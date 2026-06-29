import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthContext } from "./auth/AuthProvider";
import { Login } from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserHome from "./pages/UserHome";

function App() {
  const { user } = useAuthContext();

  const getHomeRoute = () => {
    if (!user) return "/login";

    switch (user.rol) {
      case "Paciente":
        return "/userHome";

      case "Doctor":
      case "Administrador":
        return "/dashboard";

      default:
        return "/login";
    }
  };

  return (
    <Routes>

      <Route
        path="/login"
        element={
          !user
            ? <Login />
            : <Navigate to={getHomeRoute()} replace />
        }
      />

      <Route
        path="/userHome/*"
        element={
          user?.rol === "Paciente"
            ? <UserHome />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/dashboard/*"
        element={
          user &&
          (user.rol === "Doctor" ||
           user.rol === "Administrador")
            ? <Dashboard />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="*"
        element={<Navigate to={getHomeRoute()} replace />}
      />

    </Routes>
  );
}

export default App;