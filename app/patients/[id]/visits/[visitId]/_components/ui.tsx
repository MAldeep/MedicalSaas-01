// Shared tiny primitives used across visit detail components

export function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold uppercase tracking-wide text-[rgb(var(--color-text-muted))]">
        {label}
      </p>
      {children}
    </div>
  );
}

export function Dash() {
  return (
    <span className="text-[rgb(var(--color-text-muted))] italic text-sm">
      —
    </span>
  );
}

export function FileIcon({ filename }: { filename: string }) {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const isImage = ["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext);
  const isPdf = ext === "pdf";

  return (
    <div
      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold
      ${isImage ? "bg-purple-100 text-purple-600" : isPdf ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
    >
      {ext.toUpperCase().slice(0, 3) || "FILE"}
    </div>
  );
}
