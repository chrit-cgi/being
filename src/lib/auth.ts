import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { admin } from "better-auth/plugins";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd 
    ? "/app/data/prod.db"  // De veilige plek in Docker
    : path.resolve(process.cwd(), "dev.db"); // Je lokale plek op Chromebook

const db = new Database(dbPath);

export const auth = betterAuth({
    database: db,
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        admin() 
    ],
    emailAndPassword: {
        enabled: true
    },
    // Dit zorgt ervoor dat de tabellen op Sliplane ook 
    // automatisch worden aangemaakt bij de eerste start
    databaseHooks: {
        runMigrations: true 
    },
    trustedOrigins: [`http://localhost:3000`, `https://being.sliplane.app` ],
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-voor-local",
});

