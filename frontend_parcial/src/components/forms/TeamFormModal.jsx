import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import AppModal from "../AppModal.jsx";
import { GROUP_OPTIONS } from "../../data/groupOptions.js";

const teamSchema = Yup.object({
  nombre: Yup.string().trim().required("El nombre es obligatorio."),
  pais: Yup.string().trim().required("El pais es obligatorio."),
  grupo: Yup.string().oneOf(GROUP_OPTIONS).required("El grupo es obligatorio."),
  activo: Yup.boolean().required(),
});

function TeamFormModal({ isOpen, onRequestClose, onSubmit, initialValues, mode }) {
  const isEditMode = mode === "edit";

  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title={isEditMode ? "Editar equipo" : "Registrar equipo"}
      description="La UI ya esta preparada para conectarse con endpoints de creacion y actualizacion."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={teamSchema}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          await onSubmit({
            ...values,
            activo: values.activo === true || values.activo === "true",
          });
          helpers.setSubmitting(false);
        }}
      >
        {({ errors, touched, isSubmitting }) => (
          <Form className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Nombre</span>
              <Field
                name="nombre"
                type="text"
                className="modal-field"
              />
              {touched.nombre && errors.nombre ? (
                <span className="text-sm text-rose-600">{errors.nombre}</span>
              ) : null}
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-semibold text-slate-700">Pais</span>
              <Field
                name="pais"
                type="text"
                className="modal-field"
              />
              {touched.pais && errors.pais ? (
                <span className="text-sm text-rose-600">{errors.pais}</span>
              ) : null}
            </label>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Grupo</span>
                <Field
                  as="select"
                  name="grupo"
                  className="modal-field"
                >
                  <option value="">Selecciona un grupo</option>
                  {GROUP_OPTIONS.map((group) => (
                    <option key={group} value={group}>
                      Grupo {group}
                    </option>
                  ))}
                </Field>
                {touched.grupo && errors.grupo ? (
                  <span className="text-sm text-rose-600">{errors.grupo}</span>
                ) : null}
              </label>

              <label className="grid gap-2">
                <span className="text-sm font-semibold text-slate-700">Estado</span>
                <Field
                  as="select"
                  name="activo"
                  className="modal-field"
                >
                  <option value="true">Activo</option>
                  <option value="false">Inactivo</option>
                </Field>
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
                {isEditMode ? "Guardar cambios" : "Registrar equipo"}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </AppModal>
  );
}

export default TeamFormModal;
