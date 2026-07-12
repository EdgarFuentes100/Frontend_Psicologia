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
  const [paginaActual, setPaginaActual] = useState(1);
  
  const citasPorPagina = 20;

  useEffect(() => {
    if (user?.idUsuario) getCita(user.idUsuario);
  }, [user, getCita]);

  useEffect(() => {
    if (Array.isArray(cita)) {
      setCitas(cita);
      setLoading(false);
    }
  }, [cita]);

  // Reset de página al cambiar filtros
  useEffect(() => { setPaginaActual(1); }, [filtroEstado, filtroFecha]);

  const formatearFecha = (fecha) => {
    if (!fecha) return "---";
    return new Date(fecha).toLocaleDateString("es-SV", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const configEstados = {
    Confirmada: { clase: "bg-success-subtle text-success", label: "Confirmada" },
    Finalizada: { clase: "bg-primary-subtle text-primary", label: "Finalizada" },
    Cancelada: { clase: "bg-danger-subtle text-danger", label: "Cancelada" }
  };

  const citasFiltradas = citas.filter((c) => {
    if (filtroFecha && c.fecha?.split("T")[0] !== filtroFecha) return false;
    if (filtroEstado === "Confirmada") return c.estado === "Confirmada";
    if (filtroEstado === "Historial") return ["Finalizada", "Cancelada"].includes(c.estado);
    return true;
  });

  // Lógica de Paginación
  const indiceUltimaCita = paginaActual * citasPorPagina;
  const indicePrimeraCita = indiceUltimaCita - citasPorPagina;
  const citasPaginadas = citasFiltradas.slice(indicePrimeraCita, indiceUltimaCita);
  const totalPaginas = Math.ceil(citasFiltradas.length / citasPorPagina);

  if (loading) return <div className="p-5 text-center">Cargando citas...</div>;

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-wrap justify-content-between align-items-center pb-1 mb-3 border-bottom gap-3">
        <h4 className="fw-bold m-0">Mis Citas</h4>
        <div className="d-flex gap-2">
          <input type="date" className="form-control form-control-sm" value={filtroFecha} onChange={(e) => setFiltroFecha(e.target.value)} />
          <button className="btn btn-sm btn-outline-secondary" onClick={() => setFiltroFecha("")}>Limpiar</button>
        </div>
      </div>

      <ul className="nav nav-tabs mb-3">
        {["Confirmada", "Historial"].map((estado) => (
          <li className="nav-item" key={estado}>
            <button className={`nav-link ${filtroEstado === estado ? "active fw-bold" : ""}`} onClick={() => setFiltroEstado(estado)}>
              {estado}
            </button>
          </li>
        ))}
      </ul>

      <div className="card border-0 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-light">
              <tr>
                <th className="ps-4">Paciente</th>
                <th>Servicio</th>
                <th>Fecha</th>
                <th>Horario</th>
                <th>Estado</th>
                <th className="text-center">Acción</th>
              </tr>
            </thead>
            <tbody>
              {citasPaginadas.length > 0 ? (
                citasPaginadas.map((c) => {
                  const estadoCfg = configEstados[c.estado] || { clase: "bg-secondary-subtle text-secondary", label: c.estado };
                  const [tituloServicio] = c.detalleServicio?.replace("Servicio: ", "").split(" - ") || ["---"];
                  const detalleExtra = c.detalleServicio?.split(" - ")[2] || "";

                  return (
                    <tr key={c.idCita}>
                      <td className="ps-4">
                        <div className="fw-semibold text-dark">{c.nombrePaciente || "---"}</div>
                        <small className="text-muted">Cita #{c.idCita}</small>
                      </td>
                      <td>
                        <div className="fw-medium">{tituloServicio}</div>
                        <small className="text-muted">{detalleExtra}</small>
                      </td>
                      <td><div className="fw-medium">{formatearFecha(c.fecha)}</div></td>
                      <td><span className="text-muted">{c.horaInicio?.slice(0, 5)} - {c.horaFin?.slice(0, 5)}</span></td>
                      <td><span className={`badge ${estadoCfg.clase}`}>{estadoCfg.label}</span></td>
                      <td className="text-center">
                        {c.estado === "Confirmada" ? (
                          <a href={c.linkMeet} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
                            <i className="bi bi-camera-video me-1"></i> Meet
                          </a>
                        ) : <span className="text-muted">-</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr><td colSpan="6" className="text-center py-5 text-muted">No se encontraron citas.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalPaginas > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(prev => prev - 1)}>Anterior</button>
            </li>
            <li className="page-item disabled"><span className="page-link">{paginaActual} / {totalPaginas}</span></li>
            <li className={`page-item ${paginaActual === totalPaginas ? 'disabled' : ''}`}>
              <button className="page-link" onClick={() => setPaginaActual(prev => prev + 1)}>Siguiente</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default CitasView;