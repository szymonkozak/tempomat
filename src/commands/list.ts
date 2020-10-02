import { Command, flags } from '@oclif/command'
import { appName } from '../appName'
import { trimIndent } from '../trimIndent'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class List extends Command {
    static description = '[or ls], print worklogs from provided date (YYYY-MM-DD or \'y\' as yesterday)'

    static examples = [
        `${appName} list`,
        `${appName} ls`,
        `${appName} list y `,
        `${appName} list yesterday `,
        `${appName} list 2020-02-17`,
        `${appName} list -v`
    ]

    static aliases = ['ls']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean(),
        verbose: flags.boolean({
            char: 'v',
            description: 'verbose output with description and task link'
        })
    }

    static args = [{
        name: 'when',
        description: trimIndent(`date to fetch worklogs, defaulted to today
    * date in YYYY-MM-DD format
    * y as yesterday`),
        required: false
    }]

    async run() {
        const { args, flags } = this.parse(List)
        globalFlags.debug = flags.debug
        await tempo.listUserWorklogs(args.when, flags.verbose)
    }
}
