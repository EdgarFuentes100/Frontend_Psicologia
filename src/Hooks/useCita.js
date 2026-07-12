import { useState, useCallback } from "react";
import { useFetch } from "../api/useFetch";

const useCita = () => {
    const { getFetch } = useFetch();
    const [cita, seCita] = useState([]);
    const [misCitas, setMisCitas] = useState([]);

    const getCita = useCallback((idUsuario) => {
        const urlParcial = `cita/obtenerLista/${idUsuario}`;
        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;
                if (ok) {
                    seCita(datos);
                    console.log("cita", datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener citas:", error);
            });

    }, [getFetch]);

    const getMisCitas = useCallback((idUsuario) => {
        console.log("mis citass user", idUsuario);
        const urlParcial = `cita/obtenerCitas/${idUsuario}`;
        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;
                if (ok) {
                    setMisCitas(datos);
                    console.log("Mis citas", datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener citas:", error);
            });

    }, [getFetch]);


    return {
        cita,
        getCita,
        misCitas,
        getMisCitas
    };
};

export { useCita };