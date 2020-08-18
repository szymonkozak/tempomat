import authenticator from './config/authenticator'
import worklogs, { AddWorklogInput } from './worklogs/worklogs'
import prompts from './config/prompts'
import * as worklogsTable from './worklogs/worklogsTable'
import chalk from 'chalk'
import { appName } from './appName'
import { trimIndent } from './trimIndent'
import cli from 'cli-ux'
import aliases from './config/aliases'
import trackers, { StartTrackerInput, PauseTrackerInput, StopTrackerInput, ResumeTrackerInput, DeleteTrackerInput } from './trackers/trackers'
import { Tracker } from './config/trackerStore'
import * as trackersTable from './trackers/trackersTable'
import { lightFormat as fnsLightFormat, differenceInMinutes } from 'date-fns'

export default {

    async setup() {
        try {
            const credentials = await prompts.promptCredentials()
            await authenticator.saveCredentials(credentials)
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

    async addWorklog(input: AddWorklogInput): Promise<boolean> {
        return execute(async () => {
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
            const table = await worklogsTable.render(userWorklogs, verbose)
            console.log(table.toString())
        })
    },

    async setAlias(aliasName: string, issueKey: string) {
        execute(async () => {
            await aliases.set(aliasName, issueKey)
        })
    },

    async deleteAlias(aliasName: string) {
        execute(async () => {
            await aliases.delete(aliasName)
        })
    },

    async listAliases() {
        const all = await aliases.all()
        /* eslint-disable no-unused-expressions */
        all?.forEach((value, key, _) => {
            console.log(`${key} => ${value}`)
        })
    },

    async startTracker(input: StartTrackerInput) {
        await execute(async () => {
            let tracker = await trackers.findTracker(input.issueKeyOrAlias)
            if (input.stopPreviousTracker && tracker) {
                await this.stopTracker({
                    issueKeyOrAlias: input.issueKeyOrAlias,
                    now: input.now
                })
            }

            tracker = await trackers.startTracker(input)
            if (!tracker) {
                console.log(chalk.redBright(`Tracker for ${input.issueKeyOrAlias} already exists.`))
                return
            }
            console.log(`Started tracker for ${tracker.issueKey}.`)
        })
    },

    async resumeTracker(input: ResumeTrackerInput) {
        await execute(async () => {
            const tracker = await trackers.resumeTracker(input)
            if (!tracker) {
                console.log(chalk.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`))
                return
            }
            console.log(`Resumed tracker for ${tracker.issueKey}.`)
        })
    },

    async pauseTracker(input: PauseTrackerInput) {
        await execute(async () => {
            const tracker = await trackers.pauseTracker(input)
            if (!tracker) {
                console.log(chalk.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`))
                return
            }
            console.log(`Paused tracker for ${tracker.issueKey}.`)
        })
    },

    async stopTracker(input: StopTrackerInput) {
        await execute(async () => {
            let tracker = await trackers.stopTracker(input)
            if (!tracker) {
                console.log(chalk.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`))
                return
            }

            const intervalsWithInputs = createWorklogInputs(tracker, input.remainingEstimate)
            if (intervalsWithInputs.length === 0) {
                console.log('There are no intervals with minimal length of 0 minutes.')
                await trackers.deleteTracker({ issueKeyOrAlias: tracker.issueKey })
                return
            }

            console.log('Logging tracker intervals')
            let allSucceeded = true
            for (const intervalWithInput of intervalsWithInputs) {
                const interval = intervalWithInput[0]
                const input = intervalWithInput[1]
                if (await this.addWorklog(input)) {
                    tracker = await trackers.removeInterval(tracker, interval)
                } else {
                    allSucceeded = false
                }
            }

            if (!allSucceeded) {
                console.log(chalk.redBright('Failed to log some parts of worklog.'))
                return
            }

            await trackers.deleteTracker({ issueKeyOrAlias: tracker.issueKey })
            console.log(chalk.greenBright('Logged all worklogs.'))
        })
    },

    async deleteTracker(input: DeleteTrackerInput) {
        await execute(async () => {
            const tracker = await trackers.deleteTracker(input)
            if (!tracker) {
                console.log(chalk.redBright(`Tracker for ${input.issueKeyOrAlias} does not exists.`))
                return
            }
            console.log(`Deleted tracker for ${tracker.issueKey}.`)
        })
    },

    async listTrackers(now: Date) {
        execute(async () => {
            const userTrackers = await trackers.getTrackers()
            for (const tracker of userTrackers) {
                const table = await trackersTable.render(tracker, now)
                console.log(table.toString())
            }
        })
    }
}

async function execute(action: () => Promise<void>): Promise<boolean> {
    try {
        await action()
        return true
    } catch (e) {
        showError(e)
        return false
    }
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
        chalk.greenBright(`Successfully deleted worklog ${chalk.yellow(worklog.id)}.`),
        `Deleted worklog details: ${worklog.issueKey}, ${worklog.interval?.startTime}-${worklog.interval?.endTime} (${worklog.duration})`
    )
}

function createWorklogInputs(tracker: Tracker, remainingEstimate?: string): [Interval, AddWorklogInput][] {
    return tracker.intervals.map(interval => {
        return [
            interval,
            {
                issueKeyOrAlias: tracker.issueKey,
                description: tracker.description,
                when: fnsLightFormat(interval.start, 'yyyy-MM-dd'),
                startTime: fnsLightFormat(interval.start, 'HH:mm'),
                durationOrInterval: `${differenceInMinutes(interval.end, interval.start)}m`,
                remainingEstimate: remainingEstimate
            }
        ]
    })
}
