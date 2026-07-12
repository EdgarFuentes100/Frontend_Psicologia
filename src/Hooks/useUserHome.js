import { useState, useMemo } from "react";
import { useAuthContext } from "../auth/AuthProvider";
import { useArea } from "./useArea";
import { useDoctor } from "./useDoctor";
import { useServicio } from "./useServicio";
import { useHorario } from "./useHorario";
import { useFetch } from "../api/useFetch";
import { useCita } from "./useCita";

export const useUserHome = () => {
    const { user, logout } = useAuthContext();
    const { postFetch } = useFetch();
    const { area } = useArea();
    const { misCitas, getMisCitas } = useCita();
    const { doctor, getDoctor } = useDoctor();
    const { servicio, getServicio } = useServicio();
    const { horario, getHorario, getCitasOcupadas, citasOcupadas } = useHorario();

    // Estados
    const [seccionActiva, setSeccionActiva] = useState("agendar");
    const [pasoFormulario, setPasoFormulario] = useState(1);
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);
    const [modalConfig, setModalConfig] = useState({ show: false, mensaje: '', tipo: '' });

    const mostrarModal = (mensaje, tipo) => {
        setModalConfig({ show: true, mensaje, tipo });
    };

    const limpiarFormulario = () => {
        setPasoFormulario(1);
        setAreaSeleccionada(null);
        setDoctorSeleccionado(null);
        setServicioSeleccionado(null);
        setDiaSeleccionado(null);
        setHoraSeleccionada(null);
    };

    const manejarSeleccionArea = (e) => {
        const id = Number(e.target.value);
        const item = area.find(a => a.idArea === id);

        setAreaSeleccionada(item || null);

        // CAMBIO: Limpiamos todo lo que depende del área
        setDoctorSeleccionado(null);
        setServicioSeleccionado(null);
        setDiaSeleccionado(null);
        setHoraSeleccionada(null);

        if (item) {
            getDoctor(item.idArea);
        }
    };

    const manejarSeleccionDoctor = (e) => {
        const doc = doctor.find(d => d.idDoctor === Number(e.target.value));
        if (!doc) return;
        setDoctorSeleccionado(doc);
        getServicio(doc.idDoctor);
        setPasoFormulario(3);
    };

    const manejarSeleccionServicio = (e) => {
        const ser = servicio.find(s => s.idServicio === Number(e.target.value));
        if (!ser) return;
        setServicioSeleccionado(ser);
        getHorario(doctorSeleccionado.idDoctor);
        setPasoFormulario(4);
    };

    const manejarSeleccionDia = (dia) => {
        if (!dia.esAtendible) return;
        setDiaSeleccionado(dia);
        getCitasOcupadas(doctorSeleccionado.idDoctor, dia.fecha);
        setHoraSeleccionada(null);
    };

    // Lógica de agendado
    const manejarAgendarCita = async () => {
        if (!doctorSeleccionado || !servicioSeleccionado || !diaSeleccionado || !horaSeleccionada) {
            mostrarModal("Por favor, complete todos los campos.", "error");
            return;
        }

        const nuevaCita = {
            idPersona: user.idPersona,
            idDoctor: doctorSeleccionado.idDoctor,
            idServicio: servicioSeleccionado.idServicio,
            fecha: diaSeleccionado.fecha,
            horaInicio: horaSeleccionada
        };

        const respuesta = await postFetch('cita/registrar', nuevaCita);

        if (respuesta.ok) {
            mostrarModal("¡Cita agendada exitosamente!", "exito");
            getCitasOcupadas(doctorSeleccionado.idDoctor, diaSeleccionado.fecha);
            limpiarFormulario();
            obtenerMisCitas();
            setSeccionActiva("mis-citas");
        } else {
            mostrarModal("Error al agendar: " + (respuesta.mensaje || "Ocurrió un error"), "error");
        }
    };

    const obtenerMisCitas = () => {
        getMisCitas(user.idUsuario);
    };

    const proximosDias = useMemo(() => {
        const dias = [];
        const hoy = new Date();
        for (let i = 0; i < 8; i++) {
            const fechaTarget = new Date(hoy);
            fechaTarget.setDate(hoy.getDate() + i);
            const fechaString = fechaTarget.toISOString().split('T')[0];
            let nombre = fechaTarget.toLocaleDateString('es-ES', { weekday: 'long' });
            const nombreLimpio = nombre.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            const esAtendible = horario?.some(h =>
                h.diaSemana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === nombreLimpio
                && h.estado === 1
            );

            dias.push({
                fecha: fechaString,
                nombreDia: nombreLimpio,
                diaFormateated: nombre.charAt(0).toUpperCase() + nombre.slice(1),
                numeroDia: fechaTarget.getDate(),
                mes: fechaTarget.toLocaleDateString('es-ES', { month: 'short' }),
                esAtendible: !!esAtendible
            });
        }
        return dias;
    }, [horario]);

    const horasDisponibles = useMemo(() => {
        if (!diaSeleccionado || !horario?.length || !servicioSeleccionado) return [];

        const config = horario.find(h => {
            const diaBD = h.diaSemana.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
            return diaBD === diaSeleccionado.nombreDia && h.estado === 1;
        });

        if (!config) return [];

        const [sh, sm] = config.horaInicio.split(':').map(Number);
        const [eh, em] = config.horaFin.split(':').map(Number);
        let t = new Date(); t.setHours(sh, sm, 0, 0);
        let limite = new Date(); limite.setHours(eh, em, 0, 0);

        const slots = [];
        while (t < limite) {
            const str = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;
            const ocupado = citasOcupadas?.some(c => c.horaInicio.toString().trim() === str);
            slots.push({ hora: str, disponible: !ocupado });
            t.setMinutes(t.getMinutes() + 45);
        }
        return slots;
    }, [diaSeleccionado, horario, servicioSeleccionado, citasOcupadas]);

    return {
        user, logout, area, doctor, servicio, seccionActiva, setSeccionActiva,
        pasoFormulario, areaSeleccionada, doctorSeleccionado, servicioSeleccionado,
        diaSeleccionado, manejarSeleccionDia, horaSeleccionada, setHoraSeleccionada,
        manejarSeleccionArea, manejarSeleccionDoctor, manejarSeleccionServicio,
        proximosDias, horasDisponibles, manejarAgendarCita, misCitas, obtenerMisCitas,
        modalConfig, setModalConfig, limpiarFormulario
    };
};