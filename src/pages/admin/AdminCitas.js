// src/components/admin/AdminCitas.jsx
import React, { useState } from "react";

const AdminCitas = () => {
    // Lista inicial de citas de ejemplo con fecha y hora asignadas
    const [citas, setCitas] = useState([
        {
            id: 1,
            usuario: "Ana Pérez",
            doctor: "Dra. Sofía Mendoza",
            area: "Pediatría",
            servicio: "Consulta General",
            monto: "50.00",
            metoPago: "Wompi",
            fecha: "2026-07-30",
            hora: "10:00 AM",
            estado: "Pendiente"
        },
        {
            id: 2,
            usuario: "Luis Torres",
            doctor: "Dr. Roberto Ramírez",
            area: "Cardiología",
            servicio: "Revisión",
            monto: "80.00",
            metoPago: "Efectivo",
            fecha: "2026-07-30",
            hora: "11:30 AM",
            estado: "Confirmada"
        }
    ]);

    // Opciones para los selects
    const usuariosDisponibles = ["Ana Pérez", "Luis Torres", "María Gómez", "Carlos Ruiz"];
    
    // Relación de áreas y doctores disponibles
    const areasDoctores = [
        { area: "Cardiología", doctores: ["Dr. Roberto Ramírez", "Dr. Esteban Quito"] },
        { area: "Pediatría", doctores: ["Dra. Sofía Mendoza", "Dra. Elena Vargas"] },
        { area: "Medicina General", doctores: ["Dr. Juan Pérez", "Dra. Lucía Gómez"] }
    ];

    const serviciosDisponibles = ["Consulta General", "Revisión", "Seguimiento", "Examen Especializado"];
    const metodosPagoDisponibles = ["Wompi", "Tarjeta de Crédito", "Efectivo", "Transferencia"];

    // Horarios generales de la clínica
    const horasGenerales = [
        "08:00 AM", "08:30 AM", "09:00 AM", "09:30 AM", 
        "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM", 
        "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM", 
        "04:00 PM", "04:30 PM", "05:00 PM"
    ];

    // Estados para los filtros de búsqueda
    const [filtroDoctor, setFiltroDoctor] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("");
    const [filtroFecha, setFiltroFecha] = useState("");

    // Estados para el formulario de Crear / Editar
    const [modoFormulario, setModoFormulario] = useState(null); // null, 'crear', 'editar'
    const [citaActual, setCitaActual] = useState({
        id: null,
        usuario: "",
        area: areasDoctores[0].area,
        doctor: areasDoctores[0].doctores[0],
        servicio: serviciosDisponibles[0],
        monto: "",
        metoPago: metodosPagoDisponibles[0],
        fecha: "",
        hora: "",
        estado: "Pendiente"
    });

    // Abrir formulario para crear nueva cita
    const abrirCrear = () => {
        setCitaActual({
            id: null,
            usuario: usuariosDisponibles[0],
            area: areasDoctores[0].area,
            doctor: areasDoctores[0].doctores[0],
            servicio: serviciosDisponibles[0],
            monto: "",
            metoPago: metodosPagoDisponibles[0],
            fecha: "",
            hora: "",
            estado: "Pendiente"
        });
        setModoFormulario("crear");
    };

    // Abrir formulario para editar cita existente
    const abrirEditar = (cita) => {
        setCitaActual(cita);
        setModoFormulario("editar");
    };

    // Manejar cambio de área médica para actualizar automáticamente los doctores
    const cambiarArea = (e) => {
        const nuevaArea = e.target.value;
        const areaEncontrada = areasDoctores.find(a => a.area === nuevaArea);
        setCitaActual({
            ...citaActual,
            area: nuevaArea,
            doctor: areaEncontrada ? areaEncontrada.doctores[0] : ""
        });
    };

    // LÓGICA CLAVE: Calcular horas disponibles para el doctor y la fecha seleccionados
    // Se excluyen las horas que ya estén ocupadas por otras citas (excepto si estamos editando la misma cita)
    const obtenerHorasDisponibles = () => {
        if (!citaActual.fecha || !citaActual.doctor) return horasGenerales;

        // Buscar qué horas ya están ocupadas por el mismo doctor en la misma fecha
        const horasOcupadas = citas
            .filter(c => c.doctor === citaActual.doctor && c.fecha === citaActual.fecha && c.id !== citaActual.id)
            .map(c => c.hora);

        // Retornar solo las horas que NO estén ocupadas
        return horasGenerales.filter(hora => !horasOcupadas.includes(hora));
    };

    const horasDisponiblesActuales = obtenerHorasDisponibles();

    // Guardar cambios (Crear o Actualizar)
    const guardarCita = (e) => {
        e.preventDefault();
        if (modoFormulario === "crear") {
            const nuevaCita = { ...citaActual, id: Date.now() };
            setCitas([...citas, nuevaCita]);
        } else if (modoFormulario === "editar") {
            setCitas(citas.map(c => c.id === citaActual.id ? citaActual : c));
        }
        setModoFormulario(null);
    };

    // Filtrar citas según los criterios seleccionados
    const citasFiltradas = citas.filter((c) => {
        const coincideDoctor = filtroDoctor === "" || c.doctor === filtroDoctor;
        const coincideEstado = filtroEstado === "" || c.estado === filtroEstado;
        const coincideFecha = filtroFecha === "" || c.fecha === filtroFecha;
        return coincideDoctor && coincideEstado && coincideFecha;
    });

    // Obtener lista completa de doctores únicos para el filtro superior
    const todosLosDoctores = Array.from(new Set(citas.map(c => c.doctor)));

    return (
        <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: "0.75rem" }}>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
                <div>
                    <h5 className="fw-bold mb-1">Control de Citas Médicas</h5>
                    <p className="text-muted small mb-0">Revisa, filtra y administra las citas agendadas en la plataforma.</p>
                </div>
                {modoFormulario === null && (
                    <button className="btn btn-primary btn-sm px-3" onClick={abrirCrear}>
                        + Nueva Cita
                    </button>
                )}
            </div>

            {/* FORMULARIO DE CREAR / EDITAR */}
            {modoFormulario !== null && (
                <div className="bg-light p-3 rounded border mb-4">
                    <h6 className="fw-bold mb-3">
                        {modoFormulario === "crear" ? "Agendar Nueva Cita" : "Editar Cita Médica"}
                    </h6>
                    <form onSubmit={guardarCita}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small">Usuario / Paciente</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.usuario} 
                                    onChange={(e) => setCitaActual({...citaActual, usuario: e.target.value})}
                                    required
                                >
                                    <option value="">Seleccione usuario...</option>
                                    {usuariosDisponibles.map((usr, idx) => (
                                        <option key={idx} value={usr}>{usr}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Área Médica</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.area} 
                                    onChange={cambiarArea}
                                    required
                                >
                                    {areasDoctores.map((a, idx) => (
                                        <option key={idx} value={a.area}>{a.area}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Doctor</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.doctor} 
                                    onChange={(e) => setCitaActual({...citaActual, doctor: e.target.value, hora: ""})}
                                    required
                                >
                                    {areasDoctores.find(a => a.area === citaActual.area)?.doctores.map((doc, idx) => (
                                        <option key={idx} value={doc}>{doc}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Servicio</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.servicio} 
                                    onChange={(e) => setCitaActual({...citaActual, servicio: e.target.value})}
                                    required
                                >
                                    {serviciosDisponibles.map((srv, idx) => (
                                        <option key={idx} value={srv}>{srv}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Monto ($)</label>
                                <input 
                                    type="number" 
                                    step="0.01"
                                    className="form-control form-control-sm" 
                                    placeholder="0.00"
                                    value={citaActual.monto} 
                                    onChange={(e) => setCitaActual({...citaActual, monto: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Método de Pago</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.metoPago} 
                                    onChange={(e) => setCitaActual({...citaActual, metoPago: e.target.value})}
                                    required
                                >
                                    {metodosPagoDisponibles.map((metodo, idx) => (
                                        <option key={idx} value={metodo}>{metodo}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-md-4">
                                <label className="form-label small">Estado</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.estado} 
                                    onChange={(e) => setCitaActual({...citaActual, estado: e.target.value})}
                                >
                                    <option value="Pendiente">Pendiente</option>
                                    <option value="Confirmada">Confirmada</option>
                                    <option value="Finalizada">Finalizada</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Fecha</label>
                                <input 
                                    type="date" 
                                    className="form-control form-control-sm" 
                                    value={citaActual.fecha} 
                                    onChange={(e) => setCitaActual({...citaActual, fecha: e.target.value, hora: ""})} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Hora Disponible</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={citaActual.hora} 
                                    onChange={(e) => setCitaActual({...citaActual, hora: e.target.value})}
                                    required
                                    disabled={!citaActual.fecha}
                                >
                                    <option value="">
                                        {citaActual.fecha ? "Seleccione hora disponible..." : "Primero seleccione una fecha"}
                                    </option>
                                    {horasDisponiblesActuales.map((h, idx) => (
                                        <option key={idx} value={h}>{h}</option>
                                    ))}
                                </select>
                                {citaActual.fecha && horasDisponiblesActuales.length === 0 && (
                                    <small className="text-danger d-block mt-1">No hay horarios disponibles para este doctor en esta fecha.</small>
                                )}
                            </div>
                            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                <button type="button" className="btn btn-secondary btn-sm px-3" onClick={() => setModoFormulario(null)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success btn-sm px-3" disabled={!citaActual.hora}>
                                    Guardar Cita
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            )}

            {/* SECCIÓN DE FILTROS */}
            <div className="row g-2 bg-light p-3 rounded mb-3">
                <div className="col-12 col-md-4">
                    <label className="form-label small text-muted mb-1">Filtrar por Doctor</label>
                    <select 
                        className="form-select form-select-sm" 
                        value={filtroDoctor} 
                        onChange={(e) => setFiltroDoctor(e.target.value)}
                    >
                        <option value="">Todos los doctores</option>
                        {todosLosDoctores.map((doc, idx) => (
                            <option key={idx} value={doc}>{doc}</option>
                        ))}
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label small text-muted mb-1">Filtrar por Estado</label>
                    <select 
                        className="form-select form-select-sm" 
                        value={filtroEstado} 
                        onChange={(e) => setFiltroEstado(e.target.value)}
                    >
                        <option value="">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Confirmada">Confirmada</option>
                        <option value="Finalizada">Finalizada</option>
                    </select>
                </div>
                <div className="col-12 col-md-4">
                    <label className="form-label small text-muted mb-1">Filtrar por Fecha</label>
                    <input 
                        type="date" 
                        className="form-control form-control-sm" 
                        value={filtroFecha} 
                        onChange={(e) => setFiltroFecha(e.target.value)} 
                    />
                </div>
            </div>

            {/* LISTA DE CITAS */}
            <div className="list-group mt-2">
                {citasFiltradas.length > 0 ? (
                    citasFiltradas.map((c) => (
                        <div key={c.id} className="list-group-item list-group-item-action d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-2 border rounded p-3">
                            <div>
                                <h6 className="mb-1 fw-bold">{c.servicio} - {c.usuario}</h6>
                                <small className="text-muted d-block">
                                    <strong>Área:</strong> {c.area} | <strong>Doctor:</strong> {c.doctor}
                                </small>
                                <small className="text-muted">
                                    <strong>Fecha:</strong> {c.fecha} ({c.hora}) | <strong>Pago:</strong> ${c.monto} ({c.metoPago})
                                </small>
                            </div>
                            <div className="d-flex align-items-center gap-3">
                                <span className={`badge ${
                                    c.estado === 'Pendiente' ? 'bg-warning text-dark' : 
                                    c.estado === 'Confirmada' ? 'bg-success' : 'bg-secondary'
                                }`}>
                                    {c.estado}
                                </span>
                                <button className="btn btn-outline-primary btn-sm px-3 py-1" onClick={() => abrirEditar(c)}>
                                    Editar
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted small">
                        No se encontraron citas con los filtros seleccionados.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCitas;