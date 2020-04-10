import { Command, flags } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import globalFlags from '../../globalFlags'
import time from '../../time'

export default class Start extends Command {
    static description = '[or start], start a new tracker'

    static examples = [
        `${appName} tracker:start abc-123`,
        `${appName} start abc-123`,
        `${appName} tracker:start abc-123 -d "worklog description"`
    ]

    static aliases = ['start']

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean(),
        description: flags.string({ char: 'd', description: 'description for worklng once tracker is stopped' })
    }

    static args = [
        {
            name: 'issue_key_or_alias',
            description: 'issue key, like abc-123 or alias',
            required: true
        }
    ]

    async run() {
        const now = time.now()
        const { args, flags } = this.parse(Start)
        globalFlags.debug = flags.debug
        tempo.startTracker({
            issueKeyOrAlias: args.issue_key_or_alias,
            description: flags.description,
            now: now
        })
    }
}
