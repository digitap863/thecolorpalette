import mongoose, { Schema, Document, Model } from "mongoose";

export interface IServiceCategory extends Document {
  name: string;
  slug: string;
  shortDescription: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ServiceCategorySchema: Schema<IServiceCategory> = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    shortDescription: {
      type: String,
      default: "",
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

const ServiceCategory: Model<IServiceCategory> =
  mongoose.models.ServiceCategory ||
  mongoose.model<IServiceCategory>("ServiceCategory", ServiceCategorySchema);

export default ServiceCategory;
