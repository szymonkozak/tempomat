import aliases from '../config/aliases'
import trackerStore, { Tracker, TrackerState } from '../config/trackerStore'

export type StartTrackerInput = {
    issueKeyOrAlias: string,
    description?: string,
    now: Date
}

export type ResumeTrackerInput = {
    issueKeyOrAlias: string,
    now: Date
}

export type PauseTrackerInput = {
    issueKeyOrAlias: string,
    now: Date
}

export type StopTrackerInput = {
    issueKeyOrAlias: string,
    description?: string,
    now: Date
}

export type DeleteTrackerInput = {
    issueKeyOrAlias: string
}

export default {

    async startTracker(input: StartTrackerInput): Promise<Tracker | undefined> {
        const issueKey = await aliases.getIssueKey(input.issueKeyOrAlias) ?? input.issueKeyOrAlias
        return trackerStore.createTracker({
            issueKey: issueKey,
            description: input.description,
            startTime: input.now.getTime()
        })
    },

    async resumeTracker(input: ResumeTrackerInput): Promise<Tracker | undefined> {
        const issueKey = await aliases.getIssueKey(input.issueKeyOrAlias) ?? input.issueKeyOrAlias
        const tracker = await trackerStore.getTracker(issueKey)
        if (!tracker) {
            return undefined
        }
        let activeTimestamp = tracker.activeTimestamp
        if (tracker.state === TrackerState.Paused || tracker.state === TrackerState.Stopped) {
            activeTimestamp = input.now.getTime()
        }
        const updatedTracker = {
            issueKey: issueKey,
            description: tracker.description,
            activeTimestamp: activeTimestamp,
            state: TrackerState.Resumed,
            intervals: tracker.intervals
        }
        return trackerStore.putTracker(updatedTracker)
    },

    async pauseTracker(input: PauseTrackerInput): Promise<Tracker | undefined> {
        const issueKey = await aliases.getIssueKey(input.issueKeyOrAlias) ?? input.issueKeyOrAlias
        const tracker = await trackerStore.getTracker(issueKey)
        if (!tracker) {
            return undefined
        }
        let newIntervals = tracker.intervals
        if (tracker.state === TrackerState.Started || tracker.state === TrackerState.Resumed) {
            const duration = input.now.getTime() - tracker.activeTimestamp
            if (duration >= ONE_MINUTE_IN_MS) {
                newIntervals = newIntervals.concat({
                    start: tracker.activeTimestamp,
                    end: input.now.getTime()
                })
            }
        }
        const updatedTracker = {
            issueKey: issueKey,
            description: tracker.description,
            activeTimestamp: tracker.activeTimestamp,
            state: TrackerState.Paused,
            intervals: newIntervals
        }
        return trackerStore.putTracker(updatedTracker)
    },

    async stopTracker(input: StopTrackerInput): Promise<Tracker | undefined> {
        const tracker = await this.pauseTracker({
            issueKeyOrAlias: input.issueKeyOrAlias,
            now: input.now
        })
        if (tracker) {
            return trackerStore.putTracker({
                issueKey: tracker.issueKey,
                description: input?.description ?? tracker.description,
                activeTimestamp: tracker.activeTimestamp,
                state: TrackerState.Stopped,
                intervals: tracker.intervals
            })
        }
        return tracker
    },

    async deleteTracker(input: DeleteTrackerInput): Promise<Tracker | undefined> {
        const issueKey = await aliases.getIssueKey(input.issueKeyOrAlias) ?? input.issueKeyOrAlias
        return trackerStore.removeTracker(issueKey)
    },

    async removeInterval(tracker: Tracker, interval: Interval) : Promise<Tracker> {
        const newIntervals = tracker.intervals.filter(it => it !== interval)
        return trackerStore.putTracker({
            issueKey: tracker.issueKey,
            description: tracker.description,
            activeTimestamp: tracker.activeTimestamp,
            state: tracker.state,
            intervals: newIntervals
        })
    },

    async getTrackers(): Promise<Tracker[]> {
        return trackerStore.getTrackers()
    }
}

const ONE_MINUTE_IN_MS = 60 * 1_000
