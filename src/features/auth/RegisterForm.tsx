"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useRegister } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { VerifyEmailForm } from "./VerifyEmailForm";

// Mismas reglas que RegisterDto en el backend (register.dto.ts).
const schema = z.object({
  fullName: z.string().min(2, "Ingresa tu nombre completo"),
  email: z.string().email("Correo inválido"),
  password: z
    .string()
    .min(8, "Mínimo 8 caracteres")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      "Debe tener una mayúscula, una minúscula y un número",
    ),
});

type FormValues = z.infer<typeof schema>;

export function RegisterForm({
  onSuccess,
  onSwitchToLogin,
}: {
  onSuccess?: () => void;
  onSwitchToLogin?: () => void;
}) {
  const router = useRouter();
  const [registeredEmail, setRegisteredEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isError, error } = useRegister();

  function onSubmit(values: FormValues) {
    mutate(values, { onSuccess: () => setRegisteredEmail(values.email) });
  }

  if (registeredEmail) {
    return (
      <VerifyEmailForm
        email={registeredEmail}
        onVerified={() => (onSuccess ? onSuccess() : router.push("/perfil"))}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-bold">Crea tu cuenta</h1>

      <div className="flex flex-col gap-1">
        <input
          {...register("fullName")}
          placeholder="Nombre completo"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.fullName && (
          <p className="text-xs text-red-500">{errors.fullName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("email")}
          type="email"
          placeholder="Correo electrónico"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("password")}
          type="password"
          placeholder="Contraseña"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      {isError && <p className="text-xs text-red-500">{getErrorMessage(error)}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        ¿Ya tienes cuenta?{" "}
        {onSwitchToLogin ? (
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-medium text-neutral-900 hover:underline dark:text-white"
          >
            Inicia sesión
          </button>
        ) : (
          <Link href="/login" className="font-medium text-neutral-900 hover:underline dark:text-white">
            Inicia sesión
          </Link>
        )}
      </p>
    </form>
  );
}
