"use client";
import axios from "axios";
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
    <div className="card p-6">
      {/* TOP */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Visits</h2>
        <button className="btn btn-primary">Add Visit</button>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto -mx-2 sm:mx-0">
        <table className="visits-table w-full border-collapse min-w-[600px] sm:min-w-full">
          <thead className="hidden sm:table-header-group mb-2">
            <tr className="bg-gray-100 rounded-2xl">
              <th className="text-left p-3 text-sm font-semibold text-gray-600 first:rounded-l-2xl last:rounded-r-2xl">
                Date
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">
                Reason
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">
                Diagnosis
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">
                Procedure
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600">
                Doctor
              </th>
              <th className="text-left p-3 text-sm font-semibold text-gray-600 last:rounded-r-2xl">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {visits.length > 0 ? (
              visits.map((visit) => (
                <tr
                  key={visit._id}
                  className="block sm:table-row mb-3 sm:mb-0 bg-gray-100 rounded-2xl sm:hover:bg-gray-200 transition-colors"
                >
                  <td
                    data-label="Date"
                    className="responsive-cell first:rounded-t-2xl sm:first:rounded-l-2xl sm:first:rounded-tr-none"
                  >
                    {visit.date}
                  </td>
                  <td data-label="Reason" className="responsive-cell">
                    {visit.reason}
                  </td>
                  <td data-label="Diagnosis" className="responsive-cell">
                    {visit.diagnosis}
                  </td>
                  <td data-label="Procedure" className="responsive-cell">
                    {visit.procedure}
                  </td>
                  <td data-label="Doctor" className="responsive-cell">
                    {visit.doctor}
                  </td>
                  <td
                    data-label="Actions"
                    className="responsive-cell last:rounded-b-2xl sm:last:rounded-r-2xl sm:last:rounded-bl-none"
                  >
                    <div className="flex gap-2">
                      <button className="btn btn-primary text-sm">Edit</button>
                      <button className="btn btn-danger text-sm">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center p-6 bg-gray-100 rounded-2xl text-gray-500"
                >
                  No visits found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
