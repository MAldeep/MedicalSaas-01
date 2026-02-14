import Patient from "@/models/Patient";

/**
 * Generates a unique patient ID in the format: PAT-YYYY-NNNN
 * Example: PAT-2026-0001
 */
export async function generatePatientId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `PAT-${year}-`;

  // Find the latest patient ID for this year
  const latestPatient = await Patient.findOne({
    patientId: new RegExp(`^${prefix}`),
  })
    .sort({ patientId: -1 })
    .select("patientId")
    .lean();

  if (!latestPatient) {
    // First patient of the year
    return `${prefix}0001`;
  }

  // Extract the number from the latest patient ID and increment
  const latestNumber = parseInt(latestPatient.patientId.split("-")[2]);
  const nextNumber = latestNumber + 1;

  // Pad with zeros to ensure 4 digits
  return `${prefix}${nextNumber.toString().padStart(4, "0")}`;
}

/**
 * Calculate age from date of birth
 */
export function calculateAge(dateOfBirth: Date): number {
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
}

/**
 * Format date to readable string
 */
export function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
