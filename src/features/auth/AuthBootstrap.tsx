"use client";

import { useEffect } from "react";
import { useMyProfile } from "@/hooks/useMyProfile";
import { useAuthStore } from "@/stores/auth.store";

// Sin UI: al montar la app, intenta hidratar la sesión desde la cookie
// httpOnly existente (si la hay) llamando GET /users/me/profile. Si no hay
// sesión válida, la query falla en silencio y el store queda deslogueado.
export function AuthBootstrap() {
  const { data, isSuccess } = useMyProfile();
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (isSuccess && data) {
      setUser({
        id: data.id,
        fullName: data.fullName,
        email: data.email,
        avatarUrl: data.avatarUrl,
      });
    }
  }, [isSuccess, data, setUser]);

  return null;
}
