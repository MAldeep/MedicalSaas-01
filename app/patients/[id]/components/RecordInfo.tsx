import { IPatient } from "@/models/Patient";
import { formatDate } from "./utils";

interface RecordInfoProps {
  patient: IPatient;
}

export default function RecordInfo({ patient }: RecordInfoProps) {
  return (
    <div className="card p-6 bg-[rgb(var(--color-bg))]">
      <h2 className="text-sm font-semibold text-[rgb(var(--color-text-muted))] mb-3">
        Record Information
      </h2>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-[rgb(var(--color-text-muted))]">Created</p>
          <p className="text-[rgb(var(--color-text))] font-medium">
            {formatDate(patient.createdAt)}
          </p>
        </div>
        <div>
          <p className="text-[rgb(var(--color-text-muted))]">Last Updated</p>
          <p className="text-[rgb(var(--color-text))] font-medium">
            {formatDate(patient.updatedAt)}
          </p>
        </div>
      </div>
    </div>
  );
}
