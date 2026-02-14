export default function NavBar() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <p className="text-2xl font-bold text-[rgb(var(--color-primary))] tracking-tighter">
          MediSaaS
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="btn-primary cursor-pointer transition-transform hover:scale-105 active:scale-95">
          Login
        </button>
      </div>
    </nav>
  );
}
