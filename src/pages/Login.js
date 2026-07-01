import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import { useFetch } from "../api/useFetch";
import logo from "../Img/Logo.png";

function Login() {
  const { setUser } = useAuthContext();
  const { postFetch } = useFetch();
  const navigate = useNavigate();

  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 4) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const resp = await postFetch("auth/login", { pin });

      if (!resp.ok) {
        setErrorMsg(resp.mensaje || "PIN incorrecto");
        return;
      }

      setUser(resp.datos);

      if (resp.datos.rol === "Paciente") {
        navigate("/userHome", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } finally {
      setIsLoading(false);
    }
  };

return (
  <div
    className="min-vh-100 d-flex align-items-center justify-content-center justify-content-md-end"
    style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.25)), url('https://media.istockphoto.com/id/1144444262/pt/foto/female-psychologyst-therapy-session-with-client-indoors-sitting-girl-looking-at-therapist.jpg?s=170667a&w=0&k=20&c=55JGiTeCI_8C-pn3mhVB-kFA2JEea7EY9NCpXhhJxEg=')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    {/* CONTENEDOR PRINCIPAL ASIMÉTRICO (Alineado a la derecha en PC) */}
    <div 
      className="d-flex flex-column align-items-center justify-content-start"
      style={{
        width: '100%',
        maxWidth: '800px',
        height: 'calc(100vh - 60px)',
        minHeight: '550px',
        background: 'linear-gradient(rgba(255, 255, 255, 0.85), rgba(255, 255, 255, 0.85))',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        margin: '30px',
        padding: '40px',
        paddingTop: '80px',
        transition: 'all 0.3s ease'
      }}
    >
      {/* LOGO PRINCIPAL */}
      <img
        src={logo}
        alt="Logo"
        className="img-fluid mb-4"
        style={{
          maxWidth: '150px',
          height: 'auto',
        }}
      />

      {/* WRAPPER DEL FORMULARIO BLANCO (Igual al HTML original) */}
      <div 
        className="w-100 bg-white p-4 text-center"
        style={{
          borderRadius: '15px',
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
          maxWidth: '460px'
        }}
      >
        <form onSubmit={handleSubmit}>
          
          {/* INPUT ESTILO CONTRASEÑA (Pero procesa PIN) */}
          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errorMsg ? "is-invalid" : ""}`}
              placeholder="Contraseña"
              value={pin}
              onChange={(e) =>
                setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
              }
              maxLength={4}
              autoFocus
              style={{
                width: '100%',
                padding: '12px',
                boxSizing: 'border-box',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '16px',
                textAlign: 'left', // Texto alineado a la izquierda como pediste
                letterSpacing: 'normal' // Sin espacios gigantes feos
              }}
            />
            
            {/* Indicador de puntitos discretos abajo del input */}
            <div className="d-flex justify-content-center gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: pin.length >= i ? "#1a6a6a" : "#dee2e6",
                    transition: "all 0.2s ease"
                  }}
                />
              ))}
            </div>

            {errorMsg && (
              <div className="invalid-feedback d-block mt-2 text-start small fw-semibold" style={{ color: '#fc8181' }}>
                ⚠️ {errorMsg}
              </div>
            )}
          </div>

          {/* BOTÓN DE ACCESO (Con los colores de tu HTML original) */}
          <button
            type="submit"
            className="btn w-100 py-2.5 fw-bold text-uppercase text-white"
            disabled={pin.length !== 4 || isLoading}
            style={{
              background: pin.length === 4 && !isLoading ? "#1a6a6a" : "#cbd5e0",
              border: "none",
              cursor: pin.length === 4 && !isLoading ? "pointer" : "not-allowed",
              borderRadius: "5px",
              marginTop: "10px",
              transition: "all 0.2s ease"
            }}
          >
            {isLoading ? "Verificando..." : "INICIAR SESIÓN"}
          </button>

          {/* OPCIONES / ENLACES */}
          <div className="mt-3" style={{ fontSize: '14px' }}>
            <a href="#ayuda" className="text-decoration-none d-block my-1" style={{ color: "#1a6a6a" }}>
              ¿Olvidaste tu contraseña?
            </a>
            <a href="#registro" className="text-decoration-none d-block my-1" style={{ color: "#1a6a6a" }}>
              ¿No tienes cuenta? Regístrate
            </a>
          </div>

        </form>
      </div>

      {/* FOOTER TEXT */}
      <div className="mt-auto text-center" style={{ fontSize: "12px", color: "#999", marginTop: "30px" }}>
        © 2026 Centro Aura - Todos los derechos reservados.
      </div>

    </div>
  </div>
);

}

export { Login };
