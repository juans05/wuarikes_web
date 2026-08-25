"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Plus, Rss, User } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";

export function Navbar() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const openAuthModal = useAuthModalStore((s) => s.open);

  return (
    <nav className="sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-neutral-200 bg-white/90 px-6 backdrop-blur lg:flex dark:border-neutral-800 dark:bg-neutral-950/90">
      <Logo />

      <div className="flex items-center gap-5">
        <Link
          href="/feed"
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          <Rss size={18} />
          Actividad
        </Link>

        <Link
          href="/favoritos"
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-600 transition hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
        >
          <Heart size={18} />
          Favoritos
        </Link>

        <Link
          href="/agregar-restaurante"
          className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
        >
          <Plus size={16} />
          Agregar restaurante
        </Link>

        {isAuthenticated ? (
          <Link
            href="/perfil"
            aria-label={user?.fullName ?? "Mi perfil"}
            title={user?.fullName}
            className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800"
          >
            {user?.avatarUrl ? (
              <Image
                src={user.avatarUrl}
                alt={user.fullName}
                width={40}
                height={40}
                className="h-full w-full object-cover"
              />
            ) : (
              <User size={18} className="text-neutral-500" />
            )}
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => openAuthModal("login")}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-600"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    </nav>
  );
}
