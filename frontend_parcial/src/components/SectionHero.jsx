function SectionHero({ routeInfo, eyebrow, title, description }) {
  return (
    <article className="page-glow relative h-full overflow-hidden rounded-[2rem] border border-white/60 bg-slate-950 px-8 py-9 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.65)]">
      <div className={`absolute inset-0 ${routeInfo.heroGlowClass}`} />
      <div className="relative z-10 flex h-full flex-col justify-between gap-8">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/75">
            {eyebrow}
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">{description}</p>
        </div>

        <div className="card-image-mask relative flex min-h-60 items-center justify-center overflow-hidden rounded-[1.8rem] border border-white/15 bg-white/10">
          <div className={`absolute inset-10 rounded-full blur-3xl ${routeInfo.imageBlurClass}`} />
          <img src={routeInfo.image} alt={routeInfo.imageAlt} className="relative w-56 object-contain" />
        </div>
      </div>
    </article>
  );
}

export default SectionHero;
