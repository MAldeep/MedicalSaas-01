"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

const visitSchema = z.object({
  date: z.string().min(1, "Date is required"),
  reason: z
    .string()
    .min(1, "Reason is required")
    .max(500, "Reason must be less than 500 characters"),
  diagnosis: z
    .string()
    .max(500, "Diagnosis must be less than 500 characters")
    .optional(),
  procedure: z
    .string()
    .max(500, "Procedure must be less than 500 characters")
    .optional(),
  doctor: z
    .string()
    .max(100, "Doctor name must be less than 100 characters")
    .optional(),
});

type VisitFormData = z.infer<typeof visitSchema>;

interface NewVisitFormProps {
  patientId: string;
}

export default function NewVisitForm({ patientId }: NewVisitFormProps) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<VisitFormData>({
    resolver: zodResolver(visitSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      reason: "",
      diagnosis: "",
      procedure: "",
      doctor: "",
    },
  });

  const onSubmit = async (data: VisitFormData) => {
    try {
      const res = await fetch(`/api/patients/${patientId}/visits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      router.push(`/patients/${patientId}`);
      router.refresh();
    } catch (err: unknown) {
      setFormError("root", {
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-lg mx-auto p-6 bg-[rgb(var(--color-surface))] rounded-xl shadow-lg border border-[rgb(var(--color-border))]"
    >
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
          Add New Visit
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          Record the details of this patient visit.
        </p>
      </div>

      {errors.root && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {errors.root.message}
        </div>
      )}

      {/* Date */}
      <div className="space-y-2">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Visit Date
        </label>
        <input
          type="date"
          id="date"
          {...register("date")}
          className={`input w-full ${errors.date ? "border-red-500" : ""}`}
        />
        {errors.date && (
          <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>
        )}
      </div>

      {/* Reason */}
      <div className="space-y-2">
        <label
          htmlFor="reason"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Reason for Visit <span className="text-red-500">*</span>
        </label>
        <textarea
          id="reason"
          {...register("reason")}
          rows={3}
          placeholder="Describe the reason for this visit..."
          className={`input w-full resize-none ${errors.reason ? "border-red-500" : ""}`}
        />
        {errors.reason && (
          <p className="text-red-500 text-xs mt-1">{errors.reason.message}</p>
        )}
      </div>

      {/* Diagnosis */}
      <div className="space-y-2">
        <label
          htmlFor="diagnosis"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Diagnosis{" "}
          <span className="text-[rgb(var(--color-text-muted))] font-normal">
            (Optional)
          </span>
        </label>
        <textarea
          id="diagnosis"
          {...register("diagnosis")}
          rows={2}
          placeholder="Enter diagnosis..."
          className={`input w-full resize-none ${errors.diagnosis ? "border-red-500" : ""}`}
        />
        {errors.diagnosis && (
          <p className="text-red-500 text-xs mt-1">
            {errors.diagnosis.message}
          </p>
        )}
      </div>

      {/* Procedure */}
      <div className="space-y-2">
        <label
          htmlFor="procedure"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Procedure{" "}
          <span className="text-[rgb(var(--color-text-muted))] font-normal">
            (Optional)
          </span>
        </label>
        <textarea
          id="procedure"
          {...register("procedure")}
          rows={2}
          placeholder="Describe any procedures performed..."
          className={`input w-full resize-none ${errors.procedure ? "border-red-500" : ""}`}
        />
        {errors.procedure && (
          <p className="text-red-500 text-xs mt-1">
            {errors.procedure.message}
          </p>
        )}
      </div>

      {/* Doctor */}
      <div className="space-y-2">
        <label
          htmlFor="doctor"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Doctor{" "}
          <span className="text-[rgb(var(--color-text-muted))] font-normal">
            (Optional)
          </span>
        </label>
        <input
          type="text"
          id="doctor"
          {...register("doctor")}
          placeholder="Dr. Smith"
          className={`input w-full ${errors.doctor ? "border-red-500" : ""}`}
        />
        {errors.doctor && (
          <p className="text-red-500 text-xs mt-1">{errors.doctor.message}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 py-2.5 rounded-lg border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-border))] transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary flex-1 flex justify-center py-2.5"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              Saving...
            </span>
          ) : (
            "Save Visit"
          )}
        </button>
      </div>
    </form>
  );
}
