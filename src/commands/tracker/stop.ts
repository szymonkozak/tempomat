import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class Stop extends Command {
    static description = '[or stop], stop a tracker and log it'

    static examples = [
        `${appName} tracker:stop abc-123`,
        `${appName} stop abc-123`,
        `${appName} tracker:stop abc-123 -d "worklog description"`
    ]

    static aliases = ['stop']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean(),
        description: flags.string({ char: 'd', description: 'description for worklog' })
    }

    static args = [
        {
            name: 'issue_key_or_alias',
            description: 'issue key, like abc-123 or alias',
            required: true
        }
    ]

    async run() {
        const { args, flags } = this.parse(Stop)
        globalFlags.debug = flags.debug
        tempo.stopTracker({
            issueKeyOrAlias: args.issue_key_or_alias,
            description: flags.description,
            now: time.now()
        })
    }
}
