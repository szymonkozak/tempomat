import appConfigStore, { Config, Profile } from './appConfigStore'

export default {

    async setSelectedProfile(profileName: string) {
        const appConfig = await appConfigStore.read()
        appConfig.selectedProfile = profileName
        await appConfigStore.save(appConfig)
    },

    async selectedProfile(): Promise<Profile | undefined> {
        const appConfig = await appConfigStore.read()
        const profileName = appConfig.selectedProfile
        if (!profileName) return undefined
        return appConfig.profiles?.[profileName]
    },

    async getProfileConfig(): Promise<Config | undefined> {
        const profile = await this.selectedProfile()
        if (!profile) return undefined
        let profileConfig = profile.profileConfig
        if (!profileConfig) profileConfig = {}
        if (!profileConfig?.aliases) {
            profileConfig.aliases = {}
        }
        return profileConfig
    },

    async saveProfileConfig(profileConfig: Config) {
        const appConfig = await appConfigStore.read()
        const profile = await this.selectedProfile()
        if (!profile) return
        profile.profileConfig = profileConfig
        const selectedProfileName = appConfig.selectedProfile
        if (selectedProfileName) {
            // @ts-ignore
            appConfig.profiles?.[selectedProfileName] = profile
        }
        await appConfigStore.save(appConfig)
    }
}
