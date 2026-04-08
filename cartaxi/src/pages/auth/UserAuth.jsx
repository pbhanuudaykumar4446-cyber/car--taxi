import React, { useState } from "react";
import { useApp } from "../../context/AppContext.jsx";
import { AuthLeft } from "./AuthShared.jsx";

export function UserAuth() {
  const { setScreen, login, register, showNotification } = useApp();
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ username: "", password: "", phone: "", email: "" });
  const [loading, setLoading] = useState(false);
 
  const handleLogin = async () => {
    if (!form.username || !form.password) { showNotification("Please enter username and password", "error"); return; }
    setLoading(true);
    try {
      await login("user", { username: form.username, password: form.password });
      showNotification("Welcome back to CarTaxi! 🚖", "success");
    } catch(e) {}
    setLoading(false);
  };
 
  const handleSignup = async () => {
    if (!form.username || !form.password) { showNotification("Username & Password required", "error"); return; }
    if (!form.phone) { showNotification("Mobile number is required", "error"); return; }
    setLoading(true);
    try {
      await register({ ...form, role: "user" });
      setView("login");
    } catch(e) {}
    setLoading(false);
  };
 
  return (
    <div className="auth-page">
      <AuthLeft />
      
      <div className="auth-right glass-heavy animate-premium">
        <div style={{ position: "absolute", top: 40, right: 60 }} className="animate-in delay-2">
            <span className="tag tag-gold">Premium Access</span>
        </div>

        <div className="animate-premium delay-1">
          <h1 className="auth-title">
            {view === "login" ? "Welcome Back" : "Register Now"}
          </h1>
          <p className="auth-sub">
            {view === "login" ? "Access your personalized taxi dashboard" : "Join the premium fleet experience today"}
          </p>
        </div>

        <div className="animate-premium delay-2" style={{ marginTop: 8 }}>
          <div className="form-group">
            <label>Username</label>
            <input 
                placeholder="Enter your username" 
                value={form.username} 
                onChange={e => setForm({ ...form, username: e.target.value })} 
                onKeyDown={e => e.key === "Enter" && (view === "login" ? handleLogin() : handleSignup())} 
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input 
                type="password" 
                placeholder="••••••••" 
                value={form.password} 
                onChange={e => setForm({ ...form, password: e.target.value })} 
                onKeyDown={e => e.key === "Enter" && (view === "login" ? handleLogin() : handleSignup())} 
            />
          </div>

          {view === "signup" && (
            <div className="animate-premium">
              <div className="form-group">
                <label>Mobile Number</label>
                <input 
                    placeholder="9876543210" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                />
              </div>
              <div className="form-group">
                <label>Email Address</label>
                <input 
                    placeholder="name@example.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                />
              </div>
            </div>
          )}

          <button 
            className="btn-primary" 
            style={{ width: "100%", padding: "16px 24px", fontSize: 15, marginTop: 10 }} 
            onClick={view === "login" ? handleLogin : handleSignup} 
            disabled={loading}
          >
            {loading ? (view === "login" ? "Securing Session..." : "Creating Account...") : (view === "login" ? "Sign In →" : "Create Account →")}
          </button>
        </div>

        {view === "login" && (
          <div className="animate-premium delay-3">
            <div className="divider">or continue as</div>
            <button className="btn-secondary" style={{ width: "100%", marginBottom: 24 }} onClick={() => setScreen("admin-login")}>
                🛡️ Admin Management Portal
            </button>
          </div>
        )}

        <p className="animate-premium delay-3" style={{ fontSize: 13, color: "var(--text2)", marginTop: 10, textAlign: "center" }}>
          {view === "login" ? (
            <>New to CarTaxi? <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("signup")}>Create account</span></>
          ) : (
            <>Already have an account? <span style={{ color: "var(--accent)", cursor: "pointer", fontWeight: 700 }} onClick={() => setView("login")}>Sign in here</span></>
          )}
        </p>

        <div style={{ marginTop: "auto", paddingTop: 40, borderTop: "1px solid var(--border)", display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text3)" }} className="animate-in delay-3">
            <span>© 2026 CarTaxi VJ</span>
            <div style={{ display: "flex", gap: 16 }}>
                <span style={{ cursor: "pointer" }}>Privacy</span>
                <span style={{ cursor: "pointer" }}>Terms</span>
            </div>
        </div>
      </div>
    </div>
  );
}
