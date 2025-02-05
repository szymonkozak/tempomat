import { Command, flags } from '@oclif/command'
import { appName } from '../appName'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class Submit extends Command {
    static description = '[or s], submit a timesheet for approval'

    static examples = [
        `${appName} submit 123456`,
        `${appName} s 123456`,
        `${appName} submit 123456 "please approve"`,
        `${appName} submit 123456 "please approve" "2022-01-01" "2022-01-07"`
    ]

    static aliases = ['s']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
        {
            name: 'reviewer',
            description: 'accountId of the reviewer that should approve the timesheet',
            required: true
        },
        {
            name: 'comment',
            description: 'comment to add to the timesheet submission',
            required: false
        },
        {
            name: 'from',
            description: 'start date of the timesheet to submit',
            required: false
        },
        {
            name: 'to',
            description: 'end date of the timesheet to submit',
            required: false
        }
    ]

    async run() {
        const { args, flags } = this.parse(Submit)
        globalFlags.debug = flags.debug
        await tempo.submitTimesheet({
            reviewerAccountId: args.reviewer,
            from: args.from === undefined ? null : new Date(args.from),
            to: args.to === undefined ? null : new Date(args.to),
            comment: args.comment
        })
    }
}
