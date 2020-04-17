import Table, { HorizontalTable, Cell } from 'cli-table3'
import { lightFormat as fnsLightFormat, differenceInMinutes } from 'date-fns'
import chalk from 'chalk'
import { Tracker } from '../config/trackerStore'

export function render(tracker: Tracker, now: Date): HorizontalTable {
    const table = new Table() as HorizontalTable
    const infoHeaders = generateInfoHeaders(tracker)
    const intervalHeaders = generateIntervalHeaders()
    const intervalsContent = generateIntervalsContent(tracker.intervals)
    const summaryFooter = generateSummaryFooter(tracker, now)
    table.push(
        ...infoHeaders,
        intervalHeaders,
        ...intervalsContent,
        summaryFooter
    )
    return table
}

function generateInfoHeaders(tracker: Tracker) {
    const trackerIdContent = `Tracker for ${tracker.issueKey}, ${toString(tracker.isActive)}`
    const trackerIdRow = [{ colSpan: 3, content: chalk.bold(trackerIdContent), hAlign: 'center' }]
    const descriptionRow = tracker.description ? [{ colSpan: 3, content: chalk.bold(`${tracker.description}`), hAlign: 'center' }] : []
    const trackerResumedAtContent = `Last resume time: ${fnsLightFormat(tracker.activeTimestamp, 'yyyy-MM-dd HH:mm')}`
    const trackerResumedAtRow = [{ colSpan: 3, content: chalk.bold(trackerResumedAtContent), hAlign: 'center' }]
    return [
        trackerIdRow,
        descriptionRow,
        trackerResumedAtRow
    ].filter(row => row.length !== 0).map(row => row as Cell[])
}

function toString(isActive: boolean) {
    return isActive ? 'Active' : 'INACTIVE'
}

function generateIntervalHeaders() {
    return [
        { content: chalk.bold.greenBright('started at'), hAlign: 'right' },
        { content: chalk.bold.greenBright('stopped at'), hAlign: 'right' },
        { content: chalk.bold.greenBright('duration'), hAlign: 'right' }
    ].map(row => row as Cell)
}

function generateIntervalsContent(intervals: Interval[]) {
    return toRows(intervals).map(row => row as Cell[])
}

function toRows(intervals: Interval[]) {
    if (intervals.length === 0) {
        return [[{ colSpan: 3, content: chalk.redBright('No intervals'), hAlign: 'center' }]] as Cell[][]
    }
    return intervals.map(interval => {
        const duration = differenceInMinutes(interval.end, interval.start)
        const startedAt = fnsLightFormat(interval.start, 'yyyy-MM-dd HH:mm:ss')
        const stoppedAt = fnsLightFormat(interval.end, 'yyyy-MM-dd HH:mm:ss')
        const row = {
            startedAt: { colSpan: 1, content: startedAt, hAlign: 'right' },
            stoppedAt: { colSpan: 1, content: stoppedAt, hAlign: 'right' },
            duration: { colSpan: 1, content: `${duration}m`, hAlign: 'right' }
        }
        return Object.values(row)
    }) as Cell[][]
}

function generateSummaryFooter(tracker: Tracker, now: Date) {
    const intervalsDuration = tracker.intervals
        .map(interval => differenceInMinutes(interval.end, interval.start))
        .reduce((previous, current) => previous + current, 0)
    let activeDuration = 0
    if (tracker.isActive) {
        activeDuration = differenceInMinutes(now.getTime(), tracker.activeTimestamp)
    }
    const totalDuration = intervalsDuration + activeDuration
    return [
        { colSpan: 2, content: 'Total duration:', hAlign: 'right' },
        { colSpan: 1, content: `${totalDuration}m`, hAlign: 'right' }
    ].map(row => row as Cell)
}
