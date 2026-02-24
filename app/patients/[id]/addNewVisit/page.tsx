"use client";

import { useParams } from "next/navigation";
import NewVisitForm from "./NewVisitForm";

export default function AddNewVisit() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <NewVisitForm patientId={id} />
    </div>
  );
}
// form
// logic
// push back
