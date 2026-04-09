import AppModal from "./AppModal.jsx";

function ConfirmDialog({
  isOpen,
  onRequestClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirmar",
}) {
  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title={title}
      description={description}
    >
      <div className="flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onRequestClose}
          className="btn-base btn-light"
        >
          Cancelar
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="btn-base btn-danger"
        >
          {confirmLabel}
        </button>
      </div>
    </AppModal>
  );
}

export default ConfirmDialog;
