import React, { useState } from "react";

const CitasView = () => {
  const [citas, setCitas] = useState([
    { idCita: 1, paciente: "Edgar Fuentes", servicio: "Terapia Cognitivo Conductual", fecha: "2026-07-02", hora: "09:00", estado: "Pendiente" },
    { idCita: 2, paciente: "Ana Martínez", servicio: "Consulta General", fecha: "2026-07-02", hora: "10:30", estado: "Confirmada" },
  ]);

  const cambiarEstado = (id, nuevoEstado) => {
    setCitas(citas.map(c => c.idCita === id ? { ...c, estado: nuevoEstado } : c));
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Control de Citas</h4>
          <p className="text-muted small mb-0">Listado y seguimiento de las citas asignadas.</p>
        </div>
      </div>

      <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "16px", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light text-secondary small fw-bold">
              <tr>
                <th className="px-4 py-3">Paciente</th>
                <th className="py-3">Servicio</th>
                <th className="py-3">Fecha y Hora</th>
                <th className="py-3">Estado</th>
                <th className="text-end px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="small">
              {citas.map((cita) => (
                <tr key={cita.idCita}>
                  <td className="px-4 py-3 fw-bold text-dark">{cita.paciente}</td>
                  <td className="text-secondary">{cita.servicio}</td>
                  <td>{cita.fecha} <span className="badge bg-light text-dark border ms-2">{cita.hora}</span></td>
                  <td>
                    <span className={`badge px-2.5 py-1.5 rounded-pill fw-semibold ${
                      cita.estado === "Confirmada" ? "bg-success-subtle text-success" : "bg-warning-subtle text-warning"
                    }`}>
                      {cita.estado}
                    </span>
                  </td>
                  <td className="text-end px-4 py-3">
                    {cita.estado === "Pendiente" && (
                      <button className="btn btn-sm btn-success rounded-2" onClick={() => cambiarEstado(cita.idCita, "Confirmada")}>
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitasView;