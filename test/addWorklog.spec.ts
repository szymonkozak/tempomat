import api from '../src/api/api'
import worklogs from '../src/worklogs/worklogs'
import { mockCurrentDate } from './mocks/currentDate'
import authenticator from '../src/config/authenticator'
import aliases from '../src/config/aliases'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

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
                startTime: '12:00:00'
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
})
