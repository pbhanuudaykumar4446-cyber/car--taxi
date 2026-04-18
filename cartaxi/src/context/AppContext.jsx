import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();
const API_URL = "http://localhost:8000/api";

export function AppProvider({ children }) {
  // Restore session from localStorage on page refresh
  const [screen, setScreen] = useState(() => localStorage.getItem("ct_screen") || "admin-login");
  const [role,   setRole]   = useState(() => localStorage.getItem("ct_role")   || null);
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ct_user") || "null"); } catch { return null; }
  });

  const [page, setPage] = useState("dashboard");
  const [bill, setBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Must be defined FIRST
  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      // If user, filter bookings by their ID. Admins get all.
      const bookingUrl = (role === "user" && currentUser) 
        ? `${API_URL}/bookings/?user=${currentUser.id}` 
        : `${API_URL}/bookings/`;

      const [carsRes, bookingsRes, driversRes] = await Promise.all([
        axios.get(`${API_URL}/cars/`),
        axios.get(bookingUrl),
        axios.get(`${API_URL}/drivers/`)
      ]);
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  }, [role, currentUser]);

  // Fetch data whenever role is set
  useEffect(() => {
    if (role) fetchData();
  }, [role, fetchData]);

  const login = useCallback(async (r, credentials = {}) => {
    let user = null;
    try {
      const res = await axios.post(`${API_URL}/users/login/`, credentials);
      user = res.data;
    } catch (e) {
      if (e.response?.data?.error) {
        showNotification(e.response.data.error, "error");
        throw e;
      }
      // Server offline → demo mode
      user = { id: 0, username: credentials.username || r, role: r };
      showNotification("Demo mode: server offline", "warning");
    }
    setCurrentUser(user);
    setRole(r);
    setPage("dashboard");
    setScreen(r + "-app");
    localStorage.setItem("ct_screen", r + "-app");
    localStorage.setItem("ct_role", r);
    localStorage.setItem("ct_user", JSON.stringify(user));
    showNotification(`Welcome, ${user.username}! 🚖`);
  }, [showNotification]);

  const register = useCallback(async (credentials = {}) => {
    try {
      await axios.post(`${API_URL}/users/register/`, credentials);
      showNotification("Account created! Please sign in.", "success");
    } catch(e) {
      if (e.response?.data?.error) {
        showNotification(e.response.data.error, "error");
        throw e;
      }
      showNotification("Registration saved locally (demo mode)", "warning");
    }
  }, [showNotification]);

  const logout = useCallback(() => {
    setRole(null);
    setCurrentUser(null);
    setPage("dashboard");
    setScreen("admin-login");
    setBill(null);
    localStorage.removeItem("ct_screen");
    localStorage.removeItem("ct_role");
    localStorage.removeItem("ct_user");
  }, []);

  // ── Car Functions ──
  const addCar = useCallback(async (car) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/cars/`, car);
      setCars(prev => [...prev, res.data]);
      showNotification("Car added successfully!");
      return res.data;
    } catch (e) {
      console.error("Add car error:", e.response?.data || e.message);
      showNotification(e.response?.data?.detail || "Failed to add car to fleet", "error");
      return null;
    } finally { setLoading(false); }
  }, [showNotification]);

  const removeCar = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/cars/${id}/`);
      setCars(prev => prev.filter(c => c.id !== id));
      showNotification("Car removed");
    } catch (e) { showNotification("Failed to remove car", "error"); }
  }, [showNotification]);

  const updateCarStatus = useCallback(async (id, status) => {
    try {
      const res = await axios.post(`${API_URL}/cars/${id}/toggle_status/`, { status });
      setCars(prev => prev.map(c => c.id === id ? { ...c, status: res.data.car_status } : c));
    } catch (e) { showNotification("Failed to update car status", "error"); }
  }, [showNotification]);

  const assignDriverToCar = useCallback(async (carId, driverId) => {
    try {
      const res = await axios.patch(`${API_URL}/cars/${carId}/`, { driver: driverId });
      setCars(prev => prev.map(c => c.id === carId ? res.data : c));
      showNotification("Driver assigned to car successfully!", "success");
    } catch (e) { showNotification("Failed to assign car to driver", "error"); }
  }, [showNotification]);

  // ── Booking Functions ──
  const addBooking = useCallback(async (booking) => {
    try {
      setLoading(true);
      const userId = currentUser?.id || 1;
      const res = await axios.post(`${API_URL}/bookings/`, { ...booking, user: userId });
      setBookings(prev => [res.data, ...prev]);
      showNotification("Ride booked successfully!");
      return res.data;
    } catch (e) {
      showNotification("Booking failed – check server connection", "error");
      return null;
    } finally { setLoading(false); }
  }, [showNotification, currentUser]);

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      const res = await axios.post(`${API_URL}/bookings/${id}/update_status/`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: res.data.booking_status } : b));
    } catch (e) { showNotification("Update status failed", "error"); }
  }, [showNotification]);

  // ── Driver Functions ──
  const addDriver = useCallback(async (driver) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/drivers/`, driver);
      setDrivers(prev => [...prev, res.data]);
      showNotification("Driver added successfully!");
      return res.data;
    } catch (e) {
      console.error("Add driver error:", e.response?.data || e.message);
      showNotification("Failed to add driver profile", "error");
      return null;
    } finally { setLoading(false); }
  }, [showNotification]);

  const removeDriver = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/drivers/${id}/`);
      setDrivers(prev => prev.filter(d => d.id !== id));
      showNotification("Driver removed", "info");
    } catch (e) { showNotification("Failed to remove driver", "error"); }
  }, [showNotification]);

  return (
    <AppContext.Provider value={{
      screen, setScreen, role, currentUser, login, register, logout,
      page, setPage,
      bill, setBill,
      sidebarOpen, setSidebarOpen,
      notification, showNotification,
      cars, addCar, removeCar, updateCarStatus, assignDriverToCar,
      bookings, addBooking, updateBookingStatus,
      drivers, addDriver, removeDriver,
      loading, fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);