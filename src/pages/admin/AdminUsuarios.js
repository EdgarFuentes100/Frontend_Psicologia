// src/components/admin/AdminUsuarios.jsx
import React, { useState } from "react";

const AdminUsuarios = () => {
    // Lista de usuarios de ejemplo
    const [usuarios, setUsuarios] = useState([
        { id: 1, nombre: "Ana Pérez", correo: "ana@example.com", rol: "Paciente", estado: "Activo" },
        { id: 2, nombre: "Carlos Gómez", correo: "carlos@example.com", rol: "Administrador", estado: "Activo" },
        { id: 3, nombre: "María López", correo: "maria@example.com", rol: "Paciente", estado: "Inactivo" },
    ]);

    // Estados para controlar el modal / formulario de Crear o Editar
    const [modoFormulario, setModoFormulario] = useState(null); // null, 'crear', 'editar'
    const [usuarioActual, setUsuarioActual] = useState({ id: null, nombre: "", correo: "", rol: "Paciente", estado: "Activo" });

    // Abrir formulario para crear
    const abrirCrear = () => {
        setUsuarioActual({ id: null, nombre: "", correo: "", rol: "Paciente", estado: "Activo" });
        setModoFormulario("crear");
    };

    // Abrir formulario para editar
    const abrirEditar = (usuario) => {
        setUsuarioActual(usuario);
        setModoFormulario("editar");
    };

    // Guardar cambios (Crear o Actualizar)
    const guardarUsuario = (e) => {
        e.preventDefault();
        if (modoFormulario === "crear") {
            const nuevo = { ...usuarioActual, id: Date.now() };
            setUsuarios([...usuarios, nuevo]);
        } else if (modoFormulario === "editar") {
            setUsuarios(usuarios.map(u => u.id === usuarioActual.id ? usuarioActual : u));
        }
        setModoFormulario(null);
    };

    return (
        <div className="card border-0 shadow-sm p-4 bg-white" style={{ borderRadius: "0.75rem" }}>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h5 className="fw-bold mb-0">Gestión de Usuarios</h5>
                    <p className="text-muted small mb-0">Administra los roles y estados de los usuarios del sistema.</p>
                </div>
                {modoFormulario === null && (
                    <button className="btn btn-primary btn-sm px-3" onClick={abrirCrear}>
                        + Nuevo Usuario
                    </button>
                )}
            </div>

            {/* FORMULARIO DE CREAR / EDITAR */}
            {modoFormulario !== null ? (
                <div className="bg-light p-3 rounded border mb-4">
                    <h6 className="fw-bold mb-3">
                        {modoFormulario === "crear" ? "Registrar Nuevo Usuario" : "Editar Usuario"}
                    </h6>
                    <form onSubmit={guardarUsuario}>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label small">Nombre Completo</label>
                                <input 
                                    type="text" 
                                    className="form-control form-control-sm" 
                                    value={usuarioActual.nombre} 
                                    onChange={(e) => setUsuarioActual({...usuarioActual, nombre: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Correo Electrónico</label>
                                <input 
                                    type="email" 
                                    className="form-control form-control-sm" 
                                    value={usuarioActual.correo} 
                                    onChange={(e) => setUsuarioActual({...usuarioActual, correo: e.target.value})} 
                                    required 
                                />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Rol</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={usuarioActual.rol} 
                                    onChange={(e) => setUsuarioActual({...usuarioActual, rol: e.target.value})}
                                >
                                    <option value="Paciente">Paciente</option>
                                    <option value="Doctor">Doctor</option>
                                    <option value="Administrador">Administrador</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label small">Estado</label>
                                <select 
                                    className="form-select form-select-sm" 
                                    value={usuarioActual.estado} 
                                    onChange={(e) => setUsuarioActual({...usuarioActual, estado: e.target.value})}
                                >
                                    <option value="Activo">Activo</option>
                                    <option value="Inactivo">Inactivo</option>
                                </select>
                            </div>
                            <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                                <button type="button" className="btn btn-secondary btn-sm px-3" onClick={() => setModoFormulario(null)}>
                                    Cancelar
                                </button>
                                <button type="submit" className="btn btn-success btn-sm px-3">
                                    Guardar
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            ) : null}

            {/* TABLA DE USUARIOS */}
            <div className="table-responsive">
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Nombre</th>
                            <th>Correo</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map((u) => (
                            <tr key={u.id}>
                                <td className="fw-semibold">{u.nombre}</td>
                                <td>{u.correo}</td>
                                <td>
                                    <span className={`badge ${u.rol === 'Administrador' ? 'bg-secondary' : u.rol === 'Doctor' ? 'bg-success' : 'bg-primary'}`}>
                                        {u.rol}
                                    </span>
                                </td>
                                <td>
                                    <span className={`fw-bold ${u.estado === 'Activo' ? 'text-success' : 'text-danger'}`}>
                                        • {u.estado}
                                    </span>
                                </td>
                                <td className="text-end">
                                    <button className="btn btn-outline-primary btn-sm px-2 py-0" onClick={() => abrirEditar(u)}>
                                        Editar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsuarios;