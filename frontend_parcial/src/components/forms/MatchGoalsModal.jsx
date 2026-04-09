import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import AppModal from "../AppModal.jsx";

const matchGoalsSchema = Yup.object({
  golesLocal: Yup.number().min(0).required("Ingresa los goles del local."),
  golesVisitante: Yup.number().min(0).required("Ingresa los goles del visitante."),
});

function MatchGoalsModal({ isOpen, onRequestClose, onSubmit, initialValues, matchLabel }) {
  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Editar marcador"
      description={`Solo se pueden editar los goles del encuentro ${matchLabel}.`}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={matchGoalsSchema}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          await onSubmit({
            golesLocal: Number(values.golesLocal),
            golesVisitante: Number(values.golesVisitante),
          });
          helpers.setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Goles local</span>
                <Field
                  name="golesLocal"
                  type="number"
                  min="0"
                  className="modal-field"
                />
                {touched.golesLocal && errors.golesLocal ? (
                  <span className="text-sm text-rose-600">{errors.golesLocal}</span>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Goles visitante</span>
                <Field
                  name="golesVisitante"
                  type="number"
                  min="0"
                  className="modal-field"
                />
                {touched.golesVisitante && errors.golesVisitante ? (
                  <span className="text-sm text-rose-600">{errors.golesVisitante}</span>
                ) : null}
              </label>
            </div>

            <div className="flex flex-wrap justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onRequestClose}
                className="btn-base btn-light"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-base btn-dark"
              >
                Guardar marcador
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
}

export default MatchGoalsModal;
