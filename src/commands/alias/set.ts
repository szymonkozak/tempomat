import { Command, Flags, Args } from '@oclif/core'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'

export default class Set extends Command {
    static description = 'set issue key alias, then alias can be used instead of issue key'

    static examples = [
        `${appName} alias:set lunch abc-123`
    ]

    static flags = {
        help: Flags.help({ char: 'h' }),
        debug: Flags.boolean()
    }

    static args = {
        alias: Args.string({
            description: 'alias name',
            required: true
        }),
        issue_key: Args.string({
            description: 'issue key',
            required: true
        })
    }

    async run() {
        const { args, flags } = await this.parse(Set)
        globalFlags.debug = flags.debug
        await tempo.setAlias(args.alias, args.issue_key)
    }
}
