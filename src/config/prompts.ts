import { Config } from './configStore'
import cli from 'cli-ux'
import { trimIndent } from '../trimIndent'

type ProfileInfo = {
    accountId: string;
    hostname: string;
}

export default {

    async promptConfig(): Promise<Config> {
        const profileInfo = await promptProfileInfo()
        const tempoToken = await promptTempoToken(profileInfo.hostname)

        if (!tempoToken) throw Error("Failure. Tempo token wasn't set properly.")

        return {
            tempoToken: tempoToken,
            accountId: profileInfo.accountId
        }
    }
}

async function promptProfileInfo(): Promise<ProfileInfo> {
    const input = await cli.prompt(trimIndent(`
    Step 1/2:
    Enter URL to your Jira profile. (Needed to get your account id and domain name) 
    1. Click on your avatar on the Jira sidebar
    2. Click on the "profile" option
    3. Copy an URL and paste here:
    `))

    const profileInfo = extractProfileInfo(input)
    if (profileInfo.hostname.length > 0 && profileInfo.accountId.length > 0) {
        return profileInfo
    } else {
        throw Error("Can't parse profile URL")
    }
}

async function promptTempoToken(hostname: string): Promise<string> {
    cli.open(`https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-configuration`)
    const input = await cli.prompt(trimIndent(`
    Step 2/2:
    That's almost everything! Enter your tempo token. You can generate it here: 
    https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-configuration 
    (this page should open automatically in your browser)
    `), { type: 'hide' })
    return input
}

function extractProfileInfo(profileUrl: string): ProfileInfo {
    const url = new URL(profileUrl)
    return {
        accountId: url.pathname.split('/').slice(-1)[0],
        hostname: url.hostname
    }
}
