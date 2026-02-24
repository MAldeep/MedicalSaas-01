import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

type RouteContext = { params: Promise<{ id: string; visitId: string }> };

// POST /api/patients/[id]/visits/[visitId]/attachments
// Body: { filename: string; data: string (base64 data URL) }
export async function POST(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, visitId } = await params;
    const { filename, data } = await request.json();

    if (!filename || !data) {
      return NextResponse.json(
        { error: "filename and data are required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const visit = patient.visits?.find((v) => v._id?.toString() === visitId);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    if (!visit.visitAttachments) visit.visitAttachments = [];
    visit.visitAttachments.push({
      filename,
      url: data,
      uploadedAt: new Date(),
    });

    patient.markModified("visits");
    await patient.save();

    const saved = visit.visitAttachments[visit.visitAttachments.length - 1];
    return NextResponse.json({ success: true, data: saved }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error uploading visit attachment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 },
    );
  }
}

// DELETE /api/patients/[id]/visits/[visitId]/attachments?attachmentId=...
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, visitId } = await params;
    const { searchParams } = new URL(request.url);
    const attachmentId = searchParams.get("attachmentId");

    if (!attachmentId) {
      return NextResponse.json(
        { error: "attachmentId query param is required" },
        { status: 400 },
      );
    }

    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const visit = patient.visits?.find((v) => v._id?.toString() === visitId);
    if (!visit) {
      return NextResponse.json({ error: "Visit not found" }, { status: 404 });
    }

    const before = visit.visitAttachments?.length ?? 0;
    visit.visitAttachments = visit.visitAttachments?.filter(
      (a) =>
        (a as unknown as { _id: { toString(): string } })._id.toString() !==
        attachmentId,
    );

    if ((visit.visitAttachments?.length ?? 0) === before) {
      return NextResponse.json(
        { error: "Attachment not found" },
        { status: 404 },
      );
    }

    patient.markModified("visits");
    await patient.save();
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error deleting visit attachment:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Delete failed" },
      { status: 500 },
    );
  }
}
