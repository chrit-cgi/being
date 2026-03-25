import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

export const auth = betterAuth({
    database: new Database("dev.db"),
    emailAndPassword: {
        enabled: true
    },
})