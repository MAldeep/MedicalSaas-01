"use client";

import { IPatient } from "@/models/Patient";
import PatientCard from "./PatientCard";
import { Loader2, UserX } from "lucide-react";

interface PatientsListProps {
  patients: IPatient[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export default function PatientsList({
  patients,
  loading,
  error,
  searchQuery,
}: PatientsListProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="h-12 w-12 text-[rgb(var(--color-primary))] animate-spin mb-4" />
        <p className="text-[rgb(var(--color-text-muted))]">
          Loading patients...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg">
          <p className="font-semibold">Error loading patients</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <UserX className="h-16 w-16 text-[rgb(var(--color-text-muted))] mb-4" />
        <p className="text-lg font-semibold text-[rgb(var(--color-text))]">
          {searchQuery ? "No patients found" : "No patients yet"}
        </p>
        <p className="text-sm text-[rgb(var(--color-text-muted))] mt-2">
          {searchQuery
            ? "Try adjusting your search query"
            : "Add your first patient to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <p className="text-sm text-[rgb(var(--color-text-muted))]">
          {patients.length} patient{patients.length !== 1 ? "s" : ""} found
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient) => (
          <PatientCard key={patient._id?.toString()} patient={patient} />
        ))}
      </div>
    </div>
  );
}
