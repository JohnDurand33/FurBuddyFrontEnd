import axios from "axios";

const backEndUrl = import.meta.process.env("VITE_BACKEND_URL");

const backApiCall = axios.create({
    baseURL: `${backEndUrl}`,
    headers: {
        "Content-Type": "application/json",
    },
});

backApiCall.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;