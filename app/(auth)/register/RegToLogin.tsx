import Link from "next/link";

export default function RegToLogin() {
  return (
    <div className="text-center">
      <p className="text-sm text-[rgb(var(--color-text-muted))]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-[rgb(var(--color-primary))] hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
