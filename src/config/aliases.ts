import profiles from '../config/profiles'
import authenticator from './authenticator'

export default {

    async getIssueKey(aliasName: string): Promise<string | undefined> {
        const profile = await profiles.selectedProfile()
        return profile?.profileConfig?.aliases?.[aliasName]
    },

    async getAliasNames(issueKey: string): Promise<Array<string>> {
        const profile = await profiles.selectedProfile()
        if (!profile?.profileConfig?.aliases) return []
        return Object.entries(profile.profileConfig.aliases)
            .filter(([_, it]) => it.toUpperCase() === issueKey.toUpperCase())
            .map(([aliasName, _]) => aliasName)
    },

    async set(aliasName: string, issueKey: string) {
        await checkProfile()
        const profileConfig = await profiles.getProfileConfig()
        if (profileConfig) {
            // @ts-ignore
            profileConfig?.aliases[aliasName] = issueKey
            await profiles.saveProfileConfig(profileConfig)
        }
    },

    async delete(aliasName: string) {
        await checkProfile()
        const profileConfig = await profiles.getProfileConfig()
        if (profileConfig) {
            if (profileConfig.aliases) delete profileConfig.aliases[aliasName]
            await profiles.saveProfileConfig(profileConfig)
        }
    },

    async all(): Promise<{ [key: string]: string }> {
        await checkProfile()
        const profile = await profiles.selectedProfile()
        return profile?.profileConfig?.aliases ?? {}
    }
}

// TODO: Remove duplication
async function checkProfile() {
    const isTokenSet = await authenticator.hasSelectedProfileWithToken()
    if (!isTokenSet) {
        throw Error('Tempo token not set. Setup tempomat by `tempo setup` command.')
    }
}
