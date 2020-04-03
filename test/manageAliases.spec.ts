import authenticator from '../src/config/authenticator'
import aliases from '../src/config/aliases'
import configStore from '../src/config/configStore'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

test('add and remove alias', async () => {
    authenticator.saveCredentials({
        accountId: 'fakeAccountId',
        tempoToken: 'fakeToken'
    })

    await aliases.set('lunch', 'ABC-123')
    await aliases.set('foo', 'ABC-321')

    expect(await configStore.read()).toStrictEqual(
        {
            accountId: 'fakeAccountId',
            tempoToken: 'fakeToken',
            aliases: new Map<string, string>([
                ['lunch', 'ABC-123'],
                ['foo', 'ABC-321']
            ])
        }
    )

    await aliases.delete('foo')

    expect(await configStore.read()).toStrictEqual(
        {
            accountId: 'fakeAccountId',
            tempoToken: 'fakeToken',
            aliases: new Map<string, string>([
                ['lunch', 'ABC-123']
            ])
        }
    )

    expect(await aliases.all()).toStrictEqual(new Map<string, string>([
        ['lunch', 'ABC-123']
    ]))
    expect(await aliases.getIssueKey('lunch')).toStrictEqual('ABC-123')
})
