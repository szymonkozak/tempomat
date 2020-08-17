// @ts-ignore TS6059
// Only for test purpose, isn't compiled to js sources
import { mockCurrentDate } from './mocks/currentDate'

import api from '../src/api/api'
import worklogs from '../src/worklogs/worklogs'
import authenticator from '../src/config/authenticator'
import aliases from '../src/config/aliases'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

afterEach(() => { jest.clearAllMocks() })

authenticator.saveCredentials({
    accountId: 'fakeAccountId',
    tempoToken: 'fakeToken'
})

describe('adds a worklog', () => {
    const addWorklogMock = jest.fn()
        .mockReturnValue({ issue: { key: 'ABC-123', self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123' } })
    api.addWorklog = addWorklogMock
    api.getUserSchedule = jest.fn()

    mockCurrentDate(new Date('2020-02-28T12:00:00.000+01:00'))

    describe('by duration', () => {
        test('1h10m at today', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '1h10m',
                when: undefined
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 4200,
                startDate: '2020-02-28',
                startTime: '12:00:00'
            })
        })

        test('1h10m at today from 9:30', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '1h10m',
                startTime: '9:30',
                when: undefined
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 4200,
                startDate: '2020-02-28',
                startTime: '09:30:00'
            })
        })

        test('20m at yesterday from "9', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '20m',
                startTime: '9',
                when: 'y'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 1200,
                startDate: '2020-02-27',
                startTime: '09:00:00'
            })
        })

        test('5h20m at yesterday from 3.00', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '5h20m',
                startTime: '3.00',
                when: 'yesterday'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 19200,
                startDate: '2020-02-27',
                startTime: '03:00:00'
            })
        })

        test('1h10m at specific date', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '1h10m',
                when: '2020-03-08'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 4200,
                startDate: '2020-03-08',
                startTime: '00:00:00'
            })
        })

        test('2h at yesterday with "y" alias', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '2h',
                when: 'y'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 7200,
                startDate: '2020-02-27',
                startTime: '00:00:00'
            })
        })

        test('2h at yesterday with "yesterday" alias', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '2h',
                when: 'yesterday'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 7200,
                startDate: '2020-02-27',
                startTime: '00:00:00'
            })
        })
    })

    describe('by interval', () => {
        test('11:30-13 at today', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '11:30-13',
                when: undefined
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 5400,
                startDate: '2020-02-28',
                startTime: '11:30:00'
            })
        })

        test('23:30-00:30 at yesterday', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '23:30-00:30',
                when: 'y'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 3600,
                startDate: '2020-02-27',
                startTime: '23:30:00'
            })
        })

        test('0:00-5 at yesterday', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '0:00-5',
                when: 'yesterday'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 18000,
                startDate: '2020-02-27',
                startTime: '00:00:00'
            })
        })

        test('11-13 at specific date', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '11-13',
                when: '2020-03-08'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 7200,
                startDate: '2020-03-08',
                startTime: '11:00:00'
            })
        })

        test('12-12 (24h)', async () => {
            await worklogs.addWorklog({
                issueKeyOrAlias: 'ABC-123',
                durationOrInterval: '12-12'
            })

            expect(addWorklogMock).toHaveBeenCalledWith({
                issueKey: 'ABC-123',
                timeSpentSeconds: 86400,
                startDate: '2020-02-28',
                startTime: '12:00:00'
            })
        })
    })

    test('with description', async () => {
        await worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            description: 'foo bar'
        })

        expect(addWorklogMock).toHaveBeenCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 3600,
            startDate: '2020-02-28',
            startTime: '12:00:00',
            description: 'foo bar'
        })
    })

    test('with alias', async () => {
        aliases.set('lunch', 'ABC-123')

        await worklogs.addWorklog({
            issueKeyOrAlias: 'lunch',
            durationOrInterval: '1h',
            description: 'foo bar'
        })

        expect(addWorklogMock).toHaveBeenCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 3600,
            startDate: '2020-02-28',
            startTime: '12:00:00',
            description: 'foo bar'
        })
    })

    test('with remaining estimate', async () => {
        await worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            remainingEstimate: '2h'
        })

        expect(addWorklogMock).toHaveBeenCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 3600,
            startDate: '2020-02-28',
            startTime: '12:00:00',
            remainingEstimateSeconds: 7200
        })
    })

    test('with 0h remaining estimate', async () => {
        await worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            remainingEstimate: '0h'
        })

        expect(addWorklogMock).toHaveBeenCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 3600,
            startDate: '2020-02-28',
            startTime: '12:00:00',
            remainingEstimateSeconds: 0
        })
    })
})

describe('fails when', () => {
    test('remaining estimate is negative', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            remainingEstimate: '-1h'
        })).rejects.toEqual(
            new Error('Error parsing "-1h". Try something like 1h. See tempo log --help for more examples.')
        )
    })

    test('remaining estimate is invalid', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            remainingEstimate: 'something'
        })).rejects.toEqual(
            new Error('Error parsing "something". Try something like 1h. See tempo log --help for more examples.')
        )
    })

    test('cannot parse date', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            when: 'whatever'
        })).rejects.toEqual(
            new Error('Cannot parse "whatever" to valid date. Try to use YYYY-MM-DD format. See tempo --help for more examples.')
        )
    })

    test('cannot parse start time', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h',
            startTime: 'foo'
        })).rejects.toEqual(
            new Error('Cannot parse foo to valid start time. Try to use HH:mm format. See tempo --help for more examples.')
        )
    })

    test('duration or interval is invalid', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: 'something'
        })).rejects.toEqual(
            new Error('Error parsing "something". Try something like 1h10m or 11-12:30. See tempo log --help for more examples.')
        )
    })

    test('duration is 0m', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '0m'
        })).rejects.toEqual(
            new Error('Error. Minutes worked must be larger than 0.')
        )
    })

    test('duration is 0h', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '0h'
        })).rejects.toEqual(
            new Error('Error. Minutes worked must be larger than 0.')
        )
    })
})
