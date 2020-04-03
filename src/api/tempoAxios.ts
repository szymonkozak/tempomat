import axios from 'axios'
import authenticator from '../config/authenticator'

const tempoAxios = axios.create({
    baseURL: 'https://api.tempo.io/core/3'
})

tempoAxios.interceptors.request.use(async function (axiosConfig) {
    if (await authenticator.hasTempoToken()) {
        const credentails = await authenticator.getCredentials()
        axiosConfig.headers.Authorization = `Bearer ${credentails.tempoToken}`
    }
    return axiosConfig
})

export default tempoAxios
