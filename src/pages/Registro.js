import React, { useState } from "react";
import { useFetch } from "../api/useFetch";

const Registro = () => {
    const { postFetch } = useFetch();
    const [formData, setFormData] = useState({ 
        dui: "", nombre: "", apellidos: "", telefono: "", pin: "" 
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegistro = async (e) => {
        e.preventDefault();
        const resp = await postFetch("auth/registro", formData);
        if (resp.ok) alert("Registro exitoso");
    };

    return (
        <div className="container mt-5">
            <form onSubmit={handleRegistro} className="card p-4 mx-auto" style={{ maxWidth: "400px" }}>
                <h3>Crear Cuenta</h3>
                <input name="dui" placeholder="DUI" className="form-control mb-2" onChange={handleChange} />
                <input name="nombre" placeholder="Nombre" className="form-control mb-2" onChange={handleChange} />
                <input name="apellidos" placeholder="Apellidos" className="form-control mb-2" onChange={handleChange} />
                <input name="telefono" placeholder="Teléfono" className="form-control mb-2" onChange={handleChange} />
                <input name="pin" type="password" maxLength={4} placeholder="PIN (4 dígitos)" className="form-control mb-2" onChange={handleChange} />
                <button type="submit" className="btn btn-primary w-100">Registrarse</button>
            </form>
        </div>
    );
};
export { Registro };