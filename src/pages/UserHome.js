import React, { useState, useEffect } from "react";
import { useAuthContext } from "../auth/AuthProvider";
import { useArea } from "../Hooks/useArea";
import { useDoctor } from "../Hooks/useDoctor";
import { useServicio } from "../Hooks/useServicio";
import { useHorario } from "../Hooks/useHorario";

const UserHome = () => {
    const { user, logout } = useAuthContext();

    // Hooks de datos de la clínica
    const { area } = useArea();
    const { doctor, getDoctor } = useDoctor();
    const { servicio, getServicio } = useServicio();
    const { horario, getHorario } = useHorario();

    // Estados de navegación e interfaz
    const [seccionActiva, setSeccionActiva] = useState("agendar");
    const [pasoFormulario, setPasoFormulario] = useState(1);

    // Estados de selección activa
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);

    // Estados para el flujo de fecha y hora
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);

    // Manejador Paso 1: Seleccionar Especialidad -> Carga Doctores -> Paso 2
    const manejarSeleccionArea = (item) => {
        setAreaSeleccionada(item);
        getDoctor(item.idArea);
        setDoctorSeleccionado(null);
        setServicioSeleccionado(null);
        setDiaSeleccionado(null);
        setHoraSeleccionada(null);
        setPasoFormulario(2);
    };

    // Manejador Paso 2: Seleccionar Doctor -> Carga Servicios -> Paso 3
    const manejarSeleccionDoctor = (doc) => {
        setDoctorSeleccionado(doc);
        getServicio(doc.idDoctor);
        setServicioSeleccionado(null);
        setDiaSeleccionado(null);
        setHoraSeleccionada(null);
        setPasoFormulario(3);
    };

    // Manejador Paso 3: Seleccionar Servicio -> Carga Horarios -> Paso 4
    const manejarSeleccionServicio = (ser) => {
        setServicioSeleccionado(ser);

        // CORRECCIÓN: Se envía como objeto estructurado para evitar el error 400 Bad Request
        getHorario(doctorSeleccionado.idDoctor);
        setDiaSeleccionado(null);
        setHoraSeleccionada(null);
        setPasoFormulario(4);
    };

    // --- LÓGICA GENERADORA DEL CALENDARIO (PRÓXIMOS 8 DÍAS) ---
    const generarProximosDias = () => {
        const diasGenerados = [];
        const hoy = new Date();

        for (let i = 0; i < 8; i++) {
            const fechaTarget = new Date(hoy);
            fechaTarget.setDate(hoy.getDate() + i);

            const yyyy = fechaTarget.getFullYear();
            const mm = String(fechaTarget.getMonth() + 1).padStart(2, '0');
            const dd = String(fechaTarget.getDate()).padStart(2, '0');
            const fechaString = `${yyyy}-${mm}-${dd}`;

            // Nombre del día completo en español
            let nombreDia = fechaTarget.toLocaleDateString('es-ES', { weekday: 'long' });

            // Limpieza total de acentos y minúsculas para comparar perfectamente con la Base de Datos
            const diaLimpio = nombreDia
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");

            diasGenerados.push({
                fecha: fechaString,
                nombreDia: diaLimpio,
                diaFormateado: nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1),
                numeroDia: fechaTarget.getDate(),
                mes: fechaTarget.toLocaleDateString('es-ES', { month: 'short' })
            });
        }
        return diasGenerados;
    };

    // --- GENERADOR DE SLOTS DE HORA ---
    const obtenerSlotsDeHora = () => {
        if (!diaSeleccionado || !horario || !servicioSeleccionado || !Array.isArray(horario)) return [];

        // Buscamos la coincidencia del día limpiando también lo que venga de la Base de Datos
        const configuracionDia = horario.find(h => {
            if (!h.diaSemana) return false;
            const diaBDLimpio = h.diaSemana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return diaBDLimpio === diaSeleccionado.nombreDia && h.estado === 1;
        });

        if (!configuracionDia) return [];

        const slots = [];
        const [startH, startM] = configuracionDia.horaInicio.split(':').map(Number);
        const [endH, endM] = configuracionDia.horaFin.split(':').map(Number);

        let tiempoActual = new Date();
        tiempoActual.setHours(startH, startM, 0, 0);

        const tiempoFin = new Date();
        tiempoFin.setHours(endH, endM, 0, 0);

        const duracion = servicioSeleccionado.duracionMinutos || 30;

        while (tiempoActual < tiempoFin) {
            const hh = String(tiempoActual.getHours()).padStart(2, '0');
            const mm = String(tiempoActual.getMinutes()).padStart(2, '0');
            slots.push(`${hh}:${mm}`);
            tiempoActual.setMinutes(tiempoActual.getMinutes() + duracion);
        }

        return slots;
    };

    const proximosDias = generarProximosDias();
    const horasDisponibles = obtenerSlotsDeHora();

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

                    {/* Navegación */}
                    <div className="d-none d-md-flex gap-2 bg-light p-1 rounded-pill">
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "agendar" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("agendar")}>
                            Agendar
                        </button>
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "mis-citas" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("mis-citas")}>
                            Mis Citas
                        </button>
                        <button className={`btn rounded-pill px-4 py-2 small fw-bold border-0 ${seccionActiva === "historial" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("historial")}>
                            Historial
                        </button>
                    </div>

                    <button className="btn btn-sm btn-outline-danger rounded-pill py-2 px-3 fw-bold" onClick={logout}>
                        Salir
                    </button>
                </div>
            </nav>

            {/* 2. CONTENIDO PRINCIPAL */}
            <div className="container-xl flex-grow-1 p-3 p-md-4 mt-3 mb-5" style={{ maxWidth: "1000px" }}>

                {/* SECCIÓN AGENDAR CITA */}
                {seccionActiva === "agendar" && (
                    <div className="card border-0 shadow-sm p-4 p-md-5 bg-white mb-4" style={{ borderRadius: "16px" }}>

                        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-2">
                            <div>
                                <h4 className="fw-bold m-0 text-dark">Agendar una Cita Médica</h4>
                                <p className="text-muted small m-0">Completa los pasos para reservar tu espacio.</p>
                            </div>
                            <span className="badge bg-primary-subtle text-primary rounded-pill px-3 py-2 fw-bold">Paso {pasoFormulario} de 4</span>
                        </div>

                        <div className="progress mb-4" style={{ height: "6px", borderRadius: "10px" }}>
                            <div className="progress-bar bg-primary" role="progressbar" style={{ width: `${(pasoFormulario / 4) * 100}%`, borderRadius: "10px" }}></div>
                        </div>

                        {/* PASO 1: SELECCIÓN DE ÁREAS */}
                        {pasoFormulario === 1 && (
                            <div>
                                <h6 className="text-dark fw-bold mb-3">1. Selecciona una Especialidad</h6>
                                <div className="row g-3">
                                    {area && area.length > 0 ? (
                                        area.map(item => (
                                            <div className="col-12 col-sm-6 col-md-4" key={item.idArea}>
                                                <div
                                                    className={`card h-100 p-3 border text-center ${areaSeleccionada?.idArea === item.idArea ? "border-primary bg-primary-subtle text-primary shadow-sm" : "border-secondary-subtle bg-white text-dark"}`}
                                                    onClick={() => manejarSeleccionArea(item)}
                                                    style={{ cursor: "pointer", borderRadius: "12px", transition: "all 0.2s" }}
                                                >
                                                    <span className="fw-bold">{item.area}</span>
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
                                    <span className="badge bg-light text-secondary border rounded-pill px-3 py-1.5 mb-2">Especialidad: {areaSeleccionada?.area}</span>
                                    <h6 className="text-dark fw-bold mb-1">2. Selecciona tu Especialista</h6>
                                </div>
                                <div className="row g-3">
                                    {doctor && doctor.length > 0 ? (
                                        doctor.map(doc => (
                                            <div className="col-12 col-sm-6 col-md-4" key={doc.idDoctor}>
                                                <div
                                                    className={`card h-100 p-3 border text-center ${doctorSeleccionado?.idDoctor === doc.idDoctor ? "border-primary bg-primary-subtle text-primary shadow-sm" : "border-secondary-subtle bg-white text-dark"}`}
                                                    onClick={() => manejarSeleccionDoctor(doc)}
                                                    style={{ cursor: "pointer", borderRadius: "12px", transition: "all 0.2s" }}
                                                >
                                                    <span className="fw-bold d-block">{doc.nombres} {doc.apellidos}</span>
                                                    {doc.titulo && <small className="text-muted d-block mt-1">{doc.titulo}</small>}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">No se encontraron médicos para esta área.</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-start mt-4">
                                    <button type="button" className="btn btn-sm btn-light border px-3 py-2 rounded-3 fw-bold text-secondary" onClick={() => setPasoFormulario(1)}>
                                        Regresar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 3: SELECCIÓN DE SERVICIOS */}
                        {pasoFormulario === 3 && (
                            <div>
                                <div className="mb-3">
                                    <div className="d-flex flex-wrap gap-2 mb-2">
                                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-1.5">Especialidad: {areaSeleccionada?.area}</span>
                                        <span className="badge bg-light text-secondary border rounded-pill px-3 py-1.5">Especialista: {doctorSeleccionado?.nombres}</span>
                                    </div>
                                    <h6 className="text-dark fw-bold mb-1">3. Selecciona el Servicio</h6>
                                </div>
                                <div className="row g-3">
                                    {servicio && servicio.length > 0 ? (
                                        servicio.map(ser => (
                                            <div className="col-12 col-md-6" key={ser.idServicio}>
                                                <div
                                                    className={`card h-100 p-3 border ${servicioSeleccionado?.idServicio === ser.idServicio ? "border-primary bg-primary-subtle text-primary shadow-sm" : "border-secondary-subtle bg-white text-dark"}`}
                                                    onClick={() => manejarSeleccionServicio(ser)}
                                                    style={{ cursor: "pointer", borderRadius: "12px", transition: "all 0.2s" }}
                                                >
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <div>
                                                            <span className="fw-bold d-block">{ser.servicio || ser.nombre}</span>
                                                            <small className="text-muted">⏱ {ser.duracionMinutos || 30} minutos</small>
                                                        </div>
                                                        {ser.precio && <span className="badge bg-light text-dark border fw-bold fs-6">${ser.precio}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-12 text-center p-4 text-muted">No hay servicios disponibles.</div>
                                    )}
                                </div>
                                <div className="d-flex justify-content-start mt-4">
                                    <button type="button" className="btn btn-sm btn-light border px-3 py-2 rounded-3 fw-bold text-secondary" onClick={() => setPasoFormulario(2)}>
                                        Regresar
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* PASO 4: INTERFAZ DE CALENDARIO */}
                        {/* 1. Carrusel de Días */}
                        <div className="d-flex gap-2 overflow-x-auto pb-3 mb-4" style={{ scrollbarWidth: "thin" }}>
                            {proximosDias.map((dia, idx) => {
                                // VALIDACIÓN RÚSTICA Y ULTRA FLEXIBLE
                                const estaActivoEnBD = Array.isArray(horario) && horario.some(h => {
                                    if (!h.diaSemana) return false;

                                    // 1. Limpiamos el día de la Base de Datos (ej: "LUNES" -> "lunes")
                                    const diaBDLimpio = h.diaSemana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                                    // 2. Comprobamos si el día de la BD coincide o está contenido en el día del calendario (sirve para "lunes" o abreviados como "lun")
                                    const coincidenDias = diaBDLimpio.includes(dia.nombreDia) || dia.nombreDia.includes(diaBDLimpio);

                                    // 3. Validación de estado flexible (acepta 1, "1", true o incluso si no trae campo estado)
                                    const estadoActivo = h.estado == 1 || h.estado === true || h.estado === undefined;

                                    return coincidenDias && estadoActivo;
                                });

                                const esSeleccionado = diaSeleccionado?.fecha === dia.fecha;

                                return (
                                    <div
                                        key={idx}
                                        className={`text-center p-2 border flex-grow-1 ${!estaActivoEnBD ? "opacity-25 bg-light text-muted" : esSeleccionado ? "border-primary bg-primary text-white shadow-sm" : "bg-white text-dark border-secondary-subtle"}`}
                                        style={{
                                            cursor: estaActivoEnBD ? "pointer" : "not-allowed",
                                            borderRadius: "10px",
                                            minWidth: "85px",
                                            transition: "all 0.2s"
                                        }}
                                        onClick={() => {
                                            if (estaActivoEnBD) {
                                                setDiaSeleccionado(dia);
                                                setHoraSeleccionada(null);
                                            }
                                        }}
                                    >
                                        <small className="text-uppercase d-block extra-small opacity-75">{dia.diaFormateado.substring(0, 3)}</small>
                                        <span className="fs-4 fw-bold d-block my-0 leading-none">{dia.numeroDia}</span>
                                        <small className="text-capitalize d-block extra-small opacity-75">{dia.mes}</small>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* MIS CITAS Y HISTORIAL */}
                {seccionActiva === "mis-citas" && (
                    <div className="text-center p-5 bg-white rounded-3 border shadow-sm">
                        <h6 className="fw-bold text-dark m-0">Área de Citas Vigentes</h6>
                    </div>
                )}

                {seccionActiva === "historial" && (
                    <div className="text-center p-5 bg-white rounded-3 border shadow-sm">
                        <h6 className="fw-bold text-dark m-0">Historial de Consultas Completadas</h6>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHome;