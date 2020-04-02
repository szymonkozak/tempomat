import configStore from './config/configStore'
import worklogs, { AddWorklogInput } from './worklogs/worklogs'
import prompts from './config/prompts'
import * as worklogsTable from './worklogs/worklogsTable'
import chalk from 'chalk'
import { appName } from './appName'
import { trimIndent } from './trimIndent'
import cli from 'cli-ux'

export default {

    async setup() {
        try {
            const config = await prompts.promptConfig()
            configStore.save(config)
            console.log(chalk.greenBright('Setup completed successfully. Use --help to list available commands.'))
            const aliasesCommand = chalk.bold.blue(`printf "alias tl='${appName} l'\\nalias tls='${appName} ls'\\nalias td='${appName} d'" >> ~/.zshrc; source ~/.zshrc`)
            const autocompleteCommand = chalk.bold.blue('tempo autocomplete')
            console.log(trimIndent(`
            To set up autocomplete, run: 
            
            ${autocompleteCommand}
            
            Also consider adding following aliases to your shell for faster use:
            alias tl='${appName} l'
            alias tls='${appName} ls'
            alias td='${appName} d'

            If you have zsh installed, just run:

            ${aliasesCommand}
            `))
        } catch (e) {
            showError(e)
        }
    },

    async addWorklog(input: AddWorklogInput) {
        execute(async () => {
            cli.action.start('Logging time')
            const worklog = await worklogs.addWorklog(input)
            cli.action.stop('Done.')
            console.log(chalk.greenBright(`Successfully logged ${worklog.duration} to ${worklog.issueKey}, type ${chalk.bold(`tempo d ${worklog.id}`)} to undo.`))
        })
    },

    async deleteWorklogs(worklogsIds: string[]) {
        for (const worklogId of worklogsIds) {
            await execute(async () => {
                await deleteWorklog(worklogId)
            })
        }
    },

    async listUserWorklogs(when?: string, verbose = false) {
        execute(async () => {
            cli.action.start('Loading worklogs')
            const userWorklogs = await worklogs.getUserWorklogs(when)
            cli.action.stop('Done.')
            const table = worklogsTable.render(userWorklogs, verbose)
            console.log(table.toString())
        })
    }
}

async function execute(action: () => Promise<void>): Promise<void> {
    return action().catch((e) => showError(e))
}

function showError(e: Error) {
    cli.action.stop('Error.')
    console.log(chalk.redBright(e.message))
}

async function deleteWorklog(worklogIdInput: string): Promise<void> {
    cli.action.start(`Deleting worklog ${worklogIdInput}`)
    const worklog = await worklogs.deleteWorklog(worklogIdInput)
    cli.action.stop('Done.')
    console.log(
        chalk.greenBright(`Succesfully deleted worklog ${chalk.yellow(worklog.id)}.`),
        `Deleted worklog details: ${worklog.issueKey}, ${worklog.interval?.startTime}-${worklog.interval?.endTime} (${worklog.duration})`
    )
}
