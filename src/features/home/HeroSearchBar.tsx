"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export function HeroSearchBar({ vertical }: { vertical?: string }) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (vertical) params.set("rubro", vertical);
    const query = params.toString();
    router.push(query ? `/restaurantes?${query}` : "/restaurantes");
  }

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      className="flex items-center gap-2 rounded-full bg-white p-1.5 pl-5 shadow-2xl ring-1 ring-black/5 dark:bg-neutral-900 dark:ring-white/10"
    >
      <Search size={20} className="shrink-0 text-neutral-400" aria-hidden />
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Barbería, cebiche, spa, Barranco…"
        aria-label="Buscar negocios por nombre, rubro o distrito"
        className="min-w-0 flex-1 bg-transparent py-3 text-base text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-50"
      />
      <button
        type="submit"
        className="shrink-0 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-600 md:px-7"
      >
        Buscar
      </button>
    </form>
  );
}
