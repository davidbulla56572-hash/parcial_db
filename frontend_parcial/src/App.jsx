import { NavLink, Outlet } from "react-router-dom";
import { routeDictionary } from "./data/routeDictionary.js";

function App() {
  const navigationItems = routeDictionary.filter((route) => route.showInNavigation);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_100%)] text-slate-900">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.85),_transparent_70%)] blur-3xl" />

      <header className="sticky top-0 z-30 border-b border-white/40 bg-white/45 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-6 py-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-md">
            <NavLink to="/" className="inline-flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-lg font-semibold text-white shadow-lg shadow-sky-200/60">
                FM
              </span>
              <span>
                <span className="block text-lg font-semibold tracking-tight text-slate-950">
                  Futbol Manager
                </span>
                <span className="block text-sm text-slate-500">
                  Panel visual del campeonato
                </span>
              </span>
            </NavLink>
          </div>

          <nav className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {navigationItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  [
                    "nav-card group relative overflow-hidden rounded-[1.75rem] border px-4 py-4 transition duration-300",
                    isActive
                      ? "border-white/80 bg-white text-slate-950 shadow-[0_16px_40px_-20px_rgba(15,23,42,0.45)]"
                      : "border-white/55 bg-white/55 text-slate-700 hover:-translate-y-0.5 hover:border-white hover:bg-white/85 hover:text-slate-950 hover:shadow-[0_16px_40px_-20px_rgba(15,23,42,0.35)]",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    <div
                      className={`pointer-events-none absolute inset-0 opacity-90 transition duration-300 ${item.menuGlowClass} ${
                        isActive ? "scale-100" : "scale-[1.03] group-hover:scale-100"
                      }`}
                    />
                    <div className="relative flex items-center gap-4">
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/60 bg-white/70 shadow-inner">
                        <div
                          className={`absolute inset-1 rounded-[1rem] opacity-80 blur-lg ${item.imageBlurClass}`}
                        />
                        <img
                          src={item.image}
                          alt={item.imageAlt}
                          className="relative h-11 w-11 object-contain drop-shadow-[0_10px_20px_rgba(15,23,42,0.18)] transition duration-300 group-hover:scale-110"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold tracking-tight">{item.label}</p>
                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                          {item.menuDescription}
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>
    </div>
  );
}

export default App;
