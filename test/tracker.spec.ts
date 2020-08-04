import api from '../src/api/api'
import authenticator from '../src/config/authenticator'
import aliases from '../src/config/aliases'
import tempo from '../src/tempo'
import configStore from '../src/config/configStore'
import { Tracker } from '../src/config/trackerStore'
import { add } from 'date-fns'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

async function getTracker(issueKey: string): Promise<Tracker | undefined> {
    const config = await configStore.read()
    return config.trackers?.get(issueKey)
}

async function clearStore() {
    await configStore.save({})
}

function authenticate() {
    authenticator.saveCredentials({
        accountId: 'fakeAccountId',
        tempoToken: 'fakeToken'
    })
}

function mockWorklogResponse(
    returnValue: any = { issue: { key: 'ABC-123', self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123' } }
): jest.Mock<any, any> {
    const addWorklogMock = jest.fn().mockReturnValue(returnValue)
    api.addWorklog = addWorklogMock
    return addWorklogMock
}

function mockWorklogFailure(
    returnValue: any = new Error('Failed to upload worklog!')
): jest.Mock<any, any> {
    const addWorklogMock = jest.fn().mockRejectedValue(returnValue)
    api.addWorklog = addWorklogMock
    return addWorklogMock
}

const baseDate = new Date('2020-02-28T12:00:00.000+01:00')

describe('tracker', () => {
    test('can be started for an issue', async () => {
        await clearStore()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: baseDate.getTime(),
            isActive: true,
            intervals: []
        })
    })

    test('can be started with description', async () => {
        await clearStore()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'description',
            now: baseDate
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: 'description',
            activeTimestamp: baseDate.getTime(),
            isActive: true,
            intervals: []
        })
    })

    test('cannot be started twice', async () => {
        await clearStore()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'description',
            now: baseDate
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: baseDate.getTime(),
            isActive: true,
            intervals: []
        })
    })

    test('can be started for an alias', async () => {
        await clearStore()
        await aliases.set('lunch', 'ABC-123')

        await tempo.startTracker({
            issueKeyOrAlias: 'lunch',
            now: baseDate
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: baseDate.getTime(),
            isActive: true,
            intervals: []
        })
    })

    test('can be stopped', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'start description',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            description: 'start description',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
    })

    test('can be started after being stopped', async () => {
        await clearStore()
        authenticate()
        mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })
        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'second start',
            now: add(baseDate, { minutes: 60 })
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: 'second start',
            activeTimestamp: baseDate.getTime() + 60 * 60 * 1_000,
            isActive: true,
            intervals: []
        })
    })

    test('cannot be stopped if not started', async () => {
        await clearStore()
        const apiMock = mockWorklogResponse()

        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })

        expect(apiMock).not.toBeCalled()
    })

    test('can be stopped for an alias', async () => {
        await clearStore()
        authenticate()
        await aliases.set('lunch', 'ABC-123')
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'lunch',
            now: add(baseDate, { minutes: 10 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
    })

    test('does not log intervals below 1 minute', async () => {
        await clearStore()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { seconds: 59 })
        })

        expect(apiMock).not.toBeCalled()
    })

    test('can be paused and resumed', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })
        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 20 })
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 30 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:20:00'
        })
    })

    test('does not have to be resumed to be stopped', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 30 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
    })

    test('can be paused consecutively mulitple times', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()
        const pauses = Array.from(Array(5), (_, i) => (i + 2))

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        for (const pause of pauses) {
            await tempo.pauseTracker({
                issueKeyOrAlias: 'ABC-123',
                now: add(baseDate, { minutes: pause })
            })
        }
        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 20 })
        })
        for (const pause of pauses) {
            await tempo.pauseTracker({
                issueKeyOrAlias: 'ABC-123',
                now: add(baseDate, { minutes: 20 + pause })
            })
        }
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 40 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 120,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 120,
            startDate: '2020-02-28',
            startTime: '12:20:00'
        })
    })

    test('does not have to be paused to be resumed', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 20 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 1200,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
    })

    test('can be resumed consecutively mulitple times', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()
        const resumes = Array.from(Array(5), (_, i) => (i + 2))

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        for (const resume of resumes) {
            await tempo.resumeTracker({
                issueKeyOrAlias: 'ABC-123',
                now: add(baseDate, { minutes: resume })
            })
        }
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 20 })
        })
        for (const resume of resumes) {
            await tempo.resumeTracker({
                issueKeyOrAlias: 'ABC-123',
                now: add(baseDate, { minutes: 20 + resume })
            })
        }
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 40 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 1200,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 1080,
            startDate: '2020-02-28',
            startTime: '12:22:00'
        })
    })

    test('is not removed if worklog fails to update', async () => {
        await clearStore()
        authenticate()
        mockWorklogFailure()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: baseDate.getTime(),
            isActive: false,
            intervals: [{
                start: baseDate.getTime(),
                end: add(baseDate, { minutes: 10 }).getTime()
            }]
        })
    })

    test('overwrites description for stop', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'start description',
            now: baseDate
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            description: 'stop description',
            now: add(baseDate, { minutes: 10 })
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            description: 'stop description',
            timeSpentSeconds: 600,
            startDate: '2020-02-28',
            startTime: '12:00:00'
        })
    })

    test('removes only logged intervals for failure', async () => {
        await clearStore()
        authenticate()
        api.addWorklog = jest.fn()
            .mockReturnValueOnce({ issue: { key: 'ABC-123', self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123' } })
            .mockRejectedValueOnce(new Error('Failed to upload worklog!'))
            .mockRejectedValueOnce(new Error('Failed to upload worklog!'))
            .mockReturnValueOnce({ issue: { key: 'ABC-123', self: 'https://example.atlassian.net/rest/api/2/issue/ABC-123' } })

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 5 })
        })

        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 10 })
        })
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 15 })
        })

        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 20 })
        })
        await tempo.pauseTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 25 })
        })

        await tempo.resumeTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 30 })
        })
        await tempo.stopTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 60 })
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: add(baseDate, { minutes: 30 }).getTime(),
            isActive: false,
            intervals: [
                {
                    start: add(baseDate, { minutes: 10 }).getTime(),
                    end: add(baseDate, { minutes: 15 }).getTime()
                },
                {
                    start: add(baseDate, { minutes: 20 }).getTime(),
                    end: add(baseDate, { minutes: 25 }).getTime()
                }]
        })
    })

    test('can be deleted for an issue', async () => {
        await clearStore()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.deleteTracker({ issueKeyOrAlias: 'ABC-123' })

        expect(await getTracker('ABC-123')).toBeUndefined()
    })

    test('can be deleted for an alias', async () => {
        await clearStore()
        await aliases.set('lunch', 'ABC-123')

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.deleteTracker({ issueKeyOrAlias: 'lunch' })

        expect(await getTracker('ABC-123')).toBeUndefined()
    })

    test('is not deleted for different key', async () => {
        await clearStore()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.deleteTracker({ issueKeyOrAlias: 'ABC-124' })

        expect(await getTracker('ABC-123')).not.toBeUndefined()
    })

    test('stop previous flag can start a tracker for the same issue', async () => {
        await clearStore()
        authenticate()
        const apiMock = mockWorklogResponse()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 30 }),
            stopPreviousTracker: true,
            description: 'second tracker'
        })

        expect(apiMock).toBeCalledWith({
            issueKey: 'ABC-123',
            timeSpentSeconds: 1800,
            startDate: '2020-02-28',
            startTime: '12:00:00',
            description: undefined
        })
        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: 'second tracker',
            activeTimestamp: add(baseDate, { minutes: 30 }).getTime(),
            isActive: true,
            intervals: []
        })
    })

    test('stop previous flag does not start a tracker for the same issue for log failures', async () => {
        await clearStore()
        authenticate()
        mockWorklogFailure()

        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: baseDate
        })
        await tempo.startTracker({
            issueKeyOrAlias: 'ABC-123',
            now: add(baseDate, { minutes: 30 }),
            stopPreviousTracker: true
        })

        expect(await getTracker('ABC-123')).toEqual({
            issueKey: 'ABC-123',
            description: undefined,
            activeTimestamp: baseDate.getTime(),
            isActive: false,
            intervals: [{
                start: baseDate.getTime(),
                end: add(baseDate, { minutes: 30 }).getTime()
            }]
        })
    })
})
