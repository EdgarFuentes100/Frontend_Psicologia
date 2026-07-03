import React, { useState } from "react";

const HorarioView = () => {
  // Datos iniciales estructurados exactamente como tu tabla 'horarios'
  const [horarios, setHorarios] = useState([
    { idHorario: 1, diaSemana: "Lunes", horaInicio: "08:00", horaFin: "17:00", estado: 1 },
    { idHorario: 2, diaSemana: "Martes", horaInicio: "08:00", horaFin: "17:00", estado: 1 },
    { idHorario: 3, diaSemana: "Miercoles", horaInicio: "08:00", horaFin: "17:00", estado: 1 },
    { idHorario: 4, diaSemana: "Jueves", horaInicio: "08:00", horaFin: "17:00", estado: 1 },
    { idHorario: 5, diaSemana: "Viernes", horaInicio: "08:00", horaFin: "17:00", estado: 1 },
    { idHorario: 6, diaSemana: "Sabado", horaInicio: "08:00", horaFin: "12:00", estado: 0 }, // Inactivo por defecto
    { idHorario: 7, diaSemana: "Domingo", horaInicio: "00:00", horaFin: "00:00", estado: 0 },
  ]);

  // Manejar el encendido/apagado de cualquier día (Modifica la columna 'estado' tinyint)
  const toggleDia = (id) => {
    setHorarios(horarios.map(h => h.idHorario === id ? { ...h, estado: h.estado === 1 ? 0 : 1 } : h));
  };

  // Cambiar horas específicas (Inicio o Fin)
  const cambiarHora = (id, campo, valor) => {
    setHorarios(horarios.map(h => h.idHorario === id ? { ...h, [campo]: valor } : h));
  };

  // Helper rápido para cambiar el Sábado entre bloques predefinidos comunes
  const aplicarPreajusteSabado = (id, tipo) => {
    const horas = tipo === "medio" 
      ? { horaInicio: "08:00", horaFin: "12:00", estado: 1 } 
      : { horaInicio: "08:00", horaFin: "17:00", estado: 1 };
      
    setHorarios(horarios.map(h => h.idHorario === id ? { ...h, ...horas } : h));
  };

  const guardarConfiguracion = (e) => {
    e.preventDefault();
    // Aquí enviarías el array 'horarios' mediante un Axios/Fetch a tu API para hacer el UPDATE
    console.log("Guardando en la base de datos:", horarios);
    alert("Configuración de horarios actualizada correctamente.");
  };

  return (
    <div className="container-fluid py-4 bg-light" style={{ minHeight: "100vh" }}>
      
      {/* Encabezado */}
      <div className="pb-3 mb-4 border-bottom">
        <h4 className="fw-bold text-dark mb-1">Configuración de Horarios Disponibles</h4>
        <p className="text-muted small mb-0">Define los días y rangos de horas en los que los pacientes podrán agendar citas en línea.</p>
      </div>

      <form onSubmit={guardarConfiguracion} style={{ maxWidth: "800px" }}>
        
        {/* Bloque: Lunes a Viernes */}
        <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: "8px" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark mb-3">Jornada Regular (Lunes a Viernes)</h6>
            
            <div className="d-flex flex-column gap-3">
              {horarios.slice(0, 5).map((horario) => (
                <div key={horario.idHorario} className="row align-items-center g-2 pb-2 border-bottom border-light">
                  
                  {/* Switch para activar/desactivar día */}
                  <div className="col-12 col-sm-3 d-flex align-items-center">
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`check-${horario.idHorario}`}
                        checked={horario.estado === 1}
                        onChange={() => toggleDia(horario.idHorario)}
                      />
                      <label className="form-check-label small fw-bold text-dark ms-2" htmlFor={`check-${horario.idHorario}`}>
                        {horario.diaSemana}
                      </label>
                    </div>
                  </div>

                  {/* Inputs de Horas */}
                  <div className="col-12 col-sm-9 d-flex align-items-center gap-2">
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={horario.estado === 0}
                      value={horario.horaInicio}
                      onChange={(e) => cambiarHora(horario.idHorario, "horaInicio", e.target.value)}
                    />
                    <span className="text-muted small">a</span>
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={horario.estado === 0}
                      value={horario.horaFin}
                      onChange={(e) => cambiarHora(horario.idHorario, "horaFin", e.target.value)}
                    />
                    {horario.estado === 0 && <span className="text-muted small ms-2 italic">(No disponible)</span>}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Bloque Variable: Sábados y Fines de semana */}
        <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: "8px" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark mb-1">Disponibilidad de Sábados</h6>
            <p className="text-muted small mb-3">Activa el sábado según tu flujo de trabajo semanal actual.</p>

            {horarios.slice(5, 6).map((sabado) => (
              <div key={sabado.idHorario}>
                
                {/* Switch Principal */}
                <div className="p-3 bg-light rounded mb-3 d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
                  <div className="form-check form-switch m-0">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="check-sabado"
                      checked={sabado.estado === 1}
                      onChange={() => toggleDia(sabado.idHorario)}
                    />
                    <label className="form-check-label fw-bold small text-dark ms-2" htmlFor="check-sabado">
                      {sabado.estado === 1 ? "🟢 Sábado Activo (Pacientes pueden agendar)" : "⚪ Sábado Inactivo"}
                    </label>
                  </div>

                  {/* Preajustes rápidos para el sábado si está activo */}
                  {sabado.estado === 1 && (
                    <div className="d-flex gap-2">
                      <button 
                        type="button" 
                        className={`btn btn-xs btn-outline-secondary px-2 py-1 small ${sabado.horaFin === "12:00" ? "active bg-secondary text-white" : ""}`}
                        onClick={() => aplicarPreajusteSabado(sabado.idHorario, "medio")}
                      >
                        Media Jornada (8-12)
                      </button>
                      <button 
                        type="button" 
                        className={`btn btn-xs btn-outline-secondary px-2 py-1 small ${sabado.horaFin === "17:00" ? "active bg-secondary text-white" : ""}`}
                        onClick={() => aplicarPreajusteSabado(sabado.idHorario, "completo")}
                      >
                        Jornada Completa (8-5)
                      </button>
                    </div>
                  )}
                </div>

                {/* Edición manual detallada del Sábado */}
                <div className="row align-items-center g-2">
                  <div className="col-sm-3">
                    <span className="small text-muted fw-semibold">Horario manual alternativo:</span>
                  </div>
                  <div className="col-sm-9 d-flex align-items-center gap-2">
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={sabado.estado === 0}
                      value={sabado.horaInicio}
                      onChange={(e) => cambiarHora(sabado.idHorario, "horaInicio", e.target.value)}
                    />
                    <span className="text-muted small">a</span>
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={sabado.estado === 0}
                      value={sabado.horaFin}
                      onChange={(e) => cambiarHora(sabado.idHorario, "horaFin", e.target.value)}
                    />
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>

        {/* Botón Guardar Cambios */}
        <div className="d-flex justify-content-end">
          <button type="submit" className="btn btn-primary px-4 fw-bold">
            Guardar Configuración General
          </button>
        </div>

      </form>
    </div>
  );
};

export default HorarioView;