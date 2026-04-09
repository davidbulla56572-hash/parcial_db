import { useEffect, useMemo, useState } from "react";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import GroupFilter from "../components/GroupFilter.jsx";
import SectionHero from "../components/SectionHero.jsx";
import TeamFormModal from "../components/forms/TeamFormModal.jsx";
import { ALL_GROUPS_VALUE, GROUP_OPTIONS } from "../data/groupOptions.js";
import { routeDictionary } from "../data/routeDictionary.js";
import { teamService } from "../services/teamService.js";
import { filterByGroup, findRouteByKey, getGroupLabel } from "../utils/tournament.js";

const formInitialValues = {
  nombre: "",
  pais: "",
  grupo: "",
  activo: "true",
};

function EquiposPage() {
  const routeInfo = findRouteByKey(routeDictionary, "equipos");
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS_VALUE);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamPendingDeletion, setTeamPendingDeletion] = useState(null);

  useEffect(() => {
    const loadTeams = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const data =
          selectedGroup === ALL_GROUPS_VALUE
            ? await teamService.list()
            : await teamService.listByGroup(selectedGroup);
        setTeams(data);
      } catch (error) {
        setErrorMessage(
          error.message ?? "No fue posible cargar el listado de equipos.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadTeams();
  }, [selectedGroup]);

  const filterOptions = useMemo(
    () => [
      { value: ALL_GROUPS_VALUE, label: "Todos los grupos" },
      ...GROUP_OPTIONS.map((group) => ({
        value: group,
        label: getGroupLabel(group),
      })),
    ],
    [],
  );

  const filteredTeams = useMemo(
    () => filterByGroup(teams, selectedGroup).filter((team) => team.activo),
    [teams, selectedGroup],
  );

  const handleCreateTeam = async (values) => {
    try {
      await teamService.create(values);
      const refreshedTeams =
        selectedGroup === ALL_GROUPS_VALUE
          ? await teamService.list()
          : await teamService.listByGroup(selectedGroup);
      setTeams(refreshedTeams);
      setIsCreateModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message ?? "No fue posible registrar el equipo.");
    }
  };

  const handleUpdateTeam = async (values) => {
    if (!editingTeam) {
      return;
    }

    try {
      await teamService.update(editingTeam.id, values);
      const refreshedTeams =
        selectedGroup === ALL_GROUPS_VALUE
          ? await teamService.list()
          : await teamService.listByGroup(selectedGroup);
      setTeams(refreshedTeams);
      setEditingTeam(null);
    } catch (error) {
      setErrorMessage(error.message ?? "No fue posible actualizar el equipo.");
    }
  };

  const handleDeleteTeam = async () => {
    if (!teamPendingDeletion) {
      return;
    }

    try {
      await teamService.remove(teamPendingDeletion.id);
      const refreshedTeams =
        selectedGroup === ALL_GROUPS_VALUE
          ? await teamService.list()
          : await teamService.listByGroup(selectedGroup);
      setTeams(refreshedTeams);
      setTeamPendingDeletion(null);
    } catch (error) {
      setErrorMessage(error.message ?? "No fue posible desactivar el equipo.");
    }
  };

  const editingInitialValues = editingTeam
    ? {
        nombre: editingTeam.nombre,
        pais: editingTeam.pais,
        grupo: editingTeam.grupo,
        activo: String(editingTeam.activo),
      }
    : formInitialValues;

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
      <div className="grid gap-6 xl:items-start xl:grid-cols-[0.95fr_1.05fr]">
        <SectionHero
          routeInfo={routeInfo}
          eyebrow="Gestion de equipos"
          title={routeInfo.title}
          description="La vista ya esta preparada para listar, registrar, editar y eliminar equipos consumiendo endpoints mas adelante."
        />

        <article className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Registro actual
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Listado de equipos
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                {filteredTeams.length} equipos visibles
              </span>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-base btn-dark"
              >
                Registrar equipo
              </button>
            </div>
          </div>

          <div className="mt-6">
            <GroupFilter
              options={filterOptions}
              selectedValue={selectedGroup}
              onChange={setSelectedGroup}
            />
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4">
            {isLoading ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                Cargando equipos desde la API...
              </div>
            ) : null}

            {!isLoading && filteredTeams.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                No hay equipos disponibles para el filtro seleccionado.
              </div>
            ) : null}

            {filteredTeams.map((team) => (
              <article
                key={team.id}
                className="rounded-[1.6rem] border border-slate-200/80 bg-white/85 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-xl font-semibold text-slate-950">{team.nombre}</h3>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
                        {getGroupLabel(team.grupo)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500">{team.pais}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={[
                        "rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em]",
                        team.activo
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-slate-200 text-slate-600",
                      ].join(" ")}
                    >
                      {team.activo ? "Activo" : "Inactivo"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setEditingTeam(team)}
                      className="btn-base btn-light min-h-10 px-4"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => setTeamPendingDeletion(team)}
                      className="btn-base btn-soft-danger min-h-10 px-4"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>

      <TeamFormModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateTeam}
        initialValues={formInitialValues}
        mode="create"
      />

      <TeamFormModal
        isOpen={Boolean(editingTeam)}
        onRequestClose={() => setEditingTeam(null)}
        onSubmit={handleUpdateTeam}
        initialValues={editingInitialValues}
        mode="edit"
      />

      <ConfirmDialog
        isOpen={Boolean(teamPendingDeletion)}
        onRequestClose={() => setTeamPendingDeletion(null)}
        onConfirm={handleDeleteTeam}
        title="Desactivar equipo"
        description={`Esta accion marcara como inactivo a ${teamPendingDeletion?.nombre ?? "el equipo"} usando el endpoint DELETE configurado por la API.`}
        confirmLabel="Desactivar equipo"
      />
    </section>
  );
}

export default EquiposPage;
