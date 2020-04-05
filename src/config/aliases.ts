import configStore from './configStore'

export default {

    async getIssueKey(aliasName: string): Promise<string | undefined> {
        const config = await configStore.read()
        return config.aliases?.get(aliasName)
    },

    async set(aliasName: string, issueKey: string) {
        const config = await configStore.read()
        if (!config.aliases) {
            config.aliases = new Map<string, string>()
        }
        /* eslint-disable no-unused-expressions */
        config.aliases.set(aliasName, issueKey)
        await configStore.save(config)
    },

    async delete(aliasName: string) {
        const config = await configStore.read()
        /* eslint-disable no-unused-expressions */
        config.aliases?.delete(aliasName)
        await configStore.save(config)
    },

    async all(): Promise<Map<string, string> | undefined> {
        const config = await configStore.read()
        return config.aliases
    }
}
