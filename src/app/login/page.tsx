"use client";
import { useState } from "react";
import { createAuthClient } from "better-auth/react";
import { adminClient } from "better-auth/client/plugins"; // Import admin client plugin

const authClient = createAuthClient({
    plugins: [
        adminClient() // Register it here
    ]
});


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const signUp = async (e: React.FormEvent) => {
    e.preventDefault(); // Voorkom dat de pagina herlaadt
    
    if (!email || !password) {
      alert("Vul eerst je gegevens in!");
      return;
    }

    try {
      const res = await authClient.signUp.email({
        email,
        password,
        name: "Being User",
      });
      
      if (res.error) {
        alert("Fout: " + res.error.message);
      } else {
        alert("Succes! Gebruiker aangemaakt.");
      }
    } catch (err) {
      console.error(err);
      alert("Er ging iets mis bij de verbinding.");
    }
  };

  const signIn = async () => {
    await authClient.signIn.email({
      email,
      password,
    });
    if (res.error) {
      alert(res.error.message);
    } else {
      // Gebruik window.location voor een harde reload op Sliplane
      // Dit zorgt dat de cookies zeker worden meegestuurd

      console.log( "Logged in! Op weg naar dashboard");

      window.location.href = "/dashboard";
    }
    
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h1 className="text-2xl font-bold">Being App Login</h1>
      <input 
        type="email" placeholder="Email" 
        className="border p-2 text-black"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" placeholder="Password" 
        className="border p-2 text-black"
        onChange={(e) => setPassword(e.target.value)} 
      />
      <div className="flex gap-2">
        <button onClick={(e) => signUp(e)} className="bg-blue-500 text-white p-2">Sign Up</button>
        <button onClick={signIn} className="bg-green-500 text-white p-2">Sign In</button>
      </div>
    </div>
  );
}
