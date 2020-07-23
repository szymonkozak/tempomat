import cli from 'cli-ux'
import { trimIndent } from '../trimIndent'
import { Credentials } from './authenticator'

type ProfileInfo = {
    accountId: string;
    hostname: string;
}

export default {

    async promptCredentials(): Promise<Credentials> {
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
    1. Click on your avatar on the Jira navigation header
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
    const tempoConfigurationUrl = `https://${hostname}/plugins/servlet/ac/io.tempo.jira/tempo-app#!/configuration/api-integration`
    cli.open(tempoConfigurationUrl)
    const input = await cli.prompt(trimIndent(`
    Step 2/2:
    That's almost everything! Enter your tempo token. You can generate it here: 
    ${tempoConfigurationUrl} 
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
