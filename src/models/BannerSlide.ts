import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBannerSlide extends Document {
  title?: string;
  subtitle?: string;
  images: string[];
  mobileImages?: string[];
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BannerSlideSchema: Schema<IBannerSlide> = new Schema(
  {
    title: {
      type: String,
      trim: true,
      default: "",
    },
    subtitle: {
      type: String,
      trim: true,
      default: "",
    },
    images: {
      type: [String],
      required: [true, "At least one desktop image is required"],
      default: [],
    },
    mobileImages: {
      type: [String],
      default: [],
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

const BannerSlide: Model<IBannerSlide> =
  mongoose.models.BannerSlide ||
  mongoose.model<IBannerSlide>("BannerSlide", BannerSlideSchema);

export default BannerSlide;
