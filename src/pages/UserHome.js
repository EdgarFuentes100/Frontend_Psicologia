import React from "react";
import { useUserHome } from "../Hooks/useUserHome";

const UserHome = () => {
    const {
        user, logout, area, doctor, servicio, seccionActiva, setSeccionActiva,
        pasoFormulario, areaSeleccionada, doctorSeleccionado, servicioSeleccionado,
        diaSeleccionado, manejarSeleccionDia, horaSeleccionada, setHoraSeleccionada,
        manejarSeleccionArea, manejarSeleccionDoctor, manejarSeleccionServicio,
        proximosDias, horasDisponibles
    } = useUserHome();

    return (
        <div className="min-vh-100 bg-light d-flex flex-column pb-5" style={{ userSelect: "none" }}>
            <nav className="navbar bg-white px-4 py-3 border-bottom sticky-top shadow-sm">
                <div className="container-xl d-flex justify-content-between align-items-center">
                    <div className="d-flex align-items-center gap-3">
                        <div className="bg-primary text-white rounded-0 d-flex align-items-center justify-content-center" style={{ width: "45px", height: "45px" }}>
                            <i className="bi bi-brain fs-5"></i>
                        </div>
                        <div>
                            <small className="text-muted d-block" style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "0.5px" }}>CLÍNICA PSICOLÓGICA</small>
                            <span className="fw-bold text-dark" style={{ fontSize: "16px", letterSpacing: "-0.5px" }}>Mente Dinámica</span>
                        </div>
                    </div>
                    <div className="d-flex bg-light p-1 rounded-0 border">
                        <button className={`btn rounded-0 px-3 px-md-5 py-2.5 small fw-bold border-0 ${seccionActiva === "agendar" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("agendar")}>Agendar</button>
                        <button className={`btn rounded-0 px-3 px-md-5 py-2.5 small fw-bold border-0 ${seccionActiva === "mis-citas" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("mis-citas")}>Mis Citas</button>
                        <button className={`btn rounded-0 px-3 px-md-5 py-2.5 small fw-bold border-0 ${seccionActiva === "historial" ? "btn-primary shadow-sm" : "text-secondary"}`} onClick={() => setSeccionActiva("historial")}>Historial</button>
                    </div>
                    <div className="d-flex align-items-center gap-3">
                        <span className="d-none d-lg-inline text-secondary small fw-medium">{user?.name || "Paciente"}</span>
                        <button className="btn btn-sm btn-outline-danger rounded-2 py-2 px-4 fw-bold" onClick={logout}>Salir</button>
                    </div>
                </div>
            </nav>

            <div className="container-xl flex-grow-1 mt-4 px-3" style={{ maxWidth: "1100px" }}>
                {seccionActiva === "agendar" && (
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm p-4 bg-white rounded-1">
                                <h4 className="fw-bold text-dark mb-4 text-uppercase fs-5">Nueva Cita</h4>
                                <div className="p-3 bg-light rounded-0 mb-3 border">
                                    <h6 className="fw-bold text-dark mb-3 small text-uppercase">1. Especialidad y Servicio</h6>
                                    <div className="row g-3">
                                        <div className="col-6">
                                            <select className="form-select" onChange={manejarSeleccionArea} value={areaSeleccionada?.idArea || ""}>
                                                <option value="" disabled>Seleccione Especialidad</option>
                                                {area?.map(item => <option key={item.idArea} value={item.idArea}>{item.area}</option>)}
                                            </select>
                                        </div>
                                        <div className="col-6">
                                            <select className="form-select" onChange={manejarSeleccionServicio} disabled={!areaSeleccionada} value={servicioSeleccionado?.idServicio || ""}>
                                                <option value="" disabled>Seleccione Servicio</option>
                                                {servicio?.map(ser => <option key={ser.idServicio} value={ser.idServicio}>{ser.servicio || ser.nombre}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-3 bg-light rounded-0 mb-3 border ${pasoFormulario < 2 ? "opacity-50" : ""}`}>
                                    <h6 className="fw-bold text-dark mb-3 small text-uppercase">2. Selección de Médico</h6>
                                    <select className="form-select" onChange={manejarSeleccionDoctor} disabled={pasoFormulario < 2} value={doctorSeleccionado?.idDoctor || ""}>
                                        <option value="" disabled>Seleccione Especialista</option>
                                        {doctor?.map(doc => <option key={doc.idDoctor} value={doc.idDoctor}>{doc.nombres} {doc.apellidos}</option>)}
                                    </select>
                                </div>
                                <div className={`p-3 bg-light rounded-0 border ${pasoFormulario < 3 ? "opacity-50" : ""}`}>
                                    <h6 className="fw-bold text-dark mb-3 small text-uppercase">3. Elegir Fecha y Hora</h6>
                                    {pasoFormulario >= 3 ? (
                                        <>
                                            <div className="d-flex gap-2 overflow-x-auto pb-2">
                                                {proximosDias.map((dia, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`text-center p-2 border ${!dia.esAtendible ? "bg-light text-muted opacity-50" : (diaSeleccionado?.fecha === dia.fecha ? "bg-primary text-white" : "bg-white")}`}
                                                        style={{ cursor: dia.esAtendible ? "pointer" : "not-allowed", minWidth: "85px" }}
                                                        onClick={() => manejarSeleccionDia(dia)}
                                                    >
                                                        <small>{dia.diaFormateated.substring(0, 3)}</small>
                                                        <span className="fs-4 fw-bold d-block">{dia.numeroDia}</span>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="d-flex flex-wrap gap-2 mt-3">
                                                {horasDisponibles.map((h, i) => {
                                                    // Lógica de clases:
                                                    // 1. Si NO está disponible: btn-danger (Relleno rojo)
                                                    // 2. Si está seleccionado: btn-primary (Relleno azul)
                                                    // 3. Si está libre: btn-white border (Blanco con borde)
                                                    let claseBoton = "btn-white border";
                                                    if (!h.disponible) {
                                                        claseBoton = "btn-danger text-white"; // Relleno rojo sólido
                                                    } else if (horaSeleccionada === h.hora) {
                                                        claseBoton = "btn-primary";
                                                    }

                                                    return (
                                                        <button
                                                            key={i}
                                                            disabled={!h.disponible}
                                                            className={`btn btn-sm ${claseBoton}`}
                                                            onClick={() => setHoraSeleccionada(h.hora)}
                                                        >
                                                            {h.hora}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </>
                                    ) : <small className="text-muted">Complete los pasos anteriores.</small>}
                                </div>
                            </div>
                        </div>
                        {/* COLUMNA DERECHA: RESUMEN */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm p-4 bg-white">
                                <h5 className="fw-bold mb-3">Resumen de tu Cita</h5>

                                <div className="mb-3 small">
                                    <p className="mb-1 text-muted">Especialista:</p>
                                    <p className="fw-bold text-dark">{doctorSeleccionado ? `${doctorSeleccionado.nombres} ${doctorSeleccionado.apellidos}` : "No seleccionado"}</p>

                                    <p className="mb-1 text-muted">Servicio:</p>
                                    <p className="fw-bold text-dark">{servicioSeleccionado?.servicio || servicioSeleccionado?.nombre || "No seleccionado"}</p>

                                    <p className="mb-1 text-muted">Fecha y Hora:</p>
                                    <p className="fw-bold text-dark">
                                        {diaSeleccionado ? `${diaSeleccionado.fecha} ` : ""}
                                        {horaSeleccionada ? `a las ${horaSeleccionada}` : "No seleccionada"}
                                    </p>
                                </div>

                                <hr />

                                <div className="d-flex justify-content-between mb-3">
                                    <span>Total:</span>
                                    <span className="fw-bold fs-5">${servicioSeleccionado?.precio || "0.00"}</span>
                                </div>

                                <button
                                    className="btn btn-primary w-100 py-2 fw-bold"
                                    disabled={!horaSeleccionada || !diaSeleccionado || !doctorSeleccionado}
                                    onClick={() => alert("Cita agendada")}
                                >
                                    Confirmar Agendamiento
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserHome;