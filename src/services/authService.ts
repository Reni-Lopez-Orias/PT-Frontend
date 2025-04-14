import { AxiosResponse } from 'axios';
import { apiClient } from './api';
import { showErrorAlert } from '../utils/sweetAlertUtils';

interface User {
    idUser: number;
    email: string;
    hash: string;
    name: string;
    lastName: string;
}

interface ApiResponseLogin {
    error: false;
    message: "Inicio con exito!";
    response: User;
}

export const validateLoginUser = async (email: string, hash: string): Promise<ApiResponseLogin> => {
    try {
        const response: AxiosResponse<ApiResponseLogin> = await apiClient.post('/Auth/ValidateLoginUser', { email, hash: hash });
        return response.data;
    } catch (error) {
        showErrorAlert({ text: 'Ha ocurrido un error!' });
        console.error('Error fetching:', error);
        throw error;
    }
};

interface RequestCreateUser {
    email: string;
    hash: string;
    name: string;
    lastName: string;
}

interface ApiResponseRegister {
    error: false;
    message: "";
    response: User;
}

export const registerUser = async (user: RequestCreateUser): Promise<ApiResponseRegister> => {
    try {
        const response: AxiosResponse<ApiResponseRegister> = await apiClient.post('/Auth/RegisterUser', user);
        return response.data;
    } catch (error) {
        showErrorAlert({ text: 'Ha ocurrido un error!' });
        console.error('Error fetching:', error);
        throw error;
    }
};

export const getUser = async (email: string): Promise<ApiResponseRegister> => {
    try {
        const encodedEmail = encodeURIComponent(email);
        const response: AxiosResponse<ApiResponseRegister> = await apiClient.get(`/Auth/GetUser?email=${encodedEmail}`);
        return response.data;
    } catch (error) {
        // showErrorAlert({ text: 'Ha ocurrido un error!' });
        console.error('Error fetching:', error);
        throw error;
    }
};