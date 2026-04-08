import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatusBadge, Avatar } from "../../components/ui";

export default function AdminDashboard() {
  const { bookings, cars, drivers } = useApp(); 

  const totalRevenue = bookings?.reduce((acc, b) => acc + (b.total_price || 0), 0) || 0;
  const totalBookings = bookings?.length || 0;
  const pendingBookings = bookings?.filter(b => b.status === "pending").length || 0;
  const activeRides = bookings?.filter(b => b.status === "active").length || 0;
  const completedBookings = bookings?.filter(b => b.status === "completed").length || 0;
  const totalKm = bookings?.reduce((acc, b) => acc + (b.distance_km || 0), 0) || 0;

  const chartDataMap = {};
  (bookings || []).filter(b=>b.status==='completed').forEach(b => {
      const month = new Date(b.created_at || Date.now()).toLocaleString('default', { month: 'short' });
      if (!chartDataMap[month]) chartDataMap[month] = { month, revenue: 0 };
      chartDataMap[month].revenue += (b.total_price || 0);
  });
  const REVENUE_DATA = Object.values(chartDataMap).length ? Object.values(chartDataMap).slice(-6) : [{month: 'Jan', revenue: 0}];

  return (
    <div className="page animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700 }}>Dashboard</div>
          <div style={{ color: "var(--text2)", fontSize: 14 }}>Overview of your taxi fleet operations</div>
        </div>
      </div>

      <div className="grid3" style={{ marginBottom: 24 }}>
        {[
          { l: "Total Revenue", v: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: "+12% vs last period", c: "var(--accent)" },
          { l: "Total Bookings", v: totalBookings, sub: "Avg 33/day", c: "var(--accent2)" },
          { l: "Km Covered", v: totalKm.toLocaleString(), sub: "Across all cars", c: "#60A5FA" },
        ].map((s, i) => (
          <div key={s.l} className={`card stat-card animate-in delay-${i + 1}`} style={{ padding: 24 }}>
            <div style={{ fontSize: 11, color: "var(--text2)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.l}</div>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 36, fontWeight: 700, color: s.c, margin: "8px 0", letterSpacing: "-1px" }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--accent2)" }}>↑ {s.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid2" style={{ marginBottom: 24 }}>
        <div className="card animate-in delay-2" style={{ padding: 24 }}>
          <div className="section-title">Monthly Revenue</div>
          <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 140, padding: "0 8px" }}>
            {REVENUE_DATA.map((d, i) => {
              const max = Math.max(...REVENUE_DATA.map(d => d.revenue));
              return (
                <div key={d.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                  <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>₹{(d.revenue / 1000).toFixed(0)}K</div>
                  <div style={{ width: "100%", height: `${(d.revenue / max) * 100}%`, background: i === REVENUE_DATA.length - 1 ? "var(--accent)" : "var(--surface3)", borderRadius: "4px 4px 0 0", transition: "height 0.8s ease", minHeight: 8, position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, transparent, rgba(255,255,255,0.08))" }} />
                  </div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{d.month}</div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="card animate-in delay-3" style={{ padding: 24 }}>
          <div className="section-title">Booking Status Distribution</div>
          {["completed", "active", "pending", "cancelled"].map(s => {
            const count = bookings.filter(b => b.status === s).length;
            const pct = bookings.length ? Math.round((count / bookings.length) * 100) : 0;
            const colors = { completed: "var(--accent2)", active: "#60A5FA", pending: "var(--accent)", cancelled: "var(--danger)" };
            return (
              <div key={s} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}>
                  <span style={{ textTransform: "capitalize", fontWeight: 500 }}>{s}</span>
                  <span style={{ color: colors[s], fontWeight: 700 }}>{count} ({pct}%)</span>
                </div>
                <div style={{ height: 8, borderRadius: 4, background: "var(--surface3)", overflow: "hidden" }}>
                  <div style={{ width: `${pct}%`, height: "100%", background: colors[s], borderRadius: 4, transition: "width 1s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="card animate-in delay-3" style={{ padding: 24 }}>
        <div className="section-title">Top Performing Cars</div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Car</th><th>Tier</th><th>Driver</th><th>Rate/km</th><th>Usage</th></tr></thead>
            <tbody>
              {cars.slice(0, 5).map((c, i) => (
                <tr key={c.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 44, height: 36, borderRadius: 6, overflow: "hidden", background: "var(--surface2)", flexShrink: 0 }}>
                        {c.image ? <img src={c.image} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", fontSize: 18 }}>{c.emoji}</div>}
                      </div>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{c.name}</div>
                    </div>
                  </td>
                  <td>{c.tier}</td>
                  <td>{c.driver}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent)" }}>₹{c.pricePerKm}/km</td>
                  <td>
                    <div style={{ height: 6, width: 80, borderRadius: 4, background: "var(--surface3)", overflow: "hidden" }}>
                      <div style={{ width: `${90 - i * 12}%`, height: "100%", background: "var(--accent)", borderRadius: 4 }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}