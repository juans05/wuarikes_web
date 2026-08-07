import Link from "next/link";
import { Logo } from "@/components/common/Logo";

const COLUMNS = [
  {
    title: "Explorar",
    links: [
      { href: "/", label: "Inicio" },
      { href: "/restaurantes", label: "Restaurantes" },
      { href: "/favoritos", label: "Favoritos" },
    ],
  },
  {
    title: "Cuenta",
    links: [
      { href: "/login", label: "Iniciar sesión" },
      { href: "/registro", label: "Crear cuenta" },
    ],
  },
  {
    title: "Ayuda",
    links: [{ href: "mailto:contacto@wuarikes.com", label: "Contacto" }],
  },
];

const SOCIAL_LINKS = [
  { label: "Facebook", Icon: FacebookIcon },
  { label: "Instagram", Icon: InstagramIcon },
  { label: "X", Icon: XIcon },
];

export function Footer() {
  return (
    <footer className="mb-16 bg-neutral-900 px-6 py-10 text-neutral-300 lg:mb-0">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 sm:flex-row sm:justify-between">
        <div>
          <Logo light />
          <p className="mt-2 max-w-xs text-sm text-neutral-400">
            Descubre los mejores restaurantes, cafeterías y bares del Perú.
          </p>
          <div className="mt-4 flex gap-3">
            {SOCIAL_LINKS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-neutral-300 transition hover:bg-neutral-700 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-10">
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <h3 className="mb-3 text-sm font-semibold text-white">{column.title}</h3>
              <ul className="flex flex-col gap-2 text-sm">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-6xl border-t border-neutral-800 pt-6 text-xs text-neutral-500">
        © {new Date().getFullYear()} Wuarikes. Hecho en Perú.
      </div>
    </footer>
  );
}

function FacebookIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M22 12.06C22 6.51 17.52 2 12 2S2 6.51 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.44 2.9h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.9 2H22l-7.6 8.7L23.3 22H16.9l-5-6.5-5.7 6.5H2.9l8.1-9.3L2 2h6.6l4.5 6 5.8-6zm-1.1 18.2h1.7L7.3 3.7H5.4l12.4 16.5z" />
    </svg>
  );
}
