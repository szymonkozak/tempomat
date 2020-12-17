import api, { IssueEntity, WorklogEntity, GetWorklogsResponse } from '../api/api'
import * as timeParser from './timeParser'
import { ParseResult, Interval } from './timeParser'
import time from '../time'
import { format, isValid, addDays, parse as fnsParse, startOfMonth, endOfMonth } from 'date-fns'
import { ScheduleDetails } from './schedule'
import * as schedule from './schedule'
import { appName } from '../appName'
import authenticator from '../config/authenticator'
import aliases from '../config/aliases'

const DATE_FORMAT = 'yyyy-MM-dd'
const START_TIME_FORMAT = 'HH:mm:ss'
const YESTERDAY_LITERALS = ['y', 'yesterday']
const TODAY_LITERALS = ['t', 'today']
const TODAY_REFERENCE_REGEX = RegExp(`^(${TODAY_LITERALS.join('|')})[-+][0-9]+$`)

export type AddWorklogInput = {
    issueKeyOrAlias: string
    durationOrInterval: string
    when?: string
    description?: string
    startTime?: string,
    remainingEstimate?: string
}

export type UpdateWorklogInput = {
    issueKeyOrAlias?: string
    durationOrInterval?: string
    description?: string
    startTime?: string,
    remainingEstimate?: string,
    when?: string
}

export type Worklog = {
    id: string,
    interval?: Interval,
    issueKey: string,
    duration: string,
    description: string
    link: string
}

export type UserWorklogs = {
    worklogs: Worklog[]
    date: Date,
    scheduleDetails: ScheduleDetails
}

export default {

    async addWorklog(input: AddWorklogInput): Promise<Worklog> {
        await checkToken()
        const referenceDate = parseWhenArg(time.now(), input.when)
        const parseResult = parseInputDate(input.durationOrInterval, referenceDate)
        const issueKey = await aliases.getIssueKey(input.issueKeyOrAlias) ?? input.issueKeyOrAlias
        const worklogEntity = await api.addWorklog({
            issueKey: issueKey,
            timeSpentSeconds: parseResult.seconds,
            startDate: format(referenceDate, DATE_FORMAT),
            startTime: startTime(parseResult, input.startTime, referenceDate),
            description: input.description,
            remainingEstimateSeconds: remainingEstimateSeconds(referenceDate, input.remainingEstimate)
        })
        return toWorklog(worklogEntity)
    },

    async deleteWorklog(worklogIdInput: string): Promise<Worklog> {
        await checkToken()
        const worklogId = parseInt(worklogIdInput)
        if (!Number.isInteger(worklogId)) {
            throw Error('Error. Worklog id should be an integer number.')
        }
        const worklogEntity = await api.getWorklog(worklogId)
        const worklog = toWorklog(worklogEntity)
        await api.deleteWorklog(worklogId)
        return worklog
    },

    async getUserWorklogs(when?: string): Promise<UserWorklogs> {
        await checkToken()
        const credentials = await authenticator.getCredentials()
        const now = time.now()
        const date = parseWhenArg(now, when)
        const formattedDate = format(date, DATE_FORMAT)
        const monthStart = format(startOfMonth(date), DATE_FORMAT)
        const monthEnd = format(endOfMonth(date), DATE_FORMAT)
        const [worklogsResponse, scheduleResponse] = await Promise.all([
            api.getWorklogs({ fromDate: monthStart, toDate: monthEnd }),
            api.getUserSchedule({ fromDate: monthStart, toDate: monthEnd })
        ])
        const worklogs = await generateWorklogs(worklogsResponse, formattedDate)
        const scheduleDetails = schedule.createScheduleDetails(
            worklogsResponse.results,
            scheduleResponse.results,
            formattedDate,
            credentials.accountId
        )
        return { worklogs, date, scheduleDetails }
    },

    async updateWorklog(worklogIdInput: string, input: UpdateWorklogInput) {
        const worklogId = parseInt(worklogIdInput)
        if (!Number.isInteger(worklogId)) {
            throw Error('Error. Worklog id should be an integer number.')
        }
        const currentWorklog = await api.getWorklog(worklogId)
        const referenceDate = parseWhenArg(time.now(), input.when ? input.when : currentWorklog.startDate);
        let parseResult = undefined
        if(input.durationOrInterval) {
            parseResult = parseInputDate(input.durationOrInterval, referenceDate)
        }

        const issueKey = input.issueKeyOrAlias ? input.issueKeyOrAlias : currentWorklog.issue.key;
        const issue = await aliases.getIssueKey(issueKey) ?? issueKey
        let worklogEntity;
        const request = {
            issueKey: issue,
            timeSpentSeconds: parseResult ? parseResult.seconds : currentWorklog.timeSpentSeconds,
            startDate: format(referenceDate, DATE_FORMAT),
            startTime: parseResult ? startTime(parseResult, input.startTime, referenceDate) : currentWorklog.startTime,
            description: input.description ? input.description : currentWorklog.description,
            remainingEstimateSeconds: remainingEstimateSeconds(referenceDate, input.remainingEstimate)
        };
        if(input.issueKeyOrAlias) {
            await this.deleteWorklog(worklogIdInput);
            worklogEntity = await api.addWorklog(request);
        } else {
            worklogEntity = await api.updateWorklog(worklogId, request)
        }
        return toWorklog(worklogEntity)
    }
}

function parseInputDate(durationOrInterval: string, referenceDate: Date) : ParseResult {
    const parseResult = timeParser.parse(durationOrInterval, referenceDate);
    if (parseResult == null) {
        throw Error(`Error parsing "${durationOrInterval}". Try something like 1h10m or 11-12:30. See ${appName} log --help for more examples.`)
    }
    if (parseResult.seconds <= 0) {
        throw Error('Error. Minutes worked must be larger than 0.')
    }
    return parseResult;
}

function remainingEstimateSeconds(referenceDate: Date, remainingEstimate?: string): number | undefined {
    if (remainingEstimate) {
        const result = timeParser.parse(remainingEstimate, referenceDate)
        if (result == null) {
            throw Error(`Error parsing "${remainingEstimate}". Try something like 1h. See ${appName} log --help for more examples.`)
        }
        return result.seconds
    }
    return undefined
}

async function generateWorklogs(worklogsResponse: GetWorklogsResponse, formattedDate: string): Promise<Worklog[]> {
    const credentials = await authenticator.getCredentials()
    return worklogsResponse.results
        .filter((e: WorklogEntity) => e.author.accountId === credentials.accountId && e.startDate === formattedDate)
        .map((e: WorklogEntity) => toWorklog(e))
}

function toWorklog(entity: WorklogEntity) {
    const referenceDate = fnsParse(entity.startDate, DATE_FORMAT, time.now())
    return {
        id: entity.tempoWorklogId,
        interval: timeParser.toInterval(entity.timeSpentSeconds, entity.startTime, referenceDate) ?? undefined,
        issueKey: entity.issue.key,
        duration: timeParser.toDuration(entity.timeSpentSeconds) ?? 'unknown',
        description: entity.description,
        link: generateLink(entity.issue)
    }
}

async function checkToken() {
    const isTokenSet = await authenticator.hasTempoToken()
    if (!isTokenSet) {
        throw Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
    }
}

function parseWhenArg(now: Date, when: string | undefined): Date {
    if (when === undefined) return now
    if (YESTERDAY_LITERALS.includes(when)) {
        const nowAtMidnight = new Date(now)
        nowAtMidnight.setHours(0, 0, 0, 0)
        return addDays(nowAtMidnight, -1)
    }
    if (when.match(TODAY_REFERENCE_REGEX)) {
        const nowAtMidnight = new Date(now)
        nowAtMidnight.setHours(0, 0, 0, 0)
        return addDays(nowAtMidnight, parseInt(when.replace(/[^\d+-]/g, '')))
    }
    const date = fnsParse(when, DATE_FORMAT, new Date())
    if (isValid(date)) {
        return date
    } else {
        throw Error(`Cannot parse "${when}" to valid date. Try to use YYYY-MM-DD format. See ${appName} --help for more examples.`)
    }
}

function startTime(parseResult: ParseResult, inputStartTime: string | undefined, referenceDate: Date) {
    if (parseResult.startTime) {
        if (inputStartTime) console.log(`Start time param is ignored, ${parseResult.startTime} is used instead.`)
        return parseResult.startTime
    }
    if (inputStartTime) return parseStartTime(inputStartTime, referenceDate)
    return format(referenceDate, START_TIME_FORMAT)
}

function parseStartTime(startTime: string, referenceDate: Date): string {
    const parsedTime = timeParser.parseTime(startTime, referenceDate)
    if (parsedTime) {
        return format(parsedTime, START_TIME_FORMAT)
    } else {
        throw Error(`Cannot parse ${startTime} to valid start time. Try to use HH:mm format. See ${appName} --help for more examples.`)
    }
}

function generateLink(issue: IssueEntity): string {
    const url = new URL(issue.self)
    return `https://${url.hostname}/browse/${issue.key}`
}
