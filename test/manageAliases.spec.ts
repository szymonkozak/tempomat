import authenticator from '../src/config/authenticator'
import aliases from '../src/config/aliases'
import appConfigStore from '../src/config/appConfigStore'

jest.mock('../src/config/appConfigStore', () => jest.requireActual('./mocks/appConfigStore'))

test('add and remove alias', async () => {
    await authenticator.saveCredentials({
        accountId: 'fakeAccountId',
        tempoToken: 'fakeToken'
    }, 'default')

    await aliases.set('lunch', 'ABC-123')
    await aliases.set('foo', 'ABC-321')

    expect(await appConfigStore.read()).toStrictEqual(
        {
            version: 2,
            profiles: {
                default: {
                    tempoToken: 'fakeToken',
                    accountId: 'fakeAccountId',
                    profileConfig: {
                        aliases: {
                            lunch: 'ABC-123',
                            foo: 'ABC-321'
                        }
                    }
                }
            },
            selectedProfile: 'default'
        }
    )

    await aliases.delete('foo')

    expect(await appConfigStore.read()).toStrictEqual(
        {
            version: 2,
            profiles: {
                default: {
                    tempoToken: 'fakeToken',
                    accountId: 'fakeAccountId',
                    profileConfig: {
                        aliases: {
                            lunch: 'ABC-123'
                        }
                    }
                }
            },
            selectedProfile: 'default'
        }
    )

    expect(await aliases.all()).toStrictEqual({ lunch: 'ABC-123' })
    expect(await aliases.getIssueKey('lunch')).toStrictEqual('ABC-123')

    // TOOD: Add tests with profile switching
})
