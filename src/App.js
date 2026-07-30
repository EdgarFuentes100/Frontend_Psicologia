import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./auth/AuthProvider";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserHome from "./pages/UserHome";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const { user } = useAuthContext();

  const getHomeRoute = () => {
    if (!user) return "/login";

    switch (user.rol) {
      case "Paciente":
        return "/userHome";

      case "Doctor":
        return "/dashboard";

      case "Administrador": // <-- 2. Separas el Administrador
        return "/adminDashboard";

      default:
        return "/login";
    }
  };

  return (
    <Routes>

      {/* Ruta Login */}
      <Route
        path="/login"
        element={
          !user
            ? <Login />
            : <Navigate to={getHomeRoute()} replace />
        }
      />

      {/* Ruta Paciente */}
      <Route
        path="/userHome/*"
        element={
          user?.rol === "Paciente"
            ? <UserHome />
            : <Navigate to="/login" replace />
        }
      />

      {/* Ruta Doctor */}
      <Route
        path="/dashboard/*"
        element={
          user?.rol === "Doctor"
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

      {/* 3. Ruta Exclusiva Administrador */}
      <Route
        path="/adminDashboard/*"
        element={
          user?.rol === "Administrador"
            ? <AdminDashboard />
            : <Navigate to="/login" replace />
        }
      />

      {/* Comodín / Redirección */}
      <Route
        path="*"
        element={<Navigate to={getHomeRoute()} replace />}
      />

    </Routes>
  );
}

export default App;