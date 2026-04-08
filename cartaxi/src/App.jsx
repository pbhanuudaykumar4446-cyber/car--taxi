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
import { PlaceOrder as BookRide } from "./pages/user/BookRide.jsx";
import { MyBookings } from "./pages/user/MyBookings.jsx";

// Shared
import Settings from "./pages/Settings.jsx";

function AppContent() {
  const { screen, role, page, bill, setBill, notification } = useApp();

  if (screen === "admin-login" || screen === "admin-signup") return <AdminAuth />;
  if (screen === "user-login" || screen === "user-signup") return <UserAuth />;

  const renderPage = () => {
    if (role === "admin") {
      switch (page) {
        case "dashboard":  return <AdminDashboard />;
        case "cars":       return <FleetManagement />; // Reverted
        case "drivers":    return <DriversPage />;    // Reverted
        case "bookings":   return <AdminBookings />;   // Reverted
        case "analytics":  return <AnalyticsPage />;
        case "settings":   return <Settings />;
        default:           return <AdminDashboard />;
      }
    }
    if (role === "user") {
      switch (page) {
        case "dashboard":   return <UserDashboard />;
        case "book":        return <BookRide />;        // Reverted
        case "mybookings":  return <MyBookings />;     // Reverted
        case "settings":    return <Settings />;
        default:            return <UserDashboard />;
      }
    }
    return null;
  };

  return (
    <div>
      <Sidebar />
      <div className="main">
        <Topbar />
        {renderPage()}
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
      <AppContent />
    </AppProvider>
  );
}