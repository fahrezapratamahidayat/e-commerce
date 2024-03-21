import axios from "axios"

const headers = {
    "accept": "application/json",
    "Content-Type": "application/json",
    "cache-control": "no-cache",
    Expires: 0,
}

const instance = axios.create({
    baseURL: "http://localhost:3000",
    headers,
    timeout: 60 * 1000,
})

instance.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error),
)

instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
)

export default instance
