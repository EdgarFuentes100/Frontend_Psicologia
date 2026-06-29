import { useState } from "react";
import { useAuthContext } from "../auth/AuthProvider";

// Datos de prueba estáticos (Actualizados con servicios reales de la imagen_5b6c0c.jpg)
const areasData = [
    {
        id: "med-general",
        nombre: "Medicina General",
        icono: "bi-heart-pulse-fill",
        color: "bg-primary-subtle text-primary",
        doctores: [
            { id: "doc-1", nombre: "Dr. Carlos Pérez", servicios: ["Consulta General", "Chequeo Ejecutivo"] },
            { id: "doc-2", nombre: "Dra. María Gómez", servicios: ["Consulta General", "Certificado Médico"] }
        ]
    },
    {
        id: "pediatria",
        nombre: "Pediatría",
        icono: "bi-backpack-fill",
        color: "bg-warning-subtle text-warning",
        doctores: [
            { id: "doc-3", nombre: "Dr. Luis Alva", servicios: ["Control de Crecimiento", "Vacunación Infantil"] },
            { id: "doc-4", nombre: "Dra. Ana Martínez", servicios: ["Consulta Pediátrica de Emergencia"] }
        ]
    },
    {
        id: "psicologia",
        nombre: "Psicología Clínica",
        icono: "bi-brain-fill",
        color: "bg-info-subtle text-info", 
        doctores: [
            { 
                id: "doc-5", 
                nombre: "Licda. Rivera", // Puedes cambiar por el nombre real de la especialista
                servicios: [
                    "Evaluación psicológica integral",
                    "Psicoterapia para niños, adolescentes y adultos",
                    "Manejo de ansiedad, estrés y depresión",
                    "Terapia de pareja y orientación familiar",
                    "Fortalecimiento de autoestima y seguridad personal",
                    "Manejo de emociones y límites saludables",
                    "Atención en duelo y crisis emocionales",
                    "Conflictos familiares y relaciones interpersonales",
                    "Crecimiento personal y desarrollo emocional",
                    "Prueba poligráfica",
                    "Charlas y talleres de salud mental"
                ] 
            }
        ]
    }
];

const citasIniciales = [
    {
        id: "cita-1",
        area: "Cardiología",
        doctor: "Dr. Roberto Tosso",
        servicio: "Electrocardiograma",
        fecha: "2026-07-05",
        hora: "10:30 AM",
        estado: "Programada"
    }
];

const historialInicial = [
    {
        id: "hist-1",
        area: "Medicina General",
        doctor: "Dr. Carlos Pérez",
        servicio: "Consulta General",
        fecha: "2026-05-12",
        estado: "Completada"
    }
];

const UserHome = () => {
    const { user, logout } = useAuthContext();

    // Estado de sección principal
    const [seccionActiva, setSeccionActiva] = useState("agendar");

    // Control del Paso a Paso (Stepper) para agendar
    const [pasoFormulario, setPasoFormulario] = useState(1);

    // Estados del Formulario
    const [areaSeleccionada, setAreaSeleccionada] = useState("");
    const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [fechaCita, setFechaCita] = useState("");
    const [horaCita, setHoraCita] = useState("");

    // Citas
    const [citasProgramadas, setCitasProgramadas] = useState(citasIniciales);
    const [historialCitas] = useState(historialInicial);

    // Búsquedas dinámicas
    const areaObjeto = areasData.find(a => a.id === areaSeleccionada);
    const doctoresDisponibles = areaObjeto?.doctores || [];
    const serviciosDisponibles = doctoresDisponibles.find(d => d.id === doctorSeleccionado)?.servicios || [];

    // Resetear formulario por completo
    const resetFormulario = () => {
        setAreaSeleccionada("");
        setDoctorSeleccionado("");
        setServicioSeleccionado("");
        setFechaCita("");
        setHoraCita("");
        setPasoFormulario(1);
    };

    const handleAgendar = (e) => {
        e.preventDefault();
        
        const nuevaCita = {
            id: `cita-${Date.now()}`,
            area: areaObjeto?.nombre,
            doctor: doctoresDisponibles.find(d => d.id === doctorSeleccionado)?.nombre,
            servicio: servicioSeleccionado,
            fecha: fechaCita,
            hora: horaCita,
            estado: "Programada"
        };

        setCitasProgramadas([nuevaCita, ...citasProgramadas]);
        resetFormulario();
        setSeccionActiva("mis-citas");
    };

    const handleCancelarCita = (id) => {
        if (window.confirm("¿Seguro que deseas cancelar esta cita?")) {
            setCitasProgramadas(citasProgramadas.filter(cita => cita.id !== id));
        }
    };

    const hoy = new Date().toISOString().split("T")[0];

    return (
        <div className="min-vh-100 bg-light d-flex flex-column pb-5" style={{ userSelect: "none" }}>
            
            {/* Header Premium con Color e Identidad Visual */}
            <nav className="navbar bg-primary-subtle px-3 py-3 border-bottom border-primary-visible sticky-top shadow-sm">
                <div className="container-fluid d-flex justify-content-between align-items-center p-0">
                    <div className="d-flex align-items-center gap-2">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "42px", height: "42px" }}>
                            <i className="bi bi-person-fill fs-5"></i>
                        </div>
                        <div>
                            <small className="text-primary-emphasis d-block opacity-75" style={{ fontSize: "11px", lineHeight: "1.2", fontWeight: "500" }}>Bienvenido de vuelta</small>
                            <span className="fw-bold text-primary-emphasis" style={{ fontSize: "15px" }}>{user?.name || "Paciente"}</span>
                        </div>
                    </div>
                    <button className="btn btn-sm btn-white bg-white text-danger border-0 rounded-pill py-2 px-3 fw-bold shadow-sm" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-1"></i> Salir
                    </button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <div className="container flex-grow-1 p-3 m-auto w-100 mb-5" style={{ maxWidth: "480px" }}>
                
                {/* 1. SECCIÓN AGENDAR */}
                {seccionActiva === "agendar" && (
                    <div>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="fw-black m-0 text-dark">Nueva Cita</h4>
                            <span className="badge bg-primary rounded-pill">Paso {pasoFormulario} de 3</span>
                        </div>

                        <div className="progress mb-4" style={{ height: "6px", borderRadius: "10px" }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${(pasoFormulario / 3) * 100}%` }}></div>
                        </div>

                        <form onSubmit={handleAgendar}>
                            {pasoFormulario === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                    <p className="text-muted small mb-3">Selecciona la especialidad médica que necesitas:</p>
                                    <div className="row g-2">
                                        {areasData.map(area => (
                                            <div className="col-6" key={area.id}>
                                                <div 
                                                    className={`card h-100 p-3 border-2 text-center custom-card clickable-card ${areaSeleccionada === area.id ? "border-primary bg-primary-subtle text-primary" : "border-light bg-white text-dark shadow-sm"}`}
                                                    onClick={() => { setAreaSeleccionada(area.id); setDoctorSeleccionado(""); setServicioSeleccionado(""); }}
                                                    style={{ cursor: "pointer", borderRadius: "16px", transition: "all 0.2s" }}
                                                >
                                                    <div className={`rounded-circle mx-auto mb-2 d-flex align-items-center justify-content-center ${area.color}`} style={{ width: "50px", height: "50px" }}>
                                                        <i className={`bi ${area.icono} fs-4`}></i>
                                                    </div>
                                                    <span className="fw-bold small d-block">{area.nombre}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-4">
                                        <button type="button" className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow" disabled={!areaSeleccionada} onClick={() => setPasoFormulario(2)}>
                                            Continuar <i className="bi bi-arrow-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {pasoFormulario === 2 && (
                                <div className="animate__animated animate__fadeIn">
                                    <button type="button" className="btn btn-sm btn-link text-decoration-none p-0 mb-3 text-secondary" onClick={() => setPasoFormulario(1)}>
                                        <i className="bi bi-arrow-left"></i> Cambiar especialidad
                                    </button>

                                    <div className="mb-4">
                                        <label className="form-label small fw-bold text-secondary">¿Con qué especialista prefieres atenderte?</label>
                                        <div className="d-flex flex-column gap-2">
                                            {doctoresDisponibles.map(doc => (
                                                <div 
                                                    key={doc.id}
                                                    onClick={() => { setDoctorSeleccionado(doc.id); setServicioSeleccionado(""); }}
                                                    className={`d-flex align-items-center justify-content-between p-3 rounded-4 border-2 shadow-sm ${doctorSeleccionado === doc.id ? "bg-primary text-white border-primary" : "bg-white text-dark border-transparent"}`}
                                                    style={{ cursor: "pointer", transition: "0.2s" }}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className={`rounded-circle p-2 ${doctorSeleccionado === doc.id ? 'bg-white text-primary' : 'bg-light text-secondary'}`}>
                                                            <i className="bi bi-person-heart fs-5"></i>
                                                        </div>
                                                        <span className="fw-bold">{doc.nombre}</span>
                                                    </div>
                                                    {doctorSeleccionado === doc.id && <i className="bi bi-check-circle-fill fs-5"></i>}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {doctorSeleccionado && (
                                        <div className="mb-3 animate__animated animate__fadeIn">
                                            <label className="form-label small fw-bold text-secondary">Selecciona el tipo de servicio:</label>
                                            <div className="d-flex flex-wrap gap-2">
                                                {serviciosDisponibles.map((serv, i) => (
                                                    <button 
                                                        type="button" 
                                                        key={i} 
                                                        onClick={() => setServicioSeleccionado(serv)}
                                                        className={`btn rounded-pill px-3 py-2 text-start small fw-medium shadow-sm border-0 ${servicioSeleccionado === serv ? "btn-dark text-white" : "btn-white bg-white text-secondary"}`}
                                                    >
                                                        {serv}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <button type="button" className="btn btn-primary w-100 py-3 rounded-4 fw-bold shadow" disabled={!servicioSeleccionado} onClick={() => setPasoFormulario(3)}>
                                            Elegir fecha y hora <i className="bi bi-arrow-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {pasoFormulario === 3 && (
                                <div className="animate__animated animate__fadeIn">
                                    <button type="button" className="btn btn-sm btn-link text-decoration-none p-0 mb-3 text-secondary" onClick={() => setPasoFormulario(2)}>
                                        <i className="bi bi-arrow-left"></i> Cambiar médico/servicio
                                    </button>

                                    <div className="card border-0 bg-white shadow-sm p-3 rounded-4 mb-3">
                                        <div className="mb-3">
                                            <label className="form-label small fw-bold text-secondary"><i className="bi bi-calendar-event me-1"></i> ¿Qué día deseas venir?</label>
                                            <input type="date" className="form-control form-control-lg border-2 rounded-3" min={hoy} value={fechaCita} onChange={(e) => setFechaCita(e.target.value)} required />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small fw-bold text-secondary"><i className="bi bi-clock me-1"></i> Selecciona la hora</label>
                                            <input type="time" className="form-control form-control-lg border-2 rounded-3" value={horaCita} onChange={(e) => setHoraCita(e.target.value)} required />
                                        </div>
                                    </div>

                                    {fechaCita && horaCita && (
                                        <div className="alert alert-info border-0 rounded-4 shadow-sm p-3 small animate__animated animate__pulse">
                                            <h6 className="fw-bold mb-1 text-info-emphasis"><i className="bi bi-info-circle-fill"></i> Resumen del agendamiento:</h6>
                                            Tu cita médica quedará programada para el <strong>{fechaCita}</strong> a las <strong>{horaCita}</strong>.
                                        </div>
                                    )}

                                    <div className="mt-4">
                                        <button type="submit" className="btn btn-success btn-lg w-100 py-3 rounded-4 fw-bold shadow">
                                            <i className="bi bi-calendar-check-fill me-2"></i> Confirmar y Reservar
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* 2. SECCIÓN MIS CITAS */}
                {seccionActiva === "mis-citas" && (
                    <div className="animate__animated animate__fadeIn">
                        <h4 className="fw-bold text-dark mb-3">Próximas Citas</h4>
                        {citasProgramadas.length === 0 ? (
                            <div className="text-center p-5 bg-white rounded-4 shadow-sm border border-light">
                                <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                                    <i className="bi bi-calendar-x text-muted fs-2"></i>
                                </div>
                                <h6 className="fw-bold text-dark">Sin compromisos médicos</h6>
                                <p className="text-muted small mb-3">No tienes citas programadas por el momento.</p>
                                <button className="btn btn-primary btn-sm rounded-pill px-4" onClick={() => { setSeccionActiva("agendar"); resetFormulario(); }}>
                                    Agendar una ahora
                                </button>
                            </div>
                        ) : (
                            citasProgramadas.map(cita => (
                                <div key={cita.id} className="card shadow-sm mb-3 border-0 p-3 bg-white" style={{ borderRadius: "20px" }}>
                                    <div className="d-flex justify-content-between align-items-start">
                                        <div className="w-70">
                                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 small" style={{ fontSize: "11px" }}>{cita.area}</span>
                                            <h5 className="mb-1 fw-bold text-dark fs-6">{cita.doctor}</h5>
                                            <p className="text-muted small mb-3"><i className="bi bi-clipboard2-pulse me-1 text-primary"></i> {cita.servicio}</p>
                                            
                                            <div className="p-2 bg-light rounded-3 d-inline-flex align-items-center gap-2 small text-secondary fw-semibold">
                                                <i className="bi bi-calendar3 text-primary"></i> {cita.fecha} 
                                                <span className="text-muted">|</span> 
                                                <i className="bi bi-clock text-primary"></i> {cita.hora}
                                            </div>
                                        </div>
                                        <button className="btn btn-light text-danger rounded-circle p-2 border-0 shadow-sm" onClick={() => handleCancelarCita(cita.id)} title="Cancelar Cita">
                                            <i className="bi bi-trash fs-5"></i>
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}

                {/* 3. SECCIÓN HISTORIAL */}
                {seccionActiva === "historial" && (
                    <div className="animate__animated animate__fadeIn">
                        <h4 className="fw-bold text-dark mb-3">Historial Clínico</h4>
                        <div className="d-flex flex-column gap-2">
                            {historialCitas.map(hist => (
                                <div key={hist.id} className="card shadow-sm p-3 bg-white border-0" style={{ borderRadius: "16px" }}>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div>
                                            <h6 className="mb-1 fw-bold text-dark fs-6">{hist.doctor}</h6>
                                            <div className="text-muted style-muted" style={{ fontSize: "12px" }}>
                                                <span>{hist.servicio}</span> • <span className="fw-medium">{hist.fecha}</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-1 fw-bold" style={{ fontSize: "11px" }}>
                                            <i className="bi bi-check-circle-fill me-1"></i> {hist.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Menú de Navegación Inferior Móvil - Área Completa */}
            <div className="bg-white border-top fixed-bottom d-flex justify-content-around shadow-lg rounded-top-4" style={{ zIndex: 1050 }}>
                
                {/* Botón Agendar */}
                <button 
                    className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${
                        seccionActiva === "agendar" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"
                    }`}
                    onClick={() => setSeccionActiva("agendar")}
                    style={{ transition: "all 0.2s ease-in-out" }}
                >
                    <i className={`bi ${seccionActiva === "agendar" ? "bi-calendar-plus-fill" : "bi-calendar-plus"} fs-4`}></i>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Agendar</span>
                </button>

                {/* Botón Mis Citas */}
                <button 
                    className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${
                        seccionActiva === "mis-citas" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"
                    }`}
                    onClick={() => setSeccionActiva("mis-citas")}
                    style={{ transition: "all 0.2s ease-in-out" }}
                >
                    <div className="position-relative">
                        <i className={`bi ${seccionActiva === "mis-citas" ? "bi-calendar2-check-fill" : "bi-calendar2-check"} fs-4`}></i>
                        {citasProgramadas.length > 0 && (
                            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: "9px", padding: "3px 6px" }}>
                                {citasProgramadas.length}
                            </span>
                        )}
                    </div>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Mis Citas</span>
                </button>

                {/* Botón Historial */}
                <button 
                    className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${
                        seccionActiva === "historial" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"
                    }`}
                    onClick={() => setSeccionActiva("historial")}
                    style={{ transition: "all 0.2s ease-in-out" }}
                >
                    <i className={`bi ${seccionActiva === "historial" ? "bi-clock-history" : "bi-clock"} fs-4`}></i>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Historial</span>
                </button>
                
            </div>
        </div>
    );
};

export default UserHome;