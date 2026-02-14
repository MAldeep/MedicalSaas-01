"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-[rgb(var(--color-text))] hover:text-red-600 transition-colors"
    >
      Sign Out
    </button>
  );
}
