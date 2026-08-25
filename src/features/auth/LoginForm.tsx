"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { useLogin } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { SocialLoginButtons } from "./SocialLoginButtons";

const schema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});

type FormValues = z.infer<typeof schema>;

export function LoginForm({
  onSuccess,
  onSwitchToRegister,
}: {
  onSuccess?: () => void;
  onSwitchToRegister?: () => void;
}) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isError, error } = useLogin();

  function onSubmit(values: FormValues) {
    mutate(values, { onSuccess: () => (onSuccess ? onSuccess() : router.push("/perfil")) });
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-bold">Inicia sesión</h1>

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

      <Link href="/recuperar" className="self-end text-xs text-neutral-500 hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>

      {isError && <p className="text-xs text-red-500">{getErrorMessage(error)}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isPending ? "Ingresando..." : "Ingresar"}
      </button>

      <p className="text-center text-sm text-neutral-500">
        ¿No tienes cuenta?{" "}
        {onSwitchToRegister ? (
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-medium text-neutral-900 hover:underline dark:text-white"
          >
            Regístrate
          </button>
        ) : (
          <Link href="/registro" className="font-medium text-neutral-900 hover:underline dark:text-white">
            Regístrate
          </Link>
        )}
      </p>

      <SocialLoginButtons />
    </form>
  );
}
