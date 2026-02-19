import { AlertCircle } from "lucide-react";
import { IPatient } from "@/models/Patient";

interface EmergencyContactProps {
  emergencyContact: IPatient["emergencyContact"];
}

export default function EmergencyContact({
  emergencyContact,
}: EmergencyContactProps) {
  if (!emergencyContact?.name) return null;

  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4 flex items-center gap-2">
        <AlertCircle className="h-5 w-5 text-[rgb(var(--color-error))]" />
        Emergency Contact
      </h2>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">Name</p>
          <p className="text-[rgb(var(--color-text))] font-medium">
            {emergencyContact.name}
          </p>
        </div>
        {emergencyContact.phone && (
          <div>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Phone</p>
            <p className="text-[rgb(var(--color-text))] font-medium">
              {emergencyContact.phone}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
