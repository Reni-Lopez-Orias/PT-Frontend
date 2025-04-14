import { AxiosResponse } from "axios";
import { showErrorAlert } from "../utils/sweetAlertUtils";
import { apiClient } from "./api";

interface InvoiceRequest{
    idInvoice?: number;
    idUser:number;
    clientName: string;
    registerDate: string;
    productsInvoice: any
}

interface ApiResponse {
    error: boolean;
    message: string;
    response: null;
}

export const createInvoice = async (invoiceRequest: InvoiceRequest): Promise<ApiResponse> => {
    try {
        const response: AxiosResponse<ApiResponse> = await apiClient.post('/Invoice/CreateInvoice', invoiceRequest);
        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};

interface ApiResponseGetInvoice {
    error: boolean;
    message: string;
    response: any;
}

export const getInvoces = async (): Promise<ApiResponseGetInvoice> => {
    try {
        const response: AxiosResponse<ApiResponseGetInvoice> = await apiClient.get('/Invoice/GetInvoces');
        return response.data;
    } catch (error) {
        showErrorAlert({text: 'Ha ocurrido un error!'});
        console.error('Error fetching:', error);
        throw error;
    }
};