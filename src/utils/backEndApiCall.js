import axios from "axios";

const backEnd = import.meta.env.VITE_BACKEND_URL

const TokenRequiredApiCall = axios.create({
    baseURL: `${backEnd}`,
    headers: {
        "Content-Type": "application/json",
    },
});

TokenRequiredApiCall.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
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