import { Config } from '../../src/config/configStore'

let configJson = ''

export default {
    async save(config: Config) {
        configJson = JSON.stringify(config)
    },

    async read(): Promise<Config> {
        return new Promise((resolve, reject) => resolve(JSON.parse(configJson)))
    },

    async hasTempoToken() {
        const config = await this.read()
        return config.tempoToken !== undefined
    }
}
