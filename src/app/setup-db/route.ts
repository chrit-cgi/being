import { NextResponse } from "next/server";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

export async function GET() {
    try {
        const isProd = process.env.NODE_ENV === "production";
        // We proberen een submap 'db' aan te maken binnen /app/data
        const baseDir = isProd ? "/app/data" : process.cwd();
        const targetDir = path.join(baseDir, "db");
        const dbPath = path.join(targetDir, "prod.db");

        // 1. Probeer de map aan te maken met volledige rechten
        if (!fs.existsSync(targetDir)) {
            console.log("Map aanmaken...");
            fs.mkdirSync(targetDir, { recursive: true, mode: 0o777 });
        }

        // 2. Dubbele check: als de map er al was, forceer rechten
        try {
            fs.chmodSync(baseDir, 0o777);
            fs.chmodSync(targetDir, 0o777);
        } catch (e) {
            console.log("Chmod waarschuwing (kan negeren):", e);
        }

        // 3. Open de database
        const db = new Database(dbPath);
        
        // 4. Test of we echt kunnen schrijven
        db.exec("PRAGMA journal_mode = WAL;"); // WAL mode helpt bij SQLite schrijffouten
        
        db.exec(`
            CREATE TABLE IF NOT EXISTS user (
                id TEXT PRIMARY KEY,
                email TEXT NOT NULL UNIQUE,
                role TEXT DEFAULT 'user'
            );
        `);

        db.close();

        return NextResponse.json({ 
            message: "Succes! De database is nu beschrijfbaar.",
            path: dbPath 
        });
    } catch (error: any) {
        return NextResponse.json({ 
            error: error.message,
            instruction: "Als dit blijft falen, moet de map /app/data in Sliplane handmatig op 777 gezet worden of de eigenaar moet aangepast worden."
        }, { status: 500 });
    }
}