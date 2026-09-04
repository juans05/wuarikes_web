"use client";

import Image from "next/image";
import { Users2, UserPlus, UserCheck } from "lucide-react";
import { Skeleton } from "@/components/common/Skeleton";
import { usePublicProfile, useFollow } from "@/hooks/useConnections";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";

export function UserProfileView({ userId }: { userId: string }) {
  const { data: profile, isLoading } = usePublicProfile(userId);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const { isFollowing, isAuthenticated, toggle, isPending } = useFollow(userId);

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 p-8">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-6 w-40" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="p-8 text-center text-sm text-red-500">No se encontró este usuario.</p>
    );
  }

  const isMe = currentUserId === profile.id;

  function handleFollowClick() {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    toggle();
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 p-8 text-center">
      <div className="h-24 w-24 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        {profile.avatarUrl && (
          <Image
            src={profile.avatarUrl}
            alt={profile.fullName}
            width={96}
            height={96}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-neutral-50">
        {profile.fullName}
      </h1>

      <div className="flex items-center gap-4 text-sm text-neutral-500">
        <span className="flex items-center gap-1.5">
          <Users2 size={15} />
          {profile.followers} seguidores · {profile.following} siguiendo
        </span>
      </div>

      {!isMe && (
        <button
          type="button"
          onClick={handleFollowClick}
          disabled={isPending}
          className={
            isFollowing
              ? "flex items-center gap-2 rounded-full border border-neutral-200 px-6 py-2.5 text-sm font-bold text-neutral-700 transition hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-700 dark:text-neutral-200"
              : "flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
          }
        >
          {isFollowing ? <UserCheck size={16} /> : <UserPlus size={16} />}
          {isFollowing ? "Siguiendo" : "Seguir"}
        </button>
      )}
    </div>
  );
}
