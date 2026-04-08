import React, { useState } from "react";
import { Toggle, Avatar } from "../components/ui";
import { useApp } from "../context/AppContext";

export default function Settings() {
  const { role, logout, showNotification } = useApp();
  const [notif, setNotif] = useState({ sms: true, email: true, push: false, whatsapp: true });
  const [profile, setProfile] = useState(role === "admin"
    ? { name: "Admin User", phone: "9876543210", email: "admin@cartaxi.in", company: "CarTaxi Vijayawada", gst: "37AAACR1234A1Z5" }
    : { name: "user", phone: "9876543210", email: "user@email.com", address: "MG Road, Vijayawada - 520010" }
  );
  const [billing, setBilling] = useState({ baseFare: 50, nightSurcharge: 20, waitingCharge: 2, cancellationFee: 50 });
  const [saving, setSaving] = useState(false);

  const saveProfile = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    showNotification("Profile updated successfully!", "success");
  };

  return (
    <div className="page">
      <div style={{ fontFamily: "var(--font-head)", fontSize: 26, fontWeight: 700, marginBottom: 28 }} className="animate-in">Settings</div>

      <div style={{ maxWidth: 660, display: "flex", flexDirection: "column", gap: 20 }}>
        {/* Profile Card */}
        <div className="card animate-in delay-1" style={{ padding: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <Avatar name={profile.name} size={64} />
            <div>
              <div style={{ fontFamily: "var(--font-head)", fontSize: 20, fontWeight: 700 }}>{profile.name}</div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>{profile.email}</div>
              <div style={{ fontSize: 12, color: role === "admin" ? "var(--accent)" : "var(--accent2)", marginTop: 2, fontWeight: 600 }}>{role === "admin" ? "Administrator" : "Passenger Account"}</div>
            </div>
          </div>

          <div className="section-title">Profile Information</div>
          <div className="form-row">
            <div className="form-group"><label>Full Name</label><input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} /></div>
            <div className="form-group"><label>Mobile Number</label><input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} /></div>
          </div>
          <div className="form-group"><label>Email Address</label><input value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} /></div>
          {role === "admin" && (
            <div className="form-row">
              <div className="form-group"><label>Company Name</label><input value={profile.company} onChange={e => setProfile({ ...profile, company: e.target.value })} /></div>
              <div className="form-group"><label>GST Number</label><input value={profile.gst} onChange={e => setProfile({ ...profile, gst: e.target.value })} /></div>
            </div>
          )}
          {role === "user" && (
            <div className="form-group"><label>Home Address</label><input value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} /></div>
          )}
          <button className="btn-primary" onClick={saveProfile} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* Notifications */}
        <div className="card animate-in delay-2" style={{ padding: 28 }}>
          <div className="section-title">Notifications</div>
          {[
            { k: "sms", l: "SMS Alerts", d: "Booking confirmations & OTP via SMS" },
            { k: "email", l: "Email Notifications", d: "Receipts, invoices & booking updates" },
            { k: "push", l: "Push Notifications", d: "Real-time ride status updates" },
            { k: "whatsapp", l: "WhatsApp Updates", d: "Ride info via WhatsApp" },
          ].map(n => (
            <div key={n.k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: "1px solid var(--border)" }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{n.l}</div>
                <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>{n.d}</div>
              </div>
              <Toggle on={notif[n.k]} onChange={v => setNotif({ ...notif, [n.k]: v })} />
            </div>
          ))}
        </div>

        {/* Admin: Billing Config */}
        {role === "admin" && (
          <div className="card animate-in delay-3" style={{ padding: 28 }}>
            <div className="section-title">Billing Configuration</div>
            <div className="form-row">
              <div className="form-group"><label>Base Fare (₹)</label><input type="number" value={billing.baseFare} onChange={e => setBilling({ ...billing, baseFare: e.target.value })} /></div>
              <div className="form-group"><label>Night Surcharge (%)</label><input type="number" value={billing.nightSurcharge} onChange={e => setBilling({ ...billing, nightSurcharge: e.target.value })} /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label>Waiting Charge (₹/min)</label><input type="number" value={billing.waitingCharge} onChange={e => setBilling({ ...billing, waitingCharge: e.target.value })} /></div>
              <div className="form-group"><label>Cancellation Fee (₹)</label><input type="number" value={billing.cancellationFee} onChange={e => setBilling({ ...billing, cancellationFee: e.target.value })} /></div>
            </div>
            <button className="btn-primary" onClick={() => showNotification("Billing config updated!", "success")}>Update Billing</button>
          </div>
        )}

        {/* Admin: System Settings */}
        {role === "admin" && (
          <div className="card animate-in delay-4" style={{ padding: 28 }}>
            <div className="section-title">System Settings</div>
            {[
              { l: "Auto-Approve Bookings", d: "Automatically approve new booking requests" },
              { l: "Driver Slot Auto-Reset", d: "Reset driver availability after trip completion" },
              { l: "Maintenance Mode", d: "Temporarily disable new bookings" },
            ].map((s, i) => (
              <div key={s.l} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", borderBottom: "1px solid var(--border)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.l}</div>
                  <div style={{ fontSize: 12, color: "var(--text2)" }}>{s.d}</div>
                </div>
                <Toggle on={i === 0} onChange={() => { }} />
              </div>
            ))}
          </div>
        )}

        {/* Account Actions */}
        <div className="card animate-in delay-4" style={{ padding: 28 }}>
          <div className="section-title">Account</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button className="btn-ghost" style={{ textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 10 }} onClick={() => showNotification("Password reset email sent!", "info")}>
              🔒 Change Password
            </button>
            <button className="btn-ghost" style={{ textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 10 }}>
              📱 Manage Linked Devices
            </button>
            <button className="btn-ghost" style={{ textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 10 }}>
              📋 Download My Data
            </button>
            <button className="btn-danger" style={{ textAlign: "left", justifyContent: "flex-start", display: "flex", alignItems: "center", gap: 10, marginTop: 8 }} onClick={() => { if (window.confirm("Are you sure you want to delete your account?")) logout(); }}>
              🗑 Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}