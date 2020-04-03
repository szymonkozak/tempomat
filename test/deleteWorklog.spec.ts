import api from '../src/api/api'
import worklogs from '../src/worklogs/worklogs'
import authenticator from '../src/config/authenticator'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

authenticator.saveCredentials({
    accountId: 'fakeAccountId',
    tempoToken: 'fakeToken'
})

test('deletes a worklog', async () => {
    const deleteWorklogMock = jest.fn()
    api.deleteWorklog = deleteWorklogMock

    const getWorklogMock = jest.fn((args) => {
        return Promise.resolve({
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
        })
    })
    api.getWorklog = getWorklogMock

    const deletedWorklog = await worklogs.deleteWorklog('123')

    expect(deleteWorklogMock).toHaveBeenCalledWith(123)
    expect(deletedWorklog).toStrictEqual({
        description: 'Working on issue ABC-123',
        duration: '15m',
        id: '123',
        interval: {
            startTime: '09:30',
            endTime: '09:45'
        },
        issueKey: 'ABC-123',
        link: 'https://example.atlassian.net/browse/ABC-123'
    })
})
