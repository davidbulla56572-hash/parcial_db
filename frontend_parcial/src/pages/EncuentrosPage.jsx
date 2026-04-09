import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GroupFilter from "../components/GroupFilter.jsx";
import SectionHero from "../components/SectionHero.jsx";
import MatchCreateModal from "../components/forms/MatchCreateModal.jsx";
import MatchGoalsModal from "../components/forms/MatchGoalsModal.jsx";
import { ALL_GROUPS_VALUE, GROUP_OPTIONS } from "../data/groupOptions.js";
import { routeDictionary } from "../data/routeDictionary.js";
import { matchService } from "../services/matchService.js";
import { teamService } from "../services/teamService.js";
import {
  enrichMatchesWithTeams,
  filterByGroup,
  findRouteByKey,
  getGroupLabel,
} from "../utils/tournament.js";

const createMatchInitialValues = {
  idLocal: "",
  idVisitante: "",
  golesLocal: 0,
  golesVisitante: 0,
};

function EncuentrosPage() {
  const routeInfo = findRouteByKey(routeDictionary, "encuentros");
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedGroup, setSelectedGroup] = useState(ALL_GROUPS_VALUE);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [teamsData, matchesData] = await Promise.all([
          teamService.list(),
          matchService.list(),
        ]);

        setTeams(teamsData);
        setMatches(matchesData);
      } catch (error) {
        setErrorMessage(
          error.message ?? "No fue posible cargar los encuentros desde la API.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

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

  const hydratedMatches = useMemo(
    () => enrichMatchesWithTeams(matches, teams),
    [matches, teams],
  );

  const filteredMatches = useMemo(
    () => filterByGroup(hydratedMatches, selectedGroup),
    [hydratedMatches, selectedGroup],
  );

  const handleCreateMatch = async (values) => {
    try {
      const newMatch = await matchService.create(values);
      setMatches((currentMatches) => [...currentMatches, newMatch]);
      setIsCreateModalOpen(false);
    } catch (error) {
      setErrorMessage(error.message ?? "No fue posible crear el encuentro.");
    }
  };

  const handleUpdateMatch = async (values) => {
    if (!editingMatch) {
      return;
    }

    try {
      const updatedMatch = await matchService.updateGoals(editingMatch.id, values);
      setMatches((currentMatches) =>
        currentMatches.map((match) => (match.id === updatedMatch.id ? updatedMatch : match)),
      );
      setEditingMatch(null);
    } catch (error) {
      setErrorMessage(error.message ?? "No fue posible actualizar el marcador.");
    }
  };

  const editInitialValues = editingMatch
    ? {
        golesLocal: editingMatch.golesLocal,
        golesVisitante: editingMatch.golesVisitante,
      }
    : {
        golesLocal: 0,
        golesVisitante: 0,
      };

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <article className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-500">
                Agenda del torneo
              </p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950">
                {routeInfo.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Cada encuentro muestra su grupo y desde aqui puedes prepararlo
                a partir del equipo local seleccionado, editar el marcador y
                entrar al detalle.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-base btn-dark"
            >
              Crear encuentro
            </button>
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

          <div className="mt-8 grid gap-4">
            {isLoading ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                Cargando encuentros desde la API...
              </div>
            ) : null}

            {!isLoading && filteredMatches.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                No hay encuentros disponibles para el filtro seleccionado.
              </div>
            ) : null}

            {filteredMatches.map((match) => (
              <article
                key={match.id}
                className="group relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-5 text-white transition hover:-translate-y-0.5 hover:shadow-xl"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.32),_transparent_40%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_45%)]" />
                <div className="relative flex flex-col gap-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] text-orange-200">
                      {getGroupLabel(match.grupo)}
                    </span>
                    <span className="rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-medium text-slate-100">
                      ID #{match.id}
                    </span>
                  </div>

                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-2xl font-semibold">
                        {match.nombreLocal} vs {match.nombreVisitante}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-slate-300">
                        Marcador actual preparado para sincronizarse con el backend.
                      </p>
                    </div>

                    <div className="rounded-[1.4rem] border border-white/15 bg-white/10 px-6 py-4 text-center">
                      <p className="text-sm uppercase tracking-[0.26em] text-slate-300">
                        Resultado
                      </p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">
                        {match.golesLocal} - {match.golesVisitante}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setEditingMatch(match)}
                      className="btn-base btn-glass min-h-10 px-4"
                    >
                      Editar goles
                    </button>
                    <Link
                      to={`/encuentro/${match.id}`}
                      className="btn-base btn-glass min-h-10 px-4"
                    >
                      Ver detalle
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <SectionHero
          routeInfo={routeInfo}
          eyebrow="Vista destacada"
          title="Sigue la programacion y el ganador de cada cruce"
          description="El detalle del encuentro ya usa una ruta dedicada y queda listo para consultar endpoints de resultado y ganador."
        />
      </div>

      <MatchCreateModal
        isOpen={isCreateModalOpen}
        onRequestClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateMatch}
        teams={teams}
        initialValues={createMatchInitialValues}
      />

      <MatchGoalsModal
        isOpen={Boolean(editingMatch)}
        onRequestClose={() => setEditingMatch(null)}
        onSubmit={handleUpdateMatch}
        initialValues={editInitialValues}
        matchLabel={
          editingMatch
            ? `${editingMatch.nombreLocal} vs ${editingMatch.nombreVisitante}`
            : ""
        }
      />
    </section>
  );
}

export default EncuentrosPage;
