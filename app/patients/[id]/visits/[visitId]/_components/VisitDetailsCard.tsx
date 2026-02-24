"use client";

import { Visit } from "../_types";
import { Field, Dash } from "./ui";

interface VisitDetailsCardProps {
  visit: Visit;
  editing: boolean;
  form: Partial<Visit>;
  onChange: (patch: Partial<Visit>) => void;
}

export default function VisitDetailsCard({
  visit,
  editing,
  form,
  onChange,
}: VisitDetailsCardProps) {
  const formattedDate = new Date(visit.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="card p-6 space-y-5">
      <h2 className="text-base font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-3">
        Visit Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Date */}
        <Field label="Visit Date">
          {editing ? (
            <input
              type="date"
              className="input w-full"
              value={
                form.date ? new Date(form.date).toISOString().split("T")[0] : ""
              }
              onChange={(e) => onChange({ date: e.target.value })}
            />
          ) : (
            <p className="text-[rgb(var(--color-text))] font-medium">
              {formattedDate}
            </p>
          )}
        </Field>

        {/* Doctor */}
        <Field label="Doctor">
          {editing ? (
            <input
              type="text"
              className="input w-full"
              placeholder="Dr. Smith"
              value={form.doctor ?? ""}
              onChange={(e) => onChange({ doctor: e.target.value })}
            />
          ) : (
            <p className="text-[rgb(var(--color-text))]">
              {visit.doctor || <Dash />}
            </p>
          )}
        </Field>
      </div>

      {/* Reason */}
      <Field label="Reason for Visit">
        {editing ? (
          <textarea
            rows={3}
            className="input w-full resize-none"
            value={form.reason ?? ""}
            onChange={(e) => onChange({ reason: e.target.value })}
          />
        ) : (
          <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap">
            {visit.reason || <Dash />}
          </p>
        )}
      </Field>

      {/* Diagnosis */}
      <Field label="Diagnosis">
        {editing ? (
          <textarea
            rows={2}
            className="input w-full resize-none"
            value={form.diagnosis ?? ""}
            onChange={(e) => onChange({ diagnosis: e.target.value })}
          />
        ) : (
          <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap">
            {visit.diagnosis || <Dash />}
          </p>
        )}
      </Field>

      {/* Procedure */}
      <Field label="Procedure">
        {editing ? (
          <textarea
            rows={2}
            className="input w-full resize-none"
            value={form.procedure ?? ""}
            onChange={(e) => onChange({ procedure: e.target.value })}
          />
        ) : (
          <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap">
            {visit.procedure || <Dash />}
          </p>
        )}
      </Field>
    </div>
  );
}
