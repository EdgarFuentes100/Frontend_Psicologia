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
    className="min-vh-100 d-flex align-items-center justify-content-center"
    style={{
      position: 'relative',
      overflow: 'hidden',
      backgroundImage: "linear-gradient(rgba(15, 23, 42, 0.15), rgba(15, 23, 42, 0.25)), url('https://media.istockphoto.com/id/1144444262/pt/foto/female-psychologyst-therapy-session-with-client-indoors-sitting-girl-looking-at-therapist.jpg?s=170667a&w=0&k=20&c=55JGiTeCI_8C-pn3mhVB-kFA2JEea7EY9NCpXhhJxEg=')",
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <div className="container px-4">
      <div className="row align-items-center justify-content-center justify-content-md-between g-5">

        {/* SECCIÓN DEL LOGO (IZQUIERDA) - SOLO ESCRITORIO */}
        <div className="col-12 col-md-6 col-lg-6 text-center text-md-start d-flex flex-column align-items-center justify-content-center d-none d-md-flex">
          <div className="mb-3 text-center">
            <img
              src={logo}
              alt="Mente Dinámica"
              className="img-fluid"
              style={{
                width: "420px",
                height: "auto",
                filter: "drop-shadow(0 12px 40px rgba(0, 0, 0, 0.25))",
                transition: "transform 0.3s ease"
              }}
            />
            <p style={{ 
              color: 'rgba(255,255,255,0.85)', 
              fontSize: '1.1rem', 
              marginTop: '16px',
              fontWeight: 300
            }}>
              Tu espacio seguro de crecimiento personal
            </p>
          </div>
        </div>

        {/* TARJETA DE ACCESO (DERECHA) */}
        <div className="col-12 col-md-6 col-lg-5">
          <div
            className="card border-0 p-4 p-md-5 mx-auto"
            style={{
              borderRadius: "32px",
              backgroundColor: "rgba(255, 255, 255, 0.85)",
              backdropFilter: "blur(20px) saturate(1.2)",
              WebkitBackdropFilter: "blur(20px) saturate(1.2)",
              border: "1px solid rgba(255, 255, 255, 0.5)",
              boxShadow: "0 32px 64px rgba(0, 0, 0, 0.12), 0 0 0 1px rgba(255,255,255,0.1) inset",
              maxWidth: "440px",
              transition: "transform 0.3s ease, box-shadow 0.3s ease"
            }}
          >
            {/* Encabezado - Logo pequeño SOLO en móvil */}
            <div className="text-center mb-4">
              <div className="d-md-none mb-3">
                <img
                  src={logo}
                  alt="Mente Dinámica"
                  style={{
                    width: '70px',
                    height: 'auto',
                    filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.1))"
                  }}
                />
              </div>
              <h2 style={{ 
                fontSize: "1.2rem", 
                fontWeight: 700, 
                color: "#1a2634", 
                letterSpacing: "0.5px",
                textTransform: "uppercase"
              }}>
                Área Privada
              </h2>
              <p style={{ color: '#718096', fontSize: '0.9rem', margin: 0 }}>
                Ingresa tu PIN de 4 dígitos
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Input del PIN */}
              <div className="mb-4">
                <label className="form-label fw-semibold text-secondary small text-uppercase" style={{ letterSpacing: "0.5px" }}>
                  PIN de Acceso
                </label>

                <div className="position-relative">
                  <input
                    type="password"
                    className={`form-control text-center py-3 fs-1 fw-bold ${errorMsg ? "is-invalid" : ""}`}
                    placeholder="• • • •"
                    value={pin}
                    onChange={(e) =>
                      setPin(e.target.value.replace(/\D/g, "").slice(0, 4))
                    }
                    maxLength={4}
                    autoFocus
                    style={{
                      letterSpacing: "1.8rem",
                      paddingLeft: "2rem",
                      borderRadius: "16px",
                      border: "2px solid rgba(103, 196, 106, 0.2)",
                      background: "rgba(255, 255, 255, 0.95)",
                      boxShadow: "inset 0 2px 8px rgba(0,0,0,0.04)",
                      transition: "all 0.3s ease"
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = "#67c46a";
                      e.currentTarget.style.boxShadow = "0 0 0 4px rgba(103, 196, 106, 0.1), inset 0 2px 8px rgba(0,0,0,0.04)";
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = "rgba(103, 196, 106, 0.2)";
                      e.currentTarget.style.boxShadow = "inset 0 2px 8px rgba(0,0,0,0.04)";
                    }}
                  />
                  
                  {/* Indicador de dígitos */}
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        style={{
                          width: "10px",
                          height: "10px",
                          borderRadius: "50%",
                          background: pin.length >= i ? "#67c46a" : "#dee2e6",
                          transition: "all 0.3s ease",
                          transform: pin.length >= i ? "scale(1.2)" : "scale(1)"
                        }}
                      />
                    ))}
                  </div>

                  {errorMsg && (
                    <div className="invalid-feedback d-block mt-2 text-center fw-semibold" style={{ color: '#fc8181' }}>
                      ⚠️ {errorMsg}
                    </div>
                  )}
                </div>
              </div>

              {/* Checkbox & Link */}
              <div className="d-flex justify-content-between align-items-center mb-4 small">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="rememberMe"
                    style={{ cursor: "pointer", borderColor: "rgba(103, 196, 106, 0.3)" }}
                  />
                  <label className="form-check-label text-secondary fw-medium" htmlFor="rememberMe" style={{ cursor: "pointer" }}>
                    Recordarme
                  </label>
                </div>
                <a href="#ayuda" className="text-decoration-none fw-semibold" style={{ color: "#0077b6" }}>
                  ¿Olvidaste tu PIN?
                </a>
              </div>

              {/* Botón */}
              <button
                type="submit"
                className="btn w-100 py-3 fw-bold text-uppercase"
                disabled={pin.length !== 4 || isLoading}
                style={{
                  borderRadius: "16px",
                  background: pin.length === 4 && !isLoading 
                    ? "linear-gradient(135deg, #67c46a, #4CAF50)" 
                    : "#cbd5e0",
                  border: "none",
                  color: pin.length === 4 && !isLoading ? "white" : "#a0aec0",
                  boxShadow: pin.length === 4 && !isLoading 
                    ? "0 8px 24px rgba(103, 196, 106, 0.35)" 
                    : "none",
                  transition: "all 0.3s ease",
                  letterSpacing: "0.5px",
                  cursor: pin.length === 4 && !isLoading ? "pointer" : "not-allowed",
                  opacity: pin.length === 4 ? 1 : 0.7
                }}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.disabled) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow = "0 12px 32px rgba(103, 196, 106, 0.45)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 8px 24px rgba(103, 196, 106, 0.35)";
                }}
              >
                {isLoading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Verificando...
                  </>
                ) : (
                  "Iniciar Sesión"
                )}
              </button>

              {/* Footer */}
              <div className="text-center mt-4 pt-3 border-top" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                <p className="small text-muted mb-0">
                  ¿Eres nuevo? <a href="#registro" className="text-decoration-none fw-semibold" style={{ color: "#67c46a" }}>
                    Solicita tu acceso
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
);

}

export { Login };
