import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { routeDictionary } from "../data/routeDictionary.js";
import { apiStatusService } from "../services/apiStatusService.js";

function HomePage() {
  const accessCards = routeDictionary.filter((route) => route.showInCards);
  const featuredRoute = routeDictionary.find((route) => route.key === "inicio");
  const [apiStatus, setApiStatus] = useState({
    loading: true,
    message: "Comprobando disponibilidad de la API...",
    ok: false,
  });

  useEffect(() => {
    const loadApiStatus = async () => {
      try {
        const response = await apiStatusService.getStatus();
        setApiStatus({
          loading: false,
          message: response.message ?? "API disponible",
          ok: true,
        });
      } catch (error) {
        setApiStatus({
          loading: false,
          message:
            error.message ??
            "No fue posible conectarse con la API en este momento.",
          ok: false,
        });
      }
    };

    loadApiStatus();
  }, []);

  return (
    <section className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-10 lg:py-14">
      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <article className="page-glow relative overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)]">
          <div className={`absolute inset-0 opacity-95 ${featuredRoute.heroGlowClass}`} />
          <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />

          <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_260px] lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.32em] text-sky-300">
                Plataforma deportiva
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">
                Gestiona equipos, encuentros y grupos desde un solo lugar
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-slate-300 md:text-lg">
                Navega por una interfaz visual en español, con accesos directos,
                tarjetas interactivas e indicadores listos para seguir creciendo
                con tu proyecto.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {accessCards.map((card) => (
                  <Link
                    key={card.path}
                    to={card.path}
                    className="btn-base border border-white/15 bg-white/10 text-sm font-medium text-white hover:border-white/35 hover:bg-white/18"
                  >
                    {card.label}
                  </Link>
                ))}
              </div>

              <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-4 py-3 text-sm text-slate-200">
                <span
                  className={[
                    "h-2.5 w-2.5 rounded-full",
                    apiStatus.loading
                      ? "bg-amber-300"
                      : apiStatus.ok
                        ? "bg-emerald-300"
                        : "bg-rose-300",
                  ].join(" ")}
                />
                <span>{apiStatus.message}</span>
              </div>
            </div>

            <div className="card-image-mask relative mx-auto flex h-64 w-full max-w-[260px] items-center justify-center overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 backdrop-blur-sm">
              <div className="absolute inset-6 rounded-full bg-sky-300/30 blur-3xl" />
              <img
                src={featuredRoute.image}
                alt={featuredRoute.imageAlt}
                className="relative w-52 object-contain drop-shadow-[0_20px_40px_rgba(15,23,42,0.35)]"
              />
            </div>
          </div>
        </article>

        <aside className="grid gap-4 rounded-[2rem] border border-white/60 bg-white/65 p-5 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.45)] backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Vista general
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
              Modulos disponibles
            </h2>
          </div>

          <div className="space-y-3">
            {accessCards.map((card) => (
              <Link
                key={card.path}
                to={card.path}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white/80 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-white hover:shadow-lg"
              >
                <div className={`absolute inset-0 opacity-80 ${card.menuGlowClass}`} />
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/70 bg-white/75">
                  <div className={`absolute inset-2 rounded-full blur-xl ${card.imageBlurClass}`} />
                  <img src={card.image} alt={card.imageAlt} className="relative h-11 w-11 object-contain" />
                </div>
                <div className="relative min-w-0">
                  <p className="text-base font-semibold text-slate-950">{card.label}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">{card.menuDescription}</p>
                </div>
              </Link>
            ))}
          </div>
        </aside>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {accessCards.map((card) => (
          <Link
            key={card.path}
            to={card.path}
            className="group relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.5)] backdrop-blur-xl transition duration-300 hover:-translate-y-1.5 hover:border-white hover:shadow-[0_30px_70px_-35px_rgba(15,23,42,0.65)]"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-90 ${card.cardGlowClass}`} />
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-white/45 blur-3xl transition duration-300 group-hover:scale-125" />

            <div className="relative flex h-full flex-col">
              <div className="card-image-mask relative flex h-48 items-center justify-center overflow-hidden rounded-[1.6rem] border border-white/70 bg-slate-950/85">
                <div className={`absolute inset-5 rounded-full blur-3xl ${card.imageBlurClass}`} />
                <img
                  src={card.image}
                  alt={card.imageAlt}
                  className="relative h-36 w-36 object-contain transition duration-300 group-hover:scale-110 group-hover:rotate-2"
                />
              </div>

              <div className="mt-6 flex flex-1 flex-col">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">
                  Acceso directo
                </p>
                <h2 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">
                  {card.label}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-700">{card.description}</p>
                <span className="mt-6 inline-flex items-center text-sm font-semibold text-slate-950 transition group-hover:translate-x-1">
                  Explorar modulo
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default HomePage;
