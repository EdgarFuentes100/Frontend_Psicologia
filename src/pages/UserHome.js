import { useState, useEffect } from "react";
import { useAuthContext } from "../auth/AuthProvider";
import { useArea } from "../Hooks/useArea";
import { useDoctor } from "../Hooks/useDoctor"; 
import { useServicio } from "../Hooks/useServicio";
import { useHorario } from "../Hooks/useHorario"; // Importamos tu nuevo hook de horarios

const UserHome = () => {
    const { user, logout } = useAuthContext();
    
    // Hooks de datos de la clínica
    const { area } = useArea();
    const { doctor, getDoctor } = useDoctor();
    const { servicio, getServicio } = useServicio();
    const { horario, getHorario } = useHorario(); // Traemos el arreglo y la función

    // Estados de navegación e interfaz
    const [seccionActiva, setSeccionActiva] = useState("agendar");
    const [pasoFormulario, setPasoFormulario] = useState(1);

    // Estados de selección activa
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [horarioSeleccionado, setHorarioSeleccionado] = useState(null); // Para guardar el idHorario final

    // Manejador Paso 1: Seleccionar Especialidad -> Carga Doctores -> Paso 2
    const manejarSeleccionArea = (item) => {
        setAreaSeleccionada(item);
        getDoctor(item.idArea);      
        setDoctorSeleccionado(null); 
        setServicioSeleccionado(null);
        setHorarioSeleccionado(null);
        setPasoFormulario(2);        
    };

    // Manejador Paso 2: Seleccionar Doctor -> Carga Servicios -> Paso 3
    const manejarSeleccionDoctor = (doc) => {
        setDoctorSeleccionado(doc);
        getServicio(doc.idDoctor);     
        setServicioSeleccionado(null); 
        setHorarioSeleccionado(null);
        setPasoFormulario(3);          
    };

    // Manejador Paso 3: Seleccionar Servicio -> Carga Horarios -> Paso 4
    const manejarSeleccionServicio = (ser) => {
        setServicioSeleccionado(ser);
        getHorario(doctorSeleccionado.idDoctor); // Pasamos el idDoctor que ya tenemos guardado
        setHorarioSeleccionado(null);            // Limpiamos selección previa
        setPasoFormulario(4);                    // Brincamos automáticamente al Paso 4
    };

    return (
        <div className="min-vh-100 bg-light d-flex flex-column pb-5" style={{ userSelect: "none" }}>
            
            {/* 1. NAVBAR */}
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

                    {/* Navegación Desktop */}
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

            {/* 2. CONTENIDO PRINCIPAL */}
            <div className="container-xl flex-grow-1 p-3 p-md-4 mt-3 mb-5" style={{ maxWidth: "1000px" }}>

                {/* SECCIÓN A: AGENDAR CITA */}
                {seccionActiva === "agendar" && (
                    <div className="card border-0 shadow-sm p-4 p-md-5 bg-white mb-4" style={{ borderRadius: "24px" }}>
                        
                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                            <div>
                                <h3 className="fw-bold m-0 text-dark">Agendar una Cita Médica</h3>
                                <p className="text-muted small m-0">Completa los pasos para reservar tu espacio.</p>
                            </div>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">Paso {pasoFormulario} de 4</span>
                        </div>

                        <div className="progress mb-4" style={{ height: "8px", borderRadius: "10px" }}>
                            <div className="progress-bar bg-primary progress-bar-striped progress-bar-animated" role="progressbar" style={{ width: `${(pasoFormulario / 4) * 100}%`, borderRadius: "10px" }}></div>
                        </div>

                        {/* PASO 1: SELECCIÓN DE ÁREAS */}
                        {pasoFormulario === 1 && (
                            <div>
                                <h5 className="text-dark fw-bold mb-3" style={{ fontSize: "1.1rem" }}>1. Selecciona una Especialidad</h5>
                                <div className="row g-3">
                                    {area && area.length > 0 ? (
                                        area.map(item => (
                                            <div className="col-12 col-sm-6 col-md-4" key={item.idArea}>
                                                <div
                                                    className={`card h-100 p-4 border-2 text-center ${areaSeleccionada?.idArea === item.idArea ? "border-primary bg-primary-subtle text-primary shadow" : "border-transparent bg-light text-dark"}`}
                                                    onClick={() => manejarSeleccionArea(item)}
                                                    style={{ cursor: "pointer", borderRadius: "20px", transition: "all 0.25s ease" }}
                                                >
                                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-primary-subtle text-primary" style={{ width: "60px", height: "60px" }}>
                                                        <i className="bi bi-heart-pulse-fill fs-3"></i>
                                                    </div>
                                                    <span className="fw-bold d-block mb-1">{item.area}</span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">Cargando especialidades...</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* PASO 2: SELECCIÓN DE DOCTORES */}
                        {pasoFormulario === 2 && (
                            <div>
                                <div className="mb-3">
                                    <span className="badge bg-primary-subtle text-primary border-0 rounded-pill px-3 py-2 mb-2">
                                        Especialidad: {areaSeleccionada?.area}
                                    </span>
                                    <h5 className="text-dark fw-bold mb-1" style={{ fontSize: "1.1rem" }}>2. Selecciona tu Especialista</h5>
                                </div>
                                <div className="row g-3">
                                    {doctor && doctor.length > 0 ? (
                                        doctor.map(doc => (
                                            <div className="col-12 col-sm-6 col-md-4" key={doc.idDoctor}>
                                                <div
                                                    className={`card h-100 p-4 border-2 text-center ${doctorSeleccionado?.idDoctor === doc.idDoctor ? "border-primary bg-primary-subtle text-primary shadow" : "border-transparent bg-light text-dark"}`}
                                                    onClick={() => manejarSeleccionDoctor(doc)}
                                                    style={{ cursor: "pointer", borderRadius: "20px", transition: "all 0.25s ease" }}
                                                >
                                                    <div className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center bg-white text-primary shadow-sm" style={{ width: "60px", height: "60px" }}>
                                                        <i className="bi bi-person-md fs-2"></i>
                                                    </div>
                                                    <span className="fw-bold d-block mb-1">{doc.nombres} {doc.apellidos}</span>
                                                    {doc.titulo && <small className="text-muted d-block fw-medium" style={{ fontSize: "13px" }}>{doc.titulo}</small>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">No se encontraron médicos para esta área.</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-start mt-4">
                                    <button type="button" className="btn btn-light border px-4 py-3 rounded-4 fw-bold text-secondary" onClick={() => setPasoFormulario(1)}>
                                        <i className="bi bi-arrow-left me-1"></i> Regresar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 3: SELECCIÓN DE SERVICIOS */}
                        {pasoFormulario === 3 && (
                            <div>
                                <div className="mb-3">
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-2">Especialidad: {areaSeleccionada?.area}</span>
                                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">Especialista: {doctorSeleccionado?.nombres} {doctorSeleccionado?.apellidos}</span>
                                    </div>
                                    <h5 className="text-dark fw-bold mb-1" style={{ fontSize: "1.1rem" }}>3. Selecciona el Servicio / Tipo de Consulta</h5>
                                </div>
                                <div className="row g-3">
                                    {servicio && servicio.length > 0 ? (
                                        servicio.map(ser => (
                                            <div className="col-12 col-md-6" key={ser.idServicio || ser.id}>
                                                <div
                                                    className={`card h-100 p-4 border-2 ${servicioSeleccionado?.idServicio === ser.idServicio ? "border-primary bg-primary-subtle text-primary shadow" : "border-transparent bg-light text-dark"}`}
                                                    onClick={() => manejarSeleccionServicio(ser)}
                                                    style={{ cursor: "pointer", borderRadius: "20px", transition: "all 0.25s ease" }}
                                                >
                                                    <div className="d-flex align-items-center gap-3">
                                                        <div className="rounded-4 d-flex align-items-center justify-content-center bg-white text-primary shadow-sm" style={{ width: "50px", height: "50px", minWidth: "50px" }}>
                                                            <i className="bi bi-journal-check fs-3"></i>
                                                        </div>
                                                        <div className="text-start flex-grow-1">
                                                            <span className="fw-bold d-block leading-tight">{ser.servicio || ser.nombre || "Consulta Médica"}</span>
                                                            {ser.precio && <span className="badge bg-white text-dark border mt-1 fw-bold">${ser.precio}</span>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">No hay servicios disponibles para este especialista.</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-start mt-4">
                                    <button type="button" className="btn btn-light border px-4 py-3 rounded-4 fw-bold text-secondary" onClick={() => setPasoFormulario(2)}>
                                        <i className="bi bi-arrow-left me-1"></i> Regresar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 4: NUEVA SELECCIÓN DE HORARIOS DISPONIBLES */}
                        {pasoFormulario === 4 && (
                            <div>
                                <div className="mb-3">
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-2">Especialista: {doctorSeleccionado?.nombres}</span>
                                        <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2">Servicio: {servicioSeleccionado?.servicio || servicioSeleccionado?.nombre}</span>
                                    </div>
                                    <h5 className="text-dark fw-bold mb-1" style={{ fontSize: "1.1rem" }}>4. Selecciona un Horario de Atención</h5>
                                    <p className="text-muted small">Días y horas disponibles del especialista.</p>
                                </div>

                                <div className="row g-3">
                                    {horario && horario.length > 0 ? (
                                        horario.map(h => (
                                            <div className="col-12 col-sm-6 col-md-4" key={h.idHorario}>
                                                <div
                                                    className={`card p-3 border-2 text-center ${horarioSeleccionado?.idHorario === h.idHorario ? "border-primary bg-primary-subtle text-primary shadow" : "border-transparent bg-light text-dark"}`}
                                                    onClick={() => setHorarioSeleccionado(h)}
                                                    style={{ cursor: "pointer", borderRadius: "16px", transition: "all 0.25s ease" }}
                                                >
                                                    <div className="fw-bold text-uppercase small text-primary mb-1">{h.diaSemana}</div>
                                                    <div className="d-flex align-items-center justify-content-center gap-2 mt-1">
                                                        <i className="bi bi-clock small"></i>
                                                        <span className="fw-semibold" style={{ fontSize: "14px" }}>
                                                            {h.horaInicio} - {h.horaFin}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">
                                            El especialista no cuenta con turnos u horarios activos en el sistema.
                                        </div>
                                    )}
                                </div>

                                <div className="d-flex justify-content-between gap-2 mt-4">
                                    <button type="button" className="btn btn-light border px-4 py-3 rounded-4 fw-bold text-secondary w-100 w-md-auto" onClick={() => setPasoFormulario(3)}>
                                        <i className="bi bi-arrow-left me-1"></i> Regresar
                                    </button>
                                    <button 
                                        type="button" 
                                        className="btn btn-success px-5 py-3 rounded-4 fw-bold shadow-sm w-100 w-md-auto" 
                                        disabled={!horarioSeleccionado}
                                        onClick={() => alert("¡Listo para procesar o confirmar la cita!")}
                                    >
                                        Confirmar Reserva <i className="bi bi-check-circle ms-1"></i>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* SECCIONES SECUNDARIAS */}
                {seccionActiva === "mis-citas" && (
                    <div className="text-center p-5 bg-white rounded-4 shadow-sm border border-light">
                        <i className="bi bi-calendar-x text-muted fs-2 d-block mb-3"></i>
                        <h6 className="fw-bold text-dark">Área de Citas Vigentes</h6>
                    </div>
                )}

                {seccionActiva === "historial" && (
                    <div className="text-center p-5 bg-white rounded-4 shadow-sm border border-light">
                        <i className="bi bi-clock-history text-muted fs-2 d-block mb-3"></i>
                        <h6 className="fw-bold text-dark">Historial de Consultas Completadas</h6>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHome;