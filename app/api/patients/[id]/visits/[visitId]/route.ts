import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

type RouteContext = { params: Promise<{ id: string; visitId: string }> };

// GET /api/patients/[id]/visits/[visitId] — get a single visit
export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, visitId } = await params;
    await dbConnect();

    const patient = await Patient.findById(id).select("visits");
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const visit = patient.visits?.find((v) => v._id?.toString() === visitId);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: visit });
  } catch (error: unknown) {
    console.error("Error fetching visit:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch visit",
      },
      { status: 500 },
    );
  }
}

// PATCH /api/patients/[id]/visits/[visitId] — update a visit
export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, visitId } = await params;
    const body = await request.json();
    const { date, reason, diagnosis, procedure, doctor, nextSteps } = body;

    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const visit = patient.visits?.find((v) => v._id?.toString() === visitId);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    // Only overwrite fields that were actually sent
    if (date !== undefined) visit.date = new Date(date);
    if (reason !== undefined) visit.reason = reason;
    if (diagnosis !== undefined) visit.diagnosis = diagnosis;
    if (procedure !== undefined) visit.procedure = procedure;
    if (doctor !== undefined) visit.doctor = doctor;
    if (nextSteps !== undefined) visit.nextSteps = nextSteps;

    patient.markModified("visits");
    await patient.save();

    return NextResponse.json({ success: true, data: visit });
  } catch (error: unknown) {
    console.error("Error updating visit:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to update visit",
      },
      { status: 500 },
    );
  }
}

// DELETE /api/patients/[id]/visits/[visitId] — remove a visit
export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, visitId } = await params;
    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const before = patient.visits?.length ?? 0;
    patient.visits = patient.visits?.filter(
      (v) => v._id?.toString() !== visitId,
    );

    if ((patient.visits?.length ?? 0) === before) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    await patient.save();

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting visit:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to delete visit",
      },
      { status: 500 },
    );
  }
}
