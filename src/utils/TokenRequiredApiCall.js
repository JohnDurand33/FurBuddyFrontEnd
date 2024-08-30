import axios from "axios";
import { backEndUrl } from '../utils/config'

const TokenRequiredApiCall = axios.create({
    baseURL: `${backEndUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

TokenRequiredApiCall.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("colab32Access");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default TokenRequiredApiCall;