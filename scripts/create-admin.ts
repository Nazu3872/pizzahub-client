import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { MongoClient } from "mongodb";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (e) {}
}

import { auth } from "../src/lib/auth";

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "nazmunnahar.codeware@gmail.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "PizzaAdmin2026!";
  const adminName = "Platform Administrator";

  console.log(`[Admin Seed] Preparing admin account for: ${adminEmail}`);

  const mongoUri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || "pizzahub";

  if (!mongoUri) {
    console.error("[Admin Seed Error] MONGODB_URI is missing from environment.");
    process.exit(1);
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  const db = client.db(dbName);
  const usersCollection = db.collection("user");

  try {
    // 1. Check if user already exists
    const existing = await usersCollection.findOne({ email: adminEmail });

    if (existing) {
      console.log(`[Admin Seed] User exists with ID: ${existing._id || existing.id}. Elevating to admin...`);
      await usersCollection.updateOne(
        { email: adminEmail },
        {
          $set: {
            role: "admin",
            isBlocked: false,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`[Admin Seed Success] User role updated to "admin" successfully!`);
    } else {
      console.log(`[Admin Seed] Creating brand new user via Better Auth API...`);
      // Create user with customer role first to satisfy sign-up hook
      const created = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        },
      });

      console.log(`[Admin Seed] User created. Elevating role to "admin"...`);
      await usersCollection.updateOne(
        { email: adminEmail },
        {
          $set: {
            role: "admin",
            isBlocked: false,
            updatedAt: new Date(),
          },
        }
      );
      console.log(`[Admin Seed Success] Admin account successfully initialized and verified!`);
    }
  } catch (err: any) {
    console.error(`[Admin Seed Error]:`, err.message);
    process.exit(1);
  } finally {
    await client.close();
    process.exit(0);
  }
}

main();
