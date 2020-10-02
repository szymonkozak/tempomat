import appConfigStore from './appConfigStore'

export type Credentials = {
    tempoToken?: string;
    accountId?: string;
}

export default {
    saveCredentials: async function (credentials: Credentials, profileName: string) {
        const appConfig = await appConfigStore.read()
        let profile = appConfig.profiles?.[profileName]
        if (!profile) {
            const profiles = appConfig.profiles
            if (!profiles) appConfig.profiles = {}
            profile = {}
            // @ts-ignore
            appConfig?.profiles?.[profileName] = profile
        }
        appConfig.selectedProfile = profileName
        profile.tempoToken = credentials.tempoToken
        profile.accountId = credentials.accountId
        await appConfigStore.save(appConfig)
    },

    async getSelectedProfileCredentials(): Promise<Credentials | undefined> {
        const appConfig = await appConfigStore.read()
        const selectedProfileName = appConfig.selectedProfile
        if (!selectedProfileName) return undefined
        const selectedProfile = appConfig.profiles?.[selectedProfileName]
        return {
            tempoToken: selectedProfile?.tempoToken,
            accountId: selectedProfile?.accountId
        }
    },

    async hasSelectedProfileWithToken(): Promise<boolean> {
        try {
            const appConfig = await appConfigStore.read()
            const selectedProfileName = appConfig.selectedProfile
            if (!selectedProfileName) return false
            const selectedProfile = appConfig.profiles?.[selectedProfileName]
            return selectedProfile?.tempoToken !== undefined
        } catch (e) {
            return false
        }
    }
}
