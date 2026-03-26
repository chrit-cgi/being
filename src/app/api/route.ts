import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const isProd = process.env.NODE_ENV === "production";
        const dbPath = isProd ? "/app/data/prod.db" : path.resolve(process.cwd(), "dev.db");
        
        // 1. Zorg dat de map bestaat
        const dbDir = path.dirname(dbPath);
        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        const db = new Database(dbPath);

        // 2. Voer de SQL uit om de tabellen te maken
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

        // 3. OPTIONEEL: Jezelf direct admin maken als je email al bekend is
        // db.prepare("UPDATE user SET role = 'admin' WHERE email = 'lucy@lucy.eu'").run();

        db.close();
        return NextResponse.json({ message: "Database tabellen succesvol aangemaakt!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}