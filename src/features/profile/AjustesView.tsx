"use client";

import Link from "next/link";
import clsx from "clsx";
import { ArrowLeft, Monitor, Smartphone, User } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useUpdatePrivacy } from "@/hooks/useUpdateProfile";
import { useRevokeOtherSessions, useRevokeSession, useSessions } from "@/hooks/useSessions";
import type { UserProfile } from "@/types/user";

export function AjustesView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { data: profile, isLoading } = useMyProfile(isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <User size={32} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">Inicia sesión para ver tus ajustes.</p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          Iniciar sesión
        </button>
      </div>
    );
  }

  if (isLoading || !profile) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-8">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <Link
        href="/perfil"
        className="flex w-fit items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
      >
        <ArrowLeft size={16} />
        Volver al perfil
      </Link>
      <h1 className="text-xl font-bold">Ajustes de la cuenta</h1>

      <PrivacySection profile={profile} />
      <SessionsSection />
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      disabled={disabled}
      className={clsx(
        "relative h-6 w-11 shrink-0 rounded-full transition disabled:opacity-50",
        checked ? "bg-primary-500" : "bg-neutral-300 dark:bg-neutral-700",
      )}
    >
      <span
        className={clsx(
          "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
          checked ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

const PRIVACY_ITEMS = [
  {
    key: "isProfilePublic",
    label: "Perfil público",
    description: "Otros usuarios pueden ver tu perfil, bio, logros y check-ins.",
  },
  {
    key: "areFavoritesPublic",
    label: "Favoritos visibles",
    description: "Tu lista de restaurantes favoritos es visible para otros usuarios.",
  },
  {
    key: "allowBusinessMessages",
    label: "Mensajes de negocios",
    description: "Los restaurantes pueden contactarte directamente en respuesta a tus reseñas.",
  },
  {
    key: "isDiscoverable",
    label: "Aparecer en búsqueda de amigos",
    description: "Otros usuarios pueden encontrarte por tu nombre o correo.",
  },
] as const;

function PrivacySection({ profile }: { profile: UserProfile }) {
  const mutation = useUpdatePrivacy();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
      <h2 className="text-base font-bold">Privacidad</h2>
      <p className="mt-1 text-xs text-neutral-500">
        Wuarikes todavía no tiene una vista pública de perfiles, así que estas preferencias se
        guardan y se aplicarán en cuanto esas funciones estén disponibles.
      </p>

      <div className="mt-4 flex flex-col divide-y divide-neutral-100 dark:divide-neutral-800">
        {PRIVACY_ITEMS.map((item) => (
          <div key={item.key} className="flex items-center justify-between gap-4 py-3">
            <div>
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-xs text-neutral-500">{item.description}</p>
            </div>
            <Toggle
              checked={profile[item.key]}
              disabled={mutation.isPending}
              onChange={() => mutation.mutate({ [item.key]: !profile[item.key] })}
            />
          </div>
        ))}
      </div>

      {mutation.isError && (
        <p className="mt-2 text-xs text-red-500">{getErrorMessage(mutation.error)}</p>
      )}
    </div>
  );
}

function SessionsSection() {
  const { data: sessions, isLoading } = useSessions();
  const revokeMutation = useRevokeSession();
  const revokeOthersMutation = useRevokeOtherSessions();

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold">Sesiones activas</h2>
          <p className="text-xs text-neutral-500">Dispositivos donde iniciaste sesión.</p>
        </div>
        <button
          type="button"
          onClick={() => revokeOthersMutation.mutate()}
          disabled={revokeOthersMutation.isPending || !sessions || sessions.length <= 1}
          className="rounded-full border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
        >
          Cerrar las demás sesiones
        </button>
      </div>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      ) : (
        <div className="mt-4 flex flex-col gap-2">
          {(sessions ?? []).map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800"
            >
              <div className="flex items-center gap-3">
                {s.deviceLabel === "Mobile" ? (
                  <Smartphone size={18} className="shrink-0 text-neutral-400" />
                ) : (
                  <Monitor size={18} className="shrink-0 text-neutral-400" />
                )}
                <div>
                  <p className="text-sm font-medium">
                    {s.deviceLabel}
                    {s.isCurrent && (
                      <span className="ml-2 rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-medium text-primary-600 dark:bg-primary-900 dark:text-primary-200">
                        Sesión actual
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Intl.DateTimeFormat("es-PE", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(new Date(s.createdAt))}
                  </p>
                </div>
              </div>
              {!s.isCurrent && (
                <button
                  type="button"
                  onClick={() => revokeMutation.mutate(s.id)}
                  disabled={revokeMutation.isPending}
                  className="text-xs font-medium text-red-500 hover:underline disabled:opacity-50"
                >
                  Cerrar sesión
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {revokeOthersMutation.isError && (
        <p className="mt-2 text-xs text-red-500">{getErrorMessage(revokeOthersMutation.error)}</p>
      )}
    </div>
  );
}
