import configStore from './configStore'

export type Credentials = {
    tempoToken: string;
    accountId: string;
}

export default {

    async saveCredentials(credentials: Credentials) {
        const config = await configStore.read()
        config.tempoToken = credentials.tempoToken
        config.accountId = credentials.accountId
        await configStore.save(config)
    },

    async getCredentials() {
        const config = await configStore.read()
        return {
            tempoToken: config.tempoToken,
            accountId: config.accountId
        }
    },

    async hasTempoToken() {
        try {
            const config = await configStore.read()
            return config.tempoToken !== undefined
        } catch (e) {
            return false
        }
    }
}
