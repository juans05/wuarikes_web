import { HomeView } from "@/features/home/HomeView";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ rubro?: string | string[] }>;
}) {
  const { rubro } = await searchParams;
  return <HomeView initialRubro={typeof rubro === "string" ? rubro : null} />;
}
