"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Flame, CheckCircle2 } from "lucide-react";
import { submitWuarikesHere } from "@/services/places.service";
import { useAuthStore } from "@/stores/auth.store";
import { useAuthModalStore } from "@/stores/authModal.store";

export function WuarikesHereForm() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const openAuthModal = useAuthModalStore((s) => s.open);
  const [open, setOpen] = useState(false);
  const [restaurantName, setRestaurantName] = useState("");
  const [district, setDistrict] = useState("");
  const [address, setAddress] = useState("");

  const mutation = useMutation({
    mutationFn: submitWuarikesHere,
  });

  function handleOpen() {
    if (!isAuthenticated) {
      openAuthModal("login");
      return;
    }
    setOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!restaurantName.trim()) return;
    mutation.mutate({
      restaurantName: restaurantName.trim(),
      district: district.trim() || undefined,
      address: address.trim() || undefined,
    });
  }

  if (mutation.isSuccess) {
    return (
      <p className="mx-auto flex w-fit items-center gap-2 rounded-2xl bg-primary-50 px-6 py-3 text-sm font-bold text-primary-600 dark:bg-primary-900/30 dark:text-primary-200">
        <CheckCircle2 size={18} />
        ¡Gracias! Ya avisamos que quieres verlo en Wuarikes.
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={handleOpen}
        className="mx-auto flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white transition hover:bg-primary-600"
      >
        <Flame size={16} />
        Quiero Wuarikes aquí
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto flex w-full max-w-md flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-5 text-left dark:border-neutral-800 dark:bg-neutral-900"
    >
      <p className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">
        ¿Qué restaurante quieres que traigamos a Wuarikes?
      </p>
      <input
        type="text"
        required
        value={restaurantName}
        onChange={(e) => setRestaurantName(e.target.value)}
        placeholder="Nombre del restaurante"
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      <input
        type="text"
        value={district}
        onChange={(e) => setDistrict(e.target.value)}
        placeholder="Distrito (opcional)"
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Dirección (opcional)"
        className="rounded-xl border border-neutral-200 px-4 py-2.5 text-sm dark:border-neutral-700 dark:bg-neutral-950"
      />
      <button
        type="submit"
        disabled={mutation.isPending || !restaurantName.trim()}
        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {mutation.isPending ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
