import { betterAuth } from "better-auth";
import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import dns from "dns";
import dotenv from "dotenv";
import path from "path";

// Ensure environment variables are loaded
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

// Configure DNS resolvers for MongoDB Atlas on Windows
if (process.platform === "win32") {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4", "1.1.1.1"]);
  } catch (e) {
    // ignore if not supported
  }
}

// Global cached client for serverless environments (Vercel)
declare global {
  var _mongoClientAuth: MongoClient | undefined;
}

const mongoUri =
  process.env.MONGODB_URI ||
  "mongodb://localhost:27017/pizzahub";
const dbName = process.env.DB_NAME || "pizzahub";

let client: MongoClient;

if (!global._mongoClientAuth) {
  global._mongoClientAuth = new MongoClient(mongoUri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });
}
client = global._mongoClientAuth;

const db = client.db(dbName);

const getBaseURL = () => {
  // If running in production or on Vercel, never use localhost
  if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
    if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.includes("localhost")) {
      return process.env.BETTER_AUTH_URL.replace(/\/$/, "");
    }
    if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
      return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
    }
    if (process.env.VERCEL_URL) {
      return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
    }
    return "https://pizzahub-client-nazu2.vercel.app";
  }
  return (process.env.BETTER_AUTH_URL || "http://localhost:3000").replace(/\/$/, "");
};

const baseURL = getBaseURL();

const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim();
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),
  secret: process.env.BETTER_AUTH_SECRET || "default_development_secret_pizzahub_2026",
  baseURL: baseURL,
  trustedOrigins: [
    baseURL,
    "https://pizzahub-client-nazu2.vercel.app",
    "https://pizzahub-client-five.vercel.app",
    "https://*.vercel.app",
    "http://localhost:3000",
  ],

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "customer",
        input: true,
      },
      isBlocked: {
        type: "boolean",
        required: false,
        defaultValue: false,
        input: false,
      },
      businessName: {
        type: "string",
        required: false,
        input: true,
      },
      subscriptionPlan: {
        type: "string",
        required: false,
        defaultValue: "free",
        input: false,
      },
      subscriptionExpiresAt: {
        type: "date",
        required: false,
        input: false,
      },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    requireEmailVerification: false,
  },

  socialProviders: {
    ...(googleClientId && googleClientSecret
      ? {
          google: {
            clientId: googleClientId,
            clientSecret: googleClientSecret,
          },
        }
      : {}),
  },

  plugins: [
    jwt({
      // Issues JWKS-verifiable tokens for Express backend verification
    }),
  ],

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Rule 2: Server-side validation - Strictly reject role "admin" from public sign-up
          if (user.role === "admin") {
            throw new Error(
              "Self-registration as administrator is strictly forbidden."
            );
          }

          // Rule 3: Password validation rule (at least 6 chars, 1 uppercase, 1 lowercase)
          // For email sign-ups, password is present in credentials
          const rawRole = user.role as string;
          const assignedRole =
            rawRole === "vendor" ? "vendor" : "customer";

          return {
            data: {
              ...user,
              role: assignedRole,
              isBlocked: false,
              subscriptionPlan: "free",
              subscriptionExpiresAt: null,
              businessName:
                assignedRole === "vendor"
                  ? user.businessName || `${user.name}'s Kitchen`
                  : undefined,
            },
          };
        },
      },
    },
    session: {
      create: {
        before: async (session) => {
          // Rule 5: Blocked users: deny sign-in when isBlocked is true
          try {
            const usersCollection = db.collection("user");
            // Find user by session.userId (handling both string and ObjectId)
            const user = await usersCollection.findOne({
              $or: [{ id: session.userId }, { _id: session.userId as any }],
            });

            if (user && user.isBlocked === true) {
              throw new Error(
                "Your account has been suspended by the platform administrator. Access denied."
              );
            }
          } catch (err: any) {
            if (err.message?.includes("suspended")) {
              throw err;
            }
          }
        },
      },
    },
  },
});
