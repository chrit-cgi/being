import { betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { admin } from "better-auth/plugins";
import path from "path";

const isProd = process.env.NODE_ENV === "production";
const dbPath = isProd 
    ? "/app/data/prod.db"  // De veilige plek in Docker
    : path.resolve(process.cwd(), "dev.db"); // Je lokale plek op Chromebook

const CLIENT_SIDE_URL = process.env.BETTER_AUTH_URL;

export const auth = betterAuth({
    database: async () => {
        // DIT IS DE TRICK: Better-Auth ondersteunt een async functie.
        // Deze wordt pas uitgevoerd als de app ECHT draait, 
        // dus NOOIT tijdens de build-stap op Sliplane.
        const db = new Database(dbPath);
        return ( db )
    },
    emailAndPassword: {
        enabled: true
    },
    // Dit zorgt ervoor dat de tabellen op Sliplane ook 
    // automatisch worden aangemaakt bij de eerste start
    databaseHooks: {
        runMigrations: true 
    },
    advanced: {
      defaultCookieAttributes:
        process.env.NODE_ENV === "production"
          ? {
              sameSite: "none",
              secure: true,
            }
          : undefined,
    },
    plugins: [
        admin() // Zorg dat deze aan staat!
    ],    
    trustedOrigins: [`http://localhost:3000`, `https://being.sliplane.app` ],
    secret: process.env.BETTER_AUTH_SECRET,
    baseURL: process.env.BETTER_AUTH_URL,    
});