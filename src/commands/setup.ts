import { Command } from '@oclif/command'
import { appName } from '../appName'
import tempo from '../tempo'

export default class Setup extends Command {
    static description = 'setup cli, this is required before the first use'

    static examples = [
        `${appName} setup`,
        `${appName} setup super-company`
    ]

    static args = [
        {
            name: 'profile_name',
            description: 'tempomat profile name, for example "super-company"',
            required: false
        }
    ]

    async run() {
        const { args } = this.parse(Setup)
        await tempo.setup(args.profile_name)
    }
}
