import { Config } from '../../src/config/configStore'

let savedConfig: Config = {
    tempoToken: undefined,
    accountId: undefined,
    aliases: undefined,
    trackers: undefined
}

export default {

    async save(config: Config) {
        savedConfig = config
    },

    async read(): Promise<Config> {
        return new Promise((resolve) => resolve(savedConfig))
    }
}
