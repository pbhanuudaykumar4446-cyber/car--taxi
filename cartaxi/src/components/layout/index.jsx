import React from "react";
import { useApp } from "../../context/AppContext";
import { Avatar, LiveDot } from "../ui";

export function Sidebar() {
  const { role, page, setPage, logout, bookings, currentUser } = useApp();

  const ADMIN_NAV = [
    { section: "Overview" },
    { id: "dashboard", icon: "📊", label: "Dashboard" },
    { section: "Fleet" },
    { id: "cars", icon: "🚗", label: "Fleet Management" }, // Reverted
    { id: "drivers", icon: "👤", label: "Drivers" }, // Reverted
    { section: "Operations" },
    { id: "bookings", icon: "📋", label: "Bookings", badge: true }, // Reverted
    { id: "analytics", icon: "📈", label: "Analytics" },
    { section: "System" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const USER_NAV = [
    { section: "Navigation" },
    { id: "dashboard", icon: "🏠", label: "Home" },
    { id: "book", icon: "🚖", label: "Book a Ride" }, // Reverted
    { section: "History" },
    { id: "mybookings", icon: "📋", label: "My Bookings" }, // Reverted
    { section: "Account" },
    { id: "settings", icon: "⚙️", label: "Settings" },
  ];

  const nav = role === "admin" ? ADMIN_NAV : USER_NAV;
  const pendingCount = bookings?.filter(b => b.status === "pending").length || 0;

  return (
    <div className="sidebar">
      <div className="sidebar-logo">
        <h1>🚖 CarTaxi</h1>
        <span>
          <span className="logo-dot" />
          {role === "admin" ? "Admin Console" : "Passenger Portal"}
        </span>
      </div>

      <div className="sidebar-nav">
        {nav.map((n, i) => {
          if (n.section) {
            return <div key={i} className="sidebar-section">{n.section}</div>;
          }
          return (
            <div
              key={n.id}
              className={`nav-item ${page === n.id ? "active" : ""}`}
              onClick={() => setPage(n.id)}
            >
              <span className="icon">{n.icon}</span>
              {n.label}
              {n.badge && pendingCount > 0 && (
                <span className="nav-badge">{pendingCount}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <Avatar name={currentUser?.username || (role === "admin" ? "Admin" : "User")} size={34} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {currentUser?.username || (role === "admin" ? "Administrator" : "User Account")}
            </div>
            <div style={{ fontSize: 11, color: "var(--text3)", marginTop: 1 }}>
              {currentUser?.phone || (role === "admin" ? "System Access" : "CarTaxi Member")}
            </div>
          </div>
        </div>
        <div
          className="nav-item"
          onClick={logout}
          style={{ color: "var(--danger)", marginTop: 4, borderRadius: "var(--radius-sm)", border: "1px solid rgba(239,68,68,0.15)" }}
        >
          <span className="icon">🚪</span> Logout
        </div>
      </div>
    </div>
  );
}

export function Topbar() {
  const { role, page, setPage, bookings, currentUser } = useApp();

  const TITLES = {
    admin: { 
      dashboard: "Dashboard", 
      cars: "Fleet Management", 
      drivers: "Drivers", 
      bookings: "Bookings", 
      analytics: "Analytics", 
      settings: "Settings" 
    },
    user: { 
      dashboard: "Home", 
      book: "Book a Ride", 
      mybookings: "My Bookings", 
      settings: "Settings" 
    },
  };

  const pendingCount = bookings?.filter(b => b.status === "pending").length || 0;
  const activeRides = bookings?.filter(b => b.status === "active").length || 0;

  return (
    <div className="topbar">
      <div className="topbar-title">
        {(TITLES[role] || {})[page] || page}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {role === "admin" && activeRides > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent2-glow)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 20, padding: "5px 12px", fontSize: 12, color: "var(--accent2)", fontWeight: 600 }}>
            <LiveDot /> {activeRides} Live Ride{activeRides > 1 ? "s" : ""}
          </div>
        )}

        {pendingCount > 0 && role === "admin" && (
          <button onClick={() => setPage("bookings")} style={{ display: "flex", alignItems: "center", gap: 6, background: "var(--accent-glow)", border: "1px solid var(--border-accent)", borderRadius: 20, padding: "5px 14px", fontSize: 12, color: "var(--accent)", fontWeight: 600, cursor: "pointer" }}>
            ⏳ {pendingCount} Pending
          </button>
        )}

        <div className="notif-btn">
          <span style={{ fontSize: 18 }}>🔔</span>
          <div className="notif-dot" />
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8, background: "var(--glass)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "6px 12px", cursor: "pointer" }}>
          <Avatar name={currentUser?.username || (role === "admin" ? "Admin" : "User")} size={28} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>{currentUser?.username || "Account"}</span>
            <span className={`tag ${role === "admin" ? "tag-gold" : "tag-teal"}`} style={{ fontSize: 8, padding: "1px 6px" }}>
                {role === "admin" ? "Admin" : "Passenger"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}