import { Command } from '@oclif/command'
import { appName } from '../../appName'
import tempo from '../../tempo'
import time from '../../time'

export default class List extends Command {
    static description = 'list all trackers'

    static examples = [
        `${appName} tracker:list`
    ]

    async run() {
        tempo.listTrackers(time.now())
    }
}
