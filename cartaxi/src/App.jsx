import React from "react";
import { GlobalStyle } from "./styles/GlobalStyles.jsx";
import { AppProvider, useApp } from "./context/AppContext.jsx";
import { Sidebar, Topbar } from "./components/layout/index.jsx";
import BillModal from "./components/BillModal.jsx";
import { Notification } from "./components/ui/index.jsx";

// Auth Pages
import { AdminAuth, UserAuth } from "./pages/auth/index.jsx";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import FleetManagement from "./pages/admin/Fleet.jsx";
import { DriversPage } from "./pages/admin/Drivers.jsx";
import { AdminBookings } from "./pages/admin/Bookings.jsx";
import { AnalyticsPage } from "./pages/admin/Analytics.jsx";

// User Pages
import { UserDashboard } from "./pages/user/Dashboard.jsx";
import BookRide from "./pages/user/PlaceOrder.jsx";
import { MyBookings } from "./pages/user/MyBookings.jsx";

// Shared
import Settings from "./pages/Settings.jsx";

// ── Error Boundary ─────────────────────────────────────────────────────────────
class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { hasError: false, error: null }; }
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(e) { console.error("App crash caught:", e); }
  render() {
    if (this.state.hasError) return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0E1A", color: "#fff", gap: 16, padding: 40 }}>
        <div style={{ fontSize: 48 }}>⚠️</div>
        <div style={{ fontFamily: "Georgia", fontSize: 22, fontWeight: 700 }}>Something went wrong</div>
        <div style={{ color: "#888", fontSize: 14, maxWidth: 400, textAlign: "center" }}>{String(this.state.error)}</div>
        <button onClick={() => { localStorage.clear(); window.location.reload(); }}
          style={{ marginTop: 20, padding: "12px 28px", background: "#F5A623", color: "#000", border: "none", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 14 }}>
          Clear Session & Reload
        </button>
      </div>
    );
    return this.props.children;
  }
}

// ── App Content ────────────────────────────────────────────────────────────────
function AppContent() {
  const { screen, role, page, bill, setBill, notification } = useApp();

  if (screen === "admin-login" || screen === "admin-signup") return <AdminAuth />;
  if (screen === "user-login"  || screen === "user-signup")  return <UserAuth />;

  // Safety: if screen says logged-in but role is missing, go back to login
  if (!role) { localStorage.clear(); return <AdminAuth />; }

  const renderPage = () => {
    try {
      if (role === "admin") {
        switch (page) {
          case "dashboard":  return <AdminDashboard />;
          case "cars":       return <FleetManagement />;
          case "drivers":    return <DriversPage />;
          case "bookings":   return <AdminBookings />;
          case "analytics":  return <AnalyticsPage />;
          case "settings":   return <Settings />;
          default:           return <AdminDashboard />;
        }
      }
      if (role === "user") {
        switch (page) {
          case "dashboard":   return <UserDashboard />;
          case "book":        return <BookRide />;
          case "mybookings":  return <MyBookings />;
          case "settings":    return <Settings />;
          default:            return <UserDashboard />;
        }
      }
      return <AdminAuth />;
    } catch(e) {
      console.error("Page render error:", e);
      return <AdminDashboard />;
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="main">
        <Topbar />
        <ErrorBoundary key={page}>
          {renderPage()}
        </ErrorBoundary>
      </div>
      {bill && <BillModal booking={bill} onClose={() => setBill(null)} />}
      {notification && <Notification message={notification.msg} type={notification.type} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <GlobalStyle />
      <ErrorBoundary>
        <AppContent />
      </ErrorBoundary>
    </AppProvider>
  );
}