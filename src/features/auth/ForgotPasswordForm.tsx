"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useForgotPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";

const schema = z.object({
  email: z.string().email("Correo inválido"),
});

type FormValues = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isError, error } = useForgotPassword();

  function onSubmit(values: FormValues) {
    mutate(values.email, {
      onSuccess: () =>
        router.push(`/restablecer?email=${encodeURIComponent(values.email)}`),
    });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-bold">Recuperar contraseña</h1>
      <p className="text-sm text-neutral-500">
        Ingresa tu correo y te enviaremos un código de 6 dígitos para restablecer tu
        contraseña.
      </p>

      <div className="flex flex-col gap-1">
        <input
          {...register("email")}
          type="email"
          placeholder="Correo electrónico"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      {isError && <p className="text-xs text-red-500">{getErrorMessage(error)}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar código"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        <Link href="/login" className="font-medium text-neutral-900 hover:underline dark:text-white">
          Volver a iniciar sesión
        </Link>
      </p>
    </form>
  );
}
