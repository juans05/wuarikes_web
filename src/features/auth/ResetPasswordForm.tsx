"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { useForgotPassword, useResetPassword } from "@/hooks/useAuth";
import { getErrorMessage } from "@/utils/getErrorMessage";

const schema = z
  .object({
    code: z.string().length(6, "El código tiene 6 dígitos"),
    password: z
      .string()
      .min(8, "Mínimo 8 caracteres")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Debe tener una mayúscula, una minúscula y un número",
      ),
    confirmPassword: z.string(),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof schema>;

export function ResetPasswordForm({ email }: { email: string }) {
  const router = useRouter();
  const [resent, setResent] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });
  const { mutate, isPending, isError, error } = useResetPassword();
  const resendMutation = useForgotPassword();

  function onSubmit(values: FormValues) {
    mutate(
      { email, code: values.code, password: values.password },
      { onSuccess: () => router.push("/login") },
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-sm flex-col gap-3">
      <h1 className="text-xl font-bold">Restablecer contraseña</h1>
      <p className="text-sm text-neutral-500">
        Te enviamos un código de 6 dígitos a <strong>{email}</strong>.
      </p>

      <div className="flex flex-col gap-1">
        <input
          {...register("code")}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-center text-lg tracking-widest outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.code && <p className="text-xs text-red-500">{errors.code.message}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("password")}
          type="password"
          placeholder="Nueva contraseña"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <input
          {...register("confirmPassword")}
          type="password"
          placeholder="Confirmar contraseña"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
        )}
      </div>

      {isError && <p className="text-xs text-red-500">{getErrorMessage(error)}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isPending ? "Guardando..." : "Cambiar contraseña"}
      </button>

      <button
        type="button"
        disabled={resendMutation.isPending}
        onClick={() => resendMutation.mutate(email, { onSuccess: () => setResent(true) })}
        className="text-center text-sm text-neutral-500 hover:underline disabled:opacity-50"
      >
        {resent ? "Código reenviado" : "Reenviar código"}
      </button>
    </form>
  );
}
