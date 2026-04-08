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
    } catch(e) {}
    setLoading(false);
  };

  const handleSignup = async () => {
    if (form.password !== form.confirm) { showNotification("Passwords don't match", "error"); return; }
    setLoading(true);
    // Simulation of admin registration (admins are usually pre-created or require specific flows)
    await new Promise(r => setTimeout(r, 1200));
    setLoading(false);
    setView("login");
    showNotification("Admin request sent! Approval pending.", "success");
  };

  return (
    <div className="auth-page">
      <AuthLeft />
      
      <div className="auth-right glass-heavy animate-premium">
        <div style={{ position: "absolute", top: 40, right: 60 }} className="animate-in delay-2">
            <span className="tag tag-gold">System Administrator</span>
        </div>

        <div className="animate-premium delay-1">
          <h1 className="auth-title">
            {view === "login" ? "Console Access" : "Admin Request"}
          </h1>
          <p className="auth-sub">
            {view === "login" ? "Authorize to manage fleet logistics & operations" : "Apply for an administrator account"}
          </p>
        </div>

        <div className="animate-premium delay-2" style={{ marginTop: 8 }}>
          {view === "login" ? (
            <>
              <div className="form-group">
                <label>Username</label>
                <input 
                    placeholder="admin" 
                    value={form.username} 
                    onChange={e => setForm({ ...form, username: e.target.value })} 
                    onKeyDown={e => e.key === "Enter" && handleLogin()} 
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input 
                    type="password" 
                    placeholder="••••••••" 
                    value={form.password} 
                    onChange={e => setForm({ ...form, password: e.target.value })} 
                    onKeyDown={e => e.key === "Enter" && handleLogin()} 
                />
              </div>
            </>
          ) : (
            <>
              <div className="form-row">
                <div className="form-group"><label>Full Name</label><input placeholder="Suresh Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
                <div className="form-group"><label>Phone</label><input placeholder="9876543210" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
              </div>
              <div className="form-group"><label>Company</label><input placeholder="CarTaxi Vijayawada" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></div>
              <div className="form-row">
                <div className="form-group"><label>Password</label><input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} /></div>
                <div className="form-group"><label>Confirm</label><input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} /></div>
              </div>
            </>
          )}

          <button 
            className="btn-primary" 
            style={{ width: "100%", padding: "16px 24px", fontSize: 15, marginTop: 10 }} 
            onClick={view === "login" ? handleLogin : handleSignup} 
            disabled={loading}
          >
            {loading ? "Verifying Authority..." : (view === "login" ? "Authorize Console →" : "Submit Request →")}
          </button>
        </div>

        {view === "login" && (
          <div className="animate-premium delay-3">
            <div className="divider">or switch to</div>
            <button className="btn-secondary" style={{ width: "100%", marginBottom: 12 }} onClick={() => setScreen("user-login")}>
                🚖 Passenger Booking App
            </button>
            
            <div style={{ marginTop: 16, padding: 16, background: "rgba(245,158,11,0.06)", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 11, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>Demo Authority</div>
              <button style={{ background: "none", border: "none", color: "var(--accent)", cursor: "pointer", fontWeight: 700, fontSize: 12 }}
                onClick={() => { setForm(f => ({...f, username: "admin", password: "admin123"})); }}>
                Auto-fill Credentials (admin / admin123)
              </button>
            </div>
          </div>
        )}

        <p className="animate-premium delay-3" style={{ fontSize: 13, color: "var(--text2)", marginTop: 24, textAlign: "center" }}>
          {view === "login" ? (
            <>Need admin access? <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("signup")}>Request Account</span></>
          ) : (
            <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("login")}>← Back to Login</span>
          )}
        </p>
      </div>
    </div>
  );
}
