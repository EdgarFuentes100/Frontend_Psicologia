import { NavLink, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import CitasWiew from "../pages/Citas/CitasView";
import { useState } from "react";
import HorarioView from "./Horario/HorarioView";

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);

  const menuItems = [
    { path: "CitasView", label: "Citas", roles: ["Doctor", "Administrador"], icon: "bi-people-fill" },
    { path: "HorarioView", label: "Horarios", roles: ["Doctor", "Administrador"], icon: "bi-people-fill" },
  ];

  const allowedMenu = menuItems.filter(item => item.roles.includes(user.rol));
  const currentLabel = allowedMenu.find(m => location.pathname.includes(m.path))?.label || "Dashboard";

  return (
    <div className="d-flex vh-100 overflow-hidden">
      
      {/* Sidebar Desktop: Oculto en móvil, fijo en desktop */}
      <aside className="d-none d-md-flex flex-column bg-dark text-white p-3 flex-shrink-0" style={{ width: "260px" }}>
        <h4 className="text-white mb-4"><i className="bi bi-heart-pulse-fill me-2"></i>Clínica Salud</h4>
        
        {/* Sección Usuario recuperada */}
        <div className="mb-4 d-flex align-items-center">
          <div className="rounded-circle bg-primary d-flex justify-content-center align-items-center text-white" style={{ width: "40px", height: "40px" }}>
            {user.nombre.charAt(0)}
          </div>
          <div className="ms-2">
            <strong>{user.nombre}</strong><br />
            <small className="text-white-50">{user.rol}</small>
          </div>
        </div>

        <nav className="flex-grow-1">
          <ul className="nav nav-pills flex-column">
            {allowedMenu.map(item => (
              <li className="nav-item" key={item.path}>
                <NavLink to={`/dashboard/${item.path}`} className={({ isActive }) => `nav-link ${isActive ? "active" : "text-white"}`}>
                  <i className={`bi ${item.icon} me-2`}></i>{item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button className="btn btn-outline-light w-100 mt-auto" onClick={logout}>
          <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
        </button>
      </aside>

      {/* Main Content */}
      <main className="d-flex flex-column flex-grow-1 bg-light overflow-hidden">
        <header className="d-md-none navbar navbar-dark bg-dark p-3">
          <button className="btn btn-dark" onClick={() => setShowSidebar(true)}>
            <i className="bi bi-list fs-3"></i>
          </button>
          <span className="text-white fw-bold">{currentLabel}</span>
        </header>

        <div className="flex-grow-1 overflow-auto p-3 p-md-4">
          <Routes>
            <Route path="/" element={<Navigate to={allowedMenu[0]?.path || "/dashboard"} />} />
            {allowedMenu.some(m => m.path === "CitasView") && <Route path="CitasView" element={<CitasWiew />} />}
            {allowedMenu.some(m => m.path === "HorarioView") && <Route path="HorarioView" element={<HorarioView />} />}
          </Routes>
        </div>
      </main>

      {/* Offcanvas Mobile: Incluye también la info del usuario */}
      <div className={`offcanvas offcanvas-start ${showSidebar ? "show" : ""}`} style={{ display: showSidebar ? "block" : "none", visibility: showSidebar ? "visible" : "hidden" }}>
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title">Menú</h5>
          <button type="button" className="btn-close" onClick={() => setShowSidebar(false)}></button>
        </div>
        <div className="offcanvas-body d-flex flex-column">
          {/* Info usuario en el móvil */}
          <div className="mb-4 p-2 border rounded bg-light">
             <strong>{user.nombre}</strong><br />
             <small>{user.rol}</small>
          </div>
          <ul className="nav nav-pills flex-column mb-auto">
            {allowedMenu.map(item => (
              <li key={item.path} className="nav-item">
                <NavLink to={`/dashboard/${item.path}`} className="nav-link" onClick={() => setShowSidebar(false)}>
                  <i className={`bi ${item.icon} me-2`}></i>{item.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <button className="btn btn-outline-danger w-100" onClick={logout}>
             <i className="bi bi-box-arrow-right me-2"></i> Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;