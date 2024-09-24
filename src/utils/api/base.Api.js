import axios from "axios";
import { backEndUrl } from "../config"

export const api = axios.create({
    baseURL: `${backEndUrl}`,
    headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`, // Token for auth
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
