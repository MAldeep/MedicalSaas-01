"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IPatient } from "@/models/Patient";
import EditPatientForm from "@/app/components/patients/EditPatientForm";

// Local sub-components
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import SuccessMessage from "./components/SuccessMessage";
import PageHeader from "./components/PageHeader";
import PatientHeaderCard from "./components/PatientHeaderCard";
import ContactInfo from "./components/ContactInfo";
import PersonalInfo from "./components/PersonalInfo";
import EmergencyContact from "./components/EmergencyContact";
import MedicalHistory from "./components/MedicalHistory";
import Attachments from "./components/Attachments";
import RecordInfo from "./components/RecordInfo";
import Visits from "./components/Visits";

export default function PatientFilePage() {
  const params = useParams();
  const router = useRouter();
  const [patient, setPatient] = useState<IPatient | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        console.log("Fetching patient with ID:", params.id);
        const res = await fetch(`/api/patients/${params.id}`);
        const data = await res.json();
        console.log("API Response:", { status: res.status, data });

        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch patient");
        }

        setPatient(data.data);
      } catch (err: unknown) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPatient();
    }
  }, [params.id]);

  const refreshPatient = async () => {
    try {
      const res = await fetch(`/api/patients/${params.id}`);
      const data = await res.json();
      if (res.ok) setPatient(data.data);
    } catch (err) {
      console.error("Error refreshing patient data:", err);
    }
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    setShowSuccessMessage(true);
    await refreshPatient();

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  if (loading) return <LoadingState />;
  if (error || !patient)
    return <ErrorState error={error} onReturn={() => router.push("/")} />;

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-4 px-3 sm:py-6 sm:px-6 lg:py-8 lg:px-8">
      {/* Success Message */}
      {showSuccessMessage && <SuccessMessage />}

      {/* Edit Modal */}
      {isEditModalOpen && patient && (
        <EditPatientForm
          patient={patient}
          onSuccess={handleEditSuccess}
          onCancel={handleEditCancel}
        />
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <PageHeader onEditClick={() => setIsEditModalOpen(true)} />

        {/* Patient Header Card */}
        <PatientHeaderCard patient={patient} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            <ContactInfo patient={patient} />
            <PersonalInfo patient={patient} />
            <EmergencyContact emergencyContact={patient.emergencyContact} />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">
            <MedicalHistory history={patient.history} />
            <Attachments
              patientId={String(params.id)}
              attachments={patient.attachments}
              onUploadSuccess={refreshPatient}
            />
            <Visits patientId={String(params.id)} />
            <RecordInfo patient={patient} />
          </div>
        </div>
      </div>
    </div>
  );
}
