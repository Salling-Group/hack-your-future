import axios from 'axios';
import {API_TOKEN} from "./const/api.const.js";
import "dotenv/config";

export const axiosClient = axios.create({
    baseURL: process.env.BASE_URL,
});

axiosClient.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${API_TOKEN}`;
    return config;
});