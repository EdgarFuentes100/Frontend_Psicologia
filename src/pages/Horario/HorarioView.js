import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../auth/AuthProvider";
import { useHorario } from "../../Hooks/useHorario";

const HorarioView = () => {
  const { user } = useAuthContext();
  const { horarioCompleto, listaCompleta, cambiarEstadoHorario } = useHorario();

  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Cargar la lista completa al montar el componente o cuando cambie el usuario
  useEffect(() => {
    if (user?.idUsuario) {
      listaCompleta(user.idUsuario);
    }
  }, [user, listaCompleta]);

  // 2. Sincronizar el estado local cuando el hook reciba los datos de la API
  useEffect(() => {
    if (Array.isArray(horarioCompleto) && horarioCompleto.length > 0) {
      setHorarios(horarioCompleto);
      setLoading(false);
    }
  }, [horarioCompleto]);

  // Manejar el encendido/apagado en tiempo real (Base de datos + UI)
  const toggleDia = async (idHorario) => {
    // Buscamos el horario actual para saber cuál es su estado contrario
    const horarioActual = horarios.find(h => h.idHorario === idHorario);
    if (!horarioActual) return;

    const nuevoEstado = horarioActual.estado === 1 ? 0 : 1;

    // Actualización optimista en la interfaz (para que se vea fluido de inmediato)
    setHorarios(horarios.map(h => h.idHorario === idHorario ? { ...h, estado: nuevoEstado } : h));

    // Petición a la API en tiempo real
    const exito = await cambiarEstadoHorario(idHorario, nuevoEstado);

    if (!exito) {
      // Si falla la API, revertimos el cambio visual en la UI
      setHorarios(horarios.map(h => h.idHorario === idHorario ? { ...h, estado: horarioActual.estado } : h));
      alert("Hubo un error al actualizar el estado en el servidor.");
    }
  };

  // Cambiar horas específicas (Inicio o Fin) localmente por ahora
  const cambiarHora = (id, campo, valor) => {
    setHorarios(horarios.map(h => h.idHorario === id ? { ...h, [campo]: valor } : h));
  };

  if (loading) return <div className="p-5 text-center">Cargando horarios...</div>;

  return (
    <div className="container-fluid py-4 bg-light" style={{ minHeight: "100vh" }}>
      
      {/* Encabezado */}
      <div className="pb-3 mb-4 border-bottom">
        <h4 className="fw-bold text-dark mb-1">Configuración de Horarios Disponibles</h4>
        <p className="text-muted small mb-0">Define los días y rangos de horas en los que los pacientes podrán agendar citas en línea. Los cambios se guardan automáticamente.</p>
      </div>

      <div style={{ maxWidth: "800px" }}>
        
        {/* Bloque Único: Jornada Semanal */}
        <div className="card border-0 shadow-sm mb-4 bg-white" style={{ borderRadius: "8px" }}>
          <div className="card-body p-4">
            <h6 className="fw-bold text-dark mb-3">Jornada Semanal</h6>
            
            <div className="d-flex flex-column gap-3">
              {horarios.map((item) => (
                <div key={item.idHorario} className="row align-items-center g-2 pb-2 border-bottom border-light">
                  
                  {/* Switch para activar/desactivar día en tiempo real */}
                  <div className="col-12 col-sm-3 d-flex align-items-center">
                    <div className="form-check form-switch m-0">
                      <input 
                        className="form-check-input" 
                        type="checkbox" 
                        id={`check-${item.idHorario}`}
                        checked={item.estado === 1}
                        onChange={() => toggleDia(item.idHorario)}
                      />
                      <label className="form-check-label small fw-bold text-dark ms-2" htmlFor={`check-${item.idHorario}`}>
                        {item.diaSemana}
                      </label>
                    </div>
                  </div>

                  {/* Inputs de Horas */}
                  <div className="col-12 col-sm-9 d-flex align-items-center gap-2">
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={item.estado === 0}
                      value={item.horaInicio}
                      onChange={(e) => cambiarHora(item.idHorario, "horaInicio", e.target.value)}
                    />
                    <span className="text-muted small">a</span>
                    <input 
                      type="time" 
                      className="form-control form-control-sm" 
                      disabled={item.estado === 0}
                      value={item.horaFin}
                      onChange={(e) => cambiarHora(item.idHorario, "horaFin", e.target.value)}
                    />
                    {item.estado === 0 && <span className="text-muted small ms-2 italic">(No disponible)</span>}
                  </div>

                </div>
              ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default HorarioView;