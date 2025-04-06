import { Command } from '@oclif/core'
import { appName } from '../appName'
import tempo from '../tempo'

export default class Setup extends Command {
    static description = 'setup cli, this is required before the first use'

    static examples = [
        `${appName} setup`
    ]

    async run() {
        await tempo.setup()
    }
}
