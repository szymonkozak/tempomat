import { Command, Flags, Args } from '@oclif/core'
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
        help: Flags.help({ char: 'h' }),
        debug: Flags.boolean()
    }

    static args = {
        reviewer: Args.string({
            description: 'accountId of the reviewer that should approve the timesheet',
            required: true
        }),
        comment: Args.string({
            description: 'comment to add to the timesheet submission',
            required: false
        }),
        from: Args.string({
            description: 'start date of the timesheet to submit',
            required: false
        }),
        to: Args.string({
            description: 'end date of the timesheet to submit',
            required: false
        })
    }

    async run() {
        const { args, flags } = await this.parse(Submit)
        globalFlags.debug = flags.debug
        await tempo.submitTimesheet({
            reviewerAccountId: args.reviewer,
            from: args.from === undefined ? null : new Date(args.from),
            to: args.to === undefined ? null : new Date(args.to),
            comment: args.comment ?? ''
        })
    }
}
