"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import { useAuthModalStore } from "@/stores/authModal.store";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

export function AuthModal() {
  const { isOpen, mode, close, setMode } = useAuthModalStore();

  useEffect(() => {
    if (!isOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, close]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={close}
        className="absolute inset-0 bg-neutral-900/60 backdrop-blur-sm"
      />

      <div className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-neutral-950">
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar"
          className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
        >
          <X size={18} />
        </button>

        {mode === "login" ? (
          <LoginForm onSuccess={close} onSwitchToRegister={() => setMode("register")} />
        ) : (
          <RegisterForm onSuccess={close} onSwitchToLogin={() => setMode("login")} />
        )}
      </div>
    </div>
  );
}
