import aliases from './config/aliases'
import cliTruncate from 'cli-truncate'
import chalk from 'chalk'

export enum AliasesPosition {
    // eslint-disable-next-line no-unused-vars
    Left,
    // eslint-disable-next-line no-unused-vars
    Right
}

export default async function issueKeyExtended(issueKey: string, aliasesPosition: AliasesPosition) {
    const aliasNames = await aliases.getAliasNames(issueKey)
    const issueKeyText = chalk.bold(issueKey)
    if (aliasNames.length === 0) return issueKeyText

    const aliasesText = chalk.gray(getAliasesText(aliasNames))
    switch (aliasesPosition) {
    case AliasesPosition.Left:
        return `${aliasesText} ${issueKeyText}`
    case AliasesPosition.Right:
        return `${issueKeyText} ${aliasesText}`
    }
}

function getAliasesText(aliasNames: string[]) {
    const aliasesLength = aliasNames.length
    const firstAlias = aliasNames[0]
    let moreContent = ''
    if (aliasesLength > 1) {
        moreContent = `, +${aliasesLength - 1}`
    }
    return `(${cliTruncate(firstAlias, 17)}${moreContent})`
}
