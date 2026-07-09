import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../auth/AuthProvider";
import { useCita } from "../../Hooks/useCita";

const CitasView = () => {
  const { user } = useAuthContext();
  const { cita, getCita } = useCita();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Confirmada");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    if (user?.idUsuario) {
      getCita(user.idUsuario);
    }
  }, [user]);

  useEffect(() => {
    if (Array.isArray(cita)) {
      setCitas(cita);
      setLoading(false);
    }
  }, [cita]);

  const citasFiltradas = citas.filter((c) => {
    if (filtroFecha && c.fecha?.split("T")[0] !== filtroFecha) return false;
    if (filtroEstado === "Confirmada") return c.estado === "Confirmada";
    if (filtroEstado === "Historial") return c.estado === "Finalizada" || c.estado === "Cancelada";
    return true;
  });

  if (loading) return <div className="p-5 text-center">Cargando citas...</div>;

  return (
    <div className="container-fluid p-0">
      {/* HEADER: Ajustado para ser responsivo */}
      <div className="d-flex flex-wrap justify-content-between align-items-center pb-3 mb-4 border-bottom gap-3">
        <h4 className="fw-bold m-0">Mis Citas</h4>
        <div className="d-flex align-items-center gap-2">
          <input
            type="date"
            className="form-control form-control-sm"
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setFiltroFecha("")}>
            Limpiar
          </button>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-3">
        {["Confirmada", "Historial"].map((estado) => (
          <li className="nav-item" key={estado}>
            <button
              className={`nav-link ${filtroEstado === estado ? "active fw-bold" : ""}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado}
            </button>
          </li>
        ))}
      </ul>

      {/* TABLA: Estilizada para pantallas pequeñas */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="px-4">Paciente</th>
                <th>Servicio</th>
                <th>Fecha / Hora</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length > 0 ? (
                citasFiltradas.map((c) => (
                  <tr key={c.idCita}>
                    <td className="px-4">
                      <span className="fw-bold d-block">{c.nombrePaciente} {c.apellidoPaciente}</span>
                      <small className="text-muted">Ref: #{c.idCita}</small>
                    </td>
                    <td>{c.servicio || "---"}</td>
                    <td>
                      <div className="fw-medium">{c.fecha?.split("T")[0]}</div>
                      <small className="text-muted">{c.horaInicio} - {c.horaFin}</small>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-5 text-muted">
                    No se encontraron citas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CitasView;