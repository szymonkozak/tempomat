// @ts-ignore TS6059
// Only for test purpose, isn't compiled to js sources
import { mockCurrentDate } from './mocks/currentDate'

import api, { GetWorklogsRequest, GetWorklogsResponse, GetUserScheduleRequest, GetUserScheduleResponse } from '../src/api/api'
import worklogs from '../src/worklogs/worklogs'
import authenticator from '../src/config/authenticator'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

afterEach(() => { jest.clearAllMocks() })

authenticator.saveCredentials({
    accountId: 'fakeAccountId',
    tempoToken: 'fakeToken'
})

describe('get user worklogs', () => {
    mockUserScheduleResponse({
        results: [
            {
                date: '2020-02-01',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-02',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-03',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-04',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-05',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-06',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-07',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-08',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-09',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-10',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-11',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-12',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-13',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-14',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-15',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-16',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-17',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-18',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-19',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-20',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-21',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-22',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-23',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            },
            {
                date: '2020-02-24',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-25',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-26',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-27',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-28',
                requiredSeconds: 21600,
                type: 'WORKING_DAY'
            },
            {
                date: '2020-02-29',
                requiredSeconds: 0,
                type: 'NON_WORKING_DAY'
            }
        ]
    })

    mockWorklogsResponse({
        results: [
            {
                tempoWorklogId: '123',
                issue: {
                    self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123',
                    key: 'ABC-123'
                },
                timeSpentSeconds: 900,
                startDate: '2020-02-28',
                startTime: '09:30:00',
                description: 'Working on issue ABC-123',
                author: {
                    accountId: 'fakeAccountId'
                }
            },
            {
                tempoWorklogId: '123',
                issue: {
                    self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123',
                    key: 'ABC-123'
                },
                timeSpentSeconds: 900,
                startDate: '2020-02-28',
                startTime: '09:35:00',
                description: 'Working on issue ABC-123',
                author: {
                    accountId: 'differentAccountId'
                }
            },
            {
                tempoWorklogId: '124',
                issue: {
                    self: 'https://example.atlassian.net/rest/api/2/issue/ABC-124',
                    key: 'ABC-124'
                },
                timeSpentSeconds: 7200,
                startDate: '2020-02-28',
                startTime: '12:00:00',
                description: 'Working on issue ABC-124',
                author: {
                    accountId: 'fakeAccountId'
                }
            },
            {
                tempoWorklogId: '125',
                issue: {
                    self: 'https://example.atlassian.net/rest/api/2/issue/ABC-125',
                    key: 'ABC-125'
                },
                timeSpentSeconds: 7380,
                startDate: '2020-02-27',
                startTime: '00:00:00',
                description: 'Working on issue ABC-125',
                author: {
                    accountId: 'fakeAccountId'
                }
            }
        ]
    })
    mockCurrentDate(new Date('2020-02-28T12:00:00.000+01:00'))

    test('for today', async () => {
        const result = await worklogs.getUserWorklogs()

        expect(result.worklogs).toStrictEqual([
            {
                description: 'Working on issue ABC-123',
                duration: '15m',
                id: '123',
                interval: {
                    startTime: '09:30',
                    endTime: '09:45'
                },
                issueKey: 'ABC-123',
                link: 'https://example.atlassian.net/browse/ABC-123'
            },
            {
                description: 'Working on issue ABC-124',
                duration: '2h',
                id: '124',
                interval: {
                    startTime: '12:00',
                    endTime: '14:00'
                },
                issueKey: 'ABC-124',
                link: 'https://example.atlassian.net/browse/ABC-124'
            }
        ])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-115h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '2h15m'
        })
    })

    test('for yesterday', async () => {
        const result = await worklogs.getUserWorklogs('yesterday')

        expect(result.worklogs).toStrictEqual([
            {
                description: 'Working on issue ABC-125',
                duration: '2h3m',
                id: '125',
                interval: {
                    startTime: '00:00',
                    endTime: '02:03'
                },
                issueKey: 'ABC-125',
                link: 'https://example.atlassian.net/browse/ABC-125'
            }
        ])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-115h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '2h3m'
        })
    })

    test('for yesterday by using y', async () => {
        const result = await worklogs.getUserWorklogs('y')

        expect(result.worklogs).toStrictEqual([
            {
                description: 'Working on issue ABC-125',
                duration: '2h3m',
                id: '125',
                interval: {
                    startTime: '00:00',
                    endTime: '02:03'
                },
                issueKey: 'ABC-125',
                link: 'https://example.atlassian.net/browse/ABC-125'
            }
        ])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-115h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '2h3m'
        })
    })

    test('for specific date', async () => {
        const result = await worklogs.getUserWorklogs('2020-02-27')

        expect(result.worklogs).toStrictEqual([{
            description: 'Working on issue ABC-125',
            duration: '2h3m',
            id: '125',
            interval: {
                startTime: '00:00',
                endTime: '02:03'
            },
            issueKey: 'ABC-125',
            link: 'https://example.atlassian.net/browse/ABC-125'
        }])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-115h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '2h3m'
        })
    })

    test('for specific date when there are no worklogs', async () => {
        const result = await worklogs.getUserWorklogs('2020-02-26')

        expect(result.worklogs).toStrictEqual([])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-115h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '0h'
        })
    })

    test('for specific date when there are no worklogs, but there are hours logged ahead', async () => {
        mockCurrentDate(new Date('2020-02-02T12:00:00.000+01:00'))
        const result = await worklogs.getUserWorklogs('2020-02-02')

        expect(result.worklogs).toStrictEqual([])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '+4h18m',
            dayRequiredDuration: '0h',
            dayLoggedDuration: '0h'
        })
    })

    test('for specific date when there are no worklogs, but there are hours left to log', async () => {
        mockCurrentDate(new Date('2020-02-03T12:00:00.000+01:00'))
        const result = await worklogs.getUserWorklogs('2020-02-03')

        expect(result.worklogs).toStrictEqual([])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '4h18m',
            monthCurrentPeriodDuration: '-1h42m',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '0h'
        })
    })

    test('for specific date, but hours are logged without overtime', async () => {
        mockCurrentDate(new Date('2020-02-03T12:00:00.000+01:00'))
        mockWorklogsResponse({
            results: [
                {
                    tempoWorklogId: '123',
                    issue: {
                        self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123',
                        key: 'ABC-123'
                    },
                    timeSpentSeconds: 21600,
                    startDate: '2020-02-03',
                    startTime: '09:30:00',
                    description: 'Working on issue ABC-123',
                    author: {
                        accountId: 'fakeAccountId'
                    }
                }
            ]
        })

        const result = await worklogs.getUserWorklogs('2020-02-03')

        expect(result.worklogs).toStrictEqual([{
            description: 'Working on issue ABC-123',
            duration: '6h',
            id: '123',
            interval: {
                startTime: '09:30',
                endTime: '15:30'
            },
            issueKey: 'ABC-123',
            link: 'https://example.atlassian.net/browse/ABC-123'
        }])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '6h',
            monthCurrentPeriodDuration: '0h',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '6h'
        })
    })

    test('for specific date when there are no worklogs, but 6 hours left to log', async () => {
        mockCurrentDate(new Date('2020-02-04T00:00:00.000+01:00'))
        mockWorklogsResponse({
            results: [
                {
                    tempoWorklogId: '123',
                    issue: {
                        self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123',
                        key: 'ABC-123'
                    },
                    timeSpentSeconds: 21600,
                    startDate: '2020-02-03',
                    startTime: '09:30:00',
                    description: 'Working on issue ABC-123',
                    author: {
                        accountId: 'fakeAccountId'
                    }
                }
            ]
        })

        const result = await worklogs.getUserWorklogs('2020-02-04')

        expect(result.worklogs).toStrictEqual([])
        expect(result.scheduleDetails).toStrictEqual({
            monthRequiredDuration: '120h',
            monthLoggedDuration: '6h',
            monthCurrentPeriodDuration: '-6h',
            dayRequiredDuration: '6h',
            dayLoggedDuration: '0h'
        })
    })
})

function mockWorklogsResponse (response: GetWorklogsResponse) {
    const getWorklogsMock = jest.fn(async (request: GetWorklogsRequest) => {
        return Promise.resolve<GetWorklogsResponse>(response)
    })

    api.getWorklogs = getWorklogsMock
}

function mockUserScheduleResponse (response: GetUserScheduleResponse) {
    const getUserScheduleMock = jest.fn(async (request: GetUserScheduleRequest) => {
        return Promise.resolve<GetUserScheduleResponse>(response)
    })

    api.getUserSchedule = getUserScheduleMock
}
