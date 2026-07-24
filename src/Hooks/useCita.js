import { useState, useCallback } from "react";
import { useFetch } from "../api/useFetch";

const useCita = () => {
    const { getFetch, postFetch } = useFetch();
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


const pagar = useCallback((idUsuario) => {
    const urlParcial = `wompi/crear-pago`;
    
    // Objeto con los datos que necesita el backend/Wompi
    const datosPago = {
        idUsuario: idUsuario
        // Agrega aquí otros campos necesarios (ej. monto, concepto, etc.)
    };

    console.log("📍 [FRONTEND] Enviando solicitud de pago para usuario:", idUsuario);

    // Cambiamos a postFetch y pasamos el cuerpo con los datos
    postFetch(urlParcial, datosPago)
        .then((data) => {
            console.log("📍 [FRONTEND] Respuesta recibida del servidor:", data);
            
            const { data: resultadoWompi, success, message } = data;

            if (success) {
                console.log("✅ Link de pago generado:", resultadoWompi);
                // Si Wompi devuelve la URL del enlace, puedes redireccionar así:
                // window.location.href = resultadoWompi.urlEnlace;
            } else {
                console.error("❌ Error en la respuesta:", message);
            }
        })
        .catch((error) => {
            console.error("❌ Error de red o en la petición:", error);
        });

}, []);

    return {
        cita,
        getCita,
        misCitas,
        getMisCitas,
        pagar
    };
};

export { useCita };