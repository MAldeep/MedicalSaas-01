"use client";

interface NextStepsCardProps {
  nextSteps?: string;
  editing: boolean;
  value: string;
  onChange: (val: string) => void;
  onStartEdit: () => void;
}

export default function NextStepsCard({
  nextSteps,
  editing,
  value,
  onChange,
  onStartEdit,
}: NextStepsCardProps) {
  return (
    <div className="card p-6 space-y-4">
      <h2 className="text-base font-semibold text-[rgb(var(--color-text))] border-b border-[rgb(var(--color-border))] pb-3 flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-4 h-4 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
        Next Steps
      </h2>

      {editing ? (
        <textarea
          rows={4}
          className="input w-full resize-none"
          placeholder="Follow-up appointments, medications, referrals…"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : nextSteps ? (
        <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap leading-relaxed">
          {nextSteps}
        </p>
      ) : (
        <p className="text-[rgb(var(--color-text-muted))] text-sm italic">
          No next steps recorded.{" "}
          <button
            onClick={onStartEdit}
            className="text-blue-600 hover:underline not-italic"
          >
            Add now →
          </button>
        </p>
      )}
    </div>
  );
}
