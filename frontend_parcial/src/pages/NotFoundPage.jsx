import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-73px)] w-full max-w-4xl items-center justify-center px-6 py-16">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-rose-500">
          404
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
          Pagina no encontrada
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          La ruta que intentaste abrir no existe o todavia no fue creada.
        </p>
        <Link
          to="/"
          className="btn-base btn-dark mt-8"
        >
          Volver al inicio
        </Link>
      </div>
    </section>
  );
}

export default NotFoundPage;
