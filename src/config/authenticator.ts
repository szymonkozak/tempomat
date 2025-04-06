import configStore from './configStore'

export type Credentials = {
    tempoToken?: string;
    accountId?: string;
    atlassianUserEmail?: string;
    atlassianToken?: string;
    hostname?: string;
}

export default {

    async saveCredentials(credentials: Credentials) {
        const config = await configStore.read()
        config.tempoToken = credentials.tempoToken
        config.accountId = credentials.accountId
        config.atlassianUserEmail = credentials.atlassianUserEmail
        config.atlassianToken = credentials.atlassianToken
        config.hostname = credentials.hostname
        await configStore.save(config)
    },

    async getCredentials(): Promise<Credentials> {
        const config = await configStore.read()
        return {
            tempoToken: config.tempoToken,
            accountId: config.accountId,
            atlassianUserEmail: config.atlassianUserEmail,
            atlassianToken: config.atlassianToken,
            hostname: config.hostname
        }
    },

    async hasTempoToken(): Promise<boolean> {
        try {
            const config = await configStore.read()
            return config.tempoToken !== undefined
        } catch (e) {
            return false
        }
    },

    async hasAtlassianToken(): Promise<boolean> {
        try {
            const config = await configStore.read()
            return config.atlassianToken !== undefined
        } catch (e) {
            return false
        }
    }
}
