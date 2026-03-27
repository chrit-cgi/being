import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { admin } from "better-auth/plugins";
import path from "path";
import fs from "fs"; // VOEG DEZE REGEL TOE

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd 
    ? "/app/data/prod.db"  // De veilige plek in Docker
    : path.resolve(process.cwd(), "dev.db"); // Je lokale plek op Chromebook

// DIT IS DE EXTRA VEILIGHEID:
// Als we in productie zijn en de map bestaat nog niet (tijdens build), 
// maken we hem even aan of we gebruiken een tijdelijke plek.
if (isProd) {
    const dbDir = path.dirname(dbPath);
    if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
    }
}

const db = new Database(dbPath, {
    fileMustExist: false 
});

export const auth = betterAuth({
    database: db,
    baseURL: process.env.BETTER_AUTH_URL,
    plugins: [
        admin() 
    ],
    emailAndPassword: {
        enabled: true
    },
    advanced: {
        cookiePrefix: "being-app", // Helpt om conflicten te voorkomen
        useSecureCookies: true,    // Verplicht voor https (Sliplane)
    },
    // Dit helpt bij Next.js 15 om sessies stabieler te houden
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 5 * 60 // 5 minuten
        }
    },
    // Dit zorgt ervoor dat de tabellen op Sliplane ook 
    // automatisch worden aangemaakt bij de eerste start
    databaseHooks: {
        runMigrations: true 
    },
    trustedOrigins: [`http://localhost:3000`, `https://being.sliplane.app` ],
    secret: process.env.BETTER_AUTH_SECRET || "fallback-secret-voor-local",
});

