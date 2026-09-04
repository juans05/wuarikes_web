"use client";

import { Users } from "lucide-react";
import { useFriendsVisited } from "@/hooks/usePlaces";

export function FriendsVisited({ placeId }: { placeId: string }) {
  const { data } = useFriendsVisited(placeId);
  if (!data || data.count === 0) return null;

  const names = data.friends.map((f) => f.fullName.split(" ")[0]);
  const label =
    data.count <= names.length
      ? names.join(", ")
      : `${names.join(", ")} y ${data.count - names.length} más`;

  return (
    <p className="flex items-center gap-1.5 text-sm font-medium text-primary">
      <Users size={15} />
      {label} {data.count === 1 ? "visitó" : "visitaron"} este lugar
    </p>
  );
}
