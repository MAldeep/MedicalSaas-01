"use client";

import { useRouter } from "next/navigation";

interface VisitHeaderProps {
  formattedDate: string;
  editing: boolean;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function VisitHeader({
  formattedDate,
  editing,
  saving,
  onEdit,
  onCancel,
  onSave,
}: VisitHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="p-2 rounded-lg hover:bg-[rgb(var(--color-border))] transition-colors"
        aria-label="Go back"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-[rgb(var(--color-text-muted))]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 5l-7 7 7 7" />
        </svg>
      </button>

      {/* Title + mode badge */}
      <div className="flex items-center gap-2.5">
        <div>
          <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
            Visit Record
          </h1>
          <p className="text-sm text-[rgb(var(--color-text-muted))]">
            {formattedDate}
          </p>
        </div>

        {/* Read-only / Editing badge */}
        {editing ? (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            Editing
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-500 border border-slate-200">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            Read-only
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="ml-auto flex gap-2">
        {editing ? (
          <>
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-lg border border-[rgb(var(--color-border))] text-sm hover:bg-[rgb(var(--color-border))] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="btn-primary text-sm px-4 py-2"
            >
              {saving ? "Saving…" : "Save Changes"}
            </button>
          </>
        ) : (
          <button onClick={onEdit} className="btn-primary text-sm px-4 py-2">
            Edit
          </button>
        )}
      </div>
    </div>
  );
}
