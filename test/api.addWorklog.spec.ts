// @ts-ignore TS6059
// Only for test purpose, isn't compiled to js sources
import api from '../src/api/api'
import tempoAxios from '../src/api/tempoAxios'
import { fakeCredentials } from './mocks/fakeCredentials'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))
jest.mock('../src/api/tempoAxios', () => ({
    __esModule: true,
    default: {
        post: jest.fn()
    }
}))

afterEach(() => { jest.clearAllMocks() })

describe('api.addWorklog', () => {
    beforeEach(() => {
        fakeCredentials()
    })

    test('sends worklog using new Tempo request format', async () => {
        const worklogResponse = {
            tempoWorklogId: '321',
            startDate: '2024-01-05',
            startTime: '10:00:00',
            author: { accountId: 'fakeAccountId' },
            issue: { id: '456', self: 'https://example.atlassian.net/rest/api/2/issue/456' },
            description: 'desc',
            timeSpentSeconds: 3600
        }
        const postMock = tempoAxios.post as jest.Mock
        postMock.mockResolvedValue({
            data: worklogResponse,
            config: {},
            status: 200,
            statusText: 'OK',
            headers: {}
        })

        const result = await api.addWorklog({
            issueId: '456',
            timeSpentSeconds: 3600,
            startDate: '2024-01-05',
            startTime: '10:00:00',
            description: 'desc',
            remainingEstimateSeconds: 1800
        })

        expect(postMock).toHaveBeenCalledWith('/worklogs', {
            issueId: '456',
            issue: { id: '456' },
            timeSpentSeconds: 3600,
            startDate: '2024-01-05',
            startTime: '10:00:00',
            description: 'desc',
            remainingEstimateSeconds: 1800,
            authorAccountId: 'fakeAccountId'
        })
        expect(result).toEqual(worklogResponse)
    })
})
