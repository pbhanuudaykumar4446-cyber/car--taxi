import React, { useRef } from "react";

export default function BillModal({ booking, onClose }) {
  const printRef = useRef();
  if (!booking) return null;

  // Django API fields
  const amount = Number(booking.total_price || 0);
  const tax = Math.round(amount * 0.05);
  const platformFee = 30;
  const total = amount + tax + platformFee;
  
  const km = Number(booking.distance_km || 1);
  const pricePerKm = Math.round(amount / km);
  
  const bookingDate = booking.created_at ? new Date(booking.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }) : "Today";
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const time = booking.created_at ? new Date(booking.created_at).toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }) : "N/A";

  const carName = booking.car_details?.name || booking.car || "CarTaxi";
  const driverName = booking.car_details?.driver_name || "Assigned Driver";
  const driverPhone = booking.car_details?.driver_phone || "N/A";
  const userName = booking.user_name || "Valued Customer";
  const userPhone = booking.user_phone || "N/A";
  const pickup = booking.pickup_location || "Source";
  const dropoff = booking.dropoff_location || "Destination";

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html><head><title>Invoice ${booking.id}</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; color: #0A0E1A; }
        .invoice { max-width: 600px; margin: 40px auto; padding: 40px; border: 1px solid #e5e7eb; border-radius: 12px; }
        .header { border-bottom: 3px solid #F59E0B; padding-bottom: 24px; margin-bottom: 28px; display: flex; justify-content: space-between; align-items: flex-start; }
        .logo { font-size: 28px; font-weight: 800; color: #F59E0B; }
        .logo span { color: #0A0E1A; }
        .badge { background: #FEF3C7; color: #92400E; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; margin-top: 4px; display: inline-block; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: 24px 0; }
        .info-section h3 { font-size: 11px; color: #6B7280; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 6px; }
        .route-box { background: #F9FAFB; border-radius: 8px; padding: 16px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; margin-top: 16px; }
        th { font-size: 11px; color: #6B7280; text-transform: uppercase; padding: 8px 0; border-bottom: 1px solid #E5E7EB; text-align: left; }
        td { padding: 10px 0; border-bottom: 1px solid #F3F4F6; font-size: 14px; }
        td:last-child { text-align: right; font-weight: 600; }
        .total-row { border-top: 2px solid #0A0E1A; margin-top: 8px; padding-top: 12px; display: flex; justify-content: space-between; font-size: 18px; font-weight: 800; }
        .footer { text-align: center; margin-top: 32px; padding-top: 20px; border-top: 1px solid #E5E7EB; font-size: 12px; color: #6B7280; }
      </style></head><body>
      <div class="invoice">
        <div class="header">
          <div style="display:flex;align-items:center;gap:16px;">
            <img src="${window.location.origin}/logo.png" style="width:70px;" />
            <div>
              <div class="logo">Car<span>Taxi</span></div>
              <div style="font-size:12px;color:#6B7280;margin-top:2px;">Vijayawada, Andhra Pradesh</div>
              <div style="font-size:11px;color:#9CA3AF;">GST: 37AAACR1234A1Z5 | CIN: AP2021TC001234</div>
              <div class="badge">TAX INVOICE</div>
            </div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:22px;font-weight:800;color:#F59E0B;">#${booking.id}</div>
            <div style="font-size:12px;color:#6B7280;margin-top:4px;">Date: ${bookingDate}</div>
            <div style="font-size:12px;color:#6B7280;">Printed: ${today}</div>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-section">
            <h3>Customer Details</h3>
            <div style="font-weight:600;font-size:15px;">${userName}</div>
            <div style="color:#6B7280;font-size:13px;">📞 ${userPhone}</div>
          </div>
          <div class="info-section">
            <h3>Driver & Vehicle</h3>
            <div style="font-weight:600;font-size:15px;">${driverName}</div>
            <div style="color:#6B7280;font-size:13px;">📞 ${driverPhone}</div>
            <div style="color:#6B7280;font-size:13px;">🚗 ${carName}</div>
          </div>
        </div>

        <div class="route-box">
          <div style="display:flex;gap:16px;align-items:center;">
            <div style="flex:1;"><div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Pickup</div><div style="font-weight:600;margin-top:3px;">📍 ${pickup.split(',')[0]}</div></div>
            <div style={{fontSize:"24px"}}>→</div>
            <div style="flex:1;"><div style="font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:0.05em;">Drop</div><div style="font-weight:600;margin-top:3px;">🏁 ${dropoff.split(',')[0]}</div></div>
          </div>
          <div style="margin-top:12px;padding-top:12px;border-top:1px solid #E5E7EB;display:flex;gap:24px;font-size:13px;">
            <span><strong>Distance:</strong> ${km} km</span>
            <span><strong>Time:</strong> ${time}</span>
            <span><strong>Rate:</strong> ₹${pricePerKm}/km</span>
          </div>
        </div>

        <table>
          <thead><tr><th>Description</th><th style="text-align:right;">Amount</th></tr></thead>
          <tbody>
            <tr><td>Base Fare (${km} km × ₹${pricePerKm})</td><td>₹${amount.toLocaleString("en-IN")}</td></tr>
            <tr><td>GST @ 5% (CGST 2.5% + SGST 2.5%)</td><td>₹${tax.toLocaleString("en-IN")}</td></tr>
            <tr><td>Platform Convenience Fee</td><td>₹${platformFee}</td></tr>
          </tbody>
        </table>
        <div class="total-row"><span>Total Amount</span><span>₹${total.toLocaleString("en-IN")}</span></div>

        <div style="margin-top:20px;background:#F0FDF4;border-radius:8px;padding:12px 16px;font-size:13px;">
          <strong>Payment Mode:</strong> Cash/UPI &nbsp;|&nbsp; <strong>Status:</strong> ✅ Paid
        </div>

        <div class="footer">
          <p>Thank you for choosing CarTaxi! • 24/7 Support: 1800-XXX-XXXX</p>
          <p>UPI: cartaxi@paytm • www.cartaxi.in</p>
          <p style="margin-top:6px;font-size:11px;">This is a computer-generated invoice. No signature required.</p>
        </div>
      </div>
      </body></html>
    `);
    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => printWindow.print(), 500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ fontFamily: "var(--font-head)", fontWeight: 700, fontSize: 20 }}>Trip Invoice</div>
          <button className="btn-ghost btn-sm" onClick={onClose}>✕ Close</button>
        </div>

        <div className="pdf-preview">
          <div className="pdf-header">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <img src="/logo.png" alt="Logo" style={{ width: 42 }} />
                <div>
                  <div className="pdf-logo">CarTaxi</div>
                  <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>Vijayawada | GST: 37AAACR12...</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontWeight: 800, fontSize: 16, color: "#F59E0B" }}>#{booking.id}</div>
                <div style={{ fontSize: 11, color: "#888" }}>{bookingDate}</div>
                <div style={{ background: "#FEF3C7", color: "#92400E", padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, marginTop: 4 }}>PAID</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16, fontSize: 13 }}>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Customer</div>
              <div style={{ fontWeight: 700 }}>{userName}</div>
              <div style={{ color: "#888" }}>📞 {userPhone}</div>
            </div>
            <div>
              <div style={{ fontWeight: 700, marginBottom: 4, color: "#888", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.05em" }}>Driver</div>
              <div style={{ fontWeight: 700 }}>{driverName}</div>
              <div style={{ color: "#888" }}>📞 {driverPhone}</div>
              <div style={{ color: "#888" }}>🚗 {carName}</div>
            </div>
          </div>

          <div style={{ background: "#F9FAFB", borderRadius: 8, padding: 14, marginBottom: 16, fontSize: 13 }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <div style={{ flex: 1 }}><div style={{ color: "#888", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>From</div><div style={{ fontWeight: 600, marginTop: 2 }}>📍 {pickup.split(',')[0]}</div></div>
              <div style={{ fontSize: 20 }}>→</div>
              <div style={{ flex: 1 }}><div style={{ color: "#888", fontSize: 11, fontWeight: 700, textTransform: "uppercase" }}>To</div><div style={{ fontWeight: 600, marginTop: 2 }}>🏁 {dropoff.split(',')[0]}</div></div>
            </div>
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid #E5E7EB", fontSize: 12, color: "#666" }}>
              Distance: <strong>{km} km</strong> &nbsp;·&nbsp; Rate: <strong>₹{pricePerKm}/km</strong> &nbsp;·&nbsp; Time: <strong>{time}</strong>
            </div>
          </div>

          <table className="pdf-table">
            <tbody>
              <tr><td>Base Fare ({km} km × ₹{pricePerKm})</td><td>₹{amount.toLocaleString("en-IN")}</td></tr>
              <tr><td>GST @ 5%</td><td>₹{tax.toLocaleString("en-IN")}</td></tr>
              <tr><td>Platform Fee</td><td>₹{platformFee}</td></tr>
            </tbody>
          </table>
          <div className="pdf-total">
            <span>Total</span>
            <span style={{ color: "#F59E0B" }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <div style={{ marginTop: 16, textAlign: "center", fontSize: 11, color: "#aaa" }}>
            Thank you for riding with CarTaxi · UPI: cartaxi@paytm
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={handlePrint}>
            🖨 Print / Download PDF
          </button>
          <button className="btn-secondary" style={{ flex: 1 }} onClick={() => alert("Sharing via WhatsApp/Email...")}>
            📤 Share Invoice
          </button>
        </div>
      </div>
    </div>
  );
}