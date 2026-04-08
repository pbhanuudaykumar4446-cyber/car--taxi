import React from "react";
import { StatusBadge } from "../../components/ui/index.jsx";
import { useApp } from "../../context/AppContext.jsx";
// ─── MY BOOKINGS ───────────────────────────────────────────────────────────────
export function MyBookings() {
  const { bookings, setBill } = useApp();
  const [filter, setFilter] = useState("all");
  const myBookings = filter === "all" ? bookings : bookings.filter(b => b.status === filter);
 
  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }} className="animate-in">My Bookings</div>
      <div style={{ color: "var(--text2)", fontSize: 14, marginBottom: 24 }} className="animate-in delay-1">{bookings.length} total rides</div>
 
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }} className="animate-in delay-1">
        {["all", "pending", "active", "completed", "cancelled"].map(s => (
          <button key={s} onClick={() => setFilter(s)} style={{ padding: "7px 18px", borderRadius: 20, fontSize: 12, fontWeight: 600, border: filter === s ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === s ? "var(--accent-glow)" : "var(--glass)", color: filter === s ? "var(--accent)" : "var(--text2)", cursor: "pointer", transition: "all 0.2s", textTransform: "capitalize" }}>
            {s} {s !== "all" && `(${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>
 
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {myBookings.map((b, i) => (
          <div key={b.id} className={`card animate-in delay-${Math.min(i + 1, 4)}`} style={{ padding: 22 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ fontWeight: 800, fontFamily: "var(--font-head)", fontSize: 16 }}>{b.car}</div>
                  <TierBadge tier={b.tier || "standard"} />
                </div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{b.id} · {b.date} · {b.time}</div>
              </div>
              <StatusBadge s={b.status} />
            </div>
 
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>From</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>📍 {b.from}</div>
                {b.fromKm && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>ODO: {b.fromKm} km</div>}
              </div>
              <div style={{ background: "var(--surface2)", borderRadius: 8, padding: 12 }}>
                <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase" }}>To</div>
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 3 }}>🏁 {b.to}</div>
                {b.toKm && <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 2 }}>ODO: {b.toKm} km</div>}
              </div>
            </div>
 
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
              <div style={{ display: "flex", gap: 16, fontSize: 13, color: "var(--text2)" }}>
                <span>📏 {b.km} km</span>
                <span>👤 {b.driver}</span>
                <span>📞 {b.driverPhone}</span>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: "var(--accent)" }}>₹{b.amount.toLocaleString("en-IN")}</div>
                {b.status === "completed" && (
                  <button className="btn-success btn-sm" onClick={() => setBill(b)}>📄 Invoice</button>
                )}
              </div>
            </div>
          </div>
        ))}
        {myBookings.length === 0 && (
          <div style={{ textAlign: "center", padding: 60, color: "var(--text2)" }}>
            <div style={{ fontSize: 48 }}>🚗</div>
            <div style={{ fontSize: 16, marginTop: 12 }}>No bookings found</div>
          </div>
        )}
      </div>
    </div>
  );
}