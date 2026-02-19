import { User, Hash } from "lucide-react";
import { IPatient } from "@/models/Patient";
import { calculateAge } from "./utils";

interface PatientHeaderCardProps {
  patient: IPatient;
}

export default function PatientHeaderCard({ patient }: PatientHeaderCardProps) {
  return (
    <div className="card p-8">
      <div className="flex items-start gap-6">
        <div className="w-24 h-24 bg-[rgb(var(--color-primary))] bg-opacity-10 rounded-full flex items-center justify-center shrink-0">
          <User className="h-12 w-12 text-[rgb(var(--color-primary))]" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
                {patient.firstName} {patient.lastName}
              </h1>
              <div className="flex items-center gap-4 text-[rgb(var(--color-text-muted))]">
                <span className="flex items-center gap-1">
                  <Hash className="h-4 w-4" />
                  <span className="font-mono">{patient.patientId}</span>
                </span>
                <span>•</span>
                <span>{patient.gender}</span>
                <span>•</span>
                <span>{calculateAge(patient.dateOfBirth)} years old</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
