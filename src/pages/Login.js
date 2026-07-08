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
      navigate(resp.datos.rol === "Paciente" ? "/userHome" : "/dashboard", { replace: true });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center justify-content-md-end p-3"
      style={{
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.25)), url('https://media.istockphoto.com/id/1144444262/pt/foto/female-psychologyst-therapy-session-with-client-indoors-sitting-girl-looking-at-therapist.jpg?s=170667a&w=0&k=20&c=55JGiTeCI_8C-pn3mhVB-kFA2JEea7EY9NCpXhhJxEg=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div 
        className="d-flex flex-column align-items-center justify-content-center p-4 p-md-5"
        style={{
          width: '100%',
          maxWidth: '500px',
          minHeight: 'auto',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
        }}
      >
        <img src={logo} alt="Logo" className="img-fluid mb-4" style={{ maxWidth: '150px' }} />

        <form onSubmit={handleSubmit} className="w-100">
          <div className="mb-4">
            <input
              type="password"
              className={`form-control ${errorMsg ? "is-invalid" : ""}`}
              placeholder=""
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              autoFocus
              style={{
                fontSize: '16px',
                padding: '12px',
                textAlign: 'center',
                letterSpacing: '10px',
                fontWeight: 'bold'
              }}
            />
            
            <div className="d-flex justify-content-center gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: "12px", height: "12px", borderRadius: "50%",
                  background: pin.length >= i ? "#1a6a6a" : "#cbd5e0"
                }} />
              ))}
            </div>

            {errorMsg && (
              <div className="text-danger mt-2 text-center small fw-bold">⚠️ {errorMsg}</div>
            )}
          </div>

          <button
            type="submit"
            className="btn w-100 py-3 fw-bold text-white"
            disabled={pin.length !== 4 || isLoading}
            style={{
              background: pin.length === 4 && !isLoading ? "#1a6a6a" : "#a0aec0",
              border: "none",
              borderRadius: "10px"
            }}
          >
            {isLoading ? "Validando..." : "INICIAR SESIÓN"}
          </button>

          <div className="mt-4 text-center" style={{ fontSize: '14px' }}>
            <a href="#ayuda" className="text-decoration-none d-block my-2" style={{ color: "#1a6a6a" }}>¿Olvidaste tu contraseña?</a>
            <a href="#registro" className="text-decoration-none d-block my-2" style={{ color: "#1a6a6a" }}>¿No tienes cuenta? Regístrate</a>
          </div>
        </form>

        <div className="mt-5 text-center" style={{ fontSize: "11px", color: "#718096" }}>
          © 2026 Centro Aura - Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export { Login };