import React, { useState } from "react";
import { StatusBadge, Avatar } from "../../components/ui/index.jsx";
import { useApp } from "../../context/AppContext.jsx";

export function AdminBookings() {
  const { bookings, updateBookingStatus, setBill, showNotification, fetchData } = useApp();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = bookings.filter(b => {
    const matchFilter = filter === "all" || b.status === filter;
    const s = search.toLowerCase();
    const matchSearch = !s
      || (b.user_name || "").toLowerCase().includes(s)
      || (b.car_details?.name || b.car || "").toLowerCase().includes(s)
      || String(b.id).includes(s);
    return matchFilter && matchSearch;
  });

  const handleApprove = async (b) => {
    await updateBookingStatus(b.id, "active");
    showNotification(`Booking #${b.id} approved! Driver dispatched.`, "success");
    fetchData();
  };

  const handleComplete = async (b) => {
    await updateBookingStatus(b.id, "completed");
    showNotification(`Booking #${b.id} marked completed`, "success");
    fetchData();
  };

  const handleCancel = async (b) => {
    await updateBookingStatus(b.id, "cancelled");
    showNotification(`Booking #${b.id} cancelled`, "info");
    fetchData();
  };

  const pendingCount   = bookings.filter(b => b.status === "pending").length;
  const activeCount    = bookings.filter(b => b.status === "active").length;
  const completedCount = bookings.filter(b => b.status === "completed").length;

  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700 }} className="animate-in">
            Booking Management
          </div>
          <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }} className="animate-in delay-1">
            {bookings.length} total &nbsp;·&nbsp;
            <span style={{ color: "var(--accent)", fontWeight: 700 }}>{pendingCount} pending approval</span>
          </div>
        </div>
        <button className="btn-secondary animate-in" onClick={fetchData} style={{ fontSize: 13 }}>
          ↻ Refresh
        </button>
      </div>

      {/* Live pending alert */}
      {pendingCount > 0 && (
        <div className="animate-in" style={{ marginBottom: 20, padding: "14px 20px", background: "rgba(245,166,35,0.1)", border: "1px solid var(--accent)", borderRadius: 10, display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ fontSize: 20 }}>🔔</div>
          <div>
            <div style={{ fontWeight: 700, color: "var(--accent)" }}>{pendingCount} new booking request{pendingCount > 1 ? "s" : ""} waiting!</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>Review and approve to dispatch a driver.</div>
          </div>
        </div>
      )}

      {/* Summary */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }} className="animate-in delay-1">
        {[
          { k: "all",       l: "All",       v: bookings.length,    c: "var(--text)" },
          { k: "pending",   l: "Pending",   v: pendingCount,       c: "var(--accent)" },
          { k: "active",    l: "Active",    v: activeCount,        c: "#60A5FA" },
          { k: "completed", l: "Completed", v: completedCount,     c: "var(--accent2)" },
          { k: "cancelled", l: "Cancelled", v: bookings.filter(b => b.status === "cancelled").length, c: "var(--danger)" },
        ].map(s => (
          <button key={s.k} onClick={() => setFilter(s.k)} style={{ flex: 1, padding: "12px 8px", borderRadius: 10, border: filter === s.k ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === s.k ? "var(--accent-glow)" : "var(--primary-card)", cursor: "pointer", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: filter === s.k ? "var(--accent)" : s.c }}>{s.v}</div>
            <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 2 }}>{s.l}</div>
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ marginBottom: 20 }} className="animate-in delay-2">
        <input placeholder="🔍 Search by customer, car or booking ID..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="card animate-in delay-2">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>#ID</th>
                <th>Customer</th>
                <th>Car / Driver</th>
                <th>Route</th>
                <th>Distance</th>
                <th>Fare</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(b => {
                const carName    = b.car_details?.name  || `Car #${b.car}`;
                const carImg     = b.car_details?.image || null;
                const driverName = b.car_details?.driver_name || "Unassigned";
                const userName   = b.user_name || `User #${b.user}`;

                return (
                  <tr key={b.id} style={{ background: b.status === "pending" ? "rgba(245,166,35,0.03)" : undefined }}>
                    <td style={{ fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-head)", fontSize: 15 }}>
                      #{b.id}
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Avatar name={userName} size={32} />
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{userName}</div>
                          <div style={{ fontSize: 11, color: "var(--text2)" }}>
                            {b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "—"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        {carImg && <img src={carImg} alt="" style={{ width: 44, height: 32, objectFit: "cover", borderRadius: 5 }} />}
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 13 }}>{carName}</div>
                          <div style={{ fontSize: 11, color: "var(--text2)" }}>👤 {driverName}</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ fontSize: 12 }}>
                        <div>📍 {(b.pickup_location || b.from || "—").split(",")[0]}</div>
                        <div style={{ color: "var(--text2)" }}>🏁 {(b.dropoff_location || b.to || "—").split(",")[0]}</div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, fontSize: 13 }}>
                      {b.distance_km || b.km || 0} km
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, fontSize: 14, color: "var(--accent)" }}>
                        ₹{Number(b.total_price || b.amount || 0).toLocaleString("en-IN")}
                      </div>
                    </td>
                    <td><StatusBadge s={b.status} /></td>
                    <td>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {b.status === "pending" && (
                          <>
                            <button className="btn-success btn-sm" onClick={() => handleApprove(b)}>✓ Accept</button>
                            <button className="btn-danger btn-sm" onClick={() => handleCancel(b)}>✕ Reject</button>
                          </>
                        )}
                        {b.status === "active" && (
                          <button className="btn-primary btn-sm" onClick={() => handleComplete(b)}>Mark Done</button>
                        )}
                        {b.status === "completed" && (
                          <button className="btn-success btn-sm" onClick={() => setBill(b)}>📄 Invoice</button>
                        )}
                        {b.status === "cancelled" && (
                          <span style={{ fontSize: 12, color: "var(--text3)" }}>—</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={8} style={{ textAlign: "center", padding: 40, color: "var(--text2)" }}>
                  {filter === "pending" ? "🎉 No pending requests" : "No bookings found"}
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}