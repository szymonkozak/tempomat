import { parse as fnsParse, format, isValid, differenceInSeconds, isAfter, addSeconds } from 'date-fns'

export type ParseResult = {
    seconds: number
    startTime: string | undefined
}

export type Interval = {
    startTime: string,
    endTime: string
}

export function parse(durationOrInterval: string, referenceDate: Date): ParseResult | null {
    return parseDuration(durationOrInterval) ?? parseInterval(durationOrInterval, referenceDate)
}

export function toInterval(seconds: number, startTime: string, referenceDate: Date): Interval | null {
    if (seconds < 0) return null
    const parsedStartTime = fnsParse(startTime, 'HH:mm:ss', referenceDate)
    if (isValid(parsedStartTime)) {
        const startTime = format(parsedStartTime, 'HH:mm')
        const endTime = format(addSeconds(parsedStartTime, seconds), 'HH:mm')
        return {
            startTime: startTime,
            endTime: endTime
        }
    } else {
        return null
    }
}

export function toDuration(seconds: number, plusPrefix: boolean = false): string {
    const hours = Math.floor(Math.abs(seconds) / 3600)
    const minutes = Math.floor((Math.abs(seconds) % 3600) / 60)

    if (!hours && !minutes) return '0h'

    let duration = ''
    if (seconds < 0) duration += '-'
    if (seconds > 0 && plusPrefix) duration += '+'
    if (hours) duration += `${hours}h`
    if (minutes) duration += `${minutes}m`
    return duration
}

function parseDuration(input: string): ParseResult | null {
    const durationPattern = /^(?:([0-9]+)(?:h|H))?(?:([0-9]+)(?:m|M))?$/g
    const durationGroups = durationPattern.exec(input)
    const durationGroup1 = durationGroups?.[1]
    const durationGroup2 = durationGroups?.[2]
    if (durationGroup1 || durationGroup2) {
        const hours = parseInt(durationGroup1 ?? '0')
        const minutes = parseInt(durationGroup2 ?? '0')
        return {
            seconds: hours * 3600 + minutes * 60,
            startTime: undefined
        }
    } else {
        return null
    }
}

function parseInterval(input: string, referenceDate: Date): ParseResult | null {
    const interval = input.split('-')
    if (interval.length !== 2) return null
    const from = interval[0]
    const to = interval[1]
    const seconds = intervalToSeconds(from, to, referenceDate)
    const start = parseTime(from, referenceDate)
    if (seconds == null || start == null) return null
    return {
        seconds: seconds,
        startTime: format(start, 'HH:mm:ss')
    }
}

function intervalToSeconds(startTime: string, endTime: string, referenceDate: Date): number | null {
    var start = parseTime(startTime, referenceDate)
    var end = parseTime(endTime, referenceDate)
    if (!start || !end) return null
    const diff = differenceInSeconds(end, start)

    if (isAfter(end, start)) {
        return diff
    } else {
        const dayInSeconds = 86400
        return dayInSeconds + diff
    }
}

export function parseTime(time: string, referenceDate: Date) {
    return validDateOrNull(fnsParse(time, 'HH', referenceDate)) ??
        validDateOrNull(fnsParse(time, 'HH:mm', referenceDate)) ??
        validDateOrNull(fnsParse(time, 'H:mm', referenceDate)) ??
        validDateOrNull(fnsParse(time, 'HH.mm', referenceDate)) ??
        validDateOrNull(fnsParse(time, 'H.mm', referenceDate)) ??
        validDateOrNull(fnsParse(time, 'H', referenceDate))
}

function validDateOrNull(date: Date): Date | null {
    if (isValid(date)) {
        return date
    } else {
        return null
    }
}
