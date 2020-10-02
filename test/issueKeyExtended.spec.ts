import aliases from '../src/config/aliases'
import profiles from '../src/config/profiles'
import issueKeyExtended, { AliasesPosition } from '../src/issueKeyExtended'
import chalk from 'chalk'
import authenticator from '../src/config/authenticator'

jest.mock('../src/config/appConfigStore', () => jest.requireActual('./mocks/appConfigStore'));

(async function () {
    await authenticator.saveCredentials({
        accountId: 'fakeAccountId',
        tempoToken: 'fakeToken'
    }, 'default')

    await profiles.setSelectedProfile('default')
    await aliases.set('lunch', 'ABC-123')
    await aliases.set('sm', 'ABC-124')
    await aliases.set('daily', 'ABC-124')
    await aliases.set('daily2', 'abc-124')
    await aliases.set('foobarfoobarfoobarfoobarfoobar', 'ABC-125')
})()

test('only issue key (left aliases position)', async () => {
    expect(await issueKeyExtended('ABC-122', AliasesPosition.Left))
        .toStrictEqual(chalk.bold('ABC-122'))
})

test('only issue key (right aliases position)', async () => {
    expect(await issueKeyExtended('ABC-122', AliasesPosition.Right))
        .toStrictEqual(chalk.bold('ABC-122'))
})

test('issue key and one alias (left aliases position)', async () => {
    console.log(await profiles.selectedProfile())
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
