export const validateRequired = (value: string): string | null => {
    return value.trim() === '' ? 'Campo de texto requerido' : null;
};

export const validateEmail = (value: string): string | null => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailPattern.test(value) ? 'Correo electrónico no válido' : null;
};