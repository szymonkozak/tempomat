import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import path from 'path'
import yaml from 'js-yaml'
import migration, { CONFIG_VERSION } from './migration/legacyConfigMigration'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)
const mkdirAsync = promisify(fs.mkdir)

export type AppConfig = {
    version?: number
    selectedProfile?: string
    profiles?: { [key: string]: Profile }
    globalConfig?: Config,
}

export type Profile = {
    accountId?: string,
    tempoToken?: string,
    profileConfig?: Config
}

export type Config = {
    aliases?: { [key: string]: string }
    attributes?: { [key: string]: string }
    settings?: { [key: string]: string }
}

export default {

    async save(appConfig: AppConfig) {
        await migration.migrateIfNeeded()
        const configPath = configFilePath()
        try {
            const configYaml = yaml.safeDump(appConfig)
            await mkdirAsync(path.join(os.homedir(), '.tempomat'), { recursive: true })
            await writeFileAsync(configPath, configYaml, { mode: 0o600 })
            await migration.deleteBackup()
        } catch (e) {
            console.log(e)
        }
    },

    async read(): Promise<AppConfig> {
        await migration.migrateIfNeeded()
        try {
            const configPath = configFilePath()
            const configYaml = await readFileAsync(configPath, { encoding: 'utf8' })
            const output = yaml.safeLoad(configYaml)
            if (output && typeof output !== 'string') {
                return output
            } else {
                return { version: CONFIG_VERSION }
            }
        } catch (e) {
            return { version: CONFIG_VERSION }
        }
    }
}

function configFilePath(): string {
    return path.join(os.homedir(), '.tempomat/config.yml')
}
