import { Command, Flags, Args } from '@oclif/core'
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
        help: Flags.help({ char: 'h' }),
        debug: Flags.boolean()
    }

    static args = {
        worklog_id: Args.string({
            description: 'worklog ids to delete, like 123456',
            required: true
        })
    }

    async run() {
        const { args, flags } = await this.parse(Delete)
        globalFlags.debug = flags.debug
        await tempo.deleteWorklogs([args.worklog_id])
    }
}
