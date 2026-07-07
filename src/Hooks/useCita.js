import { useState, useCallback } from "react";
import { useFetch } from "../api/useFetch";

const useCita = () => {
    const { getFetch } = useFetch();
    const [cita, seCita] = useState([]);

    const getCita = useCallback((idUsuario) => {
        console.log(idUsuario);

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

    return {
        cita,
        getCita
    };
};

export { useCita };