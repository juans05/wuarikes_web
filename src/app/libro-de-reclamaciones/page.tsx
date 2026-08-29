"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { z } from "zod";
import { apiClient } from "@/api/client";
import { ProviderCard } from "@/components/legal/ProviderCard";
import { getErrorMessage } from "@/utils/getErrorMessage";

const schema = z.object({
  type: z.enum(["reclamo", "queja"]),
  consumerFullName: z.string().min(2, "Ingresa tu nombre completo"),
  consumerDocumentType: z.enum(["DNI", "CE", "Pasaporte", "RUC"]),
  consumerDocumentNumber: z.string().min(1, "Ingresa tu número de documento"),
  consumerAddress: z.string().min(1, "Ingresa tu domicilio"),
  consumerEmail: z.string().email("Correo inválido"),
  consumerPhone: z.string().optional(),
  contractedGood: z.string().min(1, "Indica el bien o servicio contratado"),
  claimedAmount: z.string().optional(),
  detail: z.string().min(1, "Describe el detalle"),
  consumerRequest: z.string().min(1, "Indica tu pedido concreto"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900";
const labelClass = "text-sm font-semibold text-neutral-900 dark:text-white";

export default function LibroDeReclamacionesPage() {
  const [folio, setFolio] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: "reclamo", consumerDocumentType: "DNI" },
  });

  const type = watch("type");

  async function onSubmit(values: FormValues) {
    try {
      const { data } = await apiClient.post<{ folio: string }>("/complaint-book", {
        ...values,
        consumerPhone: values.consumerPhone || undefined,
        claimedAmount: values.claimedAmount ? Number(values.claimedAmount) : undefined,
      });
      setFolio(data.folio);
    } catch (err) {
      setError("root", { message: getErrorMessage(err, "No pudimos registrar tu reclamo. Intenta nuevamente.") });
    }
  }

  if (folio) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-md space-y-4 rounded-[2rem] border border-neutral-200 bg-white p-10 text-center dark:border-neutral-700 dark:bg-neutral-900">
          <h1 className="font-heading text-2xl font-bold text-neutral-900 dark:text-white">¡Registrado!</h1>
          <p className="text-sm text-neutral-500">
            Tu {type === "reclamo" ? "reclamo" : "queja"} quedó registrado en nuestro Libro de Reclamaciones. Te
            enviamos una constancia a tu correo.
          </p>
          <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
            <p className="mb-1 text-xs text-neutral-500">N.º de folio</p>
            <p className="font-mono text-xl font-bold text-primary">{folio}</p>
          </div>
          <p className="text-xs text-neutral-500">
            Conforme a la normativa vigente, tenemos hasta 30 días calendario para darte una respuesta.
          </p>
          <Link href="/" className="mt-2 inline-block text-sm font-semibold text-primary hover:underline">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-16">
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-2xl space-y-8">
        <header className="space-y-2">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 dark:text-white">
            Libro de Reclamaciones
          </h1>
          <p className="text-sm text-neutral-500">
            Conforme a lo establecido en el Código de Protección y Defensa del Consumidor.
          </p>
        </header>

        <ProviderCard label="Datos del proveedor" showCorreo={false} />

        <section className="space-y-3">
          <p className={labelClass}>¿Qué deseas registrar?</p>
          <div className="flex gap-3">
            {(["reclamo", "queja"] as const).map((option) => (
              <label
                key={option}
                className={`flex-1 cursor-pointer rounded-xl border p-3 text-center text-sm font-semibold capitalize transition-colors ${
                  type === option
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-neutral-200 text-neutral-500 dark:border-neutral-700"
                }`}
              >
                <input type="radio" value={option} {...register("type")} className="sr-only" />
                {option}
              </label>
            ))}
          </div>
          <p className="text-xs text-neutral-500">
            Reclamo: disconformidad relacionada al producto o servicio. Queja: disconformidad no relacionada, o
            malestar respecto a la atención.
          </p>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>Nombres y apellidos / Razón social</label>
            <input {...register("consumerFullName")} className={inputClass} />
            {errors.consumerFullName && (
              <p className="text-xs text-red-500">{errors.consumerFullName.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Tipo de documento</label>
            <select {...register("consumerDocumentType")} className={inputClass}>
              <option value="DNI">DNI</option>
              <option value="CE">Carné de extranjería</option>
              <option value="Pasaporte">Pasaporte</option>
              <option value="RUC">RUC</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>N.º de documento</label>
            <input {...register("consumerDocumentNumber")} className={inputClass} />
            {errors.consumerDocumentNumber && (
              <p className="text-xs text-red-500">{errors.consumerDocumentNumber.message}</p>
            )}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>Domicilio</label>
            <input {...register("consumerAddress")} className={inputClass} />
            {errors.consumerAddress && <p className="text-xs text-red-500">{errors.consumerAddress.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Correo electrónico</label>
            <input type="email" {...register("consumerEmail")} className={inputClass} />
            {errors.consumerEmail && <p className="text-xs text-red-500">{errors.consumerEmail.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Teléfono (opcional)</label>
            <input {...register("consumerPhone")} className={inputClass} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className={labelClass}>Bien o servicio contratado</label>
            <input
              placeholder="Ej: Plan Wuarikes Fidelización+ (suscripción mensual)"
              {...register("contractedGood")}
              className={inputClass}
            />
            {errors.contractedGood && <p className="text-xs text-red-500">{errors.contractedGood.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className={labelClass}>Monto reclamado (opcional, S/.)</label>
            <input type="number" min="0" step="0.01" {...register("claimedAmount")} className={inputClass} />
          </div>
        </section>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Detalle del {type}</label>
          <textarea rows={4} {...register("detail")} className={`${inputClass} resize-none`} />
          {errors.detail && <p className="text-xs text-red-500">{errors.detail.message}</p>}
        </div>

        <div className="flex flex-col gap-1">
          <label className={labelClass}>Pedido concreto</label>
          <textarea rows={3} {...register("consumerRequest")} className={`${inputClass} resize-none`} />
          {errors.consumerRequest && <p className="text-xs text-red-500">{errors.consumerRequest.message}</p>}
        </div>

        {errors.root && <p className="text-sm text-red-500">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-primary py-3.5 font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : `Registrar ${type}`}
        </button>
      </form>
    </div>
  );
}
