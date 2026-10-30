import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  src: string;
  alt: string;
  category: string;
  title: string;
  order: number;
  isActive: boolean;
  socialUrl?: string;
  socialPlatform?: string;
  isSocialPost?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema: Schema<IGalleryImage> = new Schema(
  {
    src: {
      type: String,
      default: "",
      trim: true,
    },
    alt: {
      type: String,
      default: "",
      trim: true,
    },
    category: {
      type: String,
      default: "General",
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    socialUrl: {
      type: String,
      default: "",
      trim: true,
    },
    socialPlatform: {
      type: String,
      default: "instagram",
      trim: true,
    },
    isSocialPost: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
