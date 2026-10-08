import mongoose from "mongoose";
import { SERVICE_CATEGORIES, SERVICES } from "./seed.js";

const MONGODB_URI = "mongodb+srv://Tapclone_irs:Tapclone%40123%40@cluster0.prco7.mongodb.net/the_color_palette";

const ServiceCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const ServiceSchema = new mongoose.Schema(
  {
    categoryId: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true, trim: true },
    image: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ServiceCategory = mongoose.models.ServiceCategory || mongoose.model("ServiceCategory", ServiceCategorySchema);
const Service = mongoose.models.Service || mongoose.model("Service", ServiceSchema);

async function run() {
  try {
    console.log("Connecting to MongoDB Atlas...");
    await mongoose.connect(MONGODB_URI);
    console.log("Connected successfully!");

    console.log("Deleting old collections...");
    await ServiceCategory.deleteMany({});
    await Service.deleteMany({});

    const categories = SERVICE_CATEGORIES.map(({ id, ...rest }) => rest);
    const services = SERVICES.map(({ id, ...rest }) => rest);

    console.log(`Inserting ${categories.length} categories...`);
    const insertedCats = await ServiceCategory.insertMany(categories);
    console.log(`Successfully inserted ${insertedCats.length} categories!`);

    console.log(`Inserting ${services.length} services...`);
    const insertedSrvs = await Service.insertMany(services);
    console.log(`Successfully inserted ${insertedSrvs.length} services!`);

    console.log("DATABASE SEEDED SUCCESSFULLY!");
    process.exit(0);
  } catch (err) {
    console.error("SEEDING ERROR:", err);
    process.exit(1);
  }
}

run();
