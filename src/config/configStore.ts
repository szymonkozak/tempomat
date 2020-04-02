import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import path from 'path'

const readFileAsync = promisify(fs.readFile)
const writeFileAsync = promisify(fs.writeFile)

export type Config = {
    tempoToken: string;
    accountId: string;
}

export default {
    async save(config: Config) {
        const configPath = configFilePath()
        const configJson = JSON.stringify(config)
        await writeFileAsync(configPath, configJson, { mode: 0o600 })
    },

    async read(): Promise<Config> {
        const configPath = configFilePath()
        const configJson = await readFileAsync(configPath, { encoding: 'utf8' })
        return JSON.parse(configJson)
    },

    async hasTempoToken() {
        try {
            const config = await this.read()
            return config.tempoToken !== undefined
        } catch (e) {
            return false
        }
    }
}

function configFilePath(): string {
    return path.join(os.homedir(), '.tempomat')
}
