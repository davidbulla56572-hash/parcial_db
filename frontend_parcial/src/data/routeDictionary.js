const createSvgDataUri = (svg) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(svg.replace(/\s+/g, " ").trim())}`;

const illustrations = {
  inicio: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="48" fill="#F8FAFC"/>
      <circle cx="70" cy="78" r="40" fill="#7DD3FC"/>
      <circle cx="170" cy="74" r="30" fill="#FDE68A"/>
      <rect x="42" y="118" width="156" height="76" rx="24" fill="#0F172A"/>
      <rect x="58" y="134" width="50" height="14" rx="7" fill="#38BDF8"/>
      <rect x="58" y="158" width="92" height="10" rx="5" fill="#CBD5E1"/>
      <rect x="156" y="134" width="26" height="26" rx="13" fill="#F97316"/>
    </svg>
  `),
  equipos: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="48" fill="#ECFDF5"/>
      <path d="M82 54h76l18 28-10 84-46 26-46-26-10-84 18-28Z" fill="#065F46"/>
      <path d="M120 54v138" stroke="#A7F3D0" stroke-width="12" stroke-linecap="round"/>
      <path d="M88 90h64" stroke="#A7F3D0" stroke-width="12" stroke-linecap="round"/>
      <circle cx="176" cy="66" r="22" fill="#34D399"/>
    </svg>
  `),
  encuentros: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="48" fill="#FFF7ED"/>
      <rect x="46" y="54" width="148" height="132" rx="24" fill="#7C2D12"/>
      <rect x="62" y="74" width="116" height="28" rx="14" fill="#FDBA74"/>
      <path d="M80 130h80" stroke="#FFEDD5" stroke-width="14" stroke-linecap="round"/>
      <path d="M80 158h52" stroke="#FED7AA" stroke-width="12" stroke-linecap="round"/>
      <circle cx="170" cy="158" r="18" fill="#F97316"/>
    </svg>
  `),
  grupos: createSvgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240" fill="none">
      <rect width="240" height="240" rx="48" fill="#FDF4FF"/>
      <circle cx="82" cy="82" r="28" fill="#C084FC"/>
      <circle cx="158" cy="82" r="28" fill="#F0ABFC"/>
      <rect x="54" y="126" width="58" height="52" rx="20" fill="#7E22CE"/>
      <rect x="128" y="126" width="58" height="52" rx="20" fill="#A21CAF"/>
      <path d="M120 98v54" stroke="#D8B4FE" stroke-width="10" stroke-linecap="round"/>
      <path d="M90 152h60" stroke="#E9D5FF" stroke-width="10" stroke-linecap="round"/>
    </svg>
  `),
};

export const routeDictionary = [
  {
    key: "inicio",
    label: "Inicio",
    title: "Centro de control del torneo",
    menuDescription: "Accesos rapidos y resumen visual del campeonato.",
    description:
      "Explora los modulos principales desde un panel visual con tarjetas y accesos directos.",
    path: "/",
    slug: "",
    end: true,
    index: true,
    type: "page",
    showInNavigation: true,
    showInCards: false,
    image: illustrations.inicio,
    imageAlt: "Ilustracion de panel general del torneo",
    menuGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.3),_transparent_52%),radial-gradient(circle_at_bottom_right,_rgba(14,165,233,0.18),_transparent_48%)]",
    imageBlurClass: "bg-sky-300/60",
    heroGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.32),_transparent_46%),radial-gradient(circle_at_bottom_right,_rgba(99,102,241,0.22),_transparent_48%)]",
    cardGlowClass:
      "from-sky-500/20 via-cyan-300/10 to-blue-500/20",
  },
  {
    key: "equipos",
    label: "Equipos",
    title: "Equipos del campeonato",
    menuDescription: "Plantillas, ciudades y estado operativo de cada club.",
    description:
      "Administra clubes, revisa estados y construye la base de participantes del torneo.",
    path: "/equipos",
    slug: "equipos",
    type: "page",
    showInNavigation: true,
    showInCards: true,
    image: illustrations.equipos,
    imageAlt: "Ilustracion de camiseta y escudo de equipo",
    menuGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.24),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(52,211,153,0.16),_transparent_44%)]",
    imageBlurClass: "bg-emerald-300/60",
    heroGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.3),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(34,197,94,0.18),_transparent_46%)]",
    cardGlowClass:
      "from-emerald-500/20 via-green-300/10 to-teal-500/20",
  },
  {
    key: "encuentros",
    label: "Encuentros",
    title: "Encuentros y resultados",
    menuDescription: "Cruces, marcadores y seguimiento de los partidos.",
    description:
      "Consulta los cruces del torneo y organiza cada marcador del campeonato.",
    path: "/encuentros",
    slug: "encuentros",
    type: "page",
    showInNavigation: true,
    showInCards: true,
    image: illustrations.encuentros,
    imageAlt: "Ilustracion de encuentros del torneo",
    menuGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.24),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.16),_transparent_44%)]",
    imageBlurClass: "bg-orange-300/60",
    heroGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.3),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(245,158,11,0.18),_transparent_46%)]",
    cardGlowClass:
      "from-orange-500/20 via-amber-300/10 to-yellow-500/20",
  },
  {
    key: "grupos",
    label: "Grupos",
    title: "Grupos de competencia",
    menuDescription: "Distribucion de equipos y organizacion de zonas.",
    description:
      "Revisa como se agrupan los clubes y prepara las fases del campeonato.",
    path: "/grupos",
    slug: "grupos",
    type: "page",
    showInNavigation: true,
    showInCards: true,
    image: illustrations.grupos,
    imageAlt: "Ilustracion de grupos y conexiones",
    menuGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(192,132,252,0.28),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.16),_transparent_44%)]",
    imageBlurClass: "bg-fuchsia-300/60",
    heroGlowClass:
      "bg-[radial-gradient(circle_at_top_left,_rgba(168,85,247,0.3),_transparent_48%),radial-gradient(circle_at_bottom_right,_rgba(217,70,239,0.18),_transparent_46%)]",
    cardGlowClass:
      "from-violet-500/20 via-fuchsia-300/10 to-pink-500/20",
  },
];
