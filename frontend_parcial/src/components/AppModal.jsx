import Modal from "react-modal";

function AppModal({ isOpen, onRequestClose, title, description, children }) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      overlayClassName="fixed inset-0 z-50 bg-slate-950/55 backdrop-blur-sm px-4 py-8"
      className="mx-auto w-full max-w-2xl rounded-[2rem] border border-white/55 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(245,248,255,0.92))] p-6 shadow-[0_35px_120px_-35px_rgba(15,23,42,0.6)] outline-none"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
            Gestion
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            {title}
          </h2>
          {description ? (
            <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={onRequestClose}
          className="btn-base btn-light min-h-10 px-4 text-sm font-medium"
        >
          Cerrar
        </button>
      </div>

      <div className="mt-6">{children}</div>
    </Modal>
  );
}

export default AppModal;
