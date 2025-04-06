import authenticator from '../../src/config/authenticator'

export function fakeCredentials() {
    authenticator.saveCredentials({
        accountId: 'fakeAccountId',
        tempoToken: 'fakeToken',
        atlassianUserEmail: 'fakeUserEmail',
        atlassianToken: 'fakeToken',
        hostname: 'fakeHostname'
    })
}
