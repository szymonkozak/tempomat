import Table, { HorizontalTable, Cell } from 'cli-table3'
import chalk from 'chalk'
import { UserEntity } from '../api/api'

export async function render(reviewers: UserEntity[]) {
    const { reviewerHeaders, columnsNumber } = generateReviewerHeaders()
    const infoHeaders = generateInfoHeaders(columnsNumber)
    const content = await generateContent(reviewers, columnsNumber)
    const table = new Table() as HorizontalTable
    table.push(
        ...infoHeaders,
        reviewerHeaders,
        ...content
    )
    return table
}

function generateReviewerHeaders() {
    const headers = [
        { content: chalk.bold.greenBright('AccountId'), hAlign: 'right' }
    ]
    return {
        reviewerHeaders: headers.map((r) => r as Cell),
        columnsNumber: headers.length
    }
}

function generateInfoHeaders(colSpan: number) {
    return [
        [{ colSpan: colSpan, hAlign: 'center', content: chalk.bold('Reviewers for the current user:') }]
    ].map((r) => r as Cell[])
}

async function generateContent(reviewers: UserEntity[], colSpan: number) {
    let content = await generateUserContent(reviewers)
    if (content.length === 0) {
        content = [
            [{ colSpan: colSpan, content: chalk.redBright('No reviewers'), hAlign: 'center' }]
        ]
    }
    return content.map((r) => r as Cell[])
}

async function generateUserContent(reviewers: UserEntity[]) {
    return Promise.all(
        reviewers.map(async (reviewer) => {
            const tableContent = {
                // displayName is no longer returned
                accountId: { colSpan: 1, content: reviewer.accountId, hAlign: 'left' }
            }
            return Object.values(tableContent)
        })
    )
}
