import { User, Hash } from "lucide-react";
import { IPatient } from "@/models/Patient";
import { calculateAge } from "./utils";

interface PatientHeaderCardProps {
  patient: IPatient;
}

export default function PatientHeaderCard({ patient }: PatientHeaderCardProps) {
  return (
    <div className="card p-5 sm:p-8">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[rgb(var(--color-primary))] bg-opacity-10 rounded-full flex items-center justify-center shrink-0">
          <User className="h-10 w-10 sm:h-12 sm:w-12 text-[rgb(var(--color-primary))]" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
            {patient.firstName} {patient.lastName}
          </h1>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 sm:gap-4 text-sm text-[rgb(var(--color-text-muted))]">
            <span className="flex items-center gap-1">
              <Hash className="h-4 w-4" />
              <span className="font-mono">{patient.patientId}</span>
            </span>
            <span className="hidden sm:inline">•</span>
            <span>{patient.gender}</span>
            <span className="hidden sm:inline">•</span>
            <span>{calculateAge(patient.dateOfBirth)} years old</span>
          </div>
        </div>
      </div>
    </div>
  );
}
