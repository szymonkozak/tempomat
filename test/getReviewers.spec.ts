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

describe('gets reviewers', () => {
    const getReviewersMock = jest.fn()
        .mockReturnValue([
            {
                accountId: '123456',
                displayName: 'First Reviewer'
            },
            {
                accountId: '456789',
                displayName: 'Second Reviewer'
            }
        ])
    api.getReviewers = getReviewersMock
    api.getUserSchedule = jest.fn()

    mockCurrentDate(new Date('2020-02-28T12:00:00.000+01:00'))

    describe('gets reviewers', () => {
        test('getReviewers', async () => {
            await timesheets.getReviewers()

            expect(getReviewersMock).toHaveBeenCalled()
        })
    })
})
