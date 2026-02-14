"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { IPatient } from "@/models/Patient";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Hash,
  MapPin,
  AlertCircle,
  FileText,
  Download,
  ArrowLeft,
  Edit,
  Loader2,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import EditPatientForm from "@/app/components/patients/EditPatientForm";

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

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (dateOfBirth: Date) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleEditSuccess = async () => {
    setIsEditModalOpen(false);
    setShowSuccessMessage(true);

    // Refresh patient data
    try {
      const res = await fetch(`/api/patients/${params.id}`);
      const data = await res.json();
      if (res.ok) {
        setPatient(data.data);
      }
    } catch (err) {
      console.error("Error refreshing patient data:", err);
    }

    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  };

  const handleEditCancel = () => {
    setIsEditModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-[rgb(var(--color-primary))] animate-spin mx-auto mb-4" />
          <p className="text-[rgb(var(--color-text-muted))]">
            Loading patient file...
          </p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-[rgb(var(--color-bg))] flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 text-red-600 px-6 py-4 rounded-lg max-w-md">
            <p className="font-semibold">Error loading patient</p>
            <p className="text-sm mt-1">{error || "Patient not found"}</p>
            <button
              onClick={() => router.push("/")}
              className="mt-4 text-sm underline"
            >
              Return to home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-8 px-4">
      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 px-6 py-4 rounded-lg shadow-lg border border-green-200 flex items-center gap-3 animate-slide-in">
          <CheckCircle className="h-5 w-5" />
          <span className="font-medium">Patient updated successfully!</span>
        </div>
      )}

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
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-primary))]"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Patients
          </Link>
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="btn-primary flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            Edit Patient
          </button>
        </div>

        {/* Patient Header Card */}
        <div className="card p-8">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-[rgb(var(--color-primary))] bg-opacity-10 rounded-full flex items-center justify-center shrink-0">
              <User className="h-12 w-12 text-[rgb(var(--color-primary))]" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-[rgb(var(--color-text))] mb-2">
                    {patient.firstName} {patient.lastName}
                  </h1>
                  <div className="flex items-center gap-4 text-[rgb(var(--color-text-muted))]">
                    <span className="flex items-center gap-1">
                      <Hash className="h-4 w-4" />
                      <span className="font-mono">{patient.patientId}</span>
                    </span>
                    <span>•</span>
                    <span>{patient.gender}</span>
                    <span>•</span>
                    <span>{calculateAge(patient.dateOfBirth)} years old</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Contact & Personal Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Contact Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
                Contact Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
                  <div>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      Phone
                    </p>
                    <p className="text-[rgb(var(--color-text))] font-medium">
                      {patient.contactNumber}
                    </p>
                  </div>
                </div>
                {patient.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
                    <div>
                      <p className="text-sm text-[rgb(var(--color-text-muted))]">
                        Email
                      </p>
                      <p className="text-[rgb(var(--color-text))] font-medium break-all">
                        {patient.email}
                      </p>
                    </div>
                  </div>
                )}
                {patient.address && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
                    <div>
                      <p className="text-sm text-[rgb(var(--color-text-muted))]">
                        Address
                      </p>
                      <p className="text-[rgb(var(--color-text))] font-medium">
                        {patient.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Personal Information */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
                Personal Information
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-[rgb(var(--color-primary))] mt-0.5" />
                  <div>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      Date of Birth
                    </p>
                    <p className="text-[rgb(var(--color-text))] font-medium">
                      {formatDate(patient.dateOfBirth)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {patient.emergencyContact?.name && (
              <div className="card p-6">
                <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-[rgb(var(--color-error))]" />
                  Emergency Contact
                </h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-[rgb(var(--color-text-muted))]">
                      Name
                    </p>
                    <p className="text-[rgb(var(--color-text))] font-medium">
                      {patient.emergencyContact.name}
                    </p>
                  </div>
                  {patient.emergencyContact.phone && (
                    <div>
                      <p className="text-sm text-[rgb(var(--color-text-muted))]">
                        Phone
                      </p>
                      <p className="text-[rgb(var(--color-text))] font-medium">
                        {patient.emergencyContact.phone}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Medical History & Attachments */}
          <div className="lg:col-span-2 space-y-6">
            {/* Medical History */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
                Medical History
              </h2>
              {patient.history ? (
                <div className="prose max-w-none">
                  <p className="text-[rgb(var(--color-text))] whitespace-pre-wrap">
                    {patient.history}
                  </p>
                </div>
              ) : (
                <p className="text-[rgb(var(--color-text-muted))] italic">
                  No medical history recorded
                </p>
              )}
            </div>

            {/* Attachments */}
            <div className="card p-6">
              <h2 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-4">
                Attachments
              </h2>
              {patient.attachments && patient.attachments.length > 0 ? (
                <div className="space-y-3">
                  {patient.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-[rgb(var(--color-border))] rounded-lg hover:bg-[rgb(var(--color-bg))] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                        <div>
                          <p className="text-[rgb(var(--color-text))] font-medium">
                            {attachment.filename}
                          </p>
                          <p className="text-sm text-[rgb(var(--color-text-muted))]">
                            Uploaded {formatDate(attachment.uploadedAt)}
                          </p>
                        </div>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-outline flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[rgb(var(--color-text-muted))] italic">
                  No attachments uploaded
                </p>
              )}
            </div>

            {/* Record Information */}
            <div className="card p-6 bg-[rgb(var(--color-bg))]">
              <h2 className="text-sm font-semibold text-[rgb(var(--color-text-muted))] mb-3">
                Record Information
              </h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-[rgb(var(--color-text-muted))]">Created</p>
                  <p className="text-[rgb(var(--color-text))] font-medium">
                    {formatDate(patient.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-[rgb(var(--color-text-muted))]">
                    Last Updated
                  </p>
                  <p className="text-[rgb(var(--color-text))] font-medium">
                    {formatDate(patient.updatedAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
