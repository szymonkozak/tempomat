import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'

export default class Set extends Command {
    static description = 'set issue key alias, then alias can be used instead of issue key'

    static examples = [
        `${appName} alias:set lunch abc-123`
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'alias_name',
            required: true
        },
        {
            name: 'issue_key',
            description: 'issue key, like abc-123',
            required: true
        }
    ]

    async run() {
        const { args, flags } = this.parse(Set)
        globalFlags.debug = flags.debug
        await tempo.setAlias(args.alias_name, args.issue_key)
    }
}
