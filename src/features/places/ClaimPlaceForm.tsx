"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { z } from "zod";
import { CheckCircle2, File as FileIcon, Lock, Paperclip, X } from "lucide-react";
import { useRef, useState } from "react";
import { usePlace, useClaimPlace } from "@/hooks/usePlaces";
import { useUploadDocument } from "@/hooks/useUpload";
import { useAuthStore } from "@/stores/auth.store";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { Skeleton } from "@/components/common/Skeleton";

const schema = z.object({
  businessName: z.string().min(2, "Ingresa la razón social o nombre del negocio"),
  businessEmail: z.string().email("Ingresa un correo válido"),
  businessPhone: z.string().min(6, "Ingresa un teléfono de contacto"),
  whatsapp: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export function ClaimPlaceForm({ id }: { id: string }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-8 text-center">
        <Lock size={32} className="text-neutral-300" />
        <p className="text-sm text-neutral-500">
          Inicia sesión para reclamar este negocio.
        </p>
        <Link
          href="/login"
          className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-600"
        >
          Iniciar sesión
        </Link>
      </div>
    );
  }

  return <ClaimPlaceFormFields id={id} />;
}

function ClaimPlaceFormFields({ id }: { id: string }) {
  const router = useRouter();
  const { data: place, isLoading } = usePlace(id);
  const [documents, setDocuments] = useState<File[]>([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const uploadDocumentMutation = useUploadDocument();
  const claimMutation = useClaimPlace();
  const isSubmitting = uploadDocumentMutation.isPending || claimMutation.isPending;

  function addDocuments(files: FileList | null) {
    if (!files) return;
    setDocuments((prev) => [...prev, ...Array.from(files)]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function removeDocument(index: number) {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(values: FormValues) {
    const documentUrls = await Promise.all(
      documents.map((file) => uploadDocumentMutation.mutateAsync(file)),
    );
    claimMutation.mutate(
      {
        placeId: id,
        input: {
          businessName: values.businessName,
          businessEmail: values.businessEmail,
          businessPhone: values.businessPhone,
          whatsapp: values.whatsapp || undefined,
          documentUrls: documentUrls.length > 0 ? documentUrls : undefined,
        },
      },
      { onSuccess: () => setShowSuccessModal(true) },
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto flex w-full max-w-lg flex-col gap-4 p-4"
    >
      <h1 className="font-heading text-xl font-bold">Reclama tu negocio</h1>
      <p className="text-sm text-neutral-500">
        {place ? (
          <>
            Confirma que eres el dueño de <strong>{place.name}</strong>. Revisaremos tu
            solicitud antes de darte acceso.
          </>
        ) : (
          "Confirma que eres el dueño de este local. Revisaremos tu solicitud antes de darte acceso."
        )}
      </p>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Razón social / nombre del negocio</label>
        <input
          {...register("businessName")}
          placeholder="Ej: Central Restaurante SAC"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.businessName && (
          <p className="text-xs text-red-500">{errors.businessName.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Correo del negocio</label>
        <input
          {...register("businessEmail")}
          placeholder="Ej: info@central.com.pe"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.businessEmail && (
          <p className="text-xs text-red-500">{errors.businessEmail.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Teléfono del negocio</label>
        <input
          {...register("businessPhone")}
          placeholder="Ej: +51 1 2428515"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
        {errors.businessPhone && (
          <p className="text-xs text-red-500">{errors.businessPhone.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">WhatsApp (opcional)</label>
        <input
          {...register("whatsapp")}
          placeholder="Ej: +51 987654321"
          className="rounded-xl border border-neutral-200 bg-white p-3 text-sm outline-none focus:border-primary dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium">Documentos de sustento (opcional)</label>
        <p className="text-xs text-neutral-400">
          RUC, licencia de funcionamiento o recibo de servicios a nombre del negocio.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="hidden"
          onChange={(e) => addDocuments(e.target.files)}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="flex h-16 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 text-sm text-neutral-500 dark:border-neutral-700"
        >
          <Paperclip size={18} />
          Adjuntar documentos
        </button>
        {documents.length > 0 && (
          <ul className="flex flex-col gap-2 pt-1">
            {documents.map((file, index) => (
              <li
                key={`${file.name}-${index}`}
                className="flex items-center gap-2 rounded-xl border border-neutral-100 p-2 text-sm dark:border-neutral-800"
              >
                <FileIcon size={16} className="shrink-0 text-neutral-400" />
                <span className="min-w-0 flex-1 truncate">{file.name}</span>
                <button
                  type="button"
                  onClick={() => removeDocument(index)}
                  aria-label="Quitar documento"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {claimMutation.isError && (
        <p className="text-xs text-red-500">{getErrorMessage(claimMutation.error)}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white transition hover:bg-primary-600 disabled:opacity-50"
      >
        {isSubmitting ? "Enviando..." : "Enviar solicitud"}
      </button>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/50 p-4">
          <div className="flex w-full max-w-sm flex-col items-center gap-3 rounded-2xl bg-white p-6 text-center dark:bg-neutral-900">
            <CheckCircle2 size={40} className="text-primary" />
            <h2 className="font-heading text-lg font-bold">¡Solicitud enviada!</h2>
            <p className="text-sm text-neutral-500">
              Nuestro equipo verificará tu solicitud antes de darte acceso a este negocio.
            </p>
            <button
              type="button"
              onClick={() => router.push(`/restaurantes/${id}`)}
              className="mt-1 w-full rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-600"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </form>
  );
}
