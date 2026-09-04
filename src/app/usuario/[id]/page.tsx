import { UserProfileView } from "@/features/profile/UserProfileView";

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <UserProfileView userId={id} />;
}
