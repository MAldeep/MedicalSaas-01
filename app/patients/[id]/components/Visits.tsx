"use client";
import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface VisitsProp {
  patientId: string;
}
interface Visit {
  _id: string;
  date: string;
  reason: string;
  diagnosis: string;
  procedure: string;
  doctor: string;
  createdAt: string;
}
export default function Visits({ patientId }: VisitsProp) {
  // getting all visits
  const [visits, setVisits] = useState<Visit[]>([]);
  useEffect(() => {
    const getAllVisits = async () => {
      try {
        const res = await axios.get(`/api/patients/${patientId}/visits`);
        setVisits(res.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllVisits();
  }, [patientId]);
  return (
    <div className="card p-4 sm:p-6 flex flex-col gap-5">
      {/* TOP */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-[rgb(var(--color-text))]">
            Visits
          </h2>
          <p className="text-xs text-[rgb(var(--color-text-muted))] mt-0.5">
            {visits.length} visit{visits.length !== 1 ? "s" : ""} recorded
          </p>
        </div>
        <Link
          href={`/patients/${patientId?.toString()}/addNewVisit`}
          className="btn-primary text-sm"
        >
          + Add Visit
        </Link>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto rounded-xl border border-[rgb(var(--color-border))]">
        <table className="w-full border-collapse text-sm">
          {/* ── Header ── */}
          <thead>
            <tr className="bg-[rgb(var(--color-bg))] border-b border-[rgb(var(--color-border))]">
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs w-12">
                #
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs whitespace-nowrap">
                Date
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs">
                Reason
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs">
                Diagnosis
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs">
                Procedure
              </th>
              <th className="text-left px-4 py-3 font-semibold text-[rgb(var(--color-text-muted))] uppercase tracking-wide text-xs">
                Doctor
              </th>
            </tr>
          </thead>

          {/* ── Body ── */}
          <tbody>
            {visits.length > 0 ? (
              visits.map((visit, idx) => (
                <tr
                  key={visit._id}
                  onClick={() =>
                    (window.location.href = `/patients/${patientId}/visits/${visit._id}`)
                  }
                  className={`
                    border-b border-[rgb(var(--color-border))] last:border-0
                    transition-colors cursor-pointer hover:bg-blue-50/50
                    ${idx % 2 === 0 ? "bg-white" : "bg-[rgb(var(--color-bg))]"}
                  `}
                >
                  {/* Index badge */}
                  <td className="px-4 py-3 text-[rgb(var(--color-text-muted))]">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[rgb(var(--color-border))] text-xs font-semibold text-[rgb(var(--color-text-muted))]">
                      {idx + 1}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-[rgb(var(--color-text))]">
                    {visit.date
                      ? new Date(visit.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </td>

                  {/* Reason */}
                  <td className="px-4 py-3 text-[rgb(var(--color-text))] max-w-[180px]">
                    <span className="line-clamp-2">{visit.reason || "—"}</span>
                  </td>

                  {/* Diagnosis */}
                  <td className="px-4 py-3 text-[rgb(var(--color-text-muted))] max-w-[180px]">
                    <span className="line-clamp-2">
                      {visit.diagnosis || "—"}
                    </span>
                  </td>

                  {/* Procedure */}
                  <td className="px-4 py-3 text-[rgb(var(--color-text-muted))] max-w-[180px]">
                    <span className="line-clamp-2">
                      {visit.procedure || "—"}
                    </span>
                  </td>

                  {/* Doctor */}
                  <td className="px-4 py-3 whitespace-nowrap">
                    {visit.doctor ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-medium border border-blue-100">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-3 h-3"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                        {visit.doctor}
                      </span>
                    ) : (
                      <span className="text-[rgb(var(--color-text-muted))]">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-[rgb(var(--color-text-muted))]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-10 h-10 opacity-30"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <p className="text-sm font-medium">
                      No visits recorded yet
                    </p>
                    <Link
                      href={`/patients/${patientId?.toString()}/addNewVisit`}
                      className="btn-primary text-sm mt-1"
                    >
                      Add First Visit
                    </Link>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
