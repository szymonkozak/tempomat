import { Command, Flags, Args } from '@oclif/core'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class Resume extends Command {
    static description = 'resume tracking time'

    static examples = [
        `${appName} tracker:resume abc-123`,
        `${appName} resume abc-123`
    ]

    static flags = {
        help: Flags.help({ char: 'h' }),
        debug: Flags.boolean()
    }

    static args = {
        issue_key_or_alias: Args.string({
            description: 'issue key or alias',
            required: true
        })
    }

    async run() {
        const { args, flags } = await this.parse(Resume)
        globalFlags.debug = flags.debug
        await tempo.resumeTracker({
            issueKeyOrAlias: args.issue_key_or_alias,
            now: time.now()
        })
    }
}
