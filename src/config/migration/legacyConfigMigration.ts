import legacyConfigStore, { LegacyAppConfig } from './legacyConfigStore'
import appConfigStore, { AppConfig } from '../appConfigStore'

export const CONFIG_VERSION = 2

export default {

    async migrateIfNeeded() {
        const isMigrationNeeded = await legacyConfigStore.legacyConfigExist()
        if (!isMigrationNeeded) return
        const legacyConfig = await legacyConfigStore.read()
        const appConfig = createConfigFromLegacy(legacyConfig)
        // TODO: Migrate trackers
        await legacyConfigStore.createBackup()
        await appConfigStore.save(appConfig)
    },
    async deleteBackup() {
        await legacyConfigStore.deleteBackup()
    }
}

function createConfigFromLegacy(legacyConfig: LegacyAppConfig): AppConfig {
    if (!legacyConfig.accountId || !legacyConfig.tempoToken) return { version: CONFIG_VERSION }

    return {
        version: CONFIG_VERSION,
        selectedProfile: 'default',
        profiles: {
            default: {
                accountId: legacyConfig.accountId,
                tempoToken: legacyConfig.tempoToken,
                profileConfig: {
                    aliases: aliasesMapToObject(legacyConfig.aliases)
                }
            }
        }
    }
}

function aliasesMapToObject(aliasesMap: Map<string, string> | undefined) {
    const aliases: { [key: string]: string } = {}
    // eslint-disable-next-line no-unused-expressions
    aliasesMap?.forEach(function (value: string, key: string) {
        aliases[key] = value
    })
    return aliases
}
