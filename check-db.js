const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(process.cwd(), "dev.db");
const db = new Database(dbPath);

const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log("--- Gevonden tabellen ---" );
console.log( tables.map(t => t.name).join(", "));

const users = db.prepare("SELECT * FROM user").all();
console.log("--- Geregistreerde Gebruikers ---");
console.table(users);

db.close();