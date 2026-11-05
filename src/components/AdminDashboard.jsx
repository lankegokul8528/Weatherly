import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
  query,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase";

export default function AdminDashboard() {
  const [usersList, setUsersList] = useState([]);
  const [activeAnnouncements, setActiveAnnouncements] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [systemAlert, setSystemAlert] = useState("");
  const [alertStatus, setAlertStatus] = useState("");
  const [isBroadcasting, setIsBroadcasting] = useState(false);

  // Fetch all registered users from Firestore
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const users = [];
      querySnapshot.forEach((userDoc) => {
        users.push({ id: userDoc.id, ...userDoc.data() });
      });
      setUsersList(users);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Real-time listener for broadcast announcements (sorted in memory to avoid Firestore index errors)
  useEffect(() => {
    const q = query(collection(db, "announcements"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const announcements = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            ...data,
            createdAtMillis: data.createdAt?.toMillis() || Date.now(),
          };
        });

        // Client-side sort descending by creation date
        announcements.sort((a, b) => b.createdAtMillis - a.createdAtMillis);
        setActiveAnnouncements(announcements);
      },
      (error) => {
        console.error("Error listening to announcements:", error);
      }
    );

    return () => unsubscribe();
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

  // Publish live weather alert to Firestore
  const handleBroadcastAlert = async (e) => {
    e.preventDefault();
    if (!systemAlert.trim()) return;

    setIsBroadcasting(true);
    try {
      await addDoc(collection(db, "announcements"), {
        message: systemAlert.trim(),
        createdAt: serverTimestamp(),
        active: true,
      });
      setAlertStatus(`Alert published live: "${systemAlert.trim()}"`);
      setSystemAlert("");
    } catch (error) {
      console.error("Error broadcasting alert:", error);
      setAlertStatus("Failed to publish alert to database.");
    } finally {
      setIsBroadcasting(false);
    }
  };

  // Toggle announcement active status
  const toggleAnnouncementActive = async (announcementId, currentActive) => {
    try {
      await updateDoc(doc(db, "announcements", announcementId), {
        active: !currentActive,
      });
    } catch (error) {
      console.error("Error updating announcement:", error);
    }
  };

  // Delete announcement permanently
  const deleteAnnouncement = async (announcementId) => {
    try {
      await deleteDoc(doc(db, "announcements", announcementId));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto", color: "#0f172a" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h2 style={{ color: "#ffffff", margin: 0, fontSize: "28px", fontWeight: "bold" }}>
            🛠️ Admin Control Panel
          </h2>
          <p style={{ color: "#94a3b8", margin: "4px 0 0 0" }}>
            Manage registered accounts, modify access permissions, and post app notifications.
          </p>
        </div>
        <button
          onClick={fetchUsers}
          style={{
            padding: "8px 16px",
            background: "#334155",
            color: "#ffffff",
            border: "1px solid #475569",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          🔄 Refresh Users
        </button>
      </div>

      {/* System Metrics Overview */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "24px" }}>
        <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px", borderRadius: "12px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#94a3b8", fontSize: "14px" }}>User Management</h4>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#38bdf8" }}>
            {usersList.length} <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>Total Registered</span>
          </p>
        </div>

        <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "18px", borderRadius: "12px" }}>
          <h4 style={{ margin: "0 0 8px 0", color: "#94a3b8", fontSize: "14px" }}>Active Alerts</h4>
          <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0, color: "#4ade80" }}>
            {activeAnnouncements.filter((a) => a.active).length}{" "}
            <span style={{ fontSize: "14px", fontWeight: "normal", color: "#94a3b8" }}>Broadcasting</span>
          </p>
        </div>
      </div>

      {/* User Management Table */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "12px", marginBottom: "24px" }}>
        <h3 style={{ marginTop: 0, color: "#ffffff", fontSize: "18px" }}>Registered User Accounts</h3>
        {loadingUsers ? (
          <p style={{ color: "#94a3b8" }}>Loading user list...</p>
        ) : usersList.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>No registered users found in Firestore database.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "12px", color: "#ffffff" }}>
            <thead>
              <tr style={{ borderBottom: "2px solid #334155", textAlign: "left" }}>
                <th style={{ padding: "10px", color: "#94a3b8" }}>Email</th>
                <th style={{ padding: "10px", color: "#94a3b8" }}>Role</th>
                <th style={{ padding: "10px", textAlign: "right", color: "#94a3b8" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((userItem) => (
                <tr key={userItem.id} style={{ borderBottom: "1px solid #334155" }}>
                  <td style={{ padding: "12px 10px", color: "#f8fafc", fontWeight: "500" }}>{userItem.email || "No Email Provided"}</td>
                  <td style={{ padding: "12px 10px" }}>
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        background: userItem.role === "admin" ? "rgba(59, 130, 246, 0.2)" : "rgba(148, 163, 184, 0.15)",
                        color: userItem.role === "admin" ? "#60a5fa" : "#cbd5e1",
                        border: userItem.role === "admin" ? "1px solid rgba(96, 165, 250, 0.3)" : "1px solid rgba(203, 213, 225, 0.2)",
                      }}
                    >
                      {userItem.role || "user"}
                    </span>
                  </td>
                  <td style={{ padding: "12px 10px", textAlign: "right" }}>
                    <button
                      onClick={() => toggleUserRole(userItem.id, userItem.role)}
                      style={{
                        padding: "6px 14px",
                        fontSize: "12px",
                        cursor: "pointer",
                        borderRadius: "6px",
                        border: "1px solid #475569",
                        background: "#334155",
                        color: "#ffffff",
                        fontWeight: "600",
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

      {/* Broadcast Weather Alert Section */}
      <div style={{ background: "#1e293b", border: "1px solid #334155", padding: "20px", borderRadius: "12px" }}>
        <h3 style={{ marginTop: 0, color: "#ffffff", fontSize: "18px" }}>Broadcast Weather Alert Banner</h3>
        <form onSubmit={handleBroadcastAlert} style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="e.g., High wind warning active for Coastal region..."
            value={systemAlert}
            onChange={(e) => setSystemAlert(e.target.value)}
            style={{
              flex: 1,
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #475569",
              background: "#0f172a",
              color: "#ffffff",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            disabled={isBroadcasting}
            style={{
              padding: "10px 20px",
              background: isBroadcasting ? "#475569" : "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "8px",
              cursor: isBroadcasting ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {isBroadcasting ? "Publishing..." : "Broadcast"}
          </button>
        </form>
        {alertStatus && <p style={{ color: "#4ade80", marginBottom: "20px", fontSize: "14px", fontWeight: "bold" }}>{alertStatus}</p>}

        {/* Live Broadcast Management Feed */}
        <h4 style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "12px" }}>Active Broadcast Feed</h4>
        {activeAnnouncements.length === 0 ? (
          <p style={{ color: "#64748b", fontSize: "14px" }}>No active or past announcements posted.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {activeAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "12px 14px",
                  background: "#0f172a",
                  border: "1px solid #334155",
                  borderRadius: "8px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "bold",
                      background: announcement.active ? "rgba(34, 197, 94, 0.2)" : "rgba(100, 116, 139, 0.2)",
                      color: announcement.active ? "#4ade80" : "#94a3b8",
                      border: announcement.active ? "1px solid rgba(74, 222, 128, 0.3)" : "1px solid rgba(148, 163, 184, 0.2)",
                    }}
                  >
                    {announcement.active ? "LIVE" : "INACTIVE"}
                  </span>
                  <p style={{ margin: 0, color: "#f8fafc", fontSize: "14px", fontWeight: "500" }}>{announcement.message}</p>
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => toggleAnnouncementActive(announcement.id, announcement.active)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      background: "transparent",
                      color: "#94a3b8",
                      border: "1px solid #475569",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    {announcement.active ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement.id)}
                    style={{
                      padding: "4px 10px",
                      fontSize: "12px",
                      background: "rgba(239, 68, 68, 0.15)",
                      color: "#f87171",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}