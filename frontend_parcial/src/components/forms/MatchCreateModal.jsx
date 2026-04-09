import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import AppModal from "../AppModal.jsx";
import {
  getAvailableOpponentOptions,
  getGroupLabel,
  getTeamById,
} from "../../utils/tournament.js";

const matchSchema = Yup.object({
  idLocal: Yup.number().required("Selecciona el equipo local."),
  idVisitante: Yup.number()
    .required("Selecciona el equipo visitante.")
    .test(
      "different-teams",
      "El equipo visitante debe ser diferente al local.",
      (value, context) => Number(value) !== Number(context.parent.idLocal),
    ),
  golesLocal: Yup.number().min(0).required("Ingresa los goles del local."),
  golesVisitante: Yup.number().min(0).required("Ingresa los goles del visitante."),
});

function MatchCreateModal({ isOpen, onRequestClose, onSubmit, teams, initialValues }) {
  return (
    <AppModal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      title="Crear encuentro"
      description="Solo puedes programar partidos entre equipos del mismo grupo."
    >
      <Formik
        initialValues={initialValues}
        validationSchema={matchSchema}
        enableReinitialize
        onSubmit={async (values, helpers) => {
          const localTeam = getTeamById(teams, values.idLocal);

          await onSubmit({
            idLocal: Number(values.idLocal),
            idVisitante: Number(values.idVisitante),
            golesLocal: Number(values.golesLocal),
            golesVisitante: Number(values.golesVisitante),
            grupo: localTeam?.grupo ?? "",
          });
          helpers.setSubmitting(false);
        }}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => {
          const localTeam = getTeamById(teams, values.idLocal);
          const inferredGroup = localTeam?.grupo ?? "";
          const visitorOptions = getAvailableOpponentOptions(
            teams,
            inferredGroup,
            values.idLocal,
          );
          const localOptions = teams.filter((team) => team.activo);

          return (
            <Form className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Equipo local</span>
                  <Field
                    as="select"
                    name="idLocal"
                    className="modal-field"
                    onChange={(event) => {
                      setFieldValue("idLocal", event.target.value);
                      setFieldValue("idVisitante", "");
                    }}
                  >
                    <option value="">Selecciona un equipo</option>
                    {localOptions.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.nombre} · {getGroupLabel(team.grupo)}
                      </option>
                    ))}
                  </Field>
                  {touched.idLocal && errors.idLocal ? (
                    <span className="text-sm text-rose-600">{errors.idLocal}</span>
                  ) : null}
                </label>

                <label className="grid gap-2">
                  <span className="text-sm font-semibold text-slate-700">Equipo visitante</span>
                  <Field
                    as="select"
                    name="idVisitante"
                    className="modal-field"
                  >
                    <option value="">Selecciona un equipo</option>
                    {visitorOptions.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.nombre}
                      </option>
                    ))}
                  </Field>
                  {touched.idVisitante && errors.idVisitante ? (
                    <span className="text-sm text-rose-600">{errors.idVisitante}</span>
                  ) : null}
                </label>
              </div>

              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">
                  Grupo inferido
                </p>
                <p className="mt-2 text-base font-semibold text-slate-900">
                  {inferredGroup
                    ? getGroupLabel(inferredGroup)
                    : "Selecciona primero el equipo local"}
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-500">
                  El equipo visitante solo puede pertenecer al mismo grupo del
                  equipo local seleccionado.
                </p>
              </div>

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
                  Crear encuentro
                </button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </AppModal>
  );
}

export default MatchCreateModal;
