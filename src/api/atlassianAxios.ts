import axios from 'axios'
import authenticator from '../config/authenticator'

const atlassianAxios = axios.create()

atlassianAxios.interceptors.request.use(async function (axiosConfig) {
    if (await authenticator.hasAtlassianToken()) {
        const credentials = await authenticator.getCredentials()
        axiosConfig.baseURL = `https://${credentials.hostname}/rest/api/3`
        const authString = `${credentials.atlassianUserEmail}:${credentials.atlassianToken}`
        axiosConfig.headers.Authorization = `Basic ${Buffer.from(authString).toString('base64')}`
    }
    return axiosConfig
})

export default atlassianAxios
