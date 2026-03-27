import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import Database from "better-sqlite3";

export default async function DashboardPage() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if (!session) redirect("/login");

    // TIJDELIJKE AUTO-ADMIN HACK
    // Als jij inlogt, maken we je direct admin in de database
    if (process.env.NODE_ENV === "production" && session.user.email === "lucy@lucy.eu") {
        const db = new Database("/tmp/prod.db");
        db.prepare("UPDATE user SET role = 'admin' WHERE email = ?").run(session.user.email);
        db.close();
    }

    return (
        <div>
            <h1>Dashboard</h1>
            <p>Ingelogd als: {session.user.email} ({session.user.role})</p>
        </div>
    );
}