import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/features/auth/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>;
}) {
  const { email } = await searchParams;
  if (!email) redirect("/recuperar");

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4">
      <ResetPasswordForm email={email} />
    </div>
  );
}
