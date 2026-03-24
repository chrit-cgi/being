import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
    // 1. Controleer de sessie via de headers
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Als er geen sessie is, stuur de gebruiker terug naar login
    if (!session) {
        redirect("/login");
    }

    return (
        <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
            <h1>Welkom op je Dashboard! 🚀</h1>
            <p>Je bent ingelogd als: <strong>{session.user.email}</strong></p>
            
            <div style={{ marginTop: "20px", padding: "15px", border: "1px solid #ccc", borderRadius: "8px" }}>
                <h3>Jouw Profielgegevens:</h3>
                <ul>
                    <li><strong>Naam:</strong> {session.user.name || "Niet opgegeven"}</li>
                    <li><strong>ID:</strong> {session.user.id}</li>
                    <li><strong>Geregistreerd op:</strong> {new Date(session.user.createdAt).toLocaleDateString()}</li>
                </ul>
            </div>

            <form action={async () => {
                "use server";
                // Hier komt later je uitlog-logica
            }}>
                <button style={{ marginTop: "20px", cursor: "pointer" }}>
                    Uitloggen (binnenkort beschikbaar)
                </button>
            </form>
        </div>
    );
}