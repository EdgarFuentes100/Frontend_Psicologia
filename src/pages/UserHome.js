import React, { useState } from "react";
import { useUserHome } from "../Hooks/useUserHome";
import logo from "../Img/Logo.png";
import { ModalNotificacion } from "../components/ModalNotificacion"; // Asegúrate de tener esta ruta

const UserHome = () => {
    const {
        logout, area, doctor, servicio, seccionActiva, setSeccionActiva,
        areaSeleccionada, doctorSeleccionado, servicioSeleccionado,
        diaSeleccionado, manejarSeleccionDia, horaSeleccionada, setHoraSeleccionada,
        manejarSeleccionArea, manejarSeleccionDoctor, manejarSeleccionServicio,
        proximosDias, horasDisponibles, manejarAgendarCita, misCitas, obtenerMisCitas, modalConfig, setModalConfig
    } = useUserHome();

    const [subSeccion, setSubSeccion] = useState("proximas");
    const hoy = new Date("2026-07-11");
    const citasProximas = misCitas?.filter(c => new Date(c.fecha) >= hoy) || [];
    const citasPasadas = misCitas?.filter(c => new Date(c.fecha) < hoy) || [];

    return (
        <div className="min-vh-100 bg-light">
            {/* NAVBAR RESPONSIVO */}
            <nav className="navbar bg-white border-bottom shadow-sm sticky-top">
                <div className="container-xl d-flex align-items-center justify-content-between px-2">

                    <div className="d-flex align-items-center flex-grow-1">
                        {/* Logo más grande */}
                        <img src={logo} alt="Logo" className="img-fluid" style={{ maxWidth: "60px" }} />
                        <span className="fw-bold ms-2 d-none d-sm-block text-truncate">Mente Dinámica</span>
                    </div>

                    <div className="d-flex bg-light p-1 rounded-pill border flex-shrink-0">
                        {["agendar", "mis-citas"].map((seccion) => (
                            <button
                                key={seccion}
                                className={`btn btn-sm rounded-pill px-3 ${seccionActiva === seccion ? "btn-primary shadow-sm" : "text-secondary"}`}
                                onClick={() => {
                                    setSeccionActiva(seccion);
                                    if (seccion === "mis-citas") obtenerMisCitas();
                                }}
                            >
                                {seccion === "agendar" ? "Agendar" : "Mis Citas"}
                            </button>
                        ))}
                    </div>

                    <div className="d-flex justify-content-end flex-grow-1">
                        <button className="btn btn-outline-danger btn-sm px-3" onClick={logout}>Salir</button>
                    </div>
                </div>
            </nav>

            <main className="container-xl mt-3 pb-5">
                {seccionActiva === "agendar" && (
                    <div className="row g-3">
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm p-3">
                                <div className="row g-2">
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted text-uppercase">Especialidad</label>
                                        <select className="form-select w-100" onChange={manejarSeleccionArea} value={areaSeleccionada?.idArea || ""}>
                                            <option value="">Seleccione...</option>
                                            {area?.map(a => <option key={a.idArea} value={a.idArea}>{a.area}</option>)}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted text-uppercase">Especialista</label>
                                        <select className="form-select w-100" onChange={manejarSeleccionDoctor} value={doctorSeleccionado?.idDoctor || ""} disabled={!areaSeleccionada}>
                                            <option value="">Seleccione...</option>
                                            {doctor?.map(d => <option key={d.idDoctor} value={d.idDoctor}>{d.nombres}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="mt-2">
                                    <label className="small fw-bold text-muted text-uppercase">Servicio</label>
                                    <select className="form-select w-100" onChange={manejarSeleccionServicio} value={servicioSeleccionado?.idServicio || ""} disabled={!doctorSeleccionado}>
                                        <option value="">Seleccione...</option>
                                        {servicio?.map(s => <option key={s.idServicio} value={s.idServicio}>{s.servicio}</option>)}
                                    </select>
                                </div>

                                <div className="mt-3">
                                    <label className="small fw-bold text-muted text-uppercase">Fecha y Hora</label>
                                    {/* Botones de Fecha más grandes */}
                                    <div className="d-flex gap-2 overflow-x-auto py-3 flex-nowrap">
                                        {proximosDias.map((d, i) => (
                                            <div key={i} className={`p-3 border rounded text-center ${diaSeleccionado?.fecha === d.fecha ? "bg-primary text-white" : (d.esAtendible ? "bg-white" : "bg-light text-muted")}`}
                                                style={{ cursor: d.esAtendible ? "pointer" : "not-allowed", minWidth: "80px" }} onClick={() => d.esAtendible && manejarSeleccionDia(d)}>
                                                <small style={{ fontSize: "12px" }}>{d.diaFormateated.slice(0, 3)}</small>
                                                <div className="fs-5 fw-bold">{d.numeroDia}</div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Botones de Hora sin mensaje */}
                                    <div className="d-flex flex-wrap gap-2 mt-3">
                                        {horasDisponibles.map((h, i) => (
                                            <button
                                                key={i}
                                                className={`btn px-4 py-2 ${!h.disponible
                                                    ? "btn-danger text-white"
                                                    : (horaSeleccionada === h.hora ? "btn-primary" : "btn-outline-primary")
                                                    }`}
                                                style={{ fontSize: "1rem" }}
                                                disabled={!h.disponible}
                                                onClick={() => h.disponible && setHoraSeleccionada(h.hora)}
                                            >
                                                {h.hora}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm p-3">
                                <h6 className="fw-bold text-primary">Resumen</h6>
                                <div className="small text-muted mt-2">
                                    <p>Especialista: <span className="text-dark fw-bold">{doctorSeleccionado?.nombres || "---"}</span></p>
                                    <p>Servicio: <span className="text-dark fw-bold">{servicioSeleccionado?.servicio || "---"}</span></p>
                                    <p>Fecha: <span className="text-dark fw-bold">{diaSeleccionado ? new Date(diaSeleccionado.fecha).toLocaleDateString() : "---"}</span></p>
                                    <p>Hora: <span className="text-dark fw-bold">{horaSeleccionada || "---"}</span></p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between mb-3">
                                    <span className="fw-bold">Total a pagar:</span>
                                    <span className="fs-4 fw-bold text-primary">${servicioSeleccionado?.precio || "0.00"}</span>
                                </div>
                                <button className="btn btn-primary w-100 py-2" disabled={!horaSeleccionada} onClick={manejarAgendarCita}>Confirmar Cita</button>
                            </div>
                        </div>
                    </div>
                )}

                {seccionActiva === "mis-citas" && (
                    <div className="container-fluid p-0">
                        <div className="d-flex gap-2 mb-3">
                            <button className={`btn btn-sm ${subSeccion === "proximas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSubSeccion("proximas")}>Próximas</button>
                            <button className={`btn btn-sm ${subSeccion === "pasadas" ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setSubSeccion("pasadas")}>Pasadas</button>
                        </div>

                        <div className="row g-3">
                            {(subSeccion === "proximas" ? citasProximas : citasPasadas).map((cita) => (
                                <div key={cita.idCita} className="col-12 col-md-6 col-lg-4">
                                    {/* Tarjeta con borde lateral grueso para jerarquía */}
                                    <div className="card shadow-sm border-0 h-100" style={{ borderLeft: `5px solid ${cita.estado === "Finalizada" ? "#6c757d" : "#0d6efd"}` }}>
                                        <div className="card-body p-3">
                                            {/* Header de la tarjeta */}
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <span className="badge bg-light text-dark border">{cita.estado}</span>
                                                <small className="fw-bold text-muted">{new Date(cita.fecha).toLocaleDateString()}</small>
                                            </div>

                                            {/* Contenido principal con mayor contraste */}
                                            <h6 className="fw-bold text-dark mb-1">{cita.detalleServicio.split(" - ")[0]}</h6>
                                            <p className="text-secondary small mb-2">{cita.nombreDoctor}</p>

                                            <div className="bg-light p-2 rounded mb-3">
                                                <small className="d-block text-muted">Horario:</small>
                                                <span className="fw-bold text-dark">{cita.horaInicio.slice(0, 5)} - {cita.horaFin.slice(0, 5)}</span>
                                            </div>

                                            {/* Botón de acción destacado */}
                                            {cita.estado !== "Finalizada" ? (
                                                <a
                                                    href={cita.link?.startsWith("http") ? cita.link : `https://${cita.link || "meet.google.com"}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="btn btn-primary w-100 fw-bold d-flex align-items-center justify-content-center gap-2"
                                                >
                                                    <i className="bi bi-camera-video-fill"></i>
                                                    Conectar a Meet
                                                </a>
                                            ) : (
                                                <button className="btn btn-outline-secondary w-100" disabled>
                                                    <i className="bi bi-check-circle-fill me-2"></i>
                                                    Finalizada
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <ModalNotificacion
                    show={modalConfig.show}
                    mensaje={modalConfig.mensaje}
                    tipo={modalConfig.tipo}
                    onClose={() => {
                        setModalConfig(prev => ({ ...prev, show: false }));
                        // Si la acción fue un éxito al agendar, cambiamos a la sección de citas
                        if (modalConfig.tipo === 'exito') {
                            setSeccionActiva("mis-citas");
                        }
                    }}
                />
            </main>
        </div>
    );
};

export default UserHome;