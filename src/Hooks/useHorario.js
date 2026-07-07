import { useState } from 'react';
import { useFetch } from '../api/useFetch';

const useHorario = () => {
    const { getFetch } = useFetch();
    const [horario, setHorario] = useState([]);
    const [citasOcupadas, setCitasOcupadas] = useState([]);

    const getHorario = (idDoctor) => {
        const urlParcial = `horario/obtenerLista/${idDoctor}`;

        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;

                if (ok) {
                    setHorario(datos);
                    console.log("ho ", datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener doctores:", error);
            });
    };

    const getCitasOcupadas = (idDoctor, fecha) => {
        // 1. Eliminamos el await/fetch suelto que causaba el error
        console.log("Intentando obtener citas para:", idDoctor, fecha);

        const fechaLimpia = fecha.trim();
        const urlParcial = `horario/obtenerCita/${idDoctor}/${fechaLimpia}`;

        getFetch(urlParcial)
            .then((data) => {
                console.log("Respuesta del servidor:", data); // Verás esto en consola
                const { datos, message, ok } = data;

                if (ok) {
                    // Si 'datos' es null o undefined, inicializamos como array vacío
                    setCitasOcupadas(Array.isArray(datos) ? datos : []);
                    console.log("Citas ocupadas recibidas: ", datos);
                } else {
                    console.error("Error desde el servidor:", message);
                    setCitasOcupadas([]); // Resetear si falla
                }
            })
            .catch((error) => {
                console.error("Error crítico en getCitasOcupadas:", error);
                setCitasOcupadas([]);
            });
    };

    return {
        horario,
        getHorario,
        getCitasOcupadas,
        citasOcupadas,
        setCitasOcupadas
    };
};

export { useHorario };
