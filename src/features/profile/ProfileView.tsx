"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import clsx from "clsx";
import {
  Cake,
  CalendarDays,
  Camera,
  Home,
  LogOut,
  MapPin,
  Pencil,
  Settings,
  Star,
  User,
  Users2,
} from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useGamificationBadges } from "@/hooks/useGamificationBadges";
import { useMyFollowers, useMyFollowing } from "@/hooks/useConnections";
import { useMyCheckins } from "@/hooks/useMyCheckins";
import { useLogout } from "@/hooks/useAuth";
import { useUploadAvatar, useUploadCoverImage } from "@/hooks/useUpdateProfile";
import { EditProfileModal } from "./EditProfileModal";
import type { Connection, UserProfile } from "@/types/user";

const TABS = [
  { id: "actividad", label: "Actividad" },
  { id: "resenas", label: "Reseñas" },
  { id: "fotos", label: "Fotos" },
  { id: "videos", label: "Videos" },
  { id: "amigos", label: "Amigos" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const IMAGE_ACCEPT = "image/png,image/jpeg,image/webp";

export function ProfileView() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <User size={32} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Inicia sesión para ver tu perfil, tus reseñas y tu progreso.
        </p>
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

  return <AuthenticatedProfile />;
}

function AuthenticatedProfile() {
  const { data: profile, isLoading } = useMyProfile();
  const { data: badges } = useGamificationBadges();
  const logoutMutation = useLogout();
  const uploadAvatarMutation = useUploadAvatar();
  const uploadCoverMutation = useUploadCoverImage();
  const [isEditing, setIsEditing] = useState(false);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("actividad");
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (isLoading || !profile) {
    return (
      <div className="mx-auto flex w-full max-w-[1600px] flex-col items-center gap-4 p-8">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-72 rounded-2xl" />
      </div>
    );
  }

  const lockedBadges = (badges ?? []).filter((b) => !b.unlockedAt);
  const memberSinceDate = profile.memberSince ? new Date(profile.memberSince) : null;
  const memberSince =
    memberSinceDate && !Number.isNaN(memberSinceDate.getTime())
      ? new Intl.DateTimeFormat("es-PE", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }).format(memberSinceDate)
      : null;
  const birthDateDate = profile.birthDate ? new Date(profile.birthDate) : null;
  const birthDate =
    birthDateDate && !Number.isNaN(birthDateDate.getTime())
      ? new Intl.DateTimeFormat("es-PE", {
          day: "numeric",
          month: "long",
          timeZone: "UTC",
        }).format(birthDateDate)
      : null;
  const hasPersonalData = Boolean(
    birthDate || profile.gender || profile.pronouns || profile.city || profile.hometown,
  );

  function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadAvatarMutation.mutate(file);
    e.target.value = "";
  }

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadCoverMutation.mutate(file);
    e.target.value = "";
  }

  return (
    <div className="mx-auto w-full max-w-[1600px] pb-10">
      <div className="relative h-48 w-full overflow-hidden bg-gradient-to-br from-primary-500 to-primary-400 sm:h-64 sm:rounded-t-3xl">
        {profile.coverImageUrl && (
          <Image
            src={profile.coverImageUrl}
            alt="Portada"
            fill
            className="object-cover"
            priority
          />
        )}
        <button
          type="button"
          onClick={() => coverInputRef.current?.click()}
          disabled={uploadCoverMutation.isPending}
          className="absolute right-3 bottom-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-black/60 disabled:opacity-50"
        >
          <Camera size={14} />
          {uploadCoverMutation.isPending ? "Subiendo..." : "Cambiar portada"}
        </button>
        <input
          ref={coverInputRef}
          type="file"
          accept={IMAGE_ACCEPT}
          className="hidden"
          onChange={handleCoverChange}
        />
      </div>

      <div className="rounded-b-3xl bg-white px-6 pb-5 shadow-sm dark:bg-neutral-950">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="flex items-end gap-4">
            <div className="relative -mt-12 h-24 w-24 shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-white bg-neutral-200 dark:border-neutral-950 dark:bg-neutral-700">
                {profile.avatarUrl ? (
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.fullName}
                    width={96}
                    height={96}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-neutral-400">
                    <User size={32} />
                  </div>
                )}
              </div>
              <button
                type="button"
                title="Cambiar foto de perfil"
                onClick={() => avatarInputRef.current?.click()}
                disabled={uploadAvatarMutation.isPending}
                className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-neutral-900 text-white transition hover:bg-neutral-700 disabled:opacity-50 dark:border-neutral-950"
              >
                <Camera size={14} />
              </button>
              <input
                ref={avatarInputRef}
                type="file"
                accept={IMAGE_ACCEPT}
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="pb-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{profile.fullName}</h1>
                <span className="rounded-full bg-primary-100 px-2 py-0.5 text-xs font-medium text-primary-600 dark:bg-primary-900 dark:text-primary-200">
                  {profile.levelName}
                </span>
              </div>
              <p className="text-sm text-neutral-500">{profile.totalPoints} puntos</p>
            </div>
          </div>

          <div className="flex gap-2 pb-1">
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-full border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-900"
            >
              Editar perfil
            </button>
            <Link
              href="/perfil/ajustes"
              title="Ajustes"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              <Settings size={16} />
            </Link>
            <button
              type="button"
              title="Cerrar sesión"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-900"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>

        {profile.bio && (
          <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-400">{profile.bio}</p>
        )}

        {(uploadAvatarMutation.isError || uploadCoverMutation.isError) && (
          <p className="mt-2 text-xs text-red-500">
            {getErrorMessage(
              uploadAvatarMutation.error ?? uploadCoverMutation.error,
              "No se pudo subir la imagen. Intenta de nuevo.",
            )}
          </p>
        )}

        <div className="mt-4 flex gap-5 overflow-x-auto border-b border-neutral-100 text-sm dark:border-neutral-800">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={clsx(
                "whitespace-nowrap border-b-2 pb-2 font-medium transition",
                activeTab === tab.id
                  ? "border-primary-500 text-primary-600 dark:text-primary-300"
                  : "border-transparent text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300",
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-[300px_1fr]">
        <div className="flex flex-col gap-4">
          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
            <h2 className="text-sm font-bold">Tus Logros</h2>
            <p className="mt-1 text-xs text-neutral-500">
              Comienza a compartir para acceder a los hitos
            </p>

            <div className="mt-3 flex flex-col gap-2">
              {(showAllBadges ? (badges ?? []) : lockedBadges.slice(0, 2)).map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-center gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800"
                >
                  <div
                    className={clsx(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base",
                      badge.unlockedAt
                        ? "bg-primary-100 dark:bg-primary-900"
                        : "bg-neutral-100 text-neutral-400 dark:bg-neutral-800",
                    )}
                  >
                    {badge.unlockedAt ? badge.icon : "🔒"}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{badge.name}</p>
                    <p className="truncate text-xs text-neutral-500">{badge.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {badges && badges.length > 2 && (
              <button
                type="button"
                onClick={() => setShowAllBadges((v) => !v)}
                className="mt-3 w-full rounded-full bg-neutral-900 py-2 text-xs font-semibold text-white dark:bg-white dark:text-neutral-900"
              >
                {showAllBadges ? "Ver menos" : "Ver todo"}
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 rounded-2xl bg-white p-4 shadow-sm dark:bg-neutral-950">
            <Stat label="Check-ins" value={profile.checkinsCount} />
            <Stat label="Seguidores" value={profile.followersCount} />
            <Stat label="Seguidos" value={profile.followingCount} />
            <Stat label="Nivel" value={profile.level} />
          </div>

          <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold">Datos personales</h2>
              <button
                type="button"
                title="Editar datos personales"
                onClick={() => setIsEditing(true)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
              >
                <Pencil size={14} />
              </button>
            </div>

            <ul className="mt-3 flex flex-col gap-3 text-sm text-neutral-600 dark:text-neutral-400">
              {profile.city && (
                <li className="flex items-center gap-3">
                  <MapPin size={16} className="shrink-0 text-neutral-400" />
                  Vive en {profile.city}
                </li>
              )}
              {profile.hometown && (
                <li className="flex items-center gap-3">
                  <Home size={16} className="shrink-0 text-neutral-400" />
                  De {profile.hometown}
                </li>
              )}
              {birthDate && (
                <li className="flex items-center gap-3">
                  <Cake size={16} className="shrink-0 text-neutral-400" />
                  {birthDate}
                </li>
              )}
              {profile.gender && (
                <li className="flex items-center gap-3">
                  <Users2 size={16} className="shrink-0 text-neutral-400" />
                  {profile.gender}
                  {profile.pronouns && (
                    <span className="text-neutral-400">· {profile.pronouns}</span>
                  )}
                </li>
              )}
              {!hasPersonalData && (
                <li>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 hover:underline dark:text-primary-300"
                  >
                    + Agrega tus datos personales
                  </button>
                </li>
              )}
              {!profile.bio && (
                <li>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="text-primary-600 hover:underline dark:text-primary-300"
                  >
                    + Agrega una bio
                  </button>
                </li>
              )}
              {memberSince && (
                <li className="flex items-center gap-3">
                  <CalendarDays size={16} className="shrink-0 text-neutral-400" />
                  Se unió en {memberSince}
                </li>
              )}
            </ul>
          </div>
        </div>

        <TabContent tab={activeTab} profile={profile} />
      </div>

      {isEditing && (
        <EditProfileModal profile={profile} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}

function TabContent({ tab, profile }: { tab: TabId; profile: UserProfile }) {
  if (tab === "actividad") {
    return (
      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-10 text-center dark:bg-neutral-900">
        <h2 className="text-lg font-bold">Agrégale más a tu perfil</h2>
        <p className="max-w-sm text-sm text-neutral-500">
          Agrega fotos e información a tu perfil para que otros comensales puedan encontrarte
          fácilmente y conocerte más.
        </p>
      </div>
    );
  }

  if (tab === "amigos") {
    return <ConnectionsTab profile={profile} />;
  }

  if (tab === "fotos") {
    return <PhotosTab />;
  }

  if (tab === "resenas") {
    return <ReviewsTab />;
  }

  const count = profile.videosCount;
  const noun = count === 1 ? "video" : "videos";

  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl bg-neutral-50 p-10 text-center dark:bg-neutral-900">
      <p className="text-sm text-neutral-500">
        {count > 0 ? `Tienes ${count} ${noun}.` : `Aún no tienes ${noun}.`}
      </p>
    </div>
  );
}

function ReviewsTab() {
  const { data, isLoading } = useMyCheckins();
  const reviews = data?.data ?? [];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
      <h2 className="text-base font-bold">Reseñas</h2>
      <p className="text-xs text-neutral-500">Tus check-ins con calificación y comentarios</p>

      {isLoading ? (
        <div className="mt-4 flex flex-col gap-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          Aún no tienes reseñas. Haz check-in en un restaurante para dejar una.
        </p>
      ) : (
        <div className="mt-4 flex flex-col gap-3">
          {reviews.map((r) => (
            <div
              key={r.id}
              className="flex gap-3 rounded-xl border border-neutral-100 p-3 dark:border-neutral-800"
            >
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-neutral-200 dark:bg-neutral-700">
                {r.place.photoUrl && (
                  <Image
                    src={r.place.photoUrl}
                    alt={r.place.name}
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-semibold">{r.place.name}</p>
                  {r.rating != null && (
                    <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-amber-500">
                      <Star size={12} className="fill-amber-500" />
                      {r.rating}
                    </span>
                  )}
                </div>
                {r.comment && (
                  <p className="mt-0.5 line-clamp-2 text-sm text-neutral-600 dark:text-neutral-400">
                    {r.comment}
                  </p>
                )}
                <p className="mt-1 text-xs text-neutral-400">
                  {new Intl.DateTimeFormat("es-PE", { dateStyle: "medium" }).format(
                    new Date(r.createdAt),
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PhotosTab() {
  const { data, isLoading } = useMyCheckins();
  const photos = (data?.data ?? []).filter((c) => c.photoUrl);

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
      <h2 className="text-base font-bold">Fotos</h2>
      <p className="text-xs text-neutral-500">De tus check-ins</p>

      {isLoading ? (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          Aún no tienes fotos. Sube una en tu próximo check-in.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {photos.map((c) => (
            <div key={c.id} className="aspect-square overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-700">
              <Image
                src={c.photoUrl as string}
                alt={c.place.name}
                width={200}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectionsTab({ profile }: { profile: UserProfile }) {
  const [sub, setSub] = useState<"seguidores" | "seguidos">("seguidores");
  const { data: followers, isLoading: loadingFollowers } = useMyFollowers(sub === "seguidores");
  const { data: following, isLoading: loadingFollowing } = useMyFollowing(sub === "seguidos");

  const list = sub === "seguidores" ? followers : following;
  const isLoading = sub === "seguidores" ? loadingFollowers : loadingFollowing;
  const count = sub === "seguidores" ? profile.followersCount : profile.followingCount;

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-neutral-950">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold">Amigos</h2>
          <p className="text-xs text-neutral-500">
            {count} {sub === "seguidores" ? "seguidores" : "seguidos"}
          </p>
        </div>
        <div className="flex gap-2">
          {(["seguidores", "seguidos"] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSub(s)}
              className={clsx(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                sub === s
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300",
              )}
            >
              {s === "seguidores" ? "Seguidores" : "Seguidos"}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full rounded-xl" />
          ))}
        </div>
      ) : !list || list.data.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          {sub === "seguidores" ? "Aún no tienes seguidores." : "Todavía no sigues a nadie."}
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {list.data.map((c) => (
            <ConnectionCard key={c.id} connection={c} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConnectionCard({ connection }: { connection: Connection }) {
  return (
    <div className="overflow-hidden rounded-xl bg-neutral-50 dark:bg-neutral-900">
      <div className="aspect-square w-full bg-neutral-200 dark:bg-neutral-700">
        {connection.avatarUrl ? (
          <Image
            src={connection.avatarUrl}
            alt={connection.fullName}
            width={200}
            height={200}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400">
            <User size={28} />
          </div>
        )}
      </div>
      <p className="truncate p-2 text-sm font-medium">{connection.fullName}</p>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold">{value}</p>
      <p className="text-xs text-neutral-500">{label}</p>
    </div>
  );
}
