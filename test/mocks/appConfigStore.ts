import { AppConfig } from '../../src/config/appConfigStore'
import { CONFIG_VERSION } from '../../src/config/migration/legacyConfigMigration'

let savedConfig: AppConfig = { version: CONFIG_VERSION }

export default {

    async save(config: AppConfig) {
        savedConfig = config
    },

    async read(): Promise<AppConfig> {
        return new Promise((resolve, reject) => resolve(savedConfig))
    }
}
