import axios from 'axios'
import configStore from '../config/configStore'

const tempoAxios = axios.create({
    baseURL: 'https://api.tempo.io/core/3'
})

tempoAxios.interceptors.request.use(async function (axiosConfig) {
    if (await configStore.hasTempoToken()) {
        const config = await configStore.read()
        axiosConfig.headers.Authorization = `Bearer ${config.tempoToken}`
    }
    return axiosConfig
})

export default tempoAxios
