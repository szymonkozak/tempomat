import axios from 'axios'
import authenticator from '../config/authenticator'

const tempoAxios = axios.create({
    baseURL: 'https://api.tempo.io/4'
})

tempoAxios.interceptors.request.use(async function (axiosConfig) {
    if (await authenticator.hasTempoToken()) {
        const credentials = await authenticator.getCredentials()
        axiosConfig.headers.Authorization = `Bearer ${credentials.tempoToken}`
    }
    return axiosConfig
})

export default tempoAxios
