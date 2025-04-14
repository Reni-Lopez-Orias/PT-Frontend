import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { setAuthenticationSession } from "../../utils/auth";
import useFormValidation from "../../hooks/useFormValidation";
import { validateEmail, validateRequired } from "../../validators/formValidators";
import { getUser, validateLoginUser } from "../../services/authService";
import { showErrorAlert } from "../../utils/sweetAlertUtils";

import { Box, Button, Container, Paper, TextField, Typography } from "@mui/material";

const LoginPage: React.FC = () => {

  const navigate = useNavigate();
  const navigateRegister = () => navigate('/register');
  const [disableButtonLogin, setDisableButtonLogin] = useState(false);

  const { setAuthenticated, setUserData } = useData();

  const { valuesForm, errorsForm, handleChange, validate } = useFormValidation(
    { email: '', hash: '' },
    { email: validateEmail, hash: validateRequired }
  );

  const handleLogin = async () => {

    if (validate()) {

      setDisableButtonLogin(true);

      try {
        const result = await validateLoginUser(valuesForm.email.toString(), valuesForm.hash.toString());

        if (result.response !== null) {

          const getUserResp = await getUser(valuesForm.email.toString());

          if (getUserResp.error === false) {
            sessionStorage.setItem('idUser', getUserResp.response.idUser.toString());
            sessionStorage.setItem('user', getUserResp.response.name.toString());
            setAuthenticated(true);
            setUserData(result.response);
            setAuthenticationSession('123');
          }

        }

        if (result.response === null) {
          setDisableButtonLogin(false);
          showErrorAlert({ text: result.message });
        }
      } catch (error) {
        setDisableButtonLogin(true);
      }

    }
  };

  return (
    <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100%' }} >
      <Paper elevation={3} sx={{ padding: 3, maxWidth: '300px' }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Typography component="h1" variant="h5">
            Iniciar sesión
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
            <Button
              disabled={disableButtonLogin}
              type="button"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleLogin}
            >
              Iniciar sesión
            </Button>
            <Button
              type="button"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mb: 2 }}
              onClick={navigateRegister}
            >
              Registrar
            </Button>

          </Box>
        </Box>
      </Paper>
    </Container>
  );

};

export default LoginPage;