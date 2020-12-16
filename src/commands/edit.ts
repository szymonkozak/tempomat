import {Command, flags} from '@oclif/command'
import {appName} from '../appName'
import {trimIndent} from '../trimIndent'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class Edit extends Command {
    static description = '[or e], edit a worklog entry with a given id)'

    static examples = [
        `${appName} edit 123456 -d "new desc"`,
        `${appName} e 123456 -i ISSUE_KEY_OR_ALIAS`,
        `${appName} e 123456 -t 13-15:30 `
    ]

    static aliases = ['e']

    static flags = {
        help: flags.help({char: 'h'}),
        debug: flags.boolean(),
        description: flags.string({
            char: 'd',
            description: 'the new description for the worklog being edited'
        }),
        issue: flags.string({
            char: 'i',
            description: 'the issue or alias for an issue you want to move the worklog to'
        }),
        time: flags.string({
            char: 't',
            description: 'the new worklog duration (e.g 15m) or interval (e.g 11:30-14)'
        }),
        start: flags.string({
            char: 's',
            description: 'start time (HH:mm format), used when the input is a duration'
        }),
        'remaining-estimate': flags.string({
            char: 'r',
            description: 'remaining estimate'
        }),
        when: flags.string({
            char: 'w',
            description: 'change the date of the worklog'
        })
    }

    static args = [
        {
            name: 'worklog_id',
            description: 'worklog id to edit, like 123456',
            required: true
        }
    ]

    async run() {
        const {args, flags} = this.parse(Edit)
        globalFlags.debug = flags.debug
        await tempo.updateUserWorklog(args.worklog_id, {
            description: flags.description,
            issueKeyOrAlias: flags.issue,
            durationOrInterval: flags.time,
            startTime: flags.start,
            remainingEstimate: flags["remaining-estimate"],
            when: flags.when
        })
    }
}
