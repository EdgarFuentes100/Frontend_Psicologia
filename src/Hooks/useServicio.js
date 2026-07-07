import { useState } from 'react';
import { useFetch } from '../api/useFetch';

const useServicio = () => {
    const { getFetch } = useFetch();
    const [servicio, setServicio] = useState([]);

    const getServicio = (idDoctor) => {
        const urlParcial = `servicio/obtenerLista/${idDoctor}`;

        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;

                if (ok) {
                    setServicio(datos);
                    console.log("ser ", datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener:", error);
            });
    };

    return {
        servicio,
        getServicio
    };
};

export { useServicio };
