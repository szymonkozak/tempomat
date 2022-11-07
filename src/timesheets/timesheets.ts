import api, { TimesheetResponse, UserEntity } from '../api/api'
import time from '../time'
import authenticator from '../config/authenticator'

export type SubmitTimesheetInput = {
    reviewerAccountId: string
    comment: string
    from: Date | null;
    to: Date | null;
}

export default {

    async submitTimesheet(input: SubmitTimesheetInput): Promise<TimesheetResponse> {
        await checkToken()

        if (input.to === null) {
            input.to = getNextDayOfWeek(time.now(), 0)// Next Sunday
        }

        if (input.from === null) {
            const newFrom = new Date(input.to.getTime())
            newFrom.setDate(newFrom.getDate() - 7)
            input.from = getNextDayOfWeek(newFrom, 1)// Last Monday
        }

        const timesheet = await api.submitTimesheet({
            comment: input.comment,
            reviewerAccountId: input.reviewerAccountId,
            from: input.from,
            to: input.to
        })
        return timesheet
    },

    async getReviewers(): Promise<UserEntity[]> {
        const reviewers = await api.getReviewers()
        return reviewers.results
    }

}

async function checkToken() {
    const isTokenSet = await authenticator.hasTempoToken()
    if (!isTokenSet) {
        throw Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
    }
}

/**
 * Returns the date of the next day. If today is friday and we are asking for next friday the friday of the next week is returned.
 * @param dayOfWeek 0:Su,1:Mo,2:Tu,3:We,4:Th,5:Fr,6:Sa
 */
function getNextDayOfWeek(date:Date, dayOfWeek:number) {
    const resultDate = new Date(date.getTime())
    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7)
    return resultDate
}
