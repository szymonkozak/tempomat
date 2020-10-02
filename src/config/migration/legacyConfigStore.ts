import fs from 'fs'
import os from 'os'
import { promisify } from 'util'
import path from 'path'
import { Tracker } from '../trackerStore'

const readFileAsync = promisify(fs.readFile)
const deleteFileAsync = promisify(fs.unlink)
const lstatAsync = promisify(fs.lstat)
const renameAsync = promisify(fs.rename)

export type LegacyAppConfig = {
    tempoToken?: string
    accountId?: string
    aliases?: Map<string, string>
    trackers?: Map<string, Tracker>
}

function legacyConfigFilePath(): string {
    return path.join(os.homedir(), '.tempomat')
}

function backupConfigFilePath(): string {
    return path.join(os.homedir(), '.tempomat.bak')
}

export default {

    async legacyConfigExist(): Promise<boolean> {
        const filePath = legacyConfigFilePath()
        try {
            const legacyConfigStats = await lstatAsync(filePath)
            return legacyConfigStats.isFile()
        } catch (e) {
            return false
        }
    },

    async createBackup() {
        const configPath = legacyConfigFilePath()
        await renameAsync(configPath, `${configPath}.bak`)
    },

    async deleteBackup() {
        const configPath = legacyConfigFilePath()
        if (await backupFileExist()) {
            await deleteFileAsync(`${configPath}.bak`)
        }
    },

    async read(): Promise<LegacyAppConfig> {
        try {
            const configPath = legacyConfigFilePath()
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

function reviver(key: any, value: any) {
    if (typeof value === 'object' && value !== null) {
        if (value.dataType === 'Map') {
            return new Map(value.value)
        }
    }
    return value
}

async function backupFileExist(): Promise<boolean> {
    const filePath = backupConfigFilePath()
    try {
        const legacyConfigStats = await lstatAsync(filePath)
        return legacyConfigStats.isFile()
    } catch (e) {
        return false
    }
}
