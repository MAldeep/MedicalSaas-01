import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

// GET /api/patients/[id]/visits — list all visits
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await dbConnect();

    const patient = await Patient.findById(id).select("visits");
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: patient.visits ?? [] });
  } catch (error: unknown) {
    console.error("Error fetching visits:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch visits",
      },
      { status: 500 },
    );
  }
}

// POST /api/patients/[id]/visits — add a new visit
export async function POST(
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
    const {
      date,
      reason,
      diagnosis,
      procedure,
      doctor,
      nextSteps,
      visitAttachments,
    } = body;

    if (!reason) {
      return NextResponse.json(
        { error: "Visit reason is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const newVisit = {
      date: date ? new Date(date) : new Date(),
      reason,
      diagnosis: diagnosis ?? "",
      procedure: procedure ?? "",
      doctor: doctor ?? "",
      nextSteps: nextSteps ?? "",
      visitAttachments: Array.isArray(visitAttachments) ? visitAttachments : [],
      createdAt: new Date(),
    };

    if (!patient.visits) patient.visits = [];
    patient.visits.push(newVisit);
    await patient.save();

    // Return the newly added visit (last element)
    const saved = patient.visits[patient.visits.length - 1];
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error adding visit:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to add visit",
      },
      { status: 500 },
    );
  }
}
