import worklogs from '../src/worklogs/worklogs'
jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

afterEach(() => { jest.clearAllMocks() })

describe('fails when tempo token is not set', () => {
    test('when adding worklog', async () => {
        await expect(worklogs.addWorklog({
            issueKeyOrAlias: 'ABC-123',
            durationOrInterval: '1h'
        })).rejects.toEqual(
            new Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
        )
    })

    test('when deleting worklog', async () => {
        await expect(worklogs.deleteWorklog('123')).rejects.toEqual(
            new Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
        )
    })

    test('when getting worklog', async () => {
        await expect(worklogs.getUserWorklogs()).rejects.toEqual(
            new Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
        )
    })
})
