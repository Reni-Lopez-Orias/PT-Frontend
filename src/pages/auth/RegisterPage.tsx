import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useFormValidation from "../../hooks/useFormValidation";
import { validateEmail, validateRequired } from "../../validators/formValidators";
import { registerUser } from "../../services/authService";
import { showErrorAlert } from "../../utils/sweetAlertUtils";
import { setAuthenticationSession } from "../../utils/auth";
import { useData } from "../../context/DataContext";

import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

const RegisterPage: React.FC = () => {

    const navigate = useNavigate();
    const navigateLogin = () => navigate('/login');
    const [disableButtonRegister, setDisableButtonRegister] = useState(false);

    const { setAuthenticated, setUserData } = useData();

    const { valuesForm, errorsForm, handleChange, validate } = useFormValidation(
        { email: '', hash: '', name: '', lastName: '' },
        { email: validateEmail, hash: validateRequired, name: validateRequired, lastName: validateRequired }
    );

    const handleRegister = async () => {

        try {
            if (validate()) {

                setDisableButtonRegister(true);

                const result = await registerUser({
                    email: valuesForm.email.toString(),
                    hash: valuesForm.hash.toString(),
                    name: valuesForm.name.toString(),
                    lastName: valuesForm.lastName.toString()
                });

                if (result.error === false) {
                    sessionStorage.setItem('idUser', result.response.idUser.toString());
                    sessionStorage.setItem('user', result.response.name.toString());
                    setAuthenticated(true);
                    setUserData(result.response);
                    setAuthenticationSession('123');
                    setDisableButtonRegister(false);
                } else {
                    setAuthenticated(false);
                    setDisableButtonRegister(false);
                    showErrorAlert({ text: result.message });
                }

            }
        } catch (error) {
            setDisableButtonRegister(false);
        }

    };

    return (
        <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%' }} >
            <Paper elevation={3} sx={{ padding: 3, maxWidth: '300px' }}>
                <Box display="flex" flexDirection="column" alignItems="center">
                    <Typography component="h1" variant="h5">
                        Registro
                    </Typography>
                    <Box component="form" sx={{ mt: 1 }}>
                        <TextField
                            id="email"
                            required
                            fullWidth
                            label="Correo electrónico"
                            value={valuesForm.email}
                            onChange={handleChange}
                            error={!!errorsForm.email}
                            helperText={errorsForm.email}
                        />
                        <TextField
                            id="hash"
                            margin="normal"
                            required
                            fullWidth
                            label="Contraseña"
                            type="password"
                            value={valuesForm.hash}
                            onChange={handleChange}
                            error={!!errorsForm.hash}
                            helperText={errorsForm.hash}
                        />
                        <TextField
                            id="name"
                            margin="normal"
                            required
                            fullWidth
                            label="Nombre"
                            value={valuesForm.name}
                            onChange={handleChange}
                            error={!!errorsForm.name}
                            helperText={errorsForm.name}
                        />
                        <TextField
                            id="lastName"
                            margin="normal"
                            required
                            fullWidth
                            label="Apellidos"
                            value={valuesForm.lastName}
                            onChange={handleChange}
                            error={!!errorsForm.lastName}
                            helperText={errorsForm.lastName}
                        />
                        <Button
                            disabled={disableButtonRegister}
                            type="button"
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleRegister}
                        >
                            Registrar
                        </Button>
                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            sx={{ mb: 2 }}
                            onClick={navigateLogin}
                        >
                            Login
                        </Button>

                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default RegisterPage;
