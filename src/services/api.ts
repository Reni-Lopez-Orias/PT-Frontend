import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL || 'https://localhost:7030/';

export const apiClient: AxiosInstance = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});
