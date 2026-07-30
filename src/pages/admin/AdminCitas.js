// src/components/admin/AdminCitas.jsx
import React from "react";

const AdminCitas = () => {
    return (
        <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: "0.75rem" }}>
            <h5 className="fw-bold mb-3">Control de Citas Médicas</h5>
            <p className="text-muted small">Revisa el estado de todas las citas agendadas en la plataforma.</p>
            <div className="list-group mt-3">
                <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center">
                    <div>
                        <h6 className="mb-1 fw-bold">Consulta General - Ana Pérez</h6>
                        <small className="text-muted">Doctor: Dra. Sofía Mendoza | Fecha: 30 Jul 2026, 10:00 AM</small>
                    </div>
                    <span className="badge bg-warning text-dark">Pendiente</span>
                </div>
                <div className="list-group-item list-group-item-action d-flex justify-content-between align-items-center mt-2">
                    <div>
                        <h6 className="mb-1 fw-bold">Revisión - Luis Torres</h6>
                        <small className="text-muted">Doctor: Dr. Roberto Ramírez | Fecha: 30 Jul 2026, 11:30 AM</small>
                    </div>
                    <span className="badge bg-success">Confirmada</span>
                </div>
            </div>
        </div>
    );
};

export default AdminCitas;