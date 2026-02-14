"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useState, useCallback } from "react";
import SearchBar from "./components/SearchBar";
import PatientsList from "./components/PatientsList";
import { IPatient } from "@/models/Patient";
import { UserPlus } from "lucide-react";

export default function Home() {
  const { data: session, status } = useSession();
  const [patients, setPatients] = useState<IPatient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    setSearchQuery(query);
    setHasSearched(true);
    setLoading(true);
    setError(null);

    try {
      const url = query
        ? `/api/patients?q=${encodeURIComponent(query)}`
        : "/api/patients";

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to fetch patients");
      }

      setPatients(data.data || []);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred",
      );
      setPatients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(var(--color-background))]">
      {/* Hero Section with Search */}
      <div className="bg-linear-to-br from-[rgb(var(--color-primary))] to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center space-y-6 mb-8">
            <h1 className="text-5xl font-bold">
              Welcome to Medical Files SaaS
            </h1>
            <p className="text-xl text-blue-50">
              Modern medical file management for private clinics
            </p>

            {status === "loading" ? (
              <div className="mt-8">
                <p className="text-lg text-blue-50">Loading...</p>
              </div>
            ) : !session?.user ? (
              <div className="mt-8 space-y-4">
                <p className="text-lg text-blue-50">
                  Get started by creating an account or signing in
                </p>
                <div className="flex justify-center gap-4">
                  <Link
                    href="/register"
                    className="bg-white text-[rgb(var(--color-primary))] px-6 py-3 text-lg rounded-lg font-semibold hover:bg-blue-50 transition-colors"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="bg-transparent border-2 border-white text-white px-6 py-3 text-lg rounded-lg hover:bg-white hover:text-[rgb(var(--color-primary))] transition-colors"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            ) : null}
          </div>

          {/* Search Bar - Only show when logged in */}
          {session?.user && (
            <div className="mt-8">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {session?.user && (
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-[rgb(var(--color-text))]">
              {searchQuery ? "Search Results" : "All Patients"}
            </h2>
            <Link
              href="/patients/add"
              className="btn-primary px-6 py-3 flex items-center gap-2"
            >
              <UserPlus className="h-5 w-5" />
              Add New Patient
            </Link>
          </div>

          {hasSearched && (
            <PatientsList
              patients={patients}
              loading={loading}
              error={error}
              searchQuery={searchQuery}
            />
          )}

          {!hasSearched && (
            <div className="text-center py-16">
              <p className="text-lg text-[rgb(var(--color-text-muted))]">
                Use the search bar above to find patients or view all patients
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
