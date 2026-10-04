import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [systemAlert, setSystemAlert] = useState("");
  const [alertStatus, setAlertStatus] = useState("");

  // Fetch all registered users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const users = [];
        querySnapshot.forEach((doc) => {
          users.push({ id: doc.id, ...doc.data() });
        });
        setUsersList(users);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Toggle user role between 'user' and 'admin'
  const toggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsersList((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const handleBroadcastAlert = (e) => {
    e.preventDefault();
    if (!systemAlert.trim()) return;
    setAlertStatus(`Alert published: "${systemAlert}"`);
    setSystemAlert("");
  };

  return (
    <div style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
      <h2>🛠️ Admin Control Panel</h2>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Manage registered accounts, modify access permissions, and post app notifications.
      </p>

      {/* System Metrics Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" }}>
        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>User Management</h4>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0, color: "#2563eb" }}>
            {usersList.length} <span style={{ fontSize: "14px", fontWeight: "normal", color: "#666" }}>Total Registered</span>
          </p>
        </div>

        <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "15px", borderRadius: "8px", boxShadow: "0 2px 4px rgba(0,0,0,0.05)" }}>
          <h4 style={{ margin: "0 0 10px 0" }}>API Status</h4>
          <p style={{ fontSize: "18px", fontWeight: "bold", margin: 0, color: "#16a34a" }}>
            ● Operational
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "20px", borderRadius: "8px", marginBottom: "25px" }}>
        <h3 style={{ marginTop: 0 }}>Registered User Accounts</h3>
        {loading ? (
          <p>Loading user list...</p>
        ) : usersList.length === 0 ? (
          <p style={{ color: "#666" }}>No registered users found in Firestore.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #eee", textAlign: "left" }}>
                <th style={{ padding: "8px" }}>Email</th>
                <th style={{ padding: "8px" }}>Role</th>
                <th style={{ padding: "8px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((userItem) => (
                <tr key={userItem.id} style={{ borderBottom: "1px solid #eee" }}>
                  <td style={{ padding: "10px 8px" }}>{userItem.email}</td>
                  <td style={{ padding: "10px 8px" }}>
                    <span
                      style={{
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background: userItem.role === "admin" ? "#dbeafe" : "#f3f4f6",
                        color: userItem.role === "admin" ? "#1e40af" : "#374151",
                      }}
                    >
                      {userItem.role || "user"}
                    </span>
                  </td>
                  <td style={{ padding: "10px 8px", textAlign: "right" }}>
                    <button
                      onClick={() => toggleUserRole(userItem.id, userItem.role)}
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        cursor: "pointer",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                        background: "#fff",
                      }}
                    >
                      Toggle to {userItem.role === "admin" ? "User" : "Admin"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* System Weather Alert Broadcast */}
      <div style={{ background: "#fff", border: "1px solid #e0e0e0", padding: "20px", borderRadius: "8px" }}>
        <h3 style={{ marginTop: 0 }}>Broadcast Weather Alert Banner</h3>
        <form onSubmit={handleBroadcastAlert} style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="e.g., High wind warning active for Coastal region..."
            value={systemAlert}
            onChange={(e) => setSystemAlert(e.target.value)}
            style={{ flex: 1, padding: "8px 12px", borderRadius: "4px", border: "1px solid #ccc" }}
          />
          <button type="submit" style={{ padding: "8px 16px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "4px", cursor: "pointer" }}>
            Broadcast
          </button>
        </form>
        {alertStatus && <p style={{ color: "#16a34a", marginTop: "10px", fontSize: "14px" }}>{alertStatus}</p>}
      </div>
    </div>
  );
}