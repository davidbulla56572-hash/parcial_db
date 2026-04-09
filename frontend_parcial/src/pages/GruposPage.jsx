import { useEffect, useMemo, useState } from "react";
import SectionHero from "../components/SectionHero.jsx";
import { routeDictionary } from "../data/routeDictionary.js";
import { matchService } from "../services/matchService.js";
import { teamService } from "../services/teamService.js";
import {
  calculateGroupStandings,
  findRouteByKey,
  getGroupLabel,
} from "../utils/tournament.js";

function GruposPage() {
  const routeInfo = findRouteByKey(routeDictionary, "grupos");
  const [teams, setTeams] = useState([]);
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [teamsData, matchesData] = await Promise.all([
          teamService.list(),
          matchService.list(),
        ]);

        setTeams(teamsData.filter((team) => team.activo));
        setMatches(matchesData);
      } catch (error) {
        setErrorMessage(
          error.message ?? "No fue posible construir la vista de grupos.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const groupsData = useMemo(
    () => calculateGroupStandings(teams, matches),
    [teams, matches],
  );

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <SectionHero
          routeInfo={routeInfo}
          eyebrow="Fase de grupos"
          title="Grupos calculados desde equipos y encuentros"
          description="Esta vista ya no depende de una entidad adicional. Se construye con `GET /teams` y `GET /encuentro`, filtrando equipos activos y calculando el lider en frontend."
        />

        <article className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Distribucion actual
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                Zonas competitivas
              </h2>
            </div>
            <span className="inline-flex w-fit rounded-full bg-fuchsia-100 px-4 py-2 text-sm font-semibold text-fuchsia-700">
              {groupsData.length} grupos activos
            </span>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {isLoading ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                Cargando grupos desde la API...
              </div>
            ) : null}

            {!isLoading && groupsData.length === 0 ? (
              <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 px-5 py-6 text-sm text-slate-500">
                No hay suficientes datos activos para construir la fase de grupos.
              </div>
            ) : null}

            {groupsData.map((groupData) => (
              <article
                key={groupData.group}
                className="relative overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/85 p-5 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="absolute inset-x-0 top-0 h-28 bg-[radial-gradient(circle_at_top,_rgba(217,70,239,0.16),_transparent_55%)]" />
                <div className="relative">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-2xl font-semibold text-slate-950">
                      {getGroupLabel(groupData.group)}
                    </h3>
                    <span className="rounded-full bg-fuchsia-100 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-700">
                      Lider: {groupData.leader?.nombre ?? "Pendiente"}
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    {groupData.standings.map((team, index) => (
                      <div
                        key={team.id}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                              Posicion {index + 1}
                            </p>
                            <p className="mt-1 text-base font-semibold text-slate-900">
                              {team.nombre}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">{team.pais}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-2 text-right text-xs font-semibold text-slate-500">
                            <span>PTS: {team.puntos}</span>
                            <span>PJ: {team.jugados}</span>
                            <span>GF: {team.golesFavor}</span>
                            <span>GC: {team.golesContra}</span>
                            <span className="col-span-2">DG: {team.diferenciaGol}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default GruposPage;
