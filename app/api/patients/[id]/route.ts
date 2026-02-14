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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    await dbConnect();

    // Check if patient exists
    const existingPatient = await Patient.findById(id);
    if (!existingPatient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    // Update patient
    const updatedPatient = await Patient.findByIdAndUpdate(
      id,
      {
        firstName: body.firstName,
        lastName: body.lastName,
        dateOfBirth: body.dateOfBirth,
        gender: body.gender,
        contactNumber: body.contactNumber,
        email: body.email,
        address: body.address,
        emergencyContact: body.emergencyContact,
        history: body.history,
      },
      { new: true, runValidators: true },
    );

    return NextResponse.json({
      success: true,
      data: updatedPatient,
    });
  } catch (error: unknown) {
    console.error("Error updating patient:", error);

    // Handle Mongoose validation errors
    if (error && typeof error === "object" && "name" in error) {
      if (error.name === "ValidationError" && "errors" in error) {
        const validationErrors = Object.values(
          error.errors as Record<string, { message: string }>,
        ).map((err) => err.message);
        return NextResponse.json(
          { error: validationErrors.join(", ") },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update patient",
      },
      { status: 500 },
    );
  }
}
