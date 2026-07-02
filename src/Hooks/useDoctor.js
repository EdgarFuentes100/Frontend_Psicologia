import { useState, useEffect } from 'react';
import { useFetch } from '../api/useFetch';

const useDoctor = () => {
    const { getFetch } = useFetch();
    const [doctor, setDoctor] = useState([]);

    const getDoctor = (idArea) => {
        const urlParcial = `doctor/obtenerLista/${idArea}`;

        getFetch(urlParcial)
            .then((data) => {
                const { datos, mensaje, ok } = data;

                if (ok) {
                    setDoctor(datos);
                    console.log("doc ", datos);
                } else {
                    console.error(mensaje);
                }
            })
            .catch((error) => {
                console.error("Error al obtener doctores:", error);
            });
    };

    return {
        doctor,
        getDoctor
    };
};

export { useDoctor };
