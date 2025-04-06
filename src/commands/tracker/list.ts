import { Command, Flags } from '@oclif/core'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class List extends Command {
    static description = 'list all trackers'

    static examples = [
        `${appName} tracker:list`
    ]

    static flags = {
        help: Flags.help({ char: 'h' }),
        debug: Flags.boolean()
    }

    async run() {
        const { flags } = await this.parse(List)
        globalFlags.debug = flags.debug
        await tempo.listTrackers(time.now())
    }
}
