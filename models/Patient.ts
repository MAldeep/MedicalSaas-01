import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IPatient extends Document {
  patientId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: "Male" | "Female" | "Other";
  contactNumber: string;
  email?: string;
  address?: string;
  emergencyContact?: {
    name: string;
    phone: string;
  };
  history?: string;
  attachments?: Array<{
    filename: string;
    url: string;
    uploadedAt: Date;
  }>;
  visits?: Array<{
    _id?: Types.ObjectId;
    date: Date;
    reason: string;
    diagnosis?: string;
    procedure?: string;
    doctor?: string;
    nextSteps?: string;
    visitAttachments?: Array<{
      filename: string;
      url: string;
      uploadedAt: Date;
    }>;
    createdAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const PatientSchema: Schema = new Schema(
  {
    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required"],
    },
    contactNumber: {
      type: String,
      required: [true, "Contact number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    address: {
      type: String,
      required: false,
      trim: true,
    },
    emergencyContact: {
      name: {
        type: String,
        trim: true,
      },
      phone: {
        type: String,
        trim: true,
      },
    },
    history: {
      type: String,
      required: false,
      trim: true,
    },
    attachments: [
      {
        filename: String,
        url: String,
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    visits: [
      {
        date: {
          type: Date,
          required: true,
          default: Date.now,
        },
        reason: {
          type: String,
          required: true,
          trim: true,
        },
        diagnosis: {
          type: String,
          trim: true,
        },
        procedure: {
          type: String,
          trim: true,
        },
        doctor: {
          type: String,
          trim: true,
        },
        nextSteps: {
          type: String,
          trim: true,
        },
        visitAttachments: [
          {
            filename: { type: String, required: true },
            url: { type: String, required: true },
            uploadedAt: {
              type: Date,
              default: Date.now,
            },
          },
        ],
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  },
);

// Create indexes for search optimization
PatientSchema.index({ firstName: 1, lastName: 1 });
PatientSchema.index({ patientId: 1 });
PatientSchema.index({ contactNumber: 1 });
PatientSchema.index({ email: 1 });

const Patient: Model<IPatient> =
  mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);

export default Patient;
