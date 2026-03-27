import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const isProd = process.env.NODE_ENV === "production";
        const dbPath = isProd ? "/app/data/prod.db" : path.resolve(process.cwd(), "dev.db");
        const dbDir = path.dirname(dbPath);

        // 1. Check of de map bestaat, zo niet maak hem aan
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // 2. FORCEER RECHTEN (Alleen voor Linux/Sliplane)
        // We proberen de map schrijfbaar te maken voor iedereen in de container
        try {
            fs.chmodSync(dbDir, 0o777); 
            if (fs.existsSync(dbPath)) {
                fs.chmodSync(dbPath, 0o666);
            }
        } catch (e) {
            console.log("Rechten aanpassen mislukt, we gaan door...");
        }

        // 3. Open de database met expliciete lees/schrijf rechten
        const db = new Database(dbPath, { timeout: 5000 });

        // 4. Voer de tabellen uit
        db.exec(`
            CREATE TABLE IF NOT EXISTS user (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL UNIQUE,
                emailVerified BOOLEAN NOT NULL,
                image TEXT,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                role TEXT,
                banned BOOLEAN DEFAULT 0,
                banReason TEXT,
                banExpires DATETIME
            );
            CREATE TABLE IF NOT EXISTS session (
                id TEXT PRIMARY KEY,
                expiresAt DATETIME NOT NULL,
                token TEXT NOT NULL UNIQUE,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL,
                ipAddress TEXT,
                userAgent TEXT,
                userId TEXT NOT NULL REFERENCES user(id)
            );
            CREATE TABLE IF NOT EXISTS account (
                id TEXT PRIMARY KEY,
                accountId TEXT NOT NULL,
                providerId TEXT NOT NULL,
                userId TEXT NOT NULL REFERENCES user(id),
                accessToken TEXT,
                refreshToken TEXT,
                idToken TEXT,
                accessTokenExpiresAt DATETIME,
                refreshTokenExpiresAt DATETIME,
                scope TEXT,
                password TEXT,
                createdAt DATETIME NOT NULL,
                updatedAt DATETIME NOT NULL
            );
        `);

        db.close();
        return NextResponse.json({ message: "Database is nu beschrijfbaar en tabellen zijn aangemaakt!" });
    } catch (error: any) {
        console.error("Setup error:", error);
        return NextResponse.json({ 
            error: error.message, 
            stack: error.stack,
            path: path.resolve("/app/data") 
        }, { status: 500 });
    }
}