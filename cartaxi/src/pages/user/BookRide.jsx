import React, { useState } from "react";
// Assumed imports based on the code usage
import { TierBadge, Toggle, Avatar, Stars } from "../../components/ui/index.jsx";
// Mock Data for the datalist (Fixing missing LOCATIONS)
const LOCATIONS = [
  "Auto Nagar, Kakinada",
  "Industrial Area, Hyderabad",
  "Main Street, Vijayawada",
  "Tech Park, Bangalore",
  "Warehouse, Chennai"
];

export function PlaceOrder() { // Renamed from BookRide
  // Assuming useApp provides these context values
  const { products, addOrder, setBill, showNotification } = useApp(); 
  
  const [step, setStep] = useState(1);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [slotOn, setSlotOn] = useState(true);
  const [ordered, setOrdered] = useState(null); // Renamed from 'booked'
  
  const [form, setForm] = useState({
    from: "Warehouse, Kakinada", // Billing/Source
    to: "", // Destination
    quantity: 1, // Replaced Km logic
    date: new Date().toISOString().slice(0, 10), 
    time: "10:00", 
    passengers: 1, // Kept for structure, or could be 'priority'
    notes: ""
  });
 
  // Calculation Logic Updated for Dealer System
  const qty = Number(form.quantity) || 0;
  const amount = selected && qty ? qty * selected.price : 0; // pricePerKm -> price
  const tax = Math.round(amount * 0.05);
 
  // Filter Logic (Updated for Products)
  const availProducts = products.filter(p => p.status === "available");
  const filtered = filter === "all" ? availProducts
    : filter === "electronics" ? availProducts.filter(p => p.category === "electronics")
    : filter === "spare-parts" ? availProducts.filter(p => p.category !== "electronics")
    : filter === "premium" ? availProducts.filter(p => p.tier === "premium")
    : availProducts.filter(p => p.tier === "luxury");
 
  const confirmOrder = () => { // Renamed from confirmBooking
    if (!selected) return;
    if (!form.to) { showNotification("Please enter a shipping destination", "error"); return; }
    
    const order = {
      id: "ORD" + Date.now().toString().slice(-5),
      user: "Priya Nair", 
      userPhone: "9876543210",
      product: selected.name, 
      productId: selected.id,
      from: form.from, 
      to: form.to,
      quantity: qty,
      status: "pending",
      date: form.date, 
      time: form.time,
      amount: amount || selected.price,
      tax: tax || Math.round(selected.price * 0.05),
      supplier: selected.supplier, // Renamed from driver
      supplierPhone: selected.supplierPhone,
      notes: form.notes
    };
    
    addOrder(order); // Renamed from addBooking
    setOrdered(order);
    showNotification("Order request sent! Awaiting admin approval.", "success");
  };
 
  // Ordered State
  if (ordered) return (
    <div className="page">
      <div style={{ maxWidth: 520, margin: "0 auto" }}>
        <div className="card animate-in" style={{ padding: 36, textAlign: "center" }}>
          <div style={{ fontSize: 72, marginBottom: 16 }}>🎉</div>
          <div style={{ fontFamily: "var(--font-head)", fontSize: 28, fontWeight: 700, color: "var(--accent2)", marginBottom: 8 }}>Order Submitted!</div>
          <div style={{ color: "var(--text2)", marginBottom: 28, fontSize: 14 }}>
            Your request <strong style={{ color: "var(--accent)" }}>{ordered.id}</strong> is pending admin approval
          </div>
 
          <div className="driver-card" style={{ marginBottom: 20, textAlign: "left" }}> {/* Fixed typo "left'" */}
            <Avatar name={selected.supplier} size={50} /> {/* Changed driver to supplier */}
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.supplier}</div>
              <div style={{ color: "var(--accent)", fontSize: 14, fontWeight: 600 }}>📞 {selected.supplierPhone}</div>
              <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 2 }}>{selected.name} · {selected.sku}</div> {/* Changed plate to sku */}
              <Stars rating={selected.supplierRating} />
            </div>
          </div>
 
          <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 18, marginBottom: 20, textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                { l: "From", v: form.from },
                { l: "To", v: form.to },
                { l: "Quantity", v: `${qty} units` },
                { l: "Date & Time", v: `${form.date} · ${form.time}` },
                { l: "Subtotal", v: `₹${amount || selected.price}` },
                { l: "Est. Total", v: `₹${(amount || selected.price) + tax}` },
              ].map(i => (
                <div key={i.l}>
                  <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{i.l}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, marginTop: 2 }}>{i.v}</div>
                </div>
              ))}
            </div>
          </div>
 
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>Supplier Slot Status</div>
              <div style={{ fontSize: 12, color: "var(--text2)" }}>{slotOn ? "Available — Supplier can accept orders" : "Unavailable"}</div>
            </div>
            <Toggle on={slotOn} onChange={setSlotOn} />
          </div>
 
          <div style={{ display: "flex", gap: 12 }}>
            <button className="btn-secondary" style={{ flex: 1 }} onClick={() => { setOrdered(null); setSelected(null); setStep(1); }}>Order Another</button>
            <button className="btn-success" style={{ flex: 1 }} onClick={() => setBill(ordered)}>📄 View Invoice</button>
          </div>
        </div>
      </div>
    </div>
  );
 
  return (
    <div className="page">
      {/* Step Header */}
      <div style={{ marginBottom: 28 }} className="animate-in">
        <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 8 }}>Place Order</div> {/* Changed Title */}
        <div style={{ display: "flex", gap: 4 }}>
          {["Shipping & Schedule", "Choose Product", "Confirm"].map((s, i) => ( // Changed Step Names
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, background: step === i + 1 ? "var(--accent-glow)" : step > i + 1 ? "rgba(16,185,129,0.1)" : "var(--surface2)", color: step === i + 1 ? "var(--accent)" : step > i + 1 ? "var(--accent2)" : "var(--text3)", border: `1px solid ${step === i + 1 ? "var(--accent)" : step > i + 1 ? "rgba(16,185,129,0.3)" : "var(--border)"}` }}>
                <div style={{ width: 18, height: 18, borderRadius: "50%", background: step > i + 1 ? "var(--accent2)" : step === i + 1 ? "var(--accent)" : "var(--surface3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: step >= i + 1 ? "#0A0E1A" : "var(--text3)" }}>
                  {step > i + 1 ? "✓" : i + 1}
                </div>
                {s}
              </div>
              {i < 2 && <div style={{ width: 20, height: 1, background: step > i + 1 ? "var(--accent2)" : "var(--border)" }} />}
            </div>
          ))}
        </div>
      </div>
 
      {/* STEP 1: Route/Shipping Details */}
      {step === 1 && (
        <div className="animate-in">
          <div className="card" style={{ padding: 28, marginBottom: 20 }}>
            <div className="section-title">📍 Shipping Details</div> {/* Changed Title */}
 
            <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 20, marginBottom: 16 }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: "50%", background: "var(--accent2)", flexShrink: 0, boxShadow: "0 0 0 3px rgba(16,185,129,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <input list="locations" placeholder="Billing: Warehouse, Kakinada" value={form.from} onChange={e => setForm({ ...form, from: e.target.value })} />
                    <datalist id="locations">{LOCATIONS.map(l => <option key={l} value={l} />)}</datalist>
                  </div>
                  <div style={{ width: 160, flexShrink: 0 }}>
                    {/* Changed Odometer to Quantity Input */}
                    <input type="number" placeholder="Quantity" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                  </div>
                </div>
                <div style={{ width: 2, height: 20, background: "var(--border)", marginLeft: 5 }} />
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: "var(--danger)", flexShrink: 0, boxShadow: "0 0 0 3px rgba(239,68,68,0.2)" }} />
                  <div style={{ flex: 1 }}>
                    <input list="locations" placeholder="Shipping: Customer Address..." value={form.to} onChange={e => setForm({ ...form, to: e.target.value })} />
                  </div>
                  <div style={{ width: 160, flexShrink: 0 }}>
                    {/* Placeholder for consistency */}
                    <div style={{height: 40}}></div> 
                  </div>
                </div>
              </div>
 
              {qty > 0 && (
                <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
                  <div style={{ flex: 1, background: "var(--accent-glow)", border: "1px solid var(--border-accent)", borderRadius: 8, padding: "10px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 18 }}>📦</span>
                    <div>
                      <div style={{ fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>QUANTITY</div>
                      <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700, color: "var(--text)" }}>{qty} Units</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
 
            {/* Map Preview (Kept for visual consistency) */}
            <div className="map-placeholder">
              <div className="map-grid" />
              <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
                <div style={{ fontSize: 28, marginBottom: 6 }}>🗺</div>
                <div style={{ fontSize: 14, fontWeight: 600 }}>Shipping Route</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 4 }}>{form.from} → {form.to || "Select destination"}</div>
                {qty > 0 && <div style={{ marginTop: 8, fontSize: 13, color: "var(--accent)", fontWeight: 700 }}>Weight: ~{qty * 10} kg</div>}
              </div>
              <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }}>
                <path d="M 60 200 C 100 150 160 120 220 130 C 280 140 340 100 380 70" stroke="#F59E0B" strokeWidth="2.5" fill="none" strokeDasharray="8,5" />
                <circle cx="60" cy="200" r="6" fill="#10B981" />
                <circle cx="380" cy="70" r="6" fill="#EF4444" />
              </svg>
            </div>
          </div>
 
          <div className="card" style={{ padding: 24, marginBottom: 20 }}>
            <div className="section-title">📅 Schedule</div>
            <div className="form-row">
              <div className="form-group"><label>Date</label><input type="date" value={form.date} min={new Date().toISOString().slice(0, 10)} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="form-group"><label>Delivery Time</label><input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Priority</label>
                <select value={form.passengers} onChange={e => setForm({ ...form, passengers: Number(e.target.value) })}>
                  {[1, 2, 3].map(n => <option key={n} value={n}>{"Standard".repeat(n > 1 ? n : 1)}</option>)}
                </select>
              </div>
              <div className="form-group"><label>Special Notes</label><input placeholder="Packaging instructions, gate code..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
            </div>
          </div>
 
          <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", fontSize: 16 }} onClick={() => { if (!form.to) { showNotification("Please enter a destination", "error"); return; } setStep(2); }}>
            Continue — Choose Product →
          </button>
        </div>
      )}
 
      {/* STEP 2: Choose Product */}
      {step === 2 && (
        <div className="animate-in">
          <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", marginBottom: 20, fontSize: 14, display: "flex", alignItems: "center", gap: 6, fontWeight: 600 }}>← Back to Details</button>
 
          <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
            {[{ k: "all", l: "All Products" }, { k: "electronics", l: "Electronics" }, { k: "spare-parts", l: "Spare Parts" }, { k: "premium", l: "★ Premium" }, { k: "luxury", l: "✦ Luxury" }].map(f => (
              <button key={f.k} onClick={() => setFilter(f.k)} style={{ padding: "8px 18px", borderRadius: 20, fontSize: 13, fontWeight: 600, border: filter === f.k ? "1px solid var(--accent)" : "1px solid var(--border)", background: filter === f.k ? "var(--accent-glow)" : "var(--glass)", color: filter === f.k ? "var(--accent)" : "var(--text2)", cursor: "pointer", transition: "all 0.2s" }}>
                {f.l}
              </button>
            ))}
            <div style={{ marginLeft: "auto", fontSize: 13, color: "var(--text2)", display: "flex", alignItems: "center" }}>
              {filtered.length} products available
            </div>
          </div>
 
          <div className="grid-auto" style={{ marginBottom: 100 }}>
            {filtered.map(product => (
              <div key={product.id} className="card car-card" style={{ border: selected?.id === product.id ? "2px solid var(--accent)" : "1px solid var(--border)" }} onClick={() => setSelected(product)}>
                <div className="car-img">
                  {product.image ? <><img src={product.image} alt={product.name} /><div className="car-img-overlay" /></> : <div className="car-img-emoji">{product.emoji}</div>}
                  <div className="car-tier"><TierBadge tier={product.tier} /></div>
                  <div style={{ position: "absolute", top: 10, left: 10, background: "rgba(0,0,0,0.7)", borderRadius: 6, padding: "3px 10px", fontSize: 12, fontWeight: 700, color: "#fff" }}>Stock: {product.stock}</div>
                  {selected?.id === product.id && <div style={{ position: "absolute", inset: 0, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><div style={{ fontSize: 40 }}>✓</div></div>}
                </div>
                <div className="car-info">
                  <div className="car-name">{product.name}</div>
                  <div className="car-meta">{product.type} · {product.brand} · {product.year}</div>
                  {product.description && <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>{product.description}</div>}
                  <div style={{ display: "flex", gap: 5, marginTop: 8 }}>
                    {product.warranty && <span className="tag tag-blue" style={{ fontSize: 10, padding: "2px 8px" }}>🛡 Warranty</span>}
                    {product.returnable && <span className="tag tag-teal" style={{ fontSize: 10, padding: "2px 8px" }}>↺ Returnable</span>}
                  </div>
                  <div className="driver-card" style={{ marginTop: 12, padding: 10 }}>
                    <Avatar name={product.supplier} size={32} />
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700 }}>{product.supplier}</div>
                      <div style={{ fontSize: 12, color: "var(--accent)", fontWeight: 700 }}>📞 {product.supplierPhone}</div>
                      <Stars rating={product.supplierRating} />
                    </div>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12 }}>
                    <div className="car-price">₹{product.price}/unit</div>
                    {qty > 0 && <div style={{ fontSize: 13, color: "var(--text2)", fontWeight: 600 }}>Est. <span style={{ color: "var(--accent)" }}>₹{product.price * qty}</span></div>}
                  </div>
                </div>
              </div>
            ))}
          </div>
 
          {selected && (
            <div style={{ position: "fixed", bottom: 24, left: "calc(var(--sidebar-w) + 32px)", right: 32, zIndex: 50 }}>
              <div className="card" style={{ padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid var(--accent)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ fontSize: 28 }}>{selected.emoji}</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{selected.name} selected</div>
                    <div style={{ fontSize: 13, color: "var(--text2)" }}>
                      {qty > 0 ? `${qty} units × ₹${selected.price} = ₹${amount} + GST ₹${tax}` : "Add quantity for estimate"}
                    </div>
                  </div>
                </div>
                <button className="btn-primary" style={{ fontSize: 15, padding: "12px 32px", whiteSpace: "nowrap" }} onClick={() => setStep(3)}>
                  Review & Confirm →
                </button>
              </div>
            </div>
          )}
        </div>
      )}
 
      {/* STEP 3: Confirm */}
      {step === 3 && selected && (
        <div className="animate-in">
          <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--text2)", cursor: "pointer", marginBottom: 20, fontSize: 14, fontWeight: 600 }}>← Back to Product Selection</button>
          <div style={{ maxWidth: 560 }}>
            <div className="card" style={{ padding: 28, marginBottom: 16 }}>
              <div className="section-title">📋 Order Summary</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                {[{ l: "Billing", v: form.from }, { l: "Shipping", v: form.to }, { l: "Date", v: form.date }, { l: "Time", v: form.time }, { l: "Quantity", v: qty ? `${qty} Units` : "1 Unit" }, { l: "Priority", v: form.passengers > 1 ? "High" : "Standard" }].map(i => (
                  <div key={i.l} style={{ background: "var(--surface2)", borderRadius: 8, padding: 12 }}>
                    <div style={{ fontSize: 10, color: "var(--text3)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>{i.l}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, marginTop: 4 }}>{i.v}</div>
                  </div>
                ))}
              </div>
              <div className="driver-card" style={{ marginBottom: 16 }}>
                <Avatar name={selected.supplier} size={48} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{selected.supplier}</div>
                  <div style={{ color: "var(--accent)", fontWeight: 700, fontSize: 14 }}>📞 {selected.supplierPhone}</div>
                  <div style={{ fontSize: 13, color: "var(--text2)" }}>{selected.name} · {selected.sku}</div>
                  <Stars rating={selected.supplierRating} />
                </div>
                <TierBadge tier={selected.tier} />
              </div>
              <div style={{ borderTop: "1px solid var(--border)", paddingTop: 16 }}>
                {[{ l: "Subtotal", v: `₹${amount || selected.price}` }, { l: "GST (5%)", v: `₹${tax || Math.round(selected.price * 0.05)}` }, { l: "Shipping Fee", v: "₹30" }].map(r => (
                  <div key={r.l} style={{ display: "flex", justifyContent: "space-between", fontSize: 14, marginBottom: 8 }}>
                    <span style={{ color: "var(--text2)" }}>{r.l}</span>
                    <span style={{ fontWeight: 600 }}>{r.v}</span>
                  </div>
                ))}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 800, borderTop: "1px solid var(--border)", paddingTop: 12, marginTop: 4 }}>
                  <span>Total</span>
                  <span style={{ color: "var(--accent)" }}>₹{(amount || selected.price) + (tax || Math.round(selected.price * 0.05)) + 30}</span>
                </div>
              </div>
            </div>
            <button className="btn-primary" style={{ width: "100%", padding: "16px 24px", fontSize: 16 }} onClick={confirmOrder}>
              ✓ Confirm Order — ₹{(amount || selected.price) + (tax || Math.round(selected.price * 0.05)) + 30}
            </button>
            <div style={{ fontSize: 12, color: "var(--text3)", textAlign: "center", marginTop: 10 }}>Payment collected on delivery · Credit/UPI accepted</div>
          </div>
        </div>
      )}
    </div>
  );
}