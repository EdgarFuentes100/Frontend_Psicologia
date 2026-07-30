import React, { useState } from "react";
import logo from "../Img/Logo.png";

// Importa tus subcomponentes
import AdminInicio from "./admin/AdminInicio";
import AdminUsuarios from "./admin/AdminUsuarios";
import AdminDoctores from "./admin/AdminDoctores";
import AdminCitas from "./admin/AdminCitas";
import { useAuthContext } from "../auth/AuthProvider";

const AdminDashboard = () => {
    const { user, logout } = useAuthContext();
    const [seccionActiva, setSeccionActiva] = useState("inicio");
    const [cargando, setCargando] = useState(false);

    // Función o diccionario para renderizar el subcomponente correspondiente
    const renderizarContenido = () => {
        switch (seccionActiva) {
            case "inicio":
                return <AdminInicio />;
            case "usuarios":
                return <AdminUsuarios />;
            case "doctores":
                return <AdminDoctores />;
            case "citas":
                return <AdminCitas />;
            default:
                return <AdminInicio />;
        }
    };

    return (
        <div className="min-vh-100 bg-light position-relative">

            {/* LOADER DE PANTALLA COMPLETA */}
            {cargando && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex flex-column align-items-center justify-content-center bg-white bg-opacity-75"
                    style={{ zIndex: 1050 }}
                >
                    <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-3 fw-bold text-primary">Procesando información, por favor espere...</p>
                </div>
            )}

            {/* NAVBAR RESPONSIVO */}
            <nav className="navbar bg-white border-bottom shadow-sm sticky-top">
                <div className="container-xl d-flex align-items-center justify-content-between px-2">
                    <div className="d-flex align-items-center flex-grow-1">
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "60px" }} />
                        <span className="fw-bold ms-2 d-none d-sm-block text-truncate">Centro Aura <span className="badge bg-secondary ms-1" style={{ fontSize: "10px" }}>Admin</span></span>
                    </div>

                    <div className="d-flex bg-light p-1 rounded-pill border flex-shrink-0">
                        {["inicio", "usuarios", "doctores", "citas"].map((seccion) => (
                            <button
                                key={seccion}
                                className={`btn btn-sm rounded-pill px-3 text-capitalize ${seccionActiva === seccion ? "btn-primary shadow-sm" : "text-secondary"}`}
                                onClick={() => setSeccionActiva(seccion)}
                            >
                                {seccion === "usuarios" ? "Gestión Usuarios" : seccion}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end flex-grow-1">
                        <button className="btn btn-outline-danger btn-sm px-3" onClick={logout}>Salir</button>
                    </div>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL MODULAR */}
            <main className="container-xl mt-3 pb-5">
                {renderizarContenido()}
            </main>
        </div>
    );
};

export default AdminDashboard;