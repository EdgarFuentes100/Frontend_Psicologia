export const ModalNotificacion = ({ show, onClose, mensaje, tipo }) => {
    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-body text-center p-4">
                        <i className={`bi ${tipo === 'exito' ? 'bi-check-circle-fill text-success' : 'bi-x-circle-fill text-danger'}`} style={{ fontSize: '3rem' }}></i>
                        <h5 className="mt-3">{tipo === 'exito' ? '¡Éxito!' : 'Oops...'}</h5>
                        <p>{mensaje}</p>
                        <button className="btn btn-primary w-100" onClick={onClose}>Aceptar</button>
                    </div>
                </div>
            </div>
        </div>
    );
};