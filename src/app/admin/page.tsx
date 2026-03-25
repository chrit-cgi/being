import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminUsersPage() {
    // 1. Haal de huidige sessie op
    const session = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Beveiliging: Alleen toegang als je bent ingelogd EN admin bent
    // De admin plugin voegt 'role' toe aan de user. 
    // Je moet in je database 1 gebruiker handmatig de role 'admin' geven om dit te testen.
    if (!session || session.user.role !== "admin") {
        redirect("/dashboard");
    }

    // 3. Gebruik de Admin Plugin API om de gebruikerslijst op te halen
    // Dit vervangt de handmatige SQLite 'SELECT' query.
    const { users } = await auth.api.listUsers({
        headers: await headers(),
        query: {
            limit: 100 // Haal de eerste 100 gebruikers op
        }
    });

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h1>👥 Gebruikersbeheer (Plugin)</h1>
                <span style={{ background: "#e0f2f1", color: "#00695c", padding: "5px 12px", borderRadius: "20px", fontSize: "14px" }}>
                    Admin Mode
                </span>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px", boxShadow: "0 2px 5px rgba(0,0,0,0.1)" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6" }}>
                        <th style={{ padding: "15px", textAlign: "left" }}>Naam</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Email</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Rol</th>
                        <th style={{ padding: "15px", textAlign: "left" }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #eee" }}>
                            <td style={{ padding: "15px" }}>{user.name || "Niet opgegeven"}</td>
                            <td style={{ padding: "15px" }}>{user.email}</td>
                            <td style={{ padding: "15px" }}>
                                <span style={{ padding: "3px 8px", borderRadius: "4px", backgroundColor: user.role === "admin" ? "#fff3e0" : "#f1f3f4" }}>
                                    {user.role}
                                </span>
                            </td>
                            <td style={{ padding: "15px" }}>
                                {user.banned ? "🚫 Verbannen" : "✅ Actief"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}