import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { admin, jwt } from "better-auth/plugins";

const uri: string | undefined = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable");
}

const client = new MongoClient(uri);
const db = client.db("spaceSync");

export const auth = betterAuth({
    database: mongodbAdapter(db, { client }),
    emailAndPassword: {
        enabled: true,
    },
    user: {
        additionalFields: {
            userRole: {
                type: "string",
                defaultValue: "user",
                input: true,
            },
        },
    },
    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        },
    },
    session: {
        cookieCache: {
            enabled: true,
            strategy: 'jwt',
            maxAge: 7 * 24 * 60 * 60
        }
    },
    plugins: [
        admin(), jwt(),
    ]
});