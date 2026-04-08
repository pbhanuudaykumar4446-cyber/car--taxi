import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatusBadge, TierBadge, Toggle, Avatar, Stars } from "../../components/ui";
 
// ─── USER DASHBOARD ────────────────────────────────────────────────────────────
export function UserDashboard() {
  const { bookings, cars, setPage } = useApp();
  const myBookings = bookings.slice(0, 3);
  const availCars = cars.filter(c => c.status === "available").slice(0, 3);
 
  return (
    <div className="page">
      {/* Hero */}
      <div className="animate-in" style={{
        background: "linear-gradient(135deg, var(--primary-card) 0%, #1E2A42 100%)",
        border: "1px solid var(--border)",
        borderRadius: 20, padding: 32, marginBottom: 24, position: "relative", overflow: "hidden"
      }}>
        <div style={{ position: "absolute", right: -40, top: -40, fontSize: 180, opacity: 0.04 }}>🚖</div>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 80% 50%, rgba(245,158,11,0.06) 0%, transparent 60%)", pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent2)", animation: "pulse-dot 2s infinite" }} />
            <span style={{ fontSize: 12, color: "var(--accent2)", fontWeight: 600 }}>GPS ACTIVE · Vijayawada</span>
          </div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 30, fontWeight: 700, marginBottom: 6, letterSpacing: "-0.5px" }}>
            Hello, Priya 👋
          </div>
          <div style={{ color: "var(--text2)", fontSize: 15, marginBottom: 24 }}>
            Where are you headed today? {availCars.length} cars available near you.
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-primary" style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, padding: "12px 28px" }} onClick={() => setPage("book")}>
              🚖 Book a Ride
            </button>
            <button className="btn-secondary" onClick={() => setPage("mybookings")}>My Trips →</button>
          </div>
        </div>
      </div>
 
      {/* Stats */}
      <div className="grid3" style={{ marginBottom: 24 }}>
        {[
          { icon: "🚗", label: "Total Rides", value: "18", sub: "+3 this month" },
          { icon: "💰", label: "Total Spent", value: "₹6,742", sub: "Lifetime" },
          { icon: "📍", label: "km Travelled", value: "387", sub: "Across all rides" },
        ].map((s, i) => (
          <div key={s.label} className={`card stat-card animate-in delay-${i + 1}`} style={{ padding: 20 }}>
            <div style={{ fontSize: 24 }}>{s.icon}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginTop: 10 }}>{s.label}</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, marginTop: 4, letterSpacing: "-0.5px" }}>{s.value}</div>
            <div style={{ fontSize: 12, color: "var(--accent2)", marginTop: 4 }}>↑ {s.sub}</div>
          </div>
        ))}
      </div>
 
      {/* Available Cars Preview */}
      <div className="card animate-in delay-2" style={{ padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Cars Near You</div>
          <button className="btn-ghost btn-sm" onClick={() => setPage("book")}>View all →</button>
        </div>
        <div style={{ display: "flex", gap: 14, overflow: "hidden" }}>
          {availCars.map(car => (
            <div key={car.id} onClick={() => setPage("book")} style={{ flex: "0 0 calc(33.333% - 10px)", background: "var(--surface2)", borderRadius: 12, overflow: "hidden", cursor: "pointer", border: "1px solid var(--border)", transition: "transform 0.2s", minWidth: 0 }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-3px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ height: 100, overflow: "hidden", background: "var(--surface3)", position: "relative" }}>
                {car.image ? <img src={car.image} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 36 }}>{car.emoji}</div>}
                <div style={{ position: "absolute", bottom: 6, right: 6 }}><TierBadge tier={car.tier} /></div>
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{car.name}</div>
                <div style={{ fontSize: 11, color: "var(--text2)" }}>{car.type} · ₹{car.pricePerKm}/km</div>
              </div>
            </div>
          ))}
        </div>
      </div>
 
      {/* Recent Rides */}
      <div className="card animate-in delay-3" style={{ padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <div className="section-title" style={{ marginBottom: 0 }}>Recent Rides</div>
          <button className="btn-ghost btn-sm" onClick={() => setPage("mybookings")}>View all →</button>
        </div>
        {myBookings.map(b => (
          <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--surface2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🚗</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{b.car}</div>
                <div style={{ fontSize: 12, color: "var(--text2)" }}>📍 {b.from} → {b.to}</div>
                <div style={{ fontSize: 11, color: "var(--text3)" }}>🗓 {b.date} · {b.time}</div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <StatusBadge s={b.status} />
              <div style={{ fontWeight: 800, fontSize: 15, color: "var(--accent)", marginTop: 4 }}>₹{b.amount.toLocaleString("en-IN")}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}