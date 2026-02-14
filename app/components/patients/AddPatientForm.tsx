"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";

// Zod validation schema
const patientSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must be less than 50 characters"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must be less than 50 characters"),
  dateOfBirth: z
    .string()
    .min(1, "Date of birth is required")
    .refine((date) => {
      const birthDate = new Date(date);
      const today = new Date();
      return birthDate < today;
    }, "Date of birth must be in the past")
    .refine((date) => {
      const birthDate = new Date(date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age <= 150;
    }, "Please enter a valid date of birth"),
  gender: z.enum(["Male", "Female", "Other"], {
    message: "Gender is required",
  }),
  contactNumber: z
    .string()
    .min(1, "Contact number is required")
    .regex(
      /^[\d\s\-\+\(\)]+$/,
      "Contact number can only contain numbers, spaces, and +-()",
    )
    .min(10, "Contact number must be at least 10 characters"),
  history: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

export default function AddPatientForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "Male",
      contactNumber: "",
      history: "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      router.push("/");
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
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
          Add New Patient
        </h2>
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          Enter the patient&apos;s details below.
        </p>
      </div>

      {errors.root && (
        <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
          {errors.root.message}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="firstName"
            className="block text-sm font-medium text-[rgb(var(--color-text))]"
          >
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            {...register("firstName")}
            className={`input w-full ${errors.firstName ? "border-red-500" : ""}`}
          />
          {errors.firstName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.firstName.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="lastName"
            className="block text-sm font-medium text-[rgb(var(--color-text))]"
          >
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            {...register("lastName")}
            className={`input w-full ${errors.lastName ? "border-red-500" : ""}`}
          />
          {errors.lastName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            htmlFor="dateOfBirth"
            className="block text-sm font-medium text-[rgb(var(--color-text))]"
          >
            Date of Birth
          </label>
          <input
            type="date"
            id="dateOfBirth"
            {...register("dateOfBirth")}
            className={`input w-full ${errors.dateOfBirth ? "border-red-500" : ""}`}
          />
          {errors.dateOfBirth && (
            <p className="text-red-500 text-xs mt-1">
              {errors.dateOfBirth.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label
            htmlFor="gender"
            className="block text-sm font-medium text-[rgb(var(--color-text))]"
          >
            Gender
          </label>
          <select
            id="gender"
            {...register("gender")}
            className={`input w-full ${errors.gender ? "border-red-500" : ""}`}
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
          {errors.gender && (
            <p className="text-red-500 text-xs mt-1">{errors.gender.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="contactNumber"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Contact Number
        </label>
        <input
          type="tel"
          id="contactNumber"
          {...register("contactNumber")}
          placeholder="+1 (555) 000-0000"
          className={`input w-full ${errors.contactNumber ? "border-red-500" : ""}`}
        />
        {errors.contactNumber && (
          <p className="text-red-500 text-xs mt-1">
            {errors.contactNumber.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label
          htmlFor="history"
          className="block text-sm font-medium text-[rgb(var(--color-text))]"
        >
          Medical History (Optional)
        </label>
        <textarea
          id="history"
          {...register("history")}
          rows={3}
          className="input w-full resize-none"
          placeholder="Brief medical history..."
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary w-full flex justify-center py-2.5"
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
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Saving...
          </span>
        ) : (
          "Add Patient"
        )}
      </button>
    </form>
  );
}
