import configStore from './configStore'

export type Tracker = {
    issueKey: string
    description?: string
    activeTimestamp: number
    isActive: boolean
    intervals: Interval[]
}

export type NewTracker = {
    issueKey: string
    description?: string,
    startTime: number
}

export default {

    async createTracker(newTracker: NewTracker): Promise<Tracker | undefined> {
        if (await this.getTracker(newTracker.issueKey)) {
            return undefined
        }
        const config = await configStore.read()
        if (!config.trackers) {
            config.trackers = new Map<string, Tracker>()
        }
        const tracker = {
            issueKey: newTracker.issueKey,
            description: newTracker.description,
            activeTimestamp: newTracker.startTime,
            isActive: true,
            intervals: []
        }
        config.trackers.set(newTracker.issueKey, tracker)
        await configStore.save(config)
        return tracker
    },

    async getTracker(issueKey: string): Promise<Tracker | undefined> {
        const config = await configStore.read()
        return config.trackers?.get(issueKey)
    },

    async putTracker(tracker: Tracker): Promise<Tracker> {
        const config = await configStore.read()
        if (!config.trackers) {
            config.trackers = new Map<string, Tracker>()
        }
        config.trackers.set(tracker.issueKey, tracker)
        await configStore.save(config)
        return tracker
    },

    async removeTracker(issueKey: string): Promise<Tracker | undefined> {
        const tracker = await this.getTracker(issueKey)
        if (!tracker) {
            return undefined
        }
        const config = await configStore.read()
        if (!config.trackers?.delete(issueKey)) {
            return undefined
        }
        await configStore.save(config)
        return tracker
    },

    async getTrackers(): Promise<Tracker[]> {
        const config = await configStore.read()
        const trackers = config.trackers?.values()
        return trackers ? [...trackers] : []
    }
}
