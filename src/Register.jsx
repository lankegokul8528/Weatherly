import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export default function Register({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Assign default role ('admin' for admin email, else 'user')
      const userRole = email === "admin@weatherly.com" ? "admin" : "user";

      // 3. Store user metadata in Firestore 'users' collection
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: userRole,
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "24px", border: "1px solid #334155", borderRadius: "12px", background: "#1e293b", color: "#fff" }}>
      <h2 style={{ marginTop: 0, marginBottom: "16px" }}>Register</h2>
      {error && <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "12px" }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", background: "#0f172a", color: "#fff", outline: "none" }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #475569", background: "#0f172a", color: "#fff", outline: "none" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ padding: "10px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p style={{ marginTop: "16px", fontSize: "14px", color: "#94a3b8" }}>
        Already have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: "none", border: "none", color: "#60a5fa", cursor: "pointer", textDecoration: "underline", padding: 0 }}
        >
          Login here
        </button>
      </p>
    </div>
  );
}