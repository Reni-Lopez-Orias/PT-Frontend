import { useState } from 'react';

type FormValues = {
    [key: string | number]: string | number;
};

type FormErrors = {
    [key: string]: string;
};

const useFormValidation = (initialValues: FormValues, validators: { [key: string]: (value: string) => string | null }) => {

    const [valuesForm, setValuesForm] = useState<FormValues>(initialValues);
    const [errorsForm, setErrorsForm] = useState<FormErrors>({});

    const validate = (): boolean => {

        let isValid = true;
        const newErrors: FormErrors = {};

        Object.keys(valuesForm).forEach(key => {

            const error = validators[key](valuesForm[key].toString());

            if (error) {
                newErrors[key] = error;
                isValid = false;
            } else {
                newErrors[key] = '';
            }

        });

        setErrorsForm(newErrors);
        return isValid;

    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        const number = parseFloat(value);
        const isNumber = !isNaN(number) && value.trim() !== '';

        setValuesForm(prevValues => ({
            ...prevValues,
            [id]: isNumber ? number : value
        }));
    };

    return {
        valuesForm: valuesForm,
        errorsForm,
        handleChange,
        validate,
        setValuesForm: setValuesForm
    };
};

export default useFormValidation;