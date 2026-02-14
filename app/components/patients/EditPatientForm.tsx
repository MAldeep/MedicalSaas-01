"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IPatient } from "@/models/Patient";
import { X } from "lucide-react";

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
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  address: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z
    .string()
    .regex(
      /^[\d\s\-\+\(\)]*$/,
      "Phone can only contain numbers, spaces, and +-()",
    )
    .optional()
    .or(z.literal("")),
  history: z.string().optional(),
});

type PatientFormData = z.infer<typeof patientSchema>;

interface EditPatientFormProps {
  patient: IPatient;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EditPatientForm({
  patient,
  onSuccess,
  onCancel,
}: EditPatientFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<PatientFormData>({
    resolver: zodResolver(patientSchema),
    defaultValues: {
      firstName: patient.firstName,
      lastName: patient.lastName,
      dateOfBirth: new Date(patient.dateOfBirth).toISOString().split("T")[0],
      gender: patient.gender,
      contactNumber: patient.contactNumber,
      email: patient.email || "",
      address: patient.address || "",
      emergencyContactName: patient.emergencyContact?.name || "",
      emergencyContactPhone: patient.emergencyContact?.phone || "",
      history: patient.history || "",
    },
  });

  const onSubmit = async (data: PatientFormData) => {
    try {
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        contactNumber: data.contactNumber,
        email: data.email || undefined,
        address: data.address || undefined,
        emergencyContact:
          data.emergencyContactName || data.emergencyContactPhone
            ? {
                name: data.emergencyContactName || "",
                phone: data.emergencyContactPhone || "",
              }
            : undefined,
        history: data.history || undefined,
      };

      const res = await fetch(`/api/patients/${patient._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.error || "Something went wrong");
      }

      onSuccess();
    } catch (err: unknown) {
      setFormError("root", {
        message:
          err instanceof Error ? err.message : "An unexpected error occurred",
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-[rgb(var(--color-surface))] rounded-xl shadow-2xl border border-[rgb(var(--color-border))] max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
              Edit Patient
            </h2>
            <p className="text-sm text-[rgb(var(--color-text-muted))] mt-1">
              Update patient information
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          {errors.root && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm">
              {errors.root.message}
            </div>
          )}

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              Personal Information
            </h3>
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
                  <p className="text-red-500 text-xs mt-1">
                    {errors.gender.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              Contact Information
            </h3>
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
                htmlFor="email"
                className="block text-sm font-medium text-[rgb(var(--color-text))]"
              >
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                {...register("email")}
                placeholder="patient@example.com"
                className={`input w-full ${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-[rgb(var(--color-text))]"
              >
                Address (Optional)
              </label>
              <input
                type="text"
                id="address"
                {...register("address")}
                placeholder="123 Main St, City, State"
                className="input w-full"
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              Emergency Contact (Optional)
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="emergencyContactName"
                  className="block text-sm font-medium text-[rgb(var(--color-text))]"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="emergencyContactName"
                  {...register("emergencyContactName")}
                  placeholder="Contact name"
                  className="input w-full"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="emergencyContactPhone"
                  className="block text-sm font-medium text-[rgb(var(--color-text))]"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="emergencyContactPhone"
                  {...register("emergencyContactPhone")}
                  placeholder="+1 (555) 000-0000"
                  className={`input w-full ${errors.emergencyContactPhone ? "border-red-500" : ""}`}
                />
                {errors.emergencyContactPhone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.emergencyContactPhone.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Medical History */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              Medical History
            </h3>
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
                rows={4}
                className="input w-full resize-none"
                placeholder="Brief medical history..."
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t border-[rgb(var(--color-border))]">
            <button
              type="button"
              onClick={onCancel}
              className="btn-outline flex-1"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1 flex justify-center items-center gap-2"
            >
              {isSubmitting ? (
                <>
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
                </>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
