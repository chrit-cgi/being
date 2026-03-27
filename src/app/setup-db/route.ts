import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const dbPath = path.resolve(process.cwd(), ".data", "prod.db");
        const dbDir = path.dirname(dbPath);

        if (!fs.existsSync(dbDir)) {
            fs.mkdirSync(dbDir, { recursive: true });
        }

        // 3. Open de database
        const db = new Database(dbPath);
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS user (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                role TEXT DEFAULT 'user',
                name TEXT,
                emailVerified BOOLEAN,
                createdAt DATETIME,
                updatedAt DATETIME
            );
            -- Voeg hier ook session en account toe zoals eerder
        `);

        db.close();

        return NextResponse.json({ 
            message: "Succes! De database is nu beschrijfbaar.",
            path: dbPath 
        });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
}