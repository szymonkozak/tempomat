import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class Resume extends Command {
    static description = '[or resume], resume a tracker that is currently paused'

    static examples = [
        `${appName} tracker:resume abc-123`,
        `${appName} resume abc-123`
    ]

    static aliases = ['resume']

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
        const now = time.now()
        const { args, flags } = this.parse(Resume)
        globalFlags.debug = flags.debug
        tempo.resumeTracker({
            issueKeyOrAlias: args.issue_key_or_alias,
            now: now
        })
    }
}
