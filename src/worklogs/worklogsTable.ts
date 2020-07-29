import cliTruncate from 'cli-truncate'
import Table, { HorizontalTable, Cell } from 'cli-table3'
import { format } from 'date-fns'
import chalk from 'chalk'
import { UserWorklogs, Worklog } from './worklogs'
import issueKeyExtended, { AliasesPosition } from '../issueKeyExtended'

// How many columns should be removed, when verbose mode is off
const COLUMNS_TO_REMOVE = 2

export async function render(userWorklogs: UserWorklogs, verbose: boolean = false) {
    const { worklogHeaders, columnsNumber } = generateWorklogHeaders(verbose)
    const infoHeaders = generateInfoHeaders(userWorklogs, verbose, columnsNumber)
    const content = await generateContent(userWorklogs.worklogs, verbose, columnsNumber)
    const summaryFooter = generateDurationSummaryFooter(userWorklogs)
    const table = new Table() as HorizontalTable
    table.push(
        ...infoHeaders,
        worklogHeaders,
        ...content,
        summaryFooter
    )
    return table
}

function generateWorklogHeaders(verbose: boolean) {
    const headers = [
        { content: chalk.bold.greenBright('id'), hAlign: 'right' },
        { content: chalk.bold.greenBright('from-to'), hAlign: 'right' },
        { content: chalk.bold.greenBright('issue'), hAlign: 'right' },
        { content: chalk.bold.greenBright('duration'), hAlign: 'right' },
        chalk.bold.greenBright('description'),
        chalk.bold.greenBright('task url')
    ]
    if (!verbose) {
        headers.splice(headers.length - COLUMNS_TO_REMOVE, COLUMNS_TO_REMOVE)
    }
    return {
        worklogHeaders: headers.map((r) => r as Cell),
        columnsNumber: headers.length
    }
}

function generateInfoHeaders(userWorklogs: UserWorklogs, verbose: boolean, colSpan: number) {
    const details = userWorklogs.scheduleDetails
    const monthProgress = `${details.monthLoggedDuration}/${details.monthRequiredDuration}`
    const monthInfo = `${format(userWorklogs.date, 'MMMM')}: ${monthProgress} (${details.monthCurrentPeriodDuration})`
    const dateInfo = format(userWorklogs.date, 'eeee, yyyy-MM-dd')
    return [
        [{ colSpan: colSpan, hAlign: 'center', content: chalk.bold(monthInfo) }],
        [{ colSpan: colSpan, hAlign: 'center', content: chalk.bold(dateInfo) }]
    ].map((r) => r as Cell[])
}

async function generateContent(worklogs: Worklog[], verbose: boolean, colSpan: number) {
    let content = await generateWorklogsContent(worklogs)
    if (!verbose) {
        content.map(r => r.splice(r.length - COLUMNS_TO_REMOVE, COLUMNS_TO_REMOVE))
    }
    if (content.length === 0) {
        content = [
            [{ colSpan: colSpan, content: chalk.redBright('No worklogs'), hAlign: 'center' }]
        ]
    }
    return content.map((r) => r as Cell[])
}

async function generateWorklogsContent(worklogs: Worklog[]) {
    const intervalRows = markBreaksBetweenIntervals(worklogs)
    return Promise.all(
        worklogs.map(async (worklog, index) => {
            const issueKey = await issueKeyExtended(worklog.issueKey, AliasesPosition.Left)
            const tableContent = {
                id: { colSpan: 1, content: chalk.yellow(worklog.id), hAlign: 'right' },
                interval: { colSpan: 1, content: intervalRows[index], hAlign: 'right' },
                issueKey: { colSpan: 1, content: issueKey, hAlign: 'right' },
                duration: { colSpan: 1, content: worklog.duration, hAlign: 'right' },
                description: cliTruncate(worklog.description, 30),
                taskUrl: worklog.link
            }
            return Object.values(tableContent)
        })
    )
}

function markBreaksBetweenIntervals(worklogs: Worklog[]): string[] {
    const intervals = worklogs.map(w => w.interval)
    return intervals.map((interval, index) => {
        const next = intervals[index + 1]
        const previous = intervals[index - 1]

        let isStartTimeWithoutBreak = true
        if (previous && interval?.startTime !== previous?.endTime) isStartTimeWithoutBreak = false

        let isEndTimeWithoutBreak = true
        if (next && interval?.endTime !== next?.startTime) isEndTimeWithoutBreak = false

        const startTime = isStartTimeWithoutBreak ? interval?.startTime : chalk.bold.redBright(interval?.startTime)
        const endTime = isEndTimeWithoutBreak ? interval?.endTime : chalk.bold.redBright(interval?.endTime)
        return `${startTime}-${endTime}`
    })
}

function generateDurationSummaryFooter(userWorklogs: UserWorklogs) {
    const details = userWorklogs.scheduleDetails
    const requiredInfo = `Required ${details.dayRequiredDuration}, logged:`
    const loggedDuration = `${chalk.yellow(details.dayLoggedDuration)}`
    return [
        { colSpan: 3, content: requiredInfo, hAlign: 'right' },
        { colSpan: 1, content: loggedDuration, hAlign: 'right' }
    ].map((r) => r as Cell)
}
