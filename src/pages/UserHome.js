import { useState } from "react";
import { useAuthContext } from "../auth/AuthProvider";

// Datos de prueba estáticos con los días y horas que trabaja cada doctor
const areasData = [
    {
        id: "med-general",
        nombre: "Medicina General",
        icono: "bi-heart-pulse-fill",
        color: "bg-primary-subtle text-primary",
        doctores: [
            { 
                id: "doc-1", 
                nombre: "Dr. Carlos Pérez", 
                servicios: ["Consulta General", "Chequeo Ejecutivo"],
                diasLaborales: [1, 2, 3, 4, 5], // Lunes a Viernes (JS: 1=Lun, 5=Vie)
                horarios: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"]
            },
            { 
                id: "doc-2", 
                nombre: "Dra. María Gómez", 
                servicios: ["Consulta General", "Certificado Médico"],
                diasLaborales: [1, 3, 5], // Lunes, Miércoles y Viernes
                horarios: ["09:00 AM", "10:30 AM", "11:30 AM", "04:00 PM", "05:00 PM"]
            }
        ]
    },
    {
        id: "pediatria",
        nombre: "Pediatría",
        icono: "bi-backpack-fill",
        color: "bg-warning-subtle text-warning",
        doctores: [
            { 
                id: "doc-3", 
                nombre: "Dr. Luis Alva", 
                servicios: ["Control de Crecimiento", "Vacunación Infantil"],
                diasLaborales: [2, 4], // Martes y Jueves
                horarios: ["08:30 AM", "10:00 AM", "11:30 AM", "03:30 PM"]
            },
            { 
                id: "doc-4", 
                nombre: "Dra. Ana Martínez", 
                servicios: ["Consulta Pediátrica de Emergencia"],
                diasLaborales: [1, 2, 3, 4, 5, 6], // Lunes a Sábado
                horarios: ["07:00 AM", "08:00 AM", "12:00 PM", "01:00 PM"]
            }
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
                nombre: "Licda. Rivera",
                servicios: [
                    "Evaluación psicológica integral", "Psicoterapia para niños, adolescentes y adultos",
                    "Manejo de ansiedad, estrés y depresión", "Terapia de pareja y orientación familiar",
                    "Fortalecimiento de autoestima y seguridad personal", "Manejo de emociones y límites saludables",
                    "Atención en duelo y crisis emocionales", "Conflictos familiares y relaciones interpersonales",
                    "Crecimiento personal y desarrollo emocional", "Prueba poligráfica", "Charlas y talleres de salud mental"
                ],
                diasLaborales: [1, 2, 3, 4, 5], // Lunes a Viernes
                horarios: ["08:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "03:30 PM", "05:00 PM"]
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

    const [seccionActiva, setSeccionActiva] = useState("agendar");
    const [pasoFormulario, setPasoFormulario] = useState(1);

    const [areaSeleccionada, setAreaSeleccionada] = useState("");
    const [doctorSeleccionado, setDoctorSeleccionado] = useState("");
    const [servicioSeleccionado, setServicioSeleccionado] = useState("");
    const [fechaCita, setFechaCita] = useState("");
    const [horaCita, setHoraCita] = useState("");
    const [errorFecha, setErrorFecha] = useState("");

    const [citasProgramadas, setCitasProgramadas] = useState(citasIniciales);
    const [historialCitas] = useState(historialInicial);

    const areaObjeto = areasData.find(a => a.id === areaSeleccionada);
    const doctoresDisponibles = areaObjeto?.doctores || [];
    const doctorObjeto = doctoresDisponibles.find(d => d.id === doctorSeleccionado);
    const serviciosDisponibles = doctorObjeto?.servicios || [];
    const horariosDisponibles = doctorObjeto?.horarios || [];

    const resetFormulario = () => {
        setAreaSeleccionada("");
        setDoctorSeleccionado("");
        setServicioSeleccionado("");
        setFechaCita("");
        setHoraCita("");
        setErrorFecha("");
        setPasoFormulario(1);
    };

    // Validar si el doctor trabaja en la fecha seleccionada
    const handleFechaChange = (e) => {
        const fecha = e.target.value;
        setFechaCita(fecha);
        setHoraCita(""); // Resetear hora al cambiar fecha
        setErrorFecha("");

        if (!fecha || !doctorObjeto) return;

        // Obtener el día de la semana (0 = Domingo, 1 = Lunes, etc.)
        // Se le agrega 'T00:00:00' para evitar desfases de zona horaria al parsear
        const dateObj = new Date(fecha + "T00:00:00");
        const diaSemana = dateObj.getDay();

        if (!doctorObjeto.diasLaborales.includes(diaSemana)) {
            setErrorFecha(`El especialista no labora el día seleccionado. Intente con otra fecha.`);
        }
    };

    const handleAgendar = (e) => {
        e.preventDefault();
        if (errorFecha) return;
        
        const nuevaCita = {
            id: `cita-${Date.now()}`,
            area: areaObjeto?.nombre,
            doctor: doctorObjeto?.nombre,
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
            
            {/* Header Premium Adaptado */}
            <nav className="navbar bg-white px-4 py-3 border-bottom sticky-top shadow-sm">
                <div className="container-xl d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center shadow-sm" style={{ width: "45px", height: "45px" }}>
                            <i className="bi bi-person-fill fs-5"></i>
                        </div>
                        <div>
                            <small className="text-muted d-block" style={{ fontSize: "12px", fontWeight: "500" }}>Bienvenido de vuelta</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "16px" }}>{user?.name || "Paciente"}</span>
                        </div>
                    </div>
                    
                    <div className="d-none d-md-flex gap-2 bg-light p-1 rounded-pill">
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "agendar" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("agendar")}>
                            <i className="bi bi-calendar-plus me-2"></i>Agendar
                        </button>
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "mis-citas" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("mis-citas")}>
                            <i className="bi bi-calendar2-check me-2"></i>Mis Citas
                        </button>
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "historial" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("historial")}>
                            <i className="bi bi-clock-history me-2"></i>Historial
                        </button>
                    </div>

                    <button className="btn btn-sm btn-outline-danger rounded-pill py-2 px-3 fw-bold" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-1"></i> Salir
                    </button>
                </div>
            </nav>

            {/* Contenido Principal */}
            <div className="container-xl flex-grow-1 p-3 p-md-4 mt-3 mb-5" style={{ maxWidth: "1000px" }}>
                
                {/* 1. SECCIÓN AGENDAR */}
                {seccionActiva === "agendar" && (
                    <div className="card border-0 shadow-sm p-4 p-md-5 bg-white mb-4" style={{ borderRadius: "24px" }}>
                        
                        {/* BOTÓN REGRESAR GLOBAL (Fijo arriba del flujo para que siempre puedan volver) */}
                        {pasoFormulario > 1 && (
                            <button 
                                type="button" 
                                className="btn btn-sm btn-light text-secondary border rounded-pill px-3 py-2 mb-3 fw-semibold shadow-sm transition-all" 
                                onClick={() => setPasoFormulario(pasoFormulario - 1)}
                            >
                                <i className="bi bi-arrow-left me-1"></i> Volver al paso anterior
                            </button>
                        )}

                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                            <div>
                                <h3 className="fw-bold m-0 text-dark">Agendar una Cita Médica</h3>
                                <p className="text-muted small m-0">Completa los pasos para reservar tu espacio.</p>
                            </div>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">Paso {pasoFormulario} de 3</span>
                        </div>

                        <div className="progress mb-4" style={{ height: "8px", borderRadius: "10px" }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${(pasoFormulario / 3) * 100}%`, borderRadius: "10px" }}></div>
                        </div>

                        <form onSubmit={handleAgendar}>
                            
                            {/* PASO 1: ESPECIALIDADES */}
                            {pasoFormulario === 1 && (
                                <div className="animate__animated animate__fadeIn">
                                    <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>1. Selecciona una Especialidad</h5>
                                    <div className="row g-3">
                                        {areasData.map(area => (
                                            <div className="col-12 col-sm-6 col-md-4" key={area.id}>
                                                <div 
                                                    className={`card h-100 p-4 border-2 text-center clickable-card ${areaSeleccionada === area.id ? "border-primary bg-primary-subtle text-primary shadow" : "border-transparent bg-light text-dark"}`}
                                                    onClick={() => { setAreaSeleccionada(area.id); setDoctorSeleccionado(""); setServicioSeleccionado(""); }}
                                                    style={{ cursor: "pointer", borderRadius: "20px", transition: "all 0.25s ease" }}
                                                >
                                                    <div className={`rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center ${area.color}`} style={{ width: "60px", height: "60px" }}>
                                                        <i className={`bi ${area.icono} fs-3`}></i>
                                                    </div>
                                                    <span className="fw-bold d-block mb-1">{area.nombre}</span>
                                                    <small className="text-muted d-block" style={{ fontSize: "12px" }}>{area.doctores.length} Especialistas disponibles</small>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="button" className="btn btn-primary px-5 py-3 rounded-4 fw-bold shadow-sm w-100 w-md-auto" disabled={!areaSeleccionada} onClick={() => setPasoFormulario(2)}>
                                            Continuar paso <i className="bi bi-arrow-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 2: DOCTOR Y SERVICIOS */}
                            {pasoFormulario === 2 && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="row g-4">
                                        <div className="col-12 col-md-6">
                                            <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>2. Selecciona un Especialista</h5>
                                            <div className="d-flex flex-column gap-2">
                                                {doctoresDisponibles.map(doc => (
                                                    <div 
                                                        key={doc.id}
                                                        onClick={() => { setDoctorSeleccionado(doc.id); setServicioSeleccionado(""); }}
                                                        className={`d-flex align-items-center justify-content-between p-3 rounded-4 border-2 ${doctorSeleccionado === doc.id ? "bg-primary text-white border-primary shadow" : "bg-light text-dark border-transparent"}`}
                                                        style={{ cursor: "pointer", transition: "0.2s", borderRadius: "16px" }}
                                                    >
                                                        <div className="d-flex align-items-center gap-3">
                                                            <div className={`rounded-circle p-2 ${doctorSeleccionado === doc.id ? 'bg-white text-primary' : 'bg-white text-secondary shadow-sm'}`}>
                                                                <i className="bi bi-person-heart fs-5"></i>
                                                            </div>
                                                            <span className="fw-bold">{doc.nombre}</span>
                                                        </div>
                                                        {doctorSeleccionado === doc.id && <i className="bi bi-check-circle-fill fs-5"></i>}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="col-12 col-md-6">
                                            <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>3. Selecciona el Tipo de Servicio</h5>
                                            {doctorSeleccionado ? (
                                                <div className="d-flex flex-column gap-2 max-vh-50 overflow-y-auto pe-1">
                                                    {serviciosDisponibles.map((serv, i) => (
                                                        <button 
                                                            type="button" 
                                                            key={i} 
                                                            onClick={() => setServicioSeleccionado(serv)}
                                                            className={`btn text-start p-3 rounded-4 border-2 fw-medium ${servicioSeleccionado === serv ? "btn-dark text-white border-dark" : "btn-light bg-light text-secondary border-transparent"}`}
                                                            style={{ fontSize: "14px", borderRadius: "14px" }}
                                                        >
                                                            <i className={`bi ${servicioSeleccionado === serv ? 'bi-dot text-white' : 'bi-circle text-muted'} me-2`}></i>
                                                            {serv}
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="h-100 d-flex align-items-center justify-content-center border border-dashed rounded-4 p-4 text-center text-muted min-height-150">
                                                    <span>Selecciona un médico primero para ver sus servicios disponibles.</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="d-flex justify-content-end mt-4">
                                        <button type="button" className="btn btn-primary px-5 py-3 rounded-4 fw-bold shadow-sm w-100 w-md-auto" disabled={!servicioSeleccionado} onClick={() => setPasoFormulario(3)}>
                                            Elegir fecha y hora <i className="bi bi-arrow-right ms-1"></i>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* PASO 3: FECHA Y HORARIOS ESPECÍFICOS DEL DOCTOR */}
                            {pasoFormulario === 3 && (
                                <div className="animate__animated animate__fadeIn">
                                    <div className="row g-4">
                                        
                                        {/* Fecha Calendario */}
                                        <div className="col-12 col-md-5">
                                            <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>4. Elige el Día</h5>
                                            <div className="card border-0 bg-light p-4 rounded-4 shadow-sm mb-3">
                                                <label className="form-label small fw-bold text-secondary">
                                                    <i className="bi bi-calendar-event me-1"></i> Selecciona fecha disponible:
                                                </label>
                                                <input 
                                                    type="date" 
                                                    className={`form-control form-control-lg border-2 rounded-3 ${errorFecha ? 'is-invalid border-danger' : 'border-0'}`} 
                                                    min={hoy} 
                                                    value={fechaCita} 
                                                    onChange={handleFechaChange} 
                                                    required 
                                                />
                                                {errorFecha && (
                                                    <div className="text-danger small mt-2 fw-semibold">
                                                        <i className="bi bi-exclamation-triangle-fill me-1"></i> {errorFecha}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Horarios Dinámicos del Doctor */}
                                        <div className="col-12 col-md-7">
                                            <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>5. Horarios del {doctorObjeto?.nombre}</h5>
                                            
                                            {fechaCita && !errorFecha ? (
                                                <div>
                                                    <p className="text-muted small mb-2">Horas disponibles para el día elegido:</p>
                                                    <div className="row g-2">
                                                        {horariosDisponibles.map((hora, idx) => (
                                                            <div className="col-4 col-sm-3 col-md-4 col-lg-3" key={idx}>
                                                                <button
                                                                    type="button"
                                                                    className={`btn w-100 py-3 rounded-3 fw-bold border ${horaCita === hora ? 'btn-primary border-primary shadow' : 'btn-white bg-white text-dark'}`}
                                                                    onClick={() => setHoraCita(hora)}
                                                                    style={{ fontSize: "13px" }}
                                                                >
                                                                    {hora}
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-75 d-flex align-items-center justify-content-center border border-dashed rounded-4 p-4 text-center text-muted">
                                                    <span>Selecciona una fecha válida de trabajo para ver las horas disponibles.</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Resumen Final en el pie */}
                                        {fechaCita && horaCita && !errorFecha && (
                                            <div className="col-12 animate__animated animate__fadeIn">
                                                <div className="card bg-success-subtle text-success-emphasis border-0 p-4 rounded-4 shadow-sm d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
                                                    <div>
                                                        <h6 className="fw-bold mb-2"><i className="bi bi-shield-check me-2 fs-5"></i> Todo listo para confirmar:</h6>
                                                        <span className="small d-block"><strong>Médico:</strong> {doctorObjeto?.nombre} • <strong>Servicio:</strong> {servicioSeleccionado}</span>
                                                        <span className="small d-block text-dark mt-1"><strong>Cita reservada para el:</strong> {fechaCita} a las {horaCita}</span>
                                                    </div>
                                                    <button type="submit" className="btn btn-success btn-lg px-5 py-3 rounded-4 fw-bold shadow">
                                                        <i className="bi bi-calendar-check-fill me-2"></i> Confirmar Cita
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>
                )}

                {/* Secciones MIS CITAS e HISTORIAL continúan igual... */}
                {seccionActiva === "mis-citas" && (
                    <div className="animate__animated animate__fadeIn">
                        <h4 className="fw-bold text-dark mb-4">Próximas Citas Programadas</h4>
                        {citasProgramadas.length === 0 ? (
                            <div className="text-center p-5 bg-white rounded-4 shadow-sm border border-light">
                                <div className="bg-light rounded-circle mx-auto d-flex align-items-center justify-content-center mb-3" style={{ width: "70px", height: "70px" }}>
                                    <i className="bi bi-calendar-x text-muted fs-2"></i>
                                </div>
                                <h6 className="fw-bold text-dark">Sin compromisos médicos</h6>
                                <p className="text-muted small mb-3">No tienes citas programadas por el momento.</p>
                                <button className="btn btn-primary rounded-pill px-4" onClick={() => { setSeccionActiva("agendar"); resetFormulario(); }}>
                                    Agendar una ahora
                                </button>
                            </div>
                        ) : (
                            <div className="row g-3">
                                {citasProgramadas.map(cita => (
                                    <div className="col-12 col-md-6" key={cita.id}>
                                        <div className="card shadow-sm border-0 p-4 bg-white h-100 d-flex flex-column justify-content-between" style={{ borderRadius: "20px" }}>
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div>
                                                    <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-1 mb-2 small" style={{ fontSize: "11px" }}>{cita.area}</span>
                                                    <h5 className="mb-1 fw-bold text-dark fs-5">{cita.doctor}</h5>
                                                    <p className="text-muted small mb-0"><i className="bi bi-clipboard2-pulse me-1 text-primary"></i> {cita.servicio}</p>
                                                </div>
                                                <button className="btn btn-light text-danger rounded-circle p-2 border-0 shadow-sm" onClick={() => handleCancelarCita(cita.id)} title="Cancelar Cita">
                                                    <i className="bi bi-trash fs-5"></i>
                                                </button>
                                            </div>
                                            <div className="p-3 bg-light rounded-3 d-flex align-items-center gap-3 small text-secondary fw-semibold w-100">
                                                <span><i className="bi bi-calendar3 text-primary me-1"></i> {cita.fecha}</span>
                                                <span className="text-muted">|</span>
                                                <span><i className="bi bi-clock text-primary me-1"></i> {cita.hora}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {seccionActiva === "historial" && (
                    <div className="animate__animated animate__fadeIn">
                        <h4 className="fw-bold text-dark mb-4">Historial Clínico de Consultas</h4>
                        <div className="row g-3">
                            {historialCitas.map(hist => (
                                <div className="col-12 col-md-6" key={hist.id}>
                                    <div className="card shadow-sm p-4 bg-white border-0 h-100 d-flex align-items-center justify-content-between flex-row" style={{ borderRadius: "16px" }}>
                                        <div>
                                            <h5 className="mb-1 fw-bold text-dark fs-6">{hist.doctor}</h5>
                                            <div className="text-muted small">
                                                <span>{hist.servicio}</span> • <span className="fw-medium text-dark">{hist.fecha}</span>
                                            </div>
                                        </div>
                                        <span className="badge bg-success-subtle text-success border border-success-subtle rounded-pill px-3 py-2 fw-bold" style={{ fontSize: "11px" }}>
                                            <i className="bi bi-check-circle-fill me-1"></i> {hist.estado}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Menú de Navegación Inferior Móvil */}
            <div className="bg-white border-top fixed-bottom d-flex justify-content-around shadow-lg rounded-top-4 d-md-none" style={{ zIndex: 1050 }}>
                <button className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${seccionActiva === "agendar" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"}`} onClick={() => setSeccionActiva("agendar")}>
                    <i className={`bi ${seccionActiva === "agendar" ? "bi-calendar-plus-fill" : "bi-calendar-plus"} fs-4`}></i>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Agendar</span>
                </button>
                <button className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${seccionActiva === "mis-citas" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"}`} onClick={() => setSeccionActiva("mis-citas")}>
                    <div className="position-relative">
                        <i className={`bi ${seccionActiva === "mis-citas" ? "bi-calendar2-check-fill" : "bi-calendar2-check"} fs-4`}></i>
                        {citasProgramadas.length > 0 && <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-white" style={{ fontSize: "9px", padding: "3px 6px" }}>{citasProgramadas.length}</span>}
                    </div>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Mis Citas</span>
                </button>
                <button className={`btn border-0 d-flex flex-column align-items-center justify-content-center py-2 flex-grow-1 w-100 rounded-0 ${seccionActiva === "historial" ? "bg-primary-subtle text-primary fw-bold" : "text-muted bg-transparent"}`} onClick={() => setSeccionActiva("historial")}>
                    <i className={`bi ${seccionActiva === "historial" ? "bi-clock-history" : "bi-clock"} fs-4`}></i>
                    <span style={{ fontSize: "11px", marginTop: "1px" }}>Historial</span>
                </button>
            </div>
        </div>
    );
};

export default UserHome;