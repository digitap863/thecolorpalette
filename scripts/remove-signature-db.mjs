import fs from "fs";
import path from "path";
import mongoose from "mongoose";

// Load .env manually if process.loadEnvFile is not used
const envPath = path.resolve(process.cwd(), ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx !== -1) {
      const key = trimmed.slice(0, eqIdx).trim();
      let val = trimmed.slice(eqIdx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  }
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in .env");
  process.exit(1);
}

async function run() {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected successfully.");

    const collection = mongoose.connection.collection("services");

    // Check existing indexes
    try {
      const indexes = await collection.indexes();
      for (const idx of indexes) {
        if (idx.key && idx.key.featured !== undefined) {
          console.log(`Dropping index on featured: ${idx.name}`);
          await collection.dropIndex(idx.name);
        }
      }
    } catch (idxErr) {
      console.log("Index check notice:", idxErr.message);
    }

    // Unset 'featured' field from all documents in services collection
    const result = await collection.updateMany(
      { featured: { $exists: true } },
      { $unset: { featured: "" } }
    );

    console.log(
      `🎉 Successfully removed 'featured' (signature) field from DB:\n` +
      `   Matched documents: ${result.matchedCount}\n` +
      `   Modified documents: ${result.modifiedCount}`
    );

    await mongoose.disconnect();
    console.log("🔒 Disconnected from MongoDB.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
}

run();
