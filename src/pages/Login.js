import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import { useFetch } from "../api/useFetch";
import logo from "../Img/Logo.png";

function Login() {
  const { setUser } = useAuthContext();
  const { postFetch } = useFetch();
  const navigate = useNavigate();

  const [dui, setDui] = useState("");
  const [pin, setPin] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const frases = [
    "Tu bienestar es nuestra prioridad",
    "Un paso a la vez, estamos contigo",
    "Tu salud mental es el primer paso",
    "Centro Aura: Transformando vidas"
  ];
  const [fraseActual, setFraseActual] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFraseActual((prev) => (prev + 1) % frases.length);
    }, 8000);
    return () => clearInterval(interval);
  }, []);

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
      className="min-vh-100 d-flex align-items-center justify-content-center justify-content-md-between p-3"
      style={{
        backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.25)), url('https://media.istockphoto.com/id/1144444262/pt/foto/female-psychologyst-therapy-session-with-client-indoors-sitting-girl-looking-at-therapist.jpg?s=170667a&w=0&k=20&c=55JGiTeCI_8C-pn3mhVB-kFA2JEea7EY9NCpXhhJxEg=')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <style>{`
        @keyframes slideUpAndGrow {
          0% { opacity: 0; transform: translateY(3.125rem) scale(0.5); }
          30% { opacity: 1; transform: translateY(0) scale(1); }
          70% { opacity: 1; transform: translateY(0) scale(1); }
          100% { opacity: 0; transform: translateY(-3.125rem) scale(1.2); }
        }
        .motivational-text {
          animation: slideUpAndGrow 8s infinite ease-out;
          text-shadow: 0 0.25rem 0.9375rem rgba(0,0,0,0.5);
          color: white;
          font-size: clamp(1.5rem, 5vw, 3rem);
          text-align: center;
          padding: 1.25rem;
          font-weight: bold;
          width: 90%;
        }
      `}</style>

      <div className="d-none d-md-flex flex-grow-1 align-items-center justify-content-center p-4">
        <h1 className="motivational-text">{frases[fraseActual]}</h1>
      </div>

      <div 
        className="d-flex flex-column align-items-center justify-content-center p-3 p-md-4"
        style={{
          width: '100%',
          maxWidth: '28rem',
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(0.625rem)',
          borderRadius: '1.25rem',
          boxShadow: '0 0.625rem 1.875rem rgba(0, 0, 0, 0.2)',
        }}
      >
        <img src={logo} alt="Logo" className="img-fluid mb-3" style={{ maxWidth: '8rem' }} />

        <form onSubmit={handleSubmit} className="w-100">
          <div className="mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="DUI (00000000-0)"
              value={dui}
              onChange={(e) => setDui(e.target.value)}
              style={{ padding: '0.6rem', fontSize: '1rem', textAlign: 'center' }}
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className={`form-control ${errorMsg ? "is-invalid" : ""}`}
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 4))}
              maxLength={4}
              style={{
                fontSize: '1rem',
                padding: '0.6rem',
                textAlign: 'center',
                letterSpacing: '0.5rem',
                fontWeight: 'bold'
              }}
            />
            
            <div className="d-flex justify-content-center gap-2 mt-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{
                  width: "0.6rem", height: "0.6rem", borderRadius: "50%",
                  background: pin.length >= i ? "#1a6a6a" : "#cbd5e0"
                }} />
              ))}
            </div>

            {errorMsg && <div className="text-danger mt-1 text-center small fw-bold">⚠️ {errorMsg}</div>}
          </div>

          <button
            type="submit"
            className="btn w-100 py-2 fw-bold text-white"
            disabled={pin.length !== 4 || isLoading}
            style={{ background: pin.length === 4 && !isLoading ? "#1a6a6a" : "#a0aec0", border: "none", borderRadius: "0.625rem" }}
          >
            {isLoading ? "Validando..." : "INICIAR SESIÓN"}
          </button>
        </form>

        <div className="mt-3 text-center" style={{ fontSize: '0.8rem' }}>
          <a href="#ayuda" className="text-decoration-none d-block" style={{ color: "#1a6a6a" }}>¿Olvidaste tu contraseña?</a>
          <a href="#registro" className="text-decoration-none d-block" style={{ color: "#1a6a6a" }}>¿No tienes cuenta? Regístrate</a>
        </div>

        <div className="mt-3 text-center" style={{ fontSize: "0.6875rem", color: "#718096" }}>
          © 2026 Centro Aura - Todos los derechos reservados.
        </div>
      </div>
    </div>
  );
}

export { Login };