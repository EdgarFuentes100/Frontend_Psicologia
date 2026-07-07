import { useState, useEffect } from 'react';
import { useFetch } from '../api/useFetch';

const useArea = () => {
    const { getFetch } = useFetch();
    const [area, setArea] = useState([]);

    useEffect(() => {
        const getArea = () => {
            const urlParcial = 'area/obtenerLista';
            getFetch(urlParcial)
                .then((data) => {
                    const { datos, mensaje, ok } = data;
                    if (ok) {
                        setArea(datos);
                    } else {
                        console.error(mensaje);
                    }
                })
                .catch((error) => {
                    console.error('Error al obtener áreas:', error);
                });
        };

        getArea();
    }, [getFetch]);

    return {
        area
    };
};

export { useArea };