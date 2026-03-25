import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd 
    ? "/app/data/prod.db"  // De veilige plek in Docker
    : path.resolve(process.cwd(), "dev.db"); // Je lokale plek op Chromebook

export const auth = betterAuth({
    database: async () => {
        // DIT IS DE TRICK: Better-Auth ondersteunt een async functie.
        // Deze wordt pas uitgevoerd als de app ECHT draait, 
        // dus NOOIT tijdens de build-stap op Sliplane.
        const db = new Database(dbPath);
        return {
            db: db,
            type: "sqlite"
        };
    },
    emailAndPassword: {
        enabled: true
    },
    // Dit zorgt ervoor dat de tabellen op Sliplane ook 
    // automatisch worden aangemaakt bij de eerste start
    databaseHooks: {
        runMigrations: true 
    }
});