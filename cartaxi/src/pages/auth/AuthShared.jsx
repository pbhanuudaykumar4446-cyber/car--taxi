import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
 
export const AuthLeft = ({ title, subtitle }) => (
  <div className="auth-left">
    <div className="auth-left-grid" />
    <div style={{ position: "relative", zIndex: 1 }}>
      <img src="/logo.png" alt="CarTaxi Logo" style={{ width: 140, marginBottom: 16, filter: "drop-shadow(0 4px 12px rgba(245,158,11,0.3))" }} />
      <div className="auth-brand" style={{ fontSize: 42 }}>CarTaxi</div>
      <div className="auth-tagline">
        Vijayawada's most trusted taxi management platform. 
        Book rides, manage fleets, and track in real-time.
      </div>
      <div style={{ marginTop: 56, display: "flex", flexDirection: "column", gap: 18 }}>
        {[
          { icon: "🚗", label: "Fleet Management", desc: "Manage cars, drivers & routes" },
          { icon: "📍", label: "Real-Time Tracking", desc: "Live GPS location updates" },
          { icon: "⚡", label: "Instant Booking", desc: "Book in under 60 seconds" },
          { icon: "📄", label: "PDF Billing", desc: "Auto-generate GST invoices" },
        ].map(f => (
          <div key={f.label} style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{f.icon}</div>
            <div>
              <div style={{ color: "rgba(255,255,255,0.9)", fontSize: 14, fontWeight: 600 }}>{f.label}</div>
              <div style={{ color: "rgba(255,255,255,0.35)", fontSize: 12 }}>{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
 
      <div style={{ marginTop: 60, padding: 20, background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.12)", borderRadius: 14 }}>
        <div style={{ display: "flex", gap: 20 }}>
          {[{ v: "500+", l: "Rides Today" }, { v: "98%", l: "On-Time Rate" }, { v: "4.8★", l: "Avg Rating" }].map(s => (
            <div key={s.l}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: "var(--accent)" }}>{s.v}</div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);
 