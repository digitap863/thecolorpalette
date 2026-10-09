import mongoose, { Schema, Document, Model } from "mongoose";

export interface IGalleryImage extends Document {
  src: string;
  alt: string;
  category: string;
  title: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryImageSchema: Schema<IGalleryImage> = new Schema(
  {
    src: {
      type: String,
      required: [true, "Image source URL is required"],
      trim: true,
    },
    alt: {
      type: String,
      required: [true, "Alt text is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
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
  },
  {
    timestamps: true,
  }
);

const GalleryImage: Model<IGalleryImage> =
  mongoose.models.GalleryImage ||
  mongoose.model<IGalleryImage>("GalleryImage", GalleryImageSchema);

export default GalleryImage;
