import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import path from 'path'
import { Tracker } from './trackerStore'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

export type Config = {
    tempoToken?: string
    accountId?: string
    aliases?: Map<string, string>
    trackers?: Map<string, Tracker>
}

export function configFilePath(): string {
    return path.join(os.homedir(), '.tempomat')
}

export default {

    async save(config: Config) {
        const configPath = configFilePath()
        const configJson = JSON.stringify(config, replacer)
        await writeFileAsync(configPath, configJson, { mode: 0o600 })
    },

    async read(): Promise<Config> {
        try {
            const configPath = configFilePath()
            const configJson = await readFileAsync(configPath, { encoding: 'utf8' })
            return JSON.parse(configJson, reviver)
        } catch (e) {
            return {
                tempoToken: undefined,
                accountId: undefined,
                aliases: undefined,
                trackers: undefined
            }
        }
    }
}

function replacer(this: any, key: any, value: any) {
    const originalObject = this[key]
    if (originalObject instanceof Map) {
        return {
            dataType: 'Map',
            value: Array.from(originalObject.entries())
        }
    } else {
        return value
    }
}

function reviver(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value)
        }
    }
    return value
}
