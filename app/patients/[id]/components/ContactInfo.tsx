import { Phone, Mail, MapPin } from "lucide-react";
import { IPatient } from "@/models/Patient";

interface ContactInfoProps {
  patient: IPatient;
}

export default function ContactInfo({ patient }: ContactInfoProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
        Contact Information
      </h2>
      <div className="space-y-3">
        <div className="flex items-start gap-3">
          <Phone className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
          <div>
            <p className="text-sm text-[rgb(var(--color-text-muted))]">Phone</p>
            <p className="text-[rgb(var(--color-text))] font-medium">
              {patient.contactNumber}
            </p>
          </div>
        </div>

        {patient.email && (
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
            <div>
              <p className="text-sm text-[rgb(var(--color-text-muted))]">
                Email
              </p>
              <p className="text-[rgb(var(--color-text))] font-medium break-all">
                {patient.email}
              </p>
            </div>
          </div>
        )}

        {patient.address && (
          <div className="flex items-start gap-3">
            <MapPin className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
            <div>
              <p className="text-sm text-[rgb(var(--color-text-muted))]">
                Address
              </p>
              <p className="text-[rgb(var(--color-text))] font-medium">
                {patient.address}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
