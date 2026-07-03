import React, { useState } from "react";

const PanelDoctorView = () => {
  const doctorSesion = {
    idDoctor: 1,
    nombre: "Dr. Roberto Gómez",
    colegiado: "JVPM-12345"
  };

  const [citas, setCitas] = useState([
    {
      idCita: 101,
      paciente: "Edgar Fuentes",
      servicio: "Consulta Psicológica Inicial",
      duracion: 60,
      fecha: "2026-07-03",
      horaInicio: "09:00",
      horaFin: "10:00",
      estado: "Pendiente",
      observaciones: "Presenta cuadro de estrés laboral acumulado."
    },
    {
      idCita: 102,
      paciente: "Ana Martínez",
      servicio: "Evaluación Psicológica",
      duracion: 90,
      fecha: "2026-07-03",
      horaInicio: "11:00",
      horaFin: "12:30",
      estado: "Confirmada",
      observaciones: "Segunda sesión. Traer test completado."
    },
    {
      idCita: 103,
      paciente: "Carlos Mendoza",
      servicio: "Consulta de Seguimiento",
      duracion: 45,
      fecha: "2026-07-02",
      horaInicio: "15:00",
      horaFin: "15:45",
      estado: "Finalizada",
      observaciones: "Alta médica parcial. Control en 6 meses."
    }
  ]);

  const [filtroEstado, setFiltroEstado] = useState("Pendiente");
  const [filtroFecha, setFiltroFecha] = useState("");

  const [citaAReprogramar, setCitaAReprogramar] = useState(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");

  const aceptarCita = (id) => {
    setCitas(citas.map(c => c.idCita === id ? { ...c, estado: "Confirmada" } : c));
  };

  const cancelarCita = (id) => {
    if (window.confirm("¿Confirmas la cancelación de esta cita?")) {
      setCitas(citas.map(c => c.idCita === id ? { ...c, estado: "Cancelada" } : c));
    }
  };

  const ejecutarReprogramacion = (e) => {
    e.preventDefault();
    setCitas(citas.map(c => 
      c.idCita === citaAReprogramar.idCita 
        ? { ...c, fecha: nuevaFecha, horaInicio: nuevaHora, estado: "Confirmada" } 
        : c
    ));
    setCitaAReprogramar(null);
  };

  const citasFiltradas = citas.filter(cita => {
    if (filtroFecha && cita.fecha !== filtroFecha) return false;
    if (filtroEstado === "Pendiente") return cita.estado === "Pendiente";
    if (filtroEstado === "Confirmada") return cita.estado === "Confirmada";
    if (filtroEstado === "Historial") return cita.estado === "Finalizada" || cita.estado === "Cancelada";
    return true;
  });

  const totalPendientes = citas.filter(c => c.estado === "Pendiente").length;

  return (
    <div className="container-fluid py-4 bg-light" style={{ minHeight: "100vh" }}>
      
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center pb-3 mb-4 border-bottom">
        <div>
          <h4 className="fw-bold text-dark mb-1">{doctorSesion.nombre}</h4>
          <p className="text-muted small mb-0">Colegiado: {doctorSesion.colegiado}</p>
        </div>
        
        <div className="d-flex align-items-center gap-2 mt-3 mt-md-0">
          <label className="small fw-bold text-secondary mb-0">Fecha:</label>
          <input 
            type="date" 
            className="form-control form-control-sm border-secondary-subtle bg-white text-dark" 
            style={{ width: "160px" }}
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
          />
          {filtroFecha && (
            <button className="btn btn-sm btn-outline-secondary" onClick={() => setFiltroFecha("")}>Limpiar</button>
          )}
        </div>
      </div>

      {/* Navegación por estados */}
      <div className="mb-3">
        <ul className="nav nav-tabs border-bottom-0">
          <li className="nav-item">
            <button 
              className={`nav-link px-4 py-2 small fw-bold text-dark ${filtroEstado === "Pendiente" ? "active border-bottom-0" : "bg-transparent border-0 opacity-75"}`}
              onClick={() => setFiltroEstado("Pendiente")}
            >
              Solicitudes Online
              {totalPendientes > 0 && (
                <span className="badge bg-danger ms-2">{totalPendientes}</span>
              )}
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link px-4 py-2 small fw-bold text-dark ${filtroEstado === "Confirmada" ? "active border-bottom-0" : "bg-transparent border-0 opacity-75"}`}
              onClick={() => setFiltroEstado("Confirmada")}
            >
              Agenda Confirmada
            </button>
          </li>
          <li className="nav-item">
            <button 
              className={`nav-link px-4 py-2 small fw-bold text-dark ${filtroEstado === "Historial" ? "active border-bottom-0" : "bg-transparent border-0 opacity-75"}`}
              onClick={() => setFiltroEstado("Historial")}
            >
              Historial de Citas
            </button>
          </li>
        </ul>
      </div>

      {/* Tabla Principal */}
      <div className="card border-0 shadow-sm bg-white" style={{ borderRadius: "8px" }}>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="table-light text-secondary small border-bottom">
              <tr>
                <th className="px-4 py-3">Paciente</th>
                <th className="py-3">Servicio</th>
                <th className="py-3">Horario</th>
                <th className="py-3">Motivo / Notas</th>
                {filtroEstado === "Historial" && <th className="py-3">Estado</th>}
                <th className="text-end px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="small">
              {citasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-5 text-muted">No se encontraron citas disponibles.</td>
                </tr>
              ) : (
                citasFiltradas.map((cita) => (
                  <tr key={cita.idCita} className="border-bottom">
                    
                    <td className="px-4 py-3">
                      <span className="fw-bold text-dark d-block">{cita.paciente}</span>
                      <small className="text-muted">Ref: #{cita.idCita}</small>
                    </td>

                    <td className="py-3 text-secondary">
                      {cita.servicio}
                      <small className="text-muted d-block">{cita.duracion} min</small>
                    </td>

                    <td className="py-3">
                      <span className="text-dark d-block fw-semibold">{cita.fecha}</span>
                      <small className="text-muted">{cita.horaInicio} - {cita.horaFin}</small>
                    </td>

                    <td className="py-3 text-muted text-truncate" style={{ maxWidth: "250px" }}>
                      {cita.observaciones || "-"}
                    </td>

                    {filtroEstado === "Historial" && (
                      <td className="py-3">
                        <span className={`badge px-2 py-1 ${cita.estado === 'Finalizada' ? 'bg-success text-white' : 'bg-secondary text-white'}`}>
                          {cita.estado}
                        </span>
                      </td>
                    )}

                    <td className="text-end px-4 py-3">
                      <div className="d-flex justify-content-end gap-2">
                        
                        {/* Solicitudes Online */}
                        {cita.estado === "Pendiente" && (
                          <>
                            <button className="btn btn-sm btn-success px-3" onClick={() => aceptarCita(cita.idCita)}>
                              Aceptar
                            </button>
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => {
                              setCitaAReprogramar(cita);
                              setNuevaFecha(cita.fecha);
                              setNuevaHora(cita.horaInicio);
                            }}>
                              Proponer Cambio
                            </button>
                          </>
                        )}

                        {/* Agenda Confirmada */}
                        {cita.estado === "Confirmada" && (
                          <>
                            <button className="btn btn-sm btn-primary" onClick={() => alert("Cargando formulario de consulta...")}>
                              Iniciar Sesión
                            </button>
                            <button className="btn btn-sm btn-light border" onClick={() => {
                              setCitaAReprogramar(cita);
                              setNuevaFecha(cita.fecha);
                              setNuevaHora(cita.horaInicio);
                            }}>
                              Reagendar
                            </button>
                            <button className="btn btn-sm btn-link text-danger text-decoration-none" onClick={() => cancelarCita(cita.idCita)}>
                              Cancelar
                            </button>
                          </>
                        )}

                        {/* Historial */}
                        {(cita.estado === "Finalizada" || cita.estado === "Cancelada") && (
                          <button className="btn btn-sm btn-light border text-secondary px-3">
                            Ver Consulta
                          </button>
                        )}

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Reagendar */}
      {citaAReprogramar && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(0,0,0,0.4)", zIndex: 1050 }}>
          <div className="card shadow-lg border-0 p-4 w-100" style={{ maxWidth: "400px", borderRadius: "8px" }}>
            <h6 className="fw-bold mb-3 text-dark">Modificar Horario de Cita</h6>
            
            <form onSubmit={ejecutarReprogramacion}>
              <div className="mb-3">
                <label className="form-label small text-muted">Nueva Fecha</label>
                <input type="date" className="form-control form-control-sm" value={nuevaFecha} onChange={(e) => setNuevaFecha(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label className="form-label small text-muted">Hora de Inicio</label>
                <input type="time" className="form-control form-control-sm" value={nuevaHora} onChange={(e) => setNuevaHora(e.target.value)} required />
              </div>
              
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="button" className="btn btn-sm btn-light border" onClick={() => setCitaAReprogramar(null)}>Cancelar</button>
                <button type="submit" className="btn btn-sm btn-primary px-3">Actualizar</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default PanelDoctorView;