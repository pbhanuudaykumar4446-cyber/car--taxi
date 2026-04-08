import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { AuthLeft } from "./AuthShared";

export function AdminAuth() {
  const { setScreen, login, showNotification } = useApp();
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", username: "admin", password: "admin123", confirm: "" });
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.username || !form.password) { showNotification("Enter username and password", "error"); return; }
    setLoading(true);
    try {
      await login("admin", { username: form.username, password: form.password });
    } catch(e) {
      // login() in AppContext already handles offline/demo mode gracefully
    }
    setLoading(false);
  };

  const handleSignup = async () => {
    if (form.password !== form.confirm) { showNotification("Passwords don't match", "error"); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    setLoading(false);
    setView("login");
    showNotification("Account created! Please login.", "success");
  };

  if (view === "signup") return (
    <div className="auth-page">
      <AuthLeft />
      <div className="auth-right">
        <div className="auth-title animate-in">Create Admin Account</div>
        <div className="auth-sub animate-in delay-1">Set up your fleet management system</div>
        <div className="form-row animate-in delay-1">
          <div className="form-group"><label>Full Name</label><input placeholder="Suresh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input placeholder="+91 9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
        </div>
        <div className="form-group animate-in delay-1"><label>Username</label><input placeholder="admin_user" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} /></div>
        <div className="form-group animate-in delay-2"><label>Company Name</label><input placeholder="CarTaxi Vijayawada" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
        <div className="form-row animate-in delay-2">
          <div className="form-group"><label>Password</label><input type="password" placeholder="Min 8 chars" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
          <div className="form-group"><label>Confirm</label><input type="password" placeholder="Repeat" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>
        </div>
        <button className="btn-primary animate-in delay-3" style={{ width: "100%", marginTop: 8 }} onClick={handleSignup} disabled={loading}>
          {loading ? "Creating Account..." : "Create Admin Account"}
        </button>
        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 20, textAlign: "center" }}>
          Already have an account?{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("login")}>Sign in</span>
        </p>
      </div>
    </div>
  );

  return (
    <div className="auth-page">
      <AuthLeft />
      <div className="auth-right">
        <div style={{ marginBottom: 12 }}><span className="tag tag-gold">Admin Portal</span></div>
        <div className="auth-title animate-in">Welcome back 👋</div>
        <div className="auth-sub animate-in delay-1">Sign in to your fleet management console</div>

        <div className="form-group animate-in delay-1">
          <label>Username</label>
          <input placeholder="admin" value={form.username} onChange={e => setForm({ ...form, username: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>
        <div className="form-group animate-in delay-2">
          <label>Password</label>
          <input type="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} onKeyDown={e => e.key === "Enter" && handleLogin()} />
        </div>

        <button className="btn-primary animate-in delay-3" style={{ width: "100%", padding: "14px 24px", fontSize: 15, marginTop: 8 }} onClick={handleLogin} disabled={loading}>
          {loading ? "Signing in..." : "Sign In as Admin →"}
        </button>

        <div className="divider">or continue with</div>
        <button className="btn-secondary animate-in" style={{ width: "100%" }} onClick={() => setScreen("user-login")}>
          🚖 User / Passenger Login
        </button>

        <p style={{ fontSize: 13, color: "var(--text2)", marginTop: 24, textAlign: "center" }}>
          Don't have an account?{" "}
          <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("signup")}>Create Admin Account</span>
        </p>

        <div style={{ marginTop: 24, padding: 16, background: "var(--surface2)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Demo Credentials</div>
          <div style={{ fontSize: 12, color: "var(--text2)" }}>👤 admin &nbsp;·&nbsp; 🔑 admin123</div>
          <button style={{ marginTop: 10, fontSize: 12, padding: "6px 14px", borderRadius: 6, background: "var(--accent-glow)", color: "var(--accent)", border: "1px solid var(--accent)", cursor: "pointer", fontWeight: 700 }}
            onClick={() => { setForm(f => ({...f, username: "admin", password: "admin123"})); }}>
            Fill Demo Credentials
          </button>
        </div>
      </div>
    </div>
  );
}