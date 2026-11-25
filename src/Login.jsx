import React, { useState, useEffect, useRef } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";

export default function Login({ onSwitch }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [userCaptchaInput, setUserCaptchaInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const canvasRef = useRef(null);

  // Controls the color of the text typed into Email, Password, and CAPTCHA fields
  const inputStyle = {
    padding: "10px",
    color: "#0f172a",           // Typed text color (dark slate)
    backgroundColor: "#ffffff", // Input background color
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    fontSize: "14px",
  };

  /* Alternative Dark Input Style (uncomment if you want dark boxes with white text):
  const inputStyle = {
    padding: "10px",
    color: "#f8fafc",
    backgroundColor: "#1e293b",
    border: "1px solid #334155",
    borderRadius: "4px",
    fontSize: "14px",
  };
  */

  const generateCaptcha = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789";
    let generated = "";
    for (let i = 0; i < 6; i++) {
      generated += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(generated);
    setUserCaptchaInput("");
    drawCaptcha(generated);
  };

  const drawCaptcha = (text) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#f1f5f9";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < 6; i++) {
      ctx.strokeStyle = `rgba(${Math.random() * 150}, ${Math.random() * 150}, ${Math.random() * 150}, 0.6)`;
      ctx.beginPath();
      ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
      ctx.stroke();
    }

    for (let i = 0; i < 30; i++) {
      ctx.fillStyle = "rgba(100, 116, 139, 0.5)";
      ctx.fillRect(Math.random() * canvas.width, Math.random() * canvas.height, 2, 2);
    }

    ctx.font = "bold 22px monospace";
    ctx.textBaseline = "middle";
    for (let i = 0; i < text.length; i++) {
      const x = 18 + i * 24;
      const y = canvas.height / 2 + (Math.random() * 8 - 4);
      const angle = (Math.random() - 0.5) * 0.4;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.fillStyle = "#1e293b";
      ctx.fillText(text[i], 0, 0);
      ctx.restore();
    }
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (userCaptchaInput.trim() !== captchaText) {
      setError("Invalid CAPTCHA. Please try again.");
      generateCaptcha();
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      if (err.code === "auth/too-many-requests") {
        setError("Too many failed attempts. Please wait 15 minutes and try again.");
      } else {
        setError("Invalid email or password.");
      }
      generateCaptcha();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #334155", borderRadius: "8px", backgroundColor: "#0f172a", color: "#f8fafc" }}>
      <h2>Login</h2>
      {error && <p style={{ color: "#f87171", fontSize: "14px" }}>{error}</p>}
      
      <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
        />

        {/* Auto-Generated CAPTCHA Box */}
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <canvas
            ref={canvasRef}
            width={175}
            height={42}
            style={{ border: "1px solid #cbd5e1", borderRadius: "4px" }}
          />
          <button
            type="button"
            onClick={generateCaptcha}
            title="Refresh CAPTCHA"
            style={{
              padding: "8px 12px",
              background: "#e2e8f0",
              color: "#1e293b",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            ↻
          </button>
        </div>

        <input
          type="text"
          placeholder="Enter the characters shown above"
          value={userCaptchaInput}
          onChange={(e) => setUserCaptchaInput(e.target.value)}
          required
          style={inputStyle}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            padding: "10px",
            background: loading ? "#93c5fd" : "#2563eb",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: loading ? "not-allowed" : "pointer",
            fontWeight: "600",
          }}
        >
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>

      <p style={{ marginTop: "15px" }}>
        Don't have an account?{" "}
        <button
          type="button"
          onClick={onSwitch}
          style={{ background: "none", border: "none", color: "#3b82f6", cursor: "pointer", textDecoration: "underline" }}
        >
          Register here
        </button>
      </p>
    </div>
  );
}