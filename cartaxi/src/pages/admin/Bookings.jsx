import React, { useState } from "react";
import { StatusBadge, Avatar } from "../../components/ui/index.jsx";
import { useApp } from "../../context/AppContext.jsx";

// ─── ADMIN BOOKINGS ────────────────────────────────────────────────────────────
export function AdminBookings() {
  const { bookings, updateBookingStatus, setBill, showNotification } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
 
  const filtered = bookings.filter(b => {
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch = !search || b.user.toLowerCase().includes(search.toLowerCase()) || b.car.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });
 
  const handleApprove = (b) => {
    updateBookingStatus(b.id, "active");
    showNotification(`Booking ${b.id} approved!`, "success");
  };
 
  const handleComplete = (b) => {
    updateBookingStatus(b.id, "completed");
    showNotification(`Booking ${b.id} marked as completed`, "success");
  };
 
  const handleCancel = (b) => {
    if (window.confirm(`Cancel booking ${b.id}?`)) {
      updateBookingStatus(b.id, "cancelled");
      showNotification(`Booking ${b.id} cancelled`, "info");
    }
  };
 
  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700 }} className="animate-in">All Bookings</div>
          <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }} className="animate-in delay-1">{bookings.length} total · {bookings.filter(b => b.status === "pending").length} pending approval</div>
        </div>
      </div>
 
      {/* Summary Row */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }} className="animate-in delay-1">
        {["all", "pending", "active", "completed", "cancelled"].map(s => {
          const count = s === "all" ? bookings.length : bookings.filter(b => b.status === s).length;
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ flex: 1, padding: "12px 8px", borderRadius: 10, border: filter === s ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === s ? "var(--accent-glow)" : "var(--primary-card)", cursor: "pointer", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: filter === s ? "var(--accent)" : "var(--text)" }}>{count}</div>
              <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2, textTransform: "capitalize" }}>{s}</div>
            </button>
          );
        })}
      </div>
 
      {/* Search */}
      <div style={{ marginBottom: 20 }} className="animate-in delay-2">
        <input placeholder="🔍 Search by customer name, car, or booking ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>
 
      <div className="card animate-in delay-2">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Booking ID</th><th>Customer</th><th>Car / Driver</th><th>Route</th><th>Distance</th><th>Amount</th><th>Status</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => (
                <tr key={b.id}>
                  <td style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-head)", fontSize: 15 }}>{b.id}</td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Avatar name={b.user} size={32} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{b.user}</div>
                        <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 600 }}>📞 {b.userPhone || "N/A"}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{b.car}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>👤 {b.driver}</div>
                    <div style={{ fontSize: 11, color: "var(--accent)" }}>📞 {b.driverPhone || "N/A"}</div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>📍 {b.from}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>🏁 {b.to}</div>
                    {b.fromKm && <div style={{ fontSize: 11, color: "var(--text3)" }}>ODO: {b.fromKm}→{b.toKm}</div>}
                  </td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{b.km} km</td>
                  <td>
                    <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>₹{b.amount.toLocaleString("en-IN")}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>+GST ₹{b.tax}</div>
                  </td>
                  <td><StatusBadge s={b.status} /></td>
                  <td>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {b.status === "pending" && (
                        <>
                          <button className="btn-success btn-sm" onClick={() => handleApprove(b)}>Approve</button>
                          <button className="btn-danger btn-sm" onClick={() => handleCancel(b)}>Cancel</button>
                        </>
                      )}
                      {b.status === "active" && (
                        <button className="btn-primary btn-sm" onClick={() => handleComplete(b)}>Complete</button>
                      )}
                      {b.status === "completed" && (
                        <button className="btn-success btn-sm" onClick={() => setBill(b)}>📄 Invoice</button>
                      )}
                      {b.status === "cancelled" && (
                        <span style={{ fontSize: 12, color: "var(--text3)" }}>No actions</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text2)" }}>No bookings found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}