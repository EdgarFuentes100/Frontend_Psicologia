import { useState, useEffect } from 'react';
import { useFetch } from '../api/useFetch';

const useHorario = () => {
    const { getFetch } = useFetch();
    const [horario, setHorario] = useState([]);
    
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

    return {
        horario,
        getHorario
    };
};

export { useHorario };
