import Swal from 'sweetalert2';

interface AlertOptions {
    title?: string;
    text: string;
}

export const showErrorAlert = ({ title = "Error!", text }: AlertOptions) => {
    Swal.fire({
        title,
        text,
        icon: 'error',
        confirmButtonText: 'OK',
    });
};

export const showSuccessAlert = ({ title = "Exitoso", text }: AlertOptions) => {
    Swal.fire({
        title,
        text,
        icon: 'success',
        confirmButtonText: 'OK',
    });
};