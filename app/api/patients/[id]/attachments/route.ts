import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import dbConnect from "@/lib/mongodb";
import Patient from "@/models/Patient";

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
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Convert to base64 data URL so we can store it without external storage
    const bytes = await file.arrayBuffer();
    const base64 = Buffer.from(bytes).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    await dbConnect();

    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    const newAttachment = {
      filename: file.name,
      url: dataUrl,
      uploadedAt: new Date(),
    };

    patient.attachments = [...(patient.attachments || []), newAttachment];
    await patient.save();

    return NextResponse.json({ success: true, data: patient });
  } catch (error: unknown) {
    console.error("Error uploading attachment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to upload attachment",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const index = parseInt(searchParams.get("index") ?? "-1", 10);

    if (index < 0) {
      return NextResponse.json({ error: "Invalid index" }, { status: 400 });
    }

    await dbConnect();
    const patient = await Patient.findById(id);
    if (!patient) {
      return NextResponse.json({ error: "Patient not found" }, { status: 404 });
    }

    patient.attachments?.splice(index, 1);
    await patient.save();

    return NextResponse.json({ success: true, data: patient });
  } catch (error: unknown) {
    console.error("Error deleting attachment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete attachment",
      },
      { status: 500 },
    );
  }
}
