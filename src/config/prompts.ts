import cli from 'cli-ux'
import { trimIndent } from '../trimIndent'
import { Credentials } from './authenticator'

export default {

    async promptCredentials(): Promise<Credentials> {        
        const hostname = await promptAtlassianUrl()
        const accountId = await promptAccountId(hostname)
        const atlassianUserEmail = await promptAtlassianUserEmail()
        const atlassianToken = await promptAtlassianToken()
        if (!atlassianToken) throw Error('Failure. Atlassian token wasn\'t set properly.')

        const tempoToken = await promptTempoToken(hostname)

        if (!tempoToken) throw Error('Failure. Tempo token wasn\'t set properly.')

        return {
            tempoToken: tempoToken,
            atlassianUserEmail: atlassianUserEmail,
            atlassianToken: atlassianToken,
            accountId: accountId,
            hostname: hostname
        }
    }
}

async function promptAtlassianUrl(): Promise<string> {
    const input = await cli.prompt(trimIndent(`
    Step 1/5:
    Enter your Atlassian URL.
    For example: yourcompany.atlassian.net
    `))

    const hostname = extractHostname(input)
    if (hostname.length > 0) {
        return hostname
    } else {
        throw Error('Can\'t parse Atlassian URL')
    }
}

async function promptAccountId(hostname: string): Promise<string> {
    const input = await cli.prompt(trimIndent(`
    Step 2/5:
    Enter your Jira account URL. (This is needed to extract your account ID)
    1. Click on your avatar on the Jira navigation header
    2. Click on the "Profile" option
    3. Copy the whole URL and paste here
    
    The URL should look like: https://${hostname}/jira/people/{accountId}
    `))

    const accountId = extractAccountId(input)
    if (accountId.length > 0) {
        return accountId
    } else {
        throw Error('Account ID cannot be empty')
    }
}

async function promptAtlassianUserEmail(): Promise<string> {
    const input = await cli.prompt(trimIndent(`
    Step 3/5:
    Enter your Jira (Atlassian) user email.
    In next steps you will be prompted to generate Atlassian and Tempo tokens.
    `))
    return input
}

async function promptAtlassianToken(): Promise<string> {
    const atlassianTokenUrl = 'https://id.atlassian.com/manage-profile/security/api-tokens'
    cli.open(atlassianTokenUrl)
    const input = await cli.prompt(trimIndent(`
    Step 4/5:
    Enter your Atlassian API token. It's needed to fetch workflow id based on issue key.
    You can generate it here: 
    ${atlassianTokenUrl} 
    (this page should open automatically in your browser)
    `), { type: 'hide' })
    return input
}

async function promptTempoToken(hostname: string): Promise<string> {
    const tempoConfigurationUrl = `https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration`
    cli.open(tempoConfigurationUrl)
    const input = await cli.prompt(trimIndent(`
    Step 5/5:
    That's almost everything! Enter your tempo token. You can generate it here: 
    ${tempoConfigurationUrl} 
    (this page should open automatically in your browser)
    `), { type: 'hide' })
    return input
}

function extractHostname(input: string): string {
    const trimmed = input.trim()
    const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    const url = new URL(urlString)
    return url.hostname
}

function extractAccountId(profileUrl: string): string {
    const url = new URL(profileUrl.trim())
    return url.pathname.split('/').filter(Boolean).pop() || ''
}
