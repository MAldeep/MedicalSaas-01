"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <nav className="bg-[rgb(var(--color-surface))] border-b border-[rgb(var(--color-border))] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link
              href="/"
              className="text-xl font-bold text-[rgb(var(--color-primary))]"
            >
              Medical Files SaaS
            </Link>
          </div>

          <div className="flex items-center gap-6">
            {status === "loading" ? (
              <span className="text-sm text-[rgb(var(--color-text-muted))]">
                Loading...
              </span>
            ) : session?.user ? (
              <>
                <Link
                  href="/patients/add"
                  className="text-sm text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Add Patient
                </Link>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[rgb(var(--color-text-muted))]">
                    {session.user.name}
                  </span>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/login"
                  className="text-sm text-[rgb(var(--color-text))] hover:text-[rgb(var(--color-primary))] transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="btn-primary text-sm px-4 py-2"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
