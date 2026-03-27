import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { admin } from "better-auth/plugins";
import path from "path";
import fs from "fs";

const isProd = process.env.NODE_ENV === "production";

// We gebruiken /tmp op Sliplane, dit is ALTIJD schrijfbaar
const dbPath = isProd 
    ? "/tmp/prod.db" 
    : path.resolve(process.cwd(), "dev.db");

// Zorg dat het bestand bestaat (nodig voor better-sqlite3)
if (isProd && !fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, ""); 
}

const db = new Database(dbPath);

export const auth = betterAuth({
    database: db,
    plugins: [ admin() ],
    baseURL: process.env.BETTER_AUTH_URL,
    emailAndPassword: { enabled: true },
    databaseHooks: { runMigrations: true }, // Dit doet nu de setup voor je!
    trustedOrigins: ["https://being.sliplane.app"],
    secret: process.env.BETTER_AUTH_SECRET || "fallback",
});