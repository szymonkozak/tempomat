import { Command, Flags, Args } from '@oclif/core'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'

export default class Delete extends Command {
    static description = 'delete a tracker'

    static examples = [
        `${appName} tracker:delete abc-123`
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
        const { args, flags } = await this.parse(Delete)
        globalFlags.debug = flags.debug
        await tempo.deleteTracker({ issueKeyOrAlias: args.issue_key_or_alias })
    }
}
