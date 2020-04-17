import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'

export default class Delete extends Command {
    static description = 'delete a tracker'

    static examples = [
        `${appName} tracker:delete abc-123`
    ]

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
        const { args, flags } = this.parse(Delete)
        globalFlags.debug = flags.debug
        tempo.deleteTracker({ issueKeyOrAlias: args.issue_key_or_alias })
    }
}
