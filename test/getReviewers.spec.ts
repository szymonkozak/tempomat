// @ts-ignore TS6059
// Only for test purpose, isn't compiled to js sources
import { mockCurrentDate } from './mocks/currentDate'

import api from '../src/api/api'
import timesheets from '../src/timesheets/timesheets'
import authenticator from '../src/config/authenticator'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

afterEach(() => { jest.clearAllMocks() })

mockCurrentDate(new Date('2020-02-28T12:00:00.000+01:00'))

authenticator.saveCredentials({
    accountId: 'fakeAccountId',
    tempoToken: 'fakeToken'
})

const reviewersResponse = {
    metadata: { count: 2 },
    self: '',
    results: [
        { accountId: '123456', self: '' },
        { accountId: '456789', self: '' }
    ]
}

const jiraUsers = [
    { accountId: '123456', displayName: 'First Reviewer' },
    { accountId: '456789', displayName: 'Second Reviewer' }
]

describe('getReviewers', () => {
    let getReviewersMock: jest.Mock
    let getUsersMock: jest.Mock

    beforeEach(() => {
        getReviewersMock = jest.fn().mockResolvedValue(reviewersResponse)
        getUsersMock = jest.fn().mockResolvedValue(jiraUsers)
        api.getReviewers = getReviewersMock
        api.getUsers = getUsersMock
    })

    test('calls getReviewers', async () => {
        await timesheets.getReviewers()
        expect(getReviewersMock).toHaveBeenCalled()
    })

    test('fetches display names from Jira using reviewer account ids', async () => {
        await timesheets.getReviewers()
        expect(getUsersMock).toHaveBeenCalledWith(['123456', '456789'])
    })

    test('returns reviewers enriched with display names', async () => {
        const result = await timesheets.getReviewers()
        expect(result).toEqual([
            { accountId: '123456', self: '', displayName: 'First Reviewer' },
            { accountId: '456789', self: '', displayName: 'Second Reviewer' }
        ])
    })
})
