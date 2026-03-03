import Link from "next/link";

export default function LoginToReg() {
  return (
    <div className="text-center">
      <p className="text-sm text-[rgb(var(--color-text-muted))]">
        Don&apos;t have an account?
        <Link
          href="/register"
          className="font-medium text-[rgb(var(--color-primary))] hover:underline ml-1"
        >
          Sign up
        </Link>
      </p>
    </div>
  );
}
