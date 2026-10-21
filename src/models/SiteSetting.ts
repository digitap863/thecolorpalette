import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISiteSetting extends Document {
  key: string;
  freeConsultationActive: boolean;
  freeConsultationBadge: string;
  freeConsultationTitle: string;
  freeConsultationDescription: string;
  createdAt: Date;
  updatedAt: Date;
}

export const DEFAULT_SITE_SETTINGS = {
  key: "general",
  freeConsultationActive: true,
  freeConsultationBadge: "COMPLIMENTARY OFFER",
  freeConsultationTitle: "DOCTOR CONSULTATION IS FREE",
  freeConsultationDescription:
    "Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee.",
};

const SiteSettingSchema: Schema<ISiteSetting> = new Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      default: "general",
    },
    freeConsultationActive: {
      type: Boolean,
      default: true,
    },
    freeConsultationBadge: {
      type: String,
      default: "COMPLIMENTARY OFFER",
      trim: true,
    },
    freeConsultationTitle: {
      type: String,
      default: "DOCTOR CONSULTATION IS FREE",
      trim: true,
    },
    freeConsultationDescription: {
      type: String,
      default:
        "Schedule your appointment today & receive a personalized 1-on-1 skin & hair evaluation by certified specialists at zero consultation fee.",
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const SiteSetting: Model<ISiteSetting> =
  mongoose.models.SiteSetting ||
  mongoose.model<ISiteSetting>("SiteSetting", SiteSettingSchema);

export default SiteSetting;
