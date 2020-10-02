import { LegacyAppConfig } from '../../src/config/migration/legacyConfigStore'

let savedConfig: LegacyAppConfig = {
    tempoToken: undefined,
    accountId: undefined,
    aliases: undefined,
    trackers: undefined
}

// TODO: Check if it is necessary
export default {

    async save(config: LegacyAppConfig) {
        savedConfig = config
    },

    async read(): Promise<LegacyAppConfig> {
        return new Promise((resolve, reject) => resolve(savedConfig))
    }
}
