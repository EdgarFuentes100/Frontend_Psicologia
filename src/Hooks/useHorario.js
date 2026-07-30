import { useState, useCallback } from 'react';
import { useFetch } from '../api/useFetch';

const useHorario = () => {
    // Asegúrate de extraer también el método para hacer PATCH o PUT desde useFetch (ej. patchFetch o requestFetch)
    // Si tu useFetch usa un método genérico como `fetchData`, ajústalo según corresponda.
    const { getFetch, patchFetch } = useFetch(); 
    
    const [horario, setHorario] = useState([]);
    const [horarioCompleto, setHorarioCompleto] = useState([]);
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
        console.log("Intentando obtener citas para:", idDoctor, fecha);

        const fechaLimpia = fecha.trim();
        const urlParcial = `horario/obtenerCita/${idDoctor}/${fechaLimpia}`;

        getFetch(urlParcial)
            .then((data) => {
                console.log("Respuesta del servidor:", data);
                const { datos, message, ok } = data;

                if (ok) {
                    setCitasOcupadas(Array.isArray(datos) ? datos : []);
                    console.log("Citas ocupadas recibidas: ", datos);
                } else {
                    console.error("Error desde el servidor:", message);
                    setCitasOcupadas([]);
                }
            })
            .catch((error) => {
                console.error("Error crítico en getCitasOcupadas:", error);
                setCitasOcupadas([]);
            });
    };

    const listaCompleta = useCallback((idDoctor) => {
        const urlParcial = `horario/listaCompleta/${idDoctor}`;
        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;
                if (ok) {
                    setHorarioCompleto(Array.isArray(datos) ? datos : []);
                    console.log("Lista completa recibida: ", datos);
                } else {
                    console.error("Error al obtener lista completa:", mensaje);
                }
            })
            .catch((error) => {
                console.error("Error crítico en listaCompleta:", error);
            });
    }, [getFetch]);

    /**
     * NUEVA FUNCIÓN: Cambia el estado (activar/desactivar) de un horario
     */
    const cambiarEstadoHorario = async (idHorario, estado) => {
        const urlParcial = `horario/${idHorario}/estado`;

        try {
            // Dependiendo de cómo esté estructurado tu useFetch, puedes enviar el body así:
            // (Si tu useFetch usa un método genérico tipo requestFetch({ url, method, body }), adáptalo)
            const data = await patchFetch(urlParcial, { estado });
            
            const { ok, message } = data;

            if (ok) {
                console.log("Estado actualizado con éxito");
                return true;
            } else {
                console.error("Error al actualizar estado:", message);
                return false;
            }
        } catch (error) {
            console.error("Error crítico en cambiarEstadoHorario:", error);
            return false;
        }
    };

    return {
        horario,
        getHorario,
        getCitasOcupadas,
        citasOcupadas,
        setCitasOcupadas,
        horarioCompleto,
        listaCompleta,
        cambiarEstadoHorario // <--- No olvides retornarlo aquí
    };
};

export { useHorario };