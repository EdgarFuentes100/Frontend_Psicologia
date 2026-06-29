const SubModal = ({
  show,
  handleClose,
  handleContinue, 
  children,
  titulo,
  size = "auto",
  width,
  continueText = "Continuar",
  cancelText = "Cerrar",
  continueVariant = "primary",
  showCloseButton = true,
  backdrop = true,
  scrollable = false
}) => {
  // Ajusta margen superior según topbar móvil
  const topbarHeight = 60; // aprox altura del topbar en px
  const verticalOffset = window.innerWidth < 992 ? topbarHeight + 20 : 0; // si es móvil, margen + topbar

  const sizeClass = size === "auto" ? "" : `modal-${size}`;
  const scrollableClass = scrollable ? "modal-dialog-scrollable" : "";

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget && backdrop) {
      handleClose();
    }
  };

  return (
    <div
      className={`modal ${show ? "d-block" : "d-none"} ${backdrop ? "" : "modal-no-backdrop"}`}
      tabIndex="-1"
      role="dialog"
      onClick={handleBackdropClick}
      style={{ backgroundColor: backdrop ? "rgba(0,0,0,0.5)" : "transparent" }}
    >
      <div
        className={`modal-dialog ${scrollableClass} ${sizeClass}`} // No modal-dialog-centered
        style={{
          maxWidth: width || (size === "auto" ? "90%" : undefined),
          margin: "1rem auto",
          marginTop: `${verticalOffset}px`, // espacio desde topbar en móvil
          transition: "transform 0.3s ease-out, opacity 0.3s ease-out"
        }}
        role="document"
      >
        <div className="modal-content shadow-lg" style={{ borderRadius: "0.5rem" }}>
          <div className="modal-header border-bottom-0 pb-0">
            <h1 className="modal-title fs-5">{titulo}</h1>
            {showCloseButton && (
              <button type="button" className="btn-close" onClick={handleClose} aria-label="Close" />
            )}
          </div>

          <div className="modal-body py-3">{children}</div>

          <div className="modal-footer border-top-0 pt-0">
            <button type="button" className="btn btn-outline-secondary" onClick={handleClose}>
              {cancelText}
            </button>
            <button type="button" className={`btn btn-${continueVariant}`} onClick={handleContinue}>
              {continueText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubModal;
