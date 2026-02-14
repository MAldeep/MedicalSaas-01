import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Patient from "../../../models/Patient";
import { generatePatientId } from "../../../lib/patientUtils";
import mongoose from "mongoose";
import { auth } from "@/auth";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    let patients;

    if (query.trim()) {
      // Search across multiple fields using regex for partial matches
      const searchRegex = new RegExp(query, "i"); // case-insensitive

      patients = await Patient.find({
        $or: [
          { firstName: searchRegex },
          { lastName: searchRegex },
          { patientId: searchRegex },
          { contactNumber: searchRegex },
          { email: searchRegex },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(50);
    } else {
      // Return all patients if no search query
      patients = await Patient.find().sort({ createdAt: -1 }).limit(50);
    }

    return NextResponse.json(
      { success: true, data: patients },
      { status: 200 },
    );
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    await dbConnect();
    const body = await req.json();

    // Generate unique patient ID
    const patientId = await generatePatientId();

    const patient = await Patient.create({
      ...body,
      patientId,
    });

    return NextResponse.json({ success: true, data: patient }, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof mongoose.Error.ValidationError) {
      const validationError = error as mongoose.Error.ValidationError;
      const messages = Object.values(validationError.errors).map(
        (err: mongoose.Error.ValidatorError | mongoose.Error.CastError) =>
          err.message,
      );
      return NextResponse.json(
        { success: false, error: messages.join(", ") },
        { status: 400 },
      );
    }
    const errorMessage =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
