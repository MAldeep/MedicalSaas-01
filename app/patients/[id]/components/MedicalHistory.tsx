interface MedicalHistoryProps {
  history?: string;
}

export default function MedicalHistory({ history }: MedicalHistoryProps) {
  return (
    <div className="card p-6">
      <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
        Medical History
      </h2>
      {history ? (
        <div className="prose max-w-none">
          <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap">
            {history}
          </p>
        </div>
      ) : (
        <p className="text-[rgb(var(--color-text-muted))] italic">
          No medical history recorded
        </p>
      )}
    </div>
  );
}
