import { ArrowLeft, Edit } from "lucide-react";
import Link from "next/link";

interface PageHeaderProps {
  onEditClick: () => void;
}

export default function PageHeader({ onEditClick }: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href="/"
        className="flex items-center gap-2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))] transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="hidden sm:inline">Back to Patients</span>
      </Link>
      <button
        onClick={onEditClick}
        className="btn-primary flex items-center gap-2 text-sm"
      >
        <Edit className="h-4 w-4" />
        <span>Edit Patient</span>
      </button>
    </div>
  );
}
