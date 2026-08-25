"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Heart, Home, Plus, Rss, User } from "lucide-react";
import clsx from "clsx";

const ITEMS = [
  { href: "/", label: "Inicio", icon: Home },
  { href: "/feed", label: "Actividad", icon: Rss },
  { href: "/favoritos", label: "Favoritos", icon: Heart },
  { href: "/perfil", label: "Perfil", icon: User },
] as const;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <>
      <Link
        href="/agregar-restaurante"
        aria-label="Agregar restaurante"
        className="fixed right-4 bottom-20 z-30 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-white shadow-lg lg:hidden"
      >
        <Plus size={24} />
      </Link>

      <nav
        aria-label="Navegación principal"
        className="fixed inset-x-0 bottom-0 z-30 flex border-t border-neutral-200 bg-white/95 backdrop-blur lg:hidden dark:border-neutral-800 dark:bg-neutral-950/95"
      >
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs"
            >
              {isActive && (
                <motion.span
                  layoutId="bottom-nav-active"
                  className="absolute top-0 h-0.5 w-8 rounded-full bg-primary"
                />
              )}
              <Icon size={20} className={clsx(isActive ? "text-primary" : "text-neutral-400")} />
              <span
                className={clsx("font-medium", isActive ? "text-primary" : "text-neutral-400")}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
