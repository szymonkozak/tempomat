import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'

export default class Delete extends Command {
    static description = 'delete issue key alias'

    static examples = [
        `${appName} alias:delete lunch`
    ]

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'alias_name',
            required: true
        }
    ]

    async run() {
        const { args, flags } = this.parse(Delete)
        globalFlags.debug = flags.debug
        await tempo.deleteAlias(args.alias_name)
    }
}
