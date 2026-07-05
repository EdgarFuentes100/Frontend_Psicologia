import { useState, useMemo } from "react";
import { useAuthContext } from "../auth/AuthProvider";
import { useArea } from "./useArea";
import { useDoctor } from "./useDoctor";
import { useServicio } from "./useServicio";
import { useHorario } from "./useHorario";

export const useUserHome = () => {
    const { user, logout } = useAuthContext();
    const { area } = useArea();
    const { doctor, getDoctor } = useDoctor();
    const { servicio, getServicio } = useServicio();
    const { horario, getHorario, getCitasOcupadas, citasOcupadas } = useHorario();

    const [seccionActiva, setSeccionActiva] = useState("agendar");
    const [pasoFormulario, setPasoFormulario] = useState(1);
    const [areaSeleccionada, setAreaSeleccionada] = useState(null);
    const [doctorSeleccionado, setDoctorSeleccionado] = useState(null);
    const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
    const [diaSeleccionado, setDiaSeleccionado] = useState(null);
    const [horaSeleccionada, setHoraSeleccionada] = useState(null);

    const manejarSeleccionArea = (e) => {
        const item = area.find(a => a.idArea == e.target.value);
        if (!item) return;
        setAreaSeleccionada(item);
        getDoctor(item.idArea);
        setPasoFormulario(2);
    };

    const manejarSeleccionDoctor = (e) => {
        const doc = doctor.find(d => d.idDoctor == e.target.value);
        if (!doc) return;
        setDoctorSeleccionado(doc);
        getServicio(doc.idDoctor);
        setPasoFormulario(3);
    };

    const manejarSeleccionServicio = (e) => {
        const ser = servicio.find(s => s.idServicio == e.target.value);
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
            // 1. Generamos el formato "HH:MM" (siempre con 2 dígitos)
            const str = `${String(t.getHours()).padStart(2, '0')}:${String(t.getMinutes()).padStart(2, '0')}`;

            // 2. Comparamos
            const ocupado = citasOcupadas?.some(c => {
                // Obtenemos la hora de la BD
                const horaBD = c.horaInicio.toString().trim();

                // Comparamos, asegurándonos de que ambos sean "HH:MM"
                // Si tu BD devuelve "13:00", esto funcionará.
                return horaBD === str;
            });

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
        proximosDias, horasDisponibles
    };
};