import { AxiosResponse } from 'axios';
import { apiClient } from './api';
import { showErrorAlert } from '../utils/sweetAlertUtils';

interface Product {
    idProduct: number,
    code: string,
    name: string,
    price: number,
    tax: number,
    details: string,
    totalPrice: number
}

interface ProductRequestCreateProduct {
    tax: number;
    name: string;
    details: string;
    code: string;
    price: number;
    totalPrice: number;
}

interface ApiResponse<T> {
    error: boolean;
    message: string;
    response: T;
}

export const createProduct = async (product: ProductRequestCreateProduct): Promise<ApiResponse<ProductRequestCreateProduct>> => {
    try {
        const response: AxiosResponse<ApiResponse<ProductRequestCreateProduct>> = await apiClient.post('/Product/CreateProduct', product);
        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};

export const editProduct = async (product: Product): Promise<ApiResponse<Product>> => {
    try {
        const response: AxiosResponse<ApiResponse<Product>> = await apiClient.post('/Product/EditProduct', product);
        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};

export const getProducts = async (): Promise<ApiResponse<Product[]>> => {
    try {
        const response: AxiosResponse<ApiResponse<Product[]>> = await apiClient.get('/Product/GetProducts');
        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};

export const getProductByCode = async (code: string): Promise<ApiResponse<Product>> => {
    try {
        const response: AxiosResponse<ApiResponse<Product>> = await apiClient.get(`/Product/GetProductByCode?code=${code}`);
        return response.data;
    } catch (error) {
        // showErrorAlert({ text: 'Ha ocurrido un error al obtener el producto!' });
        console.error('Error fetching:', error);
        throw error;
    }
};

export const deleteProduct = async (code: string): Promise<ApiResponse<null>> => {
    try {
        const response: AxiosResponse<ApiResponse<null>> = await apiClient.delete(`/Product/DeleteProduct`, {
            params: { code } 
        });

        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};