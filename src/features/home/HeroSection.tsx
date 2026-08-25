import { HeroSearchBar } from "./HeroSearchBar";

export function HeroSection() {
  return (
    <section className="rounded-b-[2.5rem] bg-gradient-to-br from-primary-100 via-white to-secondary/20 px-4 pt-10 pb-10 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      <div className="mx-auto flex max-w-[1600px] flex-col items-center gap-6 text-center md:flex-row md:text-left">
        <div className="flex-1">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 md:text-5xl dark:text-neutral-50">
            Encuentra tu huarique favorito y vive una nueva experiencia
          </h1>
          <p className="mx-auto mt-3 max-w-md text-neutral-600 md:mx-0 dark:text-neutral-400">
            Descubre cebicherías, criollas, cafeterías y más, cerca de ti.
          </p>
        </div>
        <ChefIllustration className="h-56 w-56 shrink-0 md:h-72 md:w-72" />
      </div>

      <div className="mx-auto mt-8 max-w-3xl">
        <HeroSearchBar />
      </div>
    </section>
  );
}

function ChefIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 240 220"
      className={className}
      role="img"
      aria-label="Ilustración de un chef presentando un plato de cebiche"
    >
      <circle cx="50" cy="180" r="70" fill="#ecb365" opacity="0.15" />
      <circle cx="200" cy="180" r="80" fill="#606c38" opacity="0.12" />

      {/* nube */}
      <g fill="none" stroke="#a79c90" strokeWidth="3" strokeLinecap="round">
        <circle cx="28" cy="30" r="10" fill="#fff" stroke="#a79c90" />
        <circle cx="40" cy="26" r="13" fill="#fff" stroke="#a79c90" />
        <circle cx="53" cy="31" r="9" fill="#fff" stroke="#a79c90" />
      </g>

      {/* chef: cuerpo */}
      <rect x="48" y="95" width="44" height="85" rx="16" fill="#c84b31" stroke="#2d2424" strokeWidth="3" />
      {/* chef: cabeza */}
      <circle cx="70" cy="55" r="22" fill="#f8ded4" stroke="#2d2424" strokeWidth="3" />
      {/* chef: gorro */}
      <rect x="50" y="18" width="40" height="20" rx="10" fill="#fff" stroke="#2d2424" strokeWidth="3" />
      <rect x="62" y="8" width="16" height="16" rx="7" fill="#fff" stroke="#2d2424" strokeWidth="3" />
      {/* chef: piernas */}
      <rect x="55" y="178" width="16" height="38" rx="8" fill="#2d2424" />
      <rect x="78" y="178" width="16" height="38" rx="8" fill="#2d2424" />
      {/* chef: brazo presentando el plato */}
      <path d="M92,120 Q130,108 150,120" fill="none" stroke="#2d2424" strokeWidth="8" strokeLinecap="round" />
      <circle cx="150" cy="120" r="7" fill="#f8ded4" stroke="#2d2424" strokeWidth="3" />

      {/* plato */}
      <ellipse cx="178" cy="118" rx="52" ry="15" fill="#fff" stroke="#2d2424" strokeWidth="3" />
      <ellipse cx="178" cy="116" rx="40" ry="9" fill="#fdf1ee" />
      <path d="M158,116 q6,-6 12,0" fill="none" stroke="#e79880" strokeWidth="3" strokeLinecap="round" />
      <path d="M175,118 q6,-6 12,0" fill="none" stroke="#e79880" strokeWidth="3" strokeLinecap="round" />
      <path d="M192,116 q6,-6 12,0" fill="none" stroke="#e79880" strokeWidth="3" strokeLinecap="round" />

      {/* vapor */}
      <g fill="none" stroke="#a79c90" strokeWidth="3" strokeLinecap="round">
        <path d="M163,90 Q158,80 163,70 Q168,60 163,50" />
        <path d="M178,86 Q173,76 178,66 Q183,56 178,46" />
        <path d="M193,90 Q188,80 193,70 Q198,60 193,50" />
      </g>

      {/* chile flotante */}
      <path
        d="M208,45 Q220,35 214,22 Q230,28 224,50 Q218,66 202,60 Q196,52 208,45 Z"
        fill="#c84b31"
        stroke="#2d2424"
        strokeWidth="2"
      />
      <path d="M214,22 Q210,14 200,14" fill="none" stroke="#606c38" strokeWidth="3" strokeLinecap="round" />

      {/* tenedor flotante */}
      <g stroke="#2d2424" strokeWidth="3" strokeLinecap="round" fill="none">
        <line x1="26" y1="150" x2="26" y2="200" />
        <line x1="20" y1="150" x2="20" y2="165" />
        <line x1="26" y1="150" x2="26" y2="165" />
        <line x1="32" y1="150" x2="32" y2="165" />
      </g>
    </svg>
  );
}
