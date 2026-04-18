import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { StatusBadge, Avatar, Stars, Toggle } from "../../components/ui";
 
// ─── DRIVERS PAGE ──────────────────────────────────────────────────────────────
export function DriversPage() {
  const { drivers, addDriver, removeDriver, cars, assignDriverToCar, showNotification } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", email: "", license: "", licenseExpiry: "", carId: "", address: "", age: "" });
 
  const handleAdd = async () => {
    if (!form.name || !form.phone) { showNotification("Name and phone are required", "error"); return; }
    
    // We send data mapped to the new DriverProfile model fields
    const payload = {
      full_name: form.name,
      phone: form.phone,
      email: form.email || null,
      age: form.age ? Number(form.age) : null,
      license_no: form.license || null,
      license_expiry: form.licenseExpiry || null,
      address: form.address || null,
      is_available: true
    };

    const result = await addDriver(payload);
    if (result) {
      if (form.carId) {
        await assignDriverToCar(form.carId, result.id);
      }
      setShowModal(false);
      setForm({ name: "", phone: "", email: "", license: "", licenseExpiry: "", carId: "", address: "", age: "" });
    }
  };
 
  return (
    <div className="page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px" }} className="animate-in">Drivers</div>
          <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 6 }} className="animate-in delay-1">
            {(drivers || []).length} registered · {(drivers || []).filter(d => d.status === "available").length} available
          </div>
        </div>
        <button className="btn-primary animate-in delay-2" onClick={() => setShowModal(true)}>+ Add Driver</button>
      </div>
 
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }} className="animate-in delay-1">
        {[
           { l: "Total Drivers", v: (drivers || []).length, c: "var(--accent)" },
          { l: "Available", v: (drivers || []).filter(d => d.status === "available").length, c: "var(--accent2)" },
          { l: "On Trip", v: (drivers || []).filter(d => d.status === "on_trip").length, c: "#60A5FA" },
          { l: "Total Trips", v: (drivers || []).reduce((s, d) => s + (d.trips || 0), 0).toLocaleString(), c: "#A78BFA" },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, background: "var(--primary-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 22, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>
 
      <div className="card animate-in delay-2">
        <div className="table-wrap">
          <table>
            <thead><tr><th>Driver</th><th>License</th><th>Assigned Car</th><th>Rating</th><th>Trips</th><th>Earnings</th><th>Status</th><th>Action</th></tr></thead>
            <tbody>
              {(drivers || []).map(d => (
                <tr key={d.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar name={d.full_name || d.name} size={38} />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 14 }}>{d.full_name || d.name}</div>
                        <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 600 }}>📞 {d.phone}</div>
                        {d.email && <div style={{ fontSize: 11, color: "var(--text2)" }}>✉ {d.email}</div>}
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: 13, fontWeight: 600 }}>{d.license_no || d.license}</div>
                    {d.license_expiry && <div style={{ fontSize: 11, color: new Date(d.license_expiry) < new Date() ? "var(--danger)" : "var(--text2)" }}>Exp: {d.license_expiry}</div>}
                  </td>
                  <td style={{ fontSize: 13 }}>{d.car}</td>
                  <td><Stars rating={d.rating} /></td>
                  <td style={{ fontWeight: 600, fontSize: 13 }}>{d.trips}</td>
                  <td style={{ fontWeight: 700, color: "var(--accent)", fontSize: 13 }}>₹{(d.earnings || 0).toLocaleString("en-IN")}</td>
                  <td><StatusBadge s={d.status} /></td>
                  <td>
                    <button className="btn-danger btn-sm" onClick={() => { if (window.confirm(`Remove ${d.name}?`)) { removeDriver(d.id); showNotification(`${d.name} removed`, "info"); } }}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
 
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">Add New Driver</div>
            <div className="form-row">
              <div className="form-group"><label>Full Name *</label><input placeholder="Ravi Kumar" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
              <div className="form-group"><label>Mobile *</label><input placeholder="9876543210" maxLength={10} value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value.replace(/\D/, "") })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Email</label><input placeholder="driver@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div className="form-group"><label>Age</label><input type="number" placeholder="30" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>License No.</label><input placeholder="AP2023DL001" value={form.license} onChange={e => setForm({ ...form, license: e.target.value.toUpperCase() })} /></div>
              <div className="form-group"><label>License Expiry</label><input type="date" value={form.licenseExpiry} onChange={e => setForm({ ...form, licenseExpiry: e.target.value })} /></div>
            </div>
            <div className="form-group"><label>Assign Car</label>
              <select value={form.carId} onChange={e => setForm({ ...form, carId: e.target.value })}>
                <option value="">-- Select Car --</option>
                {cars.filter(c => c.status !== "on_trip").map(c => <option key={c.id} value={c.id}>{c.name} ({c.plate})</option>)}
              </select>
            </div>
            <div className="form-group"><label>Address</label><input placeholder="Labbipet, Vijayawada" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
            <div style={{ display: "flex", gap: 12 }}>
              <button className="btn-primary" style={{ flex: 1 }} onClick={handleAdd}>Add Driver</button>
              <button className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}