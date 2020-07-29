import aliases from '../src/config/aliases'
import issueKeyExtended, { AliasesPosition } from '../src/issueKeyExtended'
import chalk from 'chalk'

jest.mock('../src/config/configStore', () => jest.requireActual('./mocks/configStore'))

aliases.set('lunch', 'ABC-123')
aliases.set('sm', 'ABC-124')
aliases.set('daily', 'ABC-124')
aliases.set('daily2', 'abc-124')
aliases.set('foobarfoobarfoobarfoobarfoobar', 'ABC-125')

test('only issue key (left aliases position)', async () => {
    expect(await issueKeyExtended('ABC-122', AliasesPosition.Left))
        .toStrictEqual(chalk.bold('ABC-122'))
})

test('only issue key (right aliases position)', async () => {
    expect(await issueKeyExtended('ABC-122', AliasesPosition.Right))
        .toStrictEqual(chalk.bold('ABC-122'))
})

test('issue key and one alias (left aliases position)', async () => {
    expect(await issueKeyExtended('ABC-123', AliasesPosition.Left))
        .toStrictEqual(`${chalk.gray('(lunch)')} ${chalk.bold('ABC-123')}`)
})

test('issue key and one alias (right aliases position)', async () => {
    expect(await issueKeyExtended('ABC-123', AliasesPosition.Right))
        .toStrictEqual(`${chalk.bold('ABC-123')} ${chalk.gray('(lunch)')}`)
})

test('issue key and three aliases (left aliases position)', async () => {
    expect(await issueKeyExtended('ABC-124', AliasesPosition.Left))
        .toStrictEqual(`${chalk.gray('(sm, +2)')} ${chalk.bold('ABC-124')}`)
})

test('issue key and three aliases (right aliases position)', async () => {
    expect(await issueKeyExtended('ABC-124', AliasesPosition.Right))
        .toStrictEqual(`${chalk.bold('ABC-124')} ${chalk.gray('(sm, +2)')}`)
})

test('long aliases are truncated to 17 chars', async () => {
    expect(await issueKeyExtended('ABC-125', AliasesPosition.Right))
        .toStrictEqual(`${chalk.bold('ABC-125')} ${chalk.gray('(foobarfoobarfoob…)')}`)
})
