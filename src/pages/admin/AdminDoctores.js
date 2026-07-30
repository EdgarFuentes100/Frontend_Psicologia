// src/components/admin/AdminInicio.jsx
import React from "react";

const AdminInicio = () => {
    return (
        <div className="row g-3">
            <div className="col-12">
                <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: "0.75rem" }}>
                    <h4 className="fw-bold text-dark mb-1">Panel de Control General</h4>
                    <p className="text-muted small">Bienvenido al sistema de administración de Centro Aura.</p>
                    
                    <div className="row g-3 mt-3">
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded bg-light">
                                <small className="text-muted d-block">Usuarios Totales</small>
                                <h3 className="fw-bold text-primary mb-0">1,245</h3>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded bg-light">
                                <small className="text-muted d-block">Doctores Activos</small>
                                <h3 className="fw-bold text-success mb-0">12</h3>
                            </div>
                        </div>
                        <div className="col-12 col-md-4">
                            <div className="p-3 border rounded bg-light">
                                <small className="text-muted d-block">Citas Registradas Hoy</small>
                                <h3 className="fw-bold text-warning mb-0">48</h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInicio;