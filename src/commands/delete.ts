import { Command, flags } from '@oclif/command'
import { appName } from '../appName'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class Delete extends Command {
    static description = '[or d], delete the worklog with given id, this can be used also to delete a multiple worklogs'

    static examples = [
        `${appName} delete 123456`,
        `${appName} d 123456`,
        `${appName} delete 123456 123457`
    ]

    static strict = false

    static aliases = ['d']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'worklog_id',
            description: 'worklog ids to delete, like 123456',
            required: true
        }
    ]

    async run() {
        const { argv, flags } = this.parse(Delete)
        globalFlags.debug = flags.debug
        await tempo.deleteWorklogs(argv)
    }
}
