import { useData } from "../context/DataContext";
import { isAuthenticated } from "../utils/auth";
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LoginPage from "../pages/auth/LoginPage";
import HomePage from "../pages/dashboard/HomePage";
import RegisterPage from "../pages/auth/RegisterPage";

const AppRoutes: React.FC = () => {

  const { Authenticated } = useData(); 

    return (
      <Router>
        <Routes>
          {/* rutas publicas */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={isAuthenticated() || Authenticated ? <Navigate to="/home" /> : <LoginPage />} />
          <Route path="/register" element={isAuthenticated() || Authenticated ? <Navigate to="/home" /> : <RegisterPage />} />

          {/* rutas privadas */}
          <Route path="/home" element={isAuthenticated() || Authenticated ? <HomePage /> : <Navigate to="/login" />} />
  
          {/* ruta no encontrada con sesion */}
          <Route path="*" element={isAuthenticated() || Authenticated ? <Navigate to="/home" /> : <LoginPage />} />

        </Routes>
      </Router>
    );
  };
  
  export default AppRoutes;