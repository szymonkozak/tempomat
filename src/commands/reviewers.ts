import { Command, flags } from '@oclif/command'
import { appName } from '../appName'
import tempo from '../tempo'
import globalFlags from '../globalFlags'

export default class Reviewers extends Command {
    static description = 'get the list of reviewers for the current user'

    static examples = [
        `${appName} reviewers`
    ]

    static aliases = []

    static flags = {
        help: flags.help({ char: 'h' }),
        debug: flags.boolean()
    }

    static args = [
    ]

    async run() {
        const { flags } = this.parse(Reviewers)
        globalFlags.debug = flags.debug
        await tempo.getReviewers()
    }
}
