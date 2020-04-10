import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class Pause extends Command {
    static description = '[or pause], pause a tracker that is currently running'

    static examples = [
        `${appName} tracker:pause abc-123`,
        `${appName} pause abc-123`
    ]

    static aliases = ['pause']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'issue_key_or_alias',
            description: 'issue key, like abc-123 or alias',
            required: true
        }
    ]

    async run() {
        const { args, flags } = this.parse(Pause)
        globalFlags.debug = flags.debug
        tempo.pauseTracker({
            issueKeyOrAlias: args.issue_key_or_alias,
            now: time.now()
        })
    }
}
