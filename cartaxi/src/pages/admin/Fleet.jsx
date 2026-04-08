import React, { useState } from "react";
import { useApp } from "../../context/AppContext";
import { TierBadge } from "../../components/ui";

export default function FleetManagement() {
  const { cars, addCar, removeCar, updateCarStatus, showNotification } = useApp();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCar, setNewCar] = useState({ name: "", price_per_km: "", seats: 4, tier: "standard", image: "" });

  const handleAddCar = (e) => {
    e.preventDefault();
    if (!newCar.name || !newCar.price_per_km) { showNotification("Please fill Car Name and Price/Km", "error"); return; }
    addCar({
      name: newCar.name,
      price_per_km: Number(newCar.price_per_km),
      seats: Number(newCar.seats),
      tier: newCar.tier,
      image: newCar.image || "",
      status: "available"
    });
    setShowAddModal(false);
    setNewCar({ name: "", price_per_km: "", seats: 4, tier: "standard", image: "" });
  };

  const statusColor = { available: "var(--accent2)", on_trip: "#60A5FA", unavailable: "var(--danger)" };

  return (
    <div className="page animate-in">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700 }}>Fleet Management</div>
          <div style={{ color: "var(--text2)", fontSize: 14, marginTop: 4 }}>
            {cars.length} vehicles &nbsp;·&nbsp;
            <span style={{ color: "var(--accent2)" }}>{cars.filter(c => c.status === "available").length} available</span>
          </div>
        </div>
        <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add New Car</button>
      </div>

      {/* Stats strip */}
      <div style={{ display: "flex", gap: 12, marginBottom: 24 }}>
        {[
          { l: "Total", v: cars.length, c: "var(--accent)" },
          { l: "Available", v: cars.filter(c => c.status === "available").length, c: "var(--accent2)" },
          { l: "On Trip", v: cars.filter(c => c.status === "on_trip").length, c: "#60A5FA" },
          { l: "Unavailable", v: cars.filter(c => !["available","on_trip"].includes(c.status)).length, c: "var(--danger)" },
        ].map(s => (
          <div key={s.l} style={{ flex: 1, background: "var(--primary-card)", border: "1px solid var(--border)", borderRadius: 10, padding: "14px 18px", textAlign: "center" }}>
            <div style={{ fontFamily: "var(--font-head)", fontSize: 24, fontWeight: 700, color: s.c }}>{s.v}</div>
            <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 3 }}>{s.l}</div>
          </div>
        ))}
      </div>

      <div className="grid-auto">
        {cars.map(car => (
          <div key={car.id} className="card car-card">
            <div className="car-img" style={{ height: 170 }}>
              {car.image
                ? <><img src={car.image} alt={car.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} onError={e => e.target.style.display = "none"} /><div className="car-img-overlay" /></>
                : <div className="car-img-emoji">🚗</div>
              }
              <div className="car-tier"><TierBadge tier={car.tier || "standard"} /></div>
              <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.75)", borderRadius: 6, padding: "3px 8px", fontSize: 11, fontWeight: 700, color: "#fff" }}>
                {car.seats || 4} Seats
              </div>
            </div>
            <div className="car-info">
              <div className="car-name">{car.name}</div>
              <div className="car-meta">
                Driver: {car.driver_name || "Unassigned"} &nbsp;·&nbsp; ₹{car.price_per_km || car.pricePerKm}/km
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 12, borderTop: "1px solid var(--border)" }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "var(--accent)", fontFamily: "var(--font-head)" }}>
                  ₹{car.price_per_km || car.pricePerKm}<span style={{ fontSize: 12, fontWeight: 400, color: "var(--text2)" }}>/km</span>
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: statusColor[car.status] || "var(--text2)", textTransform: "capitalize" }}>
                  {car.status === "available" ? "● " : "○ "}{car.status?.replace("_", " ") || "Available"}
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                <button
                  className="btn-secondary"
                  style={{ flex: 1, fontSize: 12, padding: "8px 0" }}
                  onClick={() => updateCarStatus(car.id, car.status === "available" ? "unavailable" : "available")}
                >
                  {car.status === "available" ? "Set Unavailable" : "Set Available"}
                </button>
                <button
                  className="btn-danger"
                  style={{ padding: "8px 12px", fontSize: 14 }}
                  onClick={() => { if (window.confirm("Remove this car?")) removeCar(car.id); }}
                >🗑</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {cars.length === 0 && (
        <div className="card" style={{ padding: 60, textAlign: "center", color: "var(--text2)" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>No cars in fleet yet</div>
          <div style={{ fontSize: 13, marginTop: 6 }}>Add your first vehicle to get started!</div>
          <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setShowAddModal(true)}>+ Add First Car</button>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
              <div className="modal-title">Add New Car</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", color: "var(--text2)", fontSize: 22, cursor: "pointer" }}>×</button>
            </div>
            <form onSubmit={handleAddCar}>
              <div className="form-group">
                <label>Car Name *</label>
                <input placeholder="e.g. Toyota Innova Crysta" value={newCar.name} onChange={e => setNewCar({...newCar, name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price Per Km (₹) *</label>
                  <input type="number" placeholder="18" value={newCar.price_per_km} onChange={e => setNewCar({...newCar, price_per_km: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Seats</label>
                  <select value={newCar.seats} onChange={e => setNewCar({...newCar, seats: e.target.value})}>
                    <option value={4}>4 Seater</option>
                    <option value={6}>6 Seater</option>
                    <option value={7}>7 Seater</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Tier</label>
                <select value={newCar.tier} onChange={e => setNewCar({...newCar, tier: e.target.value})}>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="luxury">Luxury</option>
                </select>
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input placeholder="https://example.com/car.jpg" value={newCar.image} onChange={e => setNewCar({...newCar, image: e.target.value})} />
              </div>
              {newCar.image && (
                <img src={newCar.image} alt="preview" style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} onError={e => e.target.style.display = "none"} />
              )}
              <button type="submit" className="btn-primary" style={{ width: "100%", marginTop: 12 }}>Add Car to Fleet</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}