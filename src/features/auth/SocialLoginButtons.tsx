"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSocialLogin } from "@/hooks/useAuth";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

function loadScript(src: string, id: string): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById(id)) return resolve();
    const script = document.createElement("script");
    script.id = id;
    script.src = src;
    script.async = true;
    script.onload = () => resolve();
    document.body.appendChild(script);
  });
}

export function SocialLoginButtons() {
  const router = useRouter();
  const { mutate } = useSocialLogin();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID || !googleButtonRef.current) return;
    loadScript("https://accounts.google.com/gsi/client", "google-identity-sdk").then(() => {
      const google = (window as any).google;
      if (!google || !googleButtonRef.current) return;
      google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response: { credential: string }) => {
          mutate(
            { provider: "google", token: response.credential },
            { onSuccess: () => router.push("/perfil") },
          );
        },
      });
      google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    });
  }, [mutate, router]);

  function handleFacebookLogin() {
    if (!FACEBOOK_APP_ID) return;
    loadScript("https://connect.facebook.net/es_LA/sdk.js", "facebook-jssdk").then(() => {
      const FB = (window as any).FB;
      if (!FB) return;
      FB.init({ appId: FACEBOOK_APP_ID, version: "v19.0" });
      FB.login(
        (response: any) => {
          const accessToken = response.authResponse?.accessToken;
          if (!accessToken) return;
          mutate(
            { provider: "facebook", token: accessToken },
            { onSuccess: () => router.push("/perfil") },
          );
        },
        { scope: "email" },
      );
    });
  }

  if (!GOOGLE_CLIENT_ID && !FACEBOOK_APP_ID) return null;

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-xs text-neutral-400">
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
        o continúa con
        <div className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700" />
      </div>

      {GOOGLE_CLIENT_ID && <div ref={googleButtonRef} className="flex justify-center" />}

      {FACEBOOK_APP_ID && (
        <button
          type="button"
          onClick={handleFacebookLogin}
          className="rounded-full border border-neutral-200 px-4 py-2.5 text-sm font-medium transition hover:bg-neutral-50 dark:border-neutral-700 dark:hover:bg-neutral-900"
        >
          Continuar con Facebook
        </button>
      )}
    </div>
  );
}
