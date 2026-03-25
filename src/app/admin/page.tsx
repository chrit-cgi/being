import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
    // 1. Maak de server-context aan met de huidige headers
    // Dit lost de 'undefined' error op omdat alle metadata nu aanwezig is.
    const authContext = await auth.api.getSession({
        headers: await headers()
    });

    // 2. Check of de gebruiker bestaat en admin is
    if (!authContext || authContext.user.role !== "admin") {
        console.log("Toegang geweigerd: Geen admin rol gevonden");
        redirect("/dashboard");
    }

    // 3. Haal de gebruikers op via de plugin, maar geef expliciet de headers mee
    // De 'query' moet minimaal een leeg object zijn om de 'expected object' error te voorkomen
    const usersResponse = await auth.api.listUsers({
        headers: await headers(),
        query: {} 
    });

    const users = usersResponse.users;

    return (
        <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
            <h1>🛡️ Admin Dashboard</h1>
            <p>Welkom, {authContext.user.email}</p>
            
            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
                <thead>
                    <tr style={{ textAlign: "left", borderBottom: "2px solid #000" }}>
                        <th style={{ padding: "10px" }}>Email</th>
                        <th style={{ padding: "10px" }}>Rol</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} style={{ borderBottom: "1px solid #ccc" }}>
                            <td style={{ padding: "10px" }}>{user.email}</td>
                            <td style={{ padding: "10px" }}>{user.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}