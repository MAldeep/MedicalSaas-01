import { CheckCircle } from "lucide-react";

export default function SuccessMessage() {
  return (
    <div className="fixed top-4 right-4 z-50 bg-green-50 text-green-600 px-6 py-4 rounded-lg shadow-lg border border-green-200 flex items-center gap-3 animate-slide-in">
      <CheckCircle className="h-5 w-5" />
      <span className="font-medium">Patient updated successfully!</span>
    </div>
  );
}
