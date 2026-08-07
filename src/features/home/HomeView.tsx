"use client";

import { Logo } from "@/components/common/Logo";
import { useCategories } from "@/hooks/usePlaces";
import { CategoryRow } from "./CategoryRow";
import { CategoryTiles } from "./CategoryTiles";
import { HeroSection } from "./HeroSection";
import { HostCTASection } from "./HostCTASection";

export function HomeView() {
  const { data: categories } = useCategories();

  return (
    <div className="flex min-h-screen flex-col gap-14 pb-16 lg:pb-0">
      <div className="flex items-center px-4 py-3 lg:hidden">
        <Logo />
      </div>

      <HeroSection />

      <section className="mx-auto w-full max-w-6xl px-4">
        <h2 className="mb-4 font-heading text-xl font-bold text-neutral-900 dark:text-neutral-50">
          Explora por categoría
        </h2>
        <CategoryTiles />
      </section>

      {categories?.map((category) => (
        <CategoryRow key={category.id} category={category} />
      ))}

      <HostCTASection />
    </div>
  );
}
