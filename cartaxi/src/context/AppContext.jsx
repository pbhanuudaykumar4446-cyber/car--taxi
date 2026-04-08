import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();
const API_URL = "http://localhost:8000/api";

export function AppProvider({ children }) {
  const [screen, setScreen] = useState("admin-login"); 
  const [role, setRole] = useState(null);
  
  const [page, setPage] = useState("dashboard");
  const [bill, setBill] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Dynamic Data State
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [carsRes, bookingsRes, driversRes] = await Promise.all([
        axios.get(`${API_URL}/cars/`),
        axios.get(`${API_URL}/bookings/`),
        axios.get(`${API_URL}/drivers/`)
      ]);
      setCars(carsRes.data);
      setBookings(bookingsRes.data);
      setDrivers(driversRes.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      showNotification("Error connecting to server", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (role) fetchData();
  }, [role, fetchData]);

  const login = useCallback(async (r, credentials = {}) => {
    try {
      await axios.post(`${API_URL}/users/login/`, { role: r, ...credentials });
      setRole(r);
      setPage("dashboard");
      setScreen(r + "-app");
      showNotification("Login successful");
    } catch (e) {
      showNotification(e.response?.data?.error || "Login Failed", "error");
      throw e;
    }
  }, [API_URL, showNotification]);

  const register = useCallback(async (credentials = {}) => {
    try {
        await axios.post(`${API_URL}/users/register/`, credentials);
        showNotification("Account created successfully", "success");
    } catch(e) {
        showNotification(e.response?.data?.error || "Registration Failed", "error");
        throw e;
    }
  }, [API_URL, showNotification]);

  const logout = useCallback(() => {
    setRole(null);
    setPage("dashboard");
    setScreen("admin-login");
    setBill(null);
  }, []);

  const showNotification = useCallback((msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3500);
  }, []);

  // Car Functions
  const addCar = useCallback(async (car) => {
    try {
      const res = await axios.post(`${API_URL}/cars/`, car);
      setCars(prev => [...prev, res.data]);
      showNotification("Car added successfully!");
    } catch (e) { showNotification("Failed to add car", "error"); }
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

  // Booking Functions
  const addBooking = useCallback(async (booking) => {
    try {
      const res = await axios.post(`${API_URL}/bookings/`, booking);
      setBookings(prev => [res.data, ...prev]);
      showNotification("Ride booked successfully!");
    } catch (e) { showNotification("Booking failed", "error"); }
  }, [showNotification]);

  const updateBookingStatus = useCallback(async (id, status) => {
    try {
      const res = await axios.post(`${API_URL}/bookings/${id}/update_status/`, { status });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status: res.data.booking_status } : b));
    } catch (e) { showNotification("Update status failed", "error"); }
  }, [showNotification]);

  // Driver Functions
  const addDriver = useCallback(async (driver) => {
    try {
      const res = await axios.post(`${API_URL}/drivers/`, driver);
      setDrivers(prev => [...prev, res.data]);
    } catch (e) {}
  }, []);

  const removeDriver = useCallback(async (id) => {
    try {
      await axios.delete(`${API_URL}/drivers/${id}/`);
      setDrivers(prev => prev.filter(d => d.id !== id));
    } catch (e) {}
  }, []);

  return (
    <AppContext.Provider value={{
      screen, setScreen, role, login, register, logout,
      page, setPage,
      bill, setBill,
      sidebarOpen, setSidebarOpen,
      notification, showNotification,
      cars, addCar, removeCar, updateCarStatus,
      bookings, addBooking, updateBookingStatus,
      drivers, addDriver, removeDriver,
      loading, fetchData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);