import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    console.log("Fetching patient with ID:", id);

    await dbConnect();

    const patient = await Patient.findById(id);
    console.log("Patient found:", patient ? "Yes" : "No");

    if (!patient) {
      console.log("Patient not found for ID:", id);
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: patient,
    });
  } catch (error: unknown) {
    console.error("Error fetching patient:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch patient data",
      },
      { status: 500 },
    );
  }
}
