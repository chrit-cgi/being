import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd 
    ? "/app/data/prod.db"  // De veilige plek in Docker
    : path.resolve(process.cwd(), "dev.db"); // Je lokale plek op Chromebook

export const auth = betterAuth({
    database: new Database(dbPath),
    emailAndPassword: {
        enabled: true
    },
    // Dit zorgt ervoor dat de tabellen op Sliplane ook 
    // automatisch worden aangemaakt bij de eerste start
    databaseHooks: {
        runMigrations: true 
    }
});