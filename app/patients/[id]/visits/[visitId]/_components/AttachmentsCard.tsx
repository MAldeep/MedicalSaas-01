"use client";

import { useRef } from "react";
import { VisitAttachment } from "../_types";
import { FileIcon } from "./ui";

interface AttachmentsCardProps {
  attachments: VisitAttachment[];
  uploading: boolean;
  error: string | null;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDownload: (att: VisitAttachment) => void;
  onDelete: (attachmentId: string) => void;
}

export default function AttachmentsCard({
  attachments,
  uploading,
  error,
  onUpload,
  onDownload,
  onDelete,
}: AttachmentsCardProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="card p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] pb-3">
        <h2 className="text-base font-semibold text-[rgb(var(--color-text))] flex items-center gap-2">
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
            <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
          </svg>
          Attachments
          {attachments.length > 0 && (
            <span className="text-xs font-normal text-[rgb(var(--color-text-muted))]">
              ({attachments.length})
            </span>
          )}
        </h2>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-primary text-sm px-3 py-1.5"
        >
          {uploading ? "Uploading…" : "+ Upload"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={onUpload}
          accept="image/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      {/* Empty state */}
      {attachments.length === 0 ? (
        <div className="flex flex-col items-center py-8 gap-2 text-[rgb(var(--color-text-muted))]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-8 h-8 opacity-30"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
          <p className="text-sm">No attachments yet</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {attachments.map((att) => (
            <li
              key={String(att._id)}
              className="flex items-center justify-between p-3 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-bg))] transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon filename={att.filename} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[rgb(var(--color-text))] truncate">
                    {att.filename}
                  </p>
                  <p className="text-xs text-[rgb(var(--color-text-muted))]">
                    {new Date(att.uploadedAt).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 ml-4">
                <button
                  onClick={() => onDownload(att)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-[rgb(var(--color-border))] hover:bg-[rgb(var(--color-border))] transition-colors"
                >
                  Download
                </button>
                <button
                  onClick={() => onDelete(String(att._id))}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
