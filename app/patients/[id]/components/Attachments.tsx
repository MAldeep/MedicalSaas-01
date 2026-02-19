"use client";

import { useRef, useState } from "react";
import {
  FileText,
  Download,
  Upload,
  Loader2,
  X,
  Trash,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { IPatient } from "@/models/Patient";
import { formatDate } from "./utils";

interface AttachmentsProps {
  patientId: string;
  attachments: IPatient["attachments"];
  onUploadSuccess: () => void;
}

// ─── Delete Confirmation Modal ────────────────────────────────────────────────
interface DeleteModalProps {
  filename: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteModal({
  filename,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteModalProps) {
  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(4px)",
      }}
      onClick={onCancel}
    >
      {/* Panel */}
      <div
        className="card w-full max-w-sm p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon + heading */}
        <div className="flex items-start gap-4">
          <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[rgb(var(--color-text))]">
              Delete attachment?
            </h3>
            <p className="mt-1 text-sm text-[rgb(var(--color-text-muted))]">
              <span className="font-medium text-[rgb(var(--color-text))]">
                {filename}
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors disabled:opacity-60"
          >
            {isDeleting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deleting…
              </>
            ) : (
              <>
                <Trash className="h-4 w-4" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Attachments({
  patientId,
  attachments,
  onUploadSuccess,
}: AttachmentsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{
    index: number;
    filename: string;
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const filesSize = file.size;
    // 10 MB limit
    if (filesSize > 10 * 1024 * 1024) {
      setUploadError("File size must be less than 10 MB.");
      return;
    }

    setUploadError(null);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch(`/api/patients/${patientId}/attachments`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");

      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      onUploadSuccess();
    } catch (err: unknown) {
      setUploadError(
        err instanceof Error ? err.message : "An unexpected error occurred.",
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancelSelection = () => {
    setSelectedFile(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Browsers block navigating to raw data: URLs — convert to a Blob URL instead
  const handlePreview = (dataUrl: string) => {
    const [header, base64] = dataUrl.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
    const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
    const blob = new Blob([bytes], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, "_blank");
    // Revoke after a short delay so the tab has time to load it
    setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
  };

  const handleDownload = (dataUrl: string, filename: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = filename;
    a.click();
  };

  // Opens the modal — does NOT delete yet
  const handleDeleteClick = (index: number, filename: string) => {
    setDeleteTarget({ index, filename });
  };

  // Called when user confirms inside the modal
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/patients/${patientId}/attachments?index=${deleteTarget.index}`,
        { method: "DELETE" },
      );
      if (res.ok) onUploadSuccess();
    } catch (err) {
      console.error("Error deleting attachment:", err);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteTarget && (
        <DeleteModal
          filename={deleteTarget.filename}
          isDeleting={isDeleting}
          onConfirm={handleDeleteConfirm}
          onCancel={() => !isDeleting && setDeleteTarget(null)}
        />
      )}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
          Attachments
        </h2>

        {/* Attachment list */}
        {attachments && attachments.length > 0 ? (
          <div className="space-y-3 mb-4">
            {attachments.map((attachment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-bg))] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                  <div>
                    <p className="text-[rgb(var(--color-text))] font-medium">
                      {attachment.filename}
                    </p>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      Uploaded {formatDate(attachment.uploadedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col lg:flex-row items-center gap-2">
                  <button
                    onClick={() => handlePreview(attachment.url)}
                    className="btn-outline flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>
                  <button
                    onClick={() =>
                      handleDownload(attachment.url, attachment.filename)
                    }
                    className="btn-outline flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                  <button
                    onClick={() =>
                      handleDeleteClick(index, attachment.filename)
                    }
                    className="btn-outline flex items-center gap-2 text-red-500 hover:border-red-400"
                  >
                    <Trash className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-[rgb(var(--color-text-muted))] italic mb-4">
            No attachments uploaded
          </p>
        )}

        {/* Upload area */}
        <div className="border-t border-[rgb(var(--color-border))] pt-4 space-y-3">
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt"
          />

          {/* File preview row (once a file is chosen) */}
          {selectedFile && (
            <div className="flex items-center justify-between p-3 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg">
              <div className="flex items-center gap-2 min-w-0">
                <FileText className="h-4 w-4 text-[rgb(var(--color-primary))] shrink-0" />
                <span className="text-sm text-[rgb(var(--color-text))] truncate">
                  {selectedFile.name}
                </span>
                <span className="text-xs text-[rgb(var(--color-text-muted))] shrink-0">
                  ({(selectedFile.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                onClick={handleCancelSelection}
                className="ml-2 text-[rgb(var(--color-text-muted))] hover:text-red-500 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Error message */}
          {uploadError && <p className="text-sm text-red-500">{uploadError}</p>}

          {/* Action buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="btn-outline flex items-center gap-2 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              {selectedFile ? "Change File" : "Choose File"}
            </button>

            {selectedFile && (
              <button
                onClick={handleUpload}
                disabled={isUploading}
                className="btn-primary flex items-center gap-2"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    Upload
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-[rgb(var(--color-text-muted))]">
            Accepted: PDF, Word, PNG, JPG, TXT — max 10 MB
          </p>
        </div>
      </div>
    </>
  );
}
