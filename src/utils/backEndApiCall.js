import axios from "axios";

const TokenRequiredApiCall = axios.create({
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