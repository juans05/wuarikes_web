"use client";

import dynamic from "next/dynamic";

export const ThemeToggleMount = dynamic(
  () => import("./ThemeToggle").then((m) => m.ThemeToggle),
  { ssr: false },
);
