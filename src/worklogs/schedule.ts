import { WorklogEntity, ScheduleEntity } from '../api/api'
import * as timeParser from './timeParser'
import _ from 'lodash'
import time from '../time'
import { format, isBefore, parse as fnsParse } from 'date-fns'

const DATE_FORMAT = 'yyyy-MM-dd'

export type ScheduleDetails = {
    monthRequiredDuration: string,
    monthLoggedDuration: string,
    monthCurrentPeriodDuration: string,
    dayRequiredDuration: string,
    dayLoggedDuration: string,
}

export function createScheduleDetails(
    worklogsResults: WorklogEntity[],
    scheduleResults: ScheduleEntity[],
    formattedSelectedDate: string,
    accountId?: string
): ScheduleDetails {
    const now = time.now()
    const formattedNowDate = format(now, DATE_FORMAT)

    const userAccountWorklogs = worklogsResults
        .filter((e: WorklogEntity) => e.author.accountId === accountId)
    const dayWorklogResults = userAccountWorklogs
        .filter((e: WorklogEntity) => e.startDate === formattedSelectedDate && e.author.accountId === accountId)
    const dayScheduleResults = scheduleResults.filter((e: ScheduleEntity) => e.date === formattedSelectedDate)
    const daysToTodayScheduleResults = scheduleResults
        .filter((e: ScheduleEntity) => e.date === formattedNowDate || isBefore(fnsParse(e.date, DATE_FORMAT, new Date()), now))

    const monthRequiredSeconds = _.sumBy(scheduleResults, (r) => r.requiredSeconds)
    const monthLoggedSeconds = _.sumBy(userAccountWorklogs, (r) => r.timeSpentSeconds)
    const monthCurrentPeriodSeconds = monthLoggedSeconds - _.sumBy(daysToTodayScheduleResults, (r) => r.requiredSeconds)
    const dayRequiredSeconds = _.sumBy(dayScheduleResults, (r) => r.requiredSeconds)
    const dayLoggedSeconds = _.sumBy(dayWorklogResults, (r) => r.timeSpentSeconds)
    return {
        monthRequiredDuration: timeParser.toDuration(monthRequiredSeconds),
        monthLoggedDuration: timeParser.toDuration(monthLoggedSeconds),
        monthCurrentPeriodDuration: timeParser.toDuration(monthCurrentPeriodSeconds, true),
        dayRequiredDuration: timeParser.toDuration(dayRequiredSeconds),
        dayLoggedDuration: timeParser.toDuration(dayLoggedSeconds)
    }
}
