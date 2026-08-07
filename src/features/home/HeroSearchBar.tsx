"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useCategories } from "@/hooks/usePlaces";

export function HeroSearchBar() {
  const router = useRouter();
  const { data: categories } = useCategories();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (category) params.set("categoria", category);
    const query = params.toString();
    router.push(query ? `/restaurantes?${query}` : "/restaurantes");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5 sm:flex-row sm:items-center dark:bg-neutral-900 dark:ring-white/10"
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-neutral-400"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Busca restaurantes, distritos, platos..."
          aria-label="Buscar restaurantes por nombre, distrito o plato"
          className="w-full rounded-xl border border-neutral-200 bg-transparent py-3 pr-4 pl-11 text-sm outline-none focus:border-primary dark:border-neutral-700"
        />
      </div>

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        aria-label="Categoría"
        className="rounded-xl border border-neutral-200 bg-transparent px-4 py-3 text-sm outline-none focus:border-primary sm:w-48 dark:border-neutral-700"
      >
        <option value="">Todas las categorías</option>
        {categories?.map((cat) => (
          <option key={cat.id} value={cat.slug}>
            {cat.name}
          </option>
        ))}
      </select>

      <button
        type="submit"
        className="rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-600"
      >
        Buscar
      </button>
    </form>
  );
}
