import axios from "axios";

import { env } from "@/env";

import cookies from "js-cookie";

export const api = axios.create({
    baseURL: env.VITE_API_URL
})

api.interceptors.request.use((config) => {
    const token = cookies.get("t21-arena-park.session-token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
})