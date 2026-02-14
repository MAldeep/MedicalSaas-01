import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative px-6 py-20 bg-linear-to-b from-[rgb(var(--color-bg))] to-[rgb(var(--color-surface))]">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        {/* Title & Description */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Secure Medical File Management <br />
            <span className="text-[rgb(var(--color-primary))]">
              For Modern Clinics
            </span>
          </h1>
          <p className="text-lg text-[rgb(var(--color-text-muted))] max-w-2xl mx-auto">
            Fast, secure, and collaborative access to patient records.
            Streamline your clinic&apos;s workflow today.
          </p>
        </div>

        {/* Search & Actions */}
        <div className="card p-6 md:p-8 max-w-2xl mx-auto space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <input
              type="text"
              placeholder="Search by patient name or ID..."
              className="input flex-1"
            />
            <button className="btn-primary shrink-0 transition-transform active:scale-95">
              Search Records
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-[rgb(var(--color-text-muted))]">
            <span>Or</span>
            <Link
              href="/patients/add"
              className="text-[rgb(var(--color-primary))] font-medium hover:underline"
            >
              Add a New Patient
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
