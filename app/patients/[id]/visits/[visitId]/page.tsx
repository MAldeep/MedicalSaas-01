"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";

import { Visit, VisitAttachment } from "./_types";
import VisitHeader from "./_components/VisitHeader";
import VisitDetailsCard from "./_components/VisitDetailsCard";
import NextStepsCard from "./_components/NextStepsCard";
import AttachmentsCard from "./_components/AttachmentsCard";

export default function VisitDetailPage() {
  const params = useParams();
  const patientId = params.id as string;
  const visitId = params.visitId as string;

  // ── Data ────────────────────────────────────────────────────────────────────
  const [visit, setVisit] = useState<Visit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ── Edit state ───────────────────────────────────────────────────────────────
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Partial<Visit>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // ── Attachment state ─────────────────────────────────────────────────────────
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // ── Fetch ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const res = await axios.get(
          `/api/patients/${patientId}/visits/${visitId}`,
        );
        setVisit(res.data.data);
        setForm(res.data.data);
      } catch {
        setError("Failed to load visit.");
      } finally {
        setLoading(false);
      }
    };
    fetchVisit();
  }, [patientId, visitId]);

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError(null);
    try {
      const res = await axios.patch(
        `/api/patients/${patientId}/visits/${visitId}`,
        {
          date: form.date,
          reason: form.reason,
          diagnosis: form.diagnosis,
          procedure: form.procedure,
          doctor: form.doctor,
          nextSteps: form.nextSteps,
        },
      );
      setVisit(res.data.data);
      setEditing(false);
    } catch (err: unknown) {
      setSaveError(
        err instanceof Error ? err.message : "Failed to save changes.",
      );
    } finally {
      setSaving(false);
    }
  };

  // ── Upload attachment ────────────────────────────────────────────────────────
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setUploadError("File must be smaller than 10 MB.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const res = await axios.post(
          `/api/patients/${patientId}/visits/${visitId}/attachments`,
          { filename: file.name, data: reader.result as string },
        );
        setVisit((prev) =>
          prev
            ? {
                ...prev,
                visitAttachments: [
                  ...(prev.visitAttachments ?? []),
                  res.data.data,
                ],
              }
            : prev,
        );
      } catch {
        setUploadError("Upload failed. Please try again.");
      } finally {
        setUploading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // ── Delete attachment ────────────────────────────────────────────────────────
  const handleDeleteAttachment = async (attachmentId: string) => {
    try {
      await axios.delete(
        `/api/patients/${patientId}/visits/${visitId}/attachments?attachmentId=${attachmentId}`,
      );
      setVisit((prev) =>
        prev
          ? {
              ...prev,
              visitAttachments: prev.visitAttachments?.filter(
                (a) => String(a._id) !== attachmentId,
              ),
            }
          : prev,
      );
    } catch {
      setUploadError("Failed to delete attachment.");
    }
  };

  // ── Download attachment ──────────────────────────────────────────────────────
  const handleDownload = (att: VisitAttachment) => {
    const [header, data] = att.url.split(",");
    const mime = header.match(/:(.*?);/)?.[1] ?? "application/octet-stream";
    const binary = atob(data);
    const arr = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) arr[i] = binary.charCodeAt(i);
    const blob = new Blob([arr], { type: mime });
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = att.filename;
    a.click();
    URL.revokeObjectURL(blobUrl);
  };

  // ── Loading / error states ───────────────────────────────────────────────────
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center text-[rgb(var(--color-text-muted))]">
        Loading visit…
      </div>
    );

  if (error || !visit)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        {error ?? "Visit not found."}
      </div>
    );

  const formattedDate = new Date(visit.date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <VisitHeader
        formattedDate={formattedDate}
        editing={editing}
        saving={saving}
        onEdit={() => setEditing(true)}
        onCancel={() => {
          setEditing(false);
          setForm(visit);
          setSaveError(null);
        }}
        onSave={handleSave}
      />

      {saveError && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
          {saveError}
        </div>
      )}

      <VisitDetailsCard
        visit={visit}
        editing={editing}
        form={form}
        onChange={(patch) => setForm((prev) => ({ ...prev, ...patch }))}
      />

      <NextStepsCard
        nextSteps={visit.nextSteps}
        editing={editing}
        value={form.nextSteps ?? ""}
        onChange={(val) => setForm((prev) => ({ ...prev, nextSteps: val }))}
        onStartEdit={() => setEditing(true)}
      />

      <AttachmentsCard
        attachments={visit.visitAttachments ?? []}
        uploading={uploading}
        error={uploadError}
        onUpload={handleUpload}
        onDownload={handleDownload}
        onDelete={handleDeleteAttachment}
      />

      <p className="text-center text-xs text-[rgb(var(--color-text-muted))]">
        Visit ID: {visit._id} ·{" "}
        <Link
          href={`/patients/${patientId}`}
          className="text-blue-600 hover:underline"
        >
          Back to patient file
        </Link>
      </p>
    </div>
  );
}
