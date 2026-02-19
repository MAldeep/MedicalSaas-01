import { Loader2 } from "lucide-react";

export default function LoadingState() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 text-[rgb(var(--color-primary))] animate-spin mx-auto mb-4" />
        <p className="text-[rgb(var(--color-text-muted))]">
          Loading patient file...
        </p>
      </div>
    </div>
  );
}
