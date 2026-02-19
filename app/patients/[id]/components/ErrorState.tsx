interface ErrorStateProps {
  error: string | null;
  onReturn: () => void;
}

export default function ErrorState({ error, onReturn }: ErrorStateProps) {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
      <div className="text-center">
        <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg max-w-md">
          <p className="font-semibold">Error loading patient</p>
          <p className="text-sm mt-1">{error || "Patient not found"}</p>
          <button onClick={onReturn} className="mt-4 text-sm underline">
            Return to home
          </button>
        </div>
      </div>
    </div>
  );
}
