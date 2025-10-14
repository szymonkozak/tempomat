// @ts-ignore TS6059
// Only for test purpose, isn't compiled to js sources
import { mockCurrentDate } from './mocks/currentDate'

import api from '../src/api/api'
import timesheets from '../src/timesheets/timesheets'
import authenticator from '../src/config/authenticator'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

afterEach(() => { jest.clearAllMocks() })

authenticator.saveCredentials({
    accountId: 'fakeAccountId',
    tempoToken: 'fakeToken'
})

describe('adds a worklog', () => {
    const submitTimesheetMock = jest.fn()
        .mockReturnValue({
            reviewer: {
                accountId: '123456',
                displayName: 'First Reviewer'
            }
        })
    api.submitTimesheet = submitTimesheetMock
    api.getUserSchedule = jest.fn()

    mockCurrentDate(new Date('2020-02-28T12:00:00.000+01:00'))

    describe('empty inputs', () => {
        test('default to current week', async () => {
            await timesheets.submitTimesheet({
                reviewerAccountId: '123456',
                comment: '',
                from: null,
                to: null
            })

            expect(submitTimesheetMock).toHaveBeenCalledWith({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2020-02-24T12:00:00.000+01:00'),
                to: new Date('2020-03-01T12:00:00.000+01:00')
            })
        })

        test('to defaults to next sunday', async () => {
            await timesheets.submitTimesheet({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2020-02-28T12:00:00.000+01:00'),
                to: null
            })

            expect(submitTimesheetMock).toHaveBeenCalledWith({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2020-02-28T12:00:00.000+01:00'),
                to: new Date('2020-03-01T12:00:00.000+01:00')
            })
        })

        test('from defaults to a week before to', async () => {
            await timesheets.submitTimesheet({
                reviewerAccountId: '123456',
                comment: '',
                from: null,
                to: new Date('2022-11-26T12:00:00.000+01:00')
            })

            expect(submitTimesheetMock).toHaveBeenCalledWith({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2022-11-21T12:00:00.000+01:00'),
                to: new Date('2022-11-26T12:00:00.000+01:00')
            })
        })
    })

    describe('filled inputs', () => {
        test('respect user inputs', async () => {
            await timesheets.submitTimesheet({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2020-02-27T12:00:00.000+01:00'),
                to: new Date('2020-02-29T12:00:00.000+01:00')
            })

            expect(submitTimesheetMock).toHaveBeenCalledWith({
                reviewerAccountId: '123456',
                comment: '',
                from: new Date('2020-02-27T12:00:00.000+01:00'),
                to: new Date('2020-02-29T12:00:00.000+01:00')
            })
        })
    })
})
