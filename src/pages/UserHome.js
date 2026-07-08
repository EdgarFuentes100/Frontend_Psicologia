import React from "react";
import { useUserHome } from "../Hooks/useUserHome";
import logo from "../Img/Logo.png";

const UserHome = () => {
    const {
        logout, area, doctor, servicio, seccionActiva, setSeccionActiva,
        areaSeleccionada, doctorSeleccionado, servicioSeleccionado,
        diaSeleccionado, manejarSeleccionDia, horaSeleccionada, setHoraSeleccionada,
        manejarSeleccionArea, manejarSeleccionDoctor, manejarSeleccionServicio,
        proximosDias, horasDisponibles
    } = useUserHome();

    return (
        <div className="min-vh-100 bg-light" style={{ userSelect: "none" }}>
            {/* NAVBAR */}
            <nav className="navbar bg-white border-bottom shadow-sm sticky-top">
                <div className="container-xl d-flex flex-wrap justify-content-between align-items-center py-2 gap-2">
                    <div className="d-flex align-items-center gap-2">
                        {/* CORRECCIÓN: Etiqueta img única y bien formada */}
                        <img 
                            src={logo} 
                            alt="Logo Mente Dinámica" 
                            style={{ width: "50px", height: "50px", objectFit: "contain" }} 
                        />
                        <div className="d-none d-sm-block">
                            <small className="text-muted d-block fw-bold" style={{ fontSize: "9px" }}>CLÍNICA</small>
                            <span className="fw-bold fs-6">Mente Dinámica</span>
                        </div>
                    </div>

                    <div className="d-flex bg-light p-1 rounded-pill border overflow-x-auto flex-nowrap" style={{ maxWidth: "55vw" }}>
                        {["agendar", "mis-citas", "historial"].map((seccion) => (
                            <button
                                key={seccion}
                                className={`btn btn-sm rounded-pill px-3 ${seccionActiva === seccion ? "btn-primary shadow-sm" : "text-secondary"}`}
                                onClick={() => setSeccionActiva(seccion)}
                            >
                                {seccion.charAt(0).toUpperCase() + seccion.slice(1).replace("-", " ")}
                            </button>
                        ))}
                    </div>

                    <button className="btn btn-outline-danger btn-sm px-3" onClick={logout}>Salir</button>
                </div>
            </nav>

            {/* CONTENIDO PRINCIPAL */}
            <main className="container-xl mt-4">
                {seccionActiva === "agendar" && (
                    <div className="row g-4">
                        <div className="col-12 col-lg-8">
                            <div className="card border-0 shadow-sm p-3 p-md-4 mb-4">
                                {[
                                    { title: "1. Especialidad", data: area, val: areaSeleccionada?.idArea, handler: manejarSeleccionArea, label: "area", id: "idArea" },
                                    { title: "2. Especialista", data: doctor, val: doctorSeleccionado?.idDoctor, handler: manejarSeleccionDoctor, label: "nombres", id: "idDoctor", disabled: !areaSeleccionada },
                                    { title: "3. Servicio", data: servicio, val: servicioSeleccionado?.idServicio, handler: manejarSeleccionServicio, label: "servicio", id: "idServicio", disabled: !doctorSeleccionado }
                                ].map((item, idx) => (
                                    <div key={idx} className={`mb-3 ${item.disabled ? "opacity-50" : ""}`}>
                                        <label className="small fw-bold text-uppercase text-muted">{item.title}</label>
                                        <select className="form-select mt-1" onChange={item.handler} value={item.val || ""} disabled={item.disabled}>
                                            <option value="">Seleccione...</option>
                                            {item.data?.map(i => <option key={i[item.id]} value={i[item.id]}>{i[item.label]}</option>)}
                                        </select>
                                    </div>
                                ))}

                                {/* SELECCIÓN FECHA/HORA */}
                                <div className={`mt-3 ${!servicioSeleccionado ? "opacity-50" : ""}`}>
                                    <label className="small fw-bold text-uppercase text-muted">4. Fecha y Hora</label>
                                    <div className="d-flex gap-2 overflow-x-auto py-3">
                                        {proximosDias.map((d, i) => (
                                            <div
                                                key={i}
                                                className={`p-2 border rounded text-center ${diaSeleccionado?.fecha === d.fecha ? "bg-primary text-white" : (d.esAtendible ? "bg-white" : "bg-light border-danger text-danger")}`}
                                                style={{ cursor: d.esAtendible ? "pointer" : "not-allowed", minWidth: "70px" }}
                                                onClick={() => d.esAtendible && manejarSeleccionDia(d)}
                                            >
                                                <small style={{ fontSize: "10px" }}>{d.diaFormateated.slice(0, 3)}</small>
                                                <div className="fs-6 fw-bold">{d.numeroDia}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="d-flex flex-wrap gap-2 mt-2">
                                        {horasDisponibles.map((h, i) => (
                                            <button
                                                key={i}
                                                className={`btn btn-sm ${!h.disponible ? "btn-outline-danger text-danger" : (horaSeleccionada === h.hora ? "btn-primary" : "btn-outline-primary")}`}
                                                disabled={!h.disponible}
                                                onClick={() => setHoraSeleccionada(h.hora)}
                                            >
                                                {h.hora}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* COLUMNA DERECHA: RESUMEN */}
                        <div className="col-12 col-lg-4">
                            <div className="card border-0 shadow-sm p-4 sticky-top" style={{ top: "80px" }}>
                                <h5 className="fw-bold mb-3">Resumen</h5>
                                <div className="text-muted small mb-3">
                                    <p className="mb-0">Especialista</p>
                                    <p className="text-dark fw-bold">{doctorSeleccionado ? `${doctorSeleccionado.nombres} ${doctorSeleccionado.apellidos}` : "---"}</p>
                                    <p className="mb-0">Servicio</p>
                                    <p className="text-dark fw-bold">{servicioSeleccionado?.servicio || "---"}</p>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <span className="fw-bold">Total:</span>
                                    <span className="fs-4 fw-bold text-primary">${servicioSeleccionado?.precio || "0.00"}</span>
                                </div>
                                <button className="btn btn-primary w-100 py-2 fw-bold" disabled={!horaSeleccionada} onClick={() => alert("Cita Agendada")}>
                                    Confirmar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default UserHome;