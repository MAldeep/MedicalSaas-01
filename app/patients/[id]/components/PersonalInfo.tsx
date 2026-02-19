import { Calendar } from "lucide-react";
import { IPatient } from "@/models/Patient";
import { formatDate } from "./utils";

interface PersonalInfoProps {
  patient: IPatient;
}

export default function PersonalInfo({ patient }: PersonalInfoProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
        Personal Information
      </h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Calendar className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
          <div>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">
              Date of Birth
            </p>
            <p className="text-[rgb(var(--color-text))] font-medium">
              {formatDate(patient.dateOfBirth)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
