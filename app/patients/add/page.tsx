import AddPatientForm from "../../components/patients/AddPatientForm";

export default function AddPatientPage() {
  return (
    <div className="min-h-screen bg-[rgb(var(--color-bg))] py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-extrabold text-[rgb(var(--color-text))] tracking-tight">
            Patient Registration
          </h1>
          <p className="text-lg text-[rgb(var(--color-text-muted))] max-w-2xl mx-auto">
            Create a new patient record securely. All fields marked with * are
            required.
          </p>
        </div>

        <AddPatientForm />
      </div>
    </div>
  );
}
