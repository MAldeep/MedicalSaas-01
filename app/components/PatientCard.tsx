"use client";

import { IPatient } from "@/models/Patient";
import { User, Phone, Mail, Calendar, Hash } from "lucide-react";

interface PatientCardProps {
  patient: IPatient;
}

export default function PatientCard({ patient }: PatientCardProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="bg-white border border-[rgb(var(--color-border))] rounded-xl p-6 hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[rgb(var(--color-primary))] bg-opacity-10 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-[rgb(var(--color-primary))]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
              {patient.firstName} {patient.lastName}
            </h3>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              {patient.gender}
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
          <Hash className="h-4 w-4" />
          <span className="font-mono">{patient.patientId}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
          <Phone className="h-4 w-4" />
          <span>{patient.contactNumber}</span>
        </div>
        {patient.email && (
          <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
            <Mail className="h-4 w-4" />
            <span>{patient.email}</span>
          </div>
        )}
        <div className="flex items-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
          <Calendar className="h-4 w-4" />
          <span>DOB: {formatDate(patient.dateOfBirth)}</span>
        </div>
      </div>

      {patient.history && (
        <div className="mt-4 pt-4 border-t border-[rgb(var(--color-border))]">
          <p className="text-sm text-[rgb(var(--color-text-muted))] line-clamp-2">
            {patient.history}
          </p>
        </div>
      )}
    </div>
  );
}
