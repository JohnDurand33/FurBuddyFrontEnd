import axios from "axios";

const backEndUrl=import.meta.process.env('VITE_BACKEND_URL')

export const login = (values) => {
    return axios.post(`${backEndUrl}/auth/login`, values);
};

export const socialLogin = (token, provider) => {
    return axios.post(`${backEndUrl}/social-auth/login`, { token, provider });
}