import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeDictionary } from "../data/routeDictionary.js";
import { matchService } from "../services/matchService.js";
import { teamService } from "../services/teamService.js";
import { enrichMatchesWithTeams, findRouteByKey, getGroupLabel } from "../utils/tournament.js";
import SectionHero from "../components/SectionHero.jsx";

function EncuentroDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const [teams, currentMatch, currentOutcome] = await Promise.all([
          teamService.list(),
          matchService.getById(Number(id)),
          matchService.getOutcome(Number(id)),
        ]);

        if (!currentMatch) {
          setMatch(null);
          setOutcome(null);
          setIsLoading(false);
          return;
        }

        const [enrichedMatch] = enrichMatchesWithTeams([currentMatch], teams);
        setMatch(enrichedMatch);
        setOutcome(currentOutcome);
      } catch (error) {
        setErrorMessage(
          error.message ?? "No fue posible cargar el detalle del encuentro.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const routeInfo = findRouteByKey(routeDictionary, "encuentros");

  if (isLoading) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 text-slate-600 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          Cargando detalle del encuentro...
        </div>
      </section>
    );
  }

  if (!match) {
    return (
      <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Encuentro no encontrado
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            El identificador solicitado no existe en la fuente actual de datos.
          </p>
          <Link
            to="/encuentros"
            className="btn-base btn-dark mt-6"
          >
            Volver a encuentros
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10 lg:py-14">
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <SectionHero
          routeInfo={routeInfo}
          eyebrow="Detalle del encuentro"
          title={`${match.nombreLocal} vs ${match.nombreVisitante}`}
          description="Esta pantalla ya esta preparada para consultar un endpoint de detalle y otro de resultado del encuentro."
        />

        <article className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          {errorMessage ? (
            <div className="mb-6 rounded-[1.5rem] border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Resumen del partido
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Marcador y resultado
              </h2>
            </div>
            <span className="rounded-full bg-orange-100 px-4 py-2 text-sm font-semibold text-orange-700">
              {getGroupLabel(match.grupo)}
            </span>
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-slate-200/80 bg-slate-950 p-6 text-white">
            <div className="flex flex-col items-center justify-center gap-4 text-center md:flex-row md:justify-between md:text-left">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Local</p>
                <p className="mt-2 text-2xl font-semibold">{match.nombreLocal}</p>
              </div>
              <div className="rounded-[1.5rem] bg-white/10 px-6 py-4">
                <p className="text-4xl font-semibold tracking-tight">
                  {match.golesLocal} - {match.golesVisitante}
                </p>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Visitante</p>
                <p className="mt-2 text-2xl font-semibold">{match.nombreVisitante}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Ganador
              </p>
              <p className="mt-3 text-2xl font-semibold text-slate-950">
                {outcome?.ganador === "local"
                  ? match.nombreLocal
                  : outcome?.ganador === "visitante"
                    ? match.nombreVisitante
                    : outcome?.ganador ?? "Empate"}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {outcome?.detalle ?? "Sin informacion disponible."}
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-slate-200 bg-white/80 p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
                Resultado consultado
              </p>
              <p className="mt-3 text-base leading-7 text-slate-600">
                {outcome?.resultado ?? "Sin informacion disponible."}
              </p>
            </div>
          </div>

          <Link
            to="/encuentros"
            className="btn-base btn-light mt-6"
          >
            Volver al listado
          </Link>
        </article>
      </div>
    </section>
  );
}

export default EncuentroDetailPage;
