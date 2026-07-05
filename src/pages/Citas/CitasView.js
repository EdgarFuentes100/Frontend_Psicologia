import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../auth/AuthProvider";
import { useCita } from "../../Hooks/useCita";

const CitasView = () => {
  const { user } = useAuthContext();
  const { cita, getCita } = useCita();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("Pendiente");
  const [filtroFecha, setFiltroFecha] = useState("");

  // DIAGNÓSTICO: Ver qué es 'user'
  useEffect(() => {
    console.log("Usuario actual desde contexto:", user);
    // IMPORTANTE: Cambia 'user.idUsuario' por la propiedad real (ej: 'user.id' o 'user.uid')
    const idParaConsultar = user?.id;

    if (idParaConsultar) {
      console.log("Iniciando carga para ID:", idParaConsultar);
      getCita(idParaConsultar);
    }
  }, [user]);

  useEffect(() => {
    if (cita && cita.length >= 0) {
      setCitas(cita);
      setLoading(false);
    }
  }, [cita]);
  // 3. Lógica de filtrado
  const citasFiltradas = citas.filter((c) => {
    if (filtroFecha && c.fecha !== filtroFecha) return false;
    if (filtroEstado === "Pendiente") return c.estado === "Pendiente";
    if (filtroEstado === "Confirmada") return c.estado === "Confirmada";
    if (filtroEstado === "Historial") return c.estado === "Finalizada" || c.estado === "Cancelada";
    return true;
  });

  const totalPendientes = citas.filter((c) => c.estado === "Pendiente").length;

  if (loading) return <div className="p-5 text-center">Cargando agenda...</div>;

  return (
    <div className="container-fluid py-4 bg-light" style={{ minHeight: "100vh" }}>
      {/* Header */}
      <div className="d-flex justify-content-between pb-3 mb-4 border-bottom">
        <h4 className="fw-bold">Gestión de Agenda</h4>
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

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {["Pendiente", "Confirmada", "Historial"].map((estado) => (
          <li className="nav-item" key={estado}>
            <button
              className={`nav-link ${filtroEstado === estado ? "active" : ""}`}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado === "Pendiente" ? `Solicitudes (${totalPendientes})` : estado}
            </button>
          </li>
        ))}
      </ul>

      {/* Tabla */}
      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead>
              <tr className="table-light">
                <th className="px-4">Paciente</th>
                <th>Servicio</th>
                <th>Fecha / Hora</th>
                <th className="text-end px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {citasFiltradas.length > 0 ? (
                citasFiltradas.map((c) => (
                  <tr key={c.idCita}>
                    <td className="px-4">
                      <span className="fw-bold d-block">{c.nombres} {c.apellidos}</span>
                      <small className="text-muted">Ref: #{c.idCita}</small>
                    </td>
                    <td>{c.servicio}</td>
                    <td>
                      {c.fecha?.split("T")[0]}
                      <br />
                      <small className="text-muted">{c.horaInicio} - {c.horaFin}</small>
                    </td>
                    <td className="text-end px-4">
                      {c.estado === "Pendiente" && (
                        <button className="btn btn-sm btn-success px-3">Aceptar</button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-4 text-muted">
                    No hay citas en este estado.
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