import { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";
import '../styles/AdminDashboard.css';

const AdminDashboard = ({ onBack, onLogout }) => {
  // Helper function to format date as local YYYY-MM-DD string
  const formatLocalDate = (dateInput) => {
    if (typeof dateInput === "string") return dateInput;
    const year = dateInput.getFullYear();
    const month = String(dateInput.getMonth() + 1).padStart(2, "0");
    const day = String(dateInput.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const today = new Date();
  const localDateStr = formatLocalDate(today);
  const [date, setDate] = useState(localDateStr);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const loadAppointments = async () => {
    setLoading(true);
    setError("");

    try {
      const dailyQuery = query(
        collection(db, "appointments"),
        where("date", "==", date)
      );

      const snapshot = await getDocs(dailyQuery);
      const items = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
      items.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
      setAppointments(items);
    } catch (loadError) {
      setError(loadError.message || "Failed to load appointments.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [date]);

  const usageByTime = useMemo(() => {
    const usage = {};
    appointments.forEach((appointment) => {
      if (appointment.status === "denied") {
        return;
      }

      usage[appointment.time] = (usage[appointment.time] || 0) + 1;
    });
    return usage;
  }, [appointments]);

  const filteredAppointments = useMemo(() => {
    if (!serviceFilter) {
      return appointments;
    }
    return appointments.filter(
      (appointment) => appointment?.service?.name === serviceFilter
    );
  }, [appointments, serviceFilter]);

  const availableServices = useMemo(() => {
    const services = new Set();
    appointments.forEach((appointment) => {
      if (appointment?.service?.name) {
        services.add(appointment.service.name);
      }
    });
    return Array.from(services).sort();
  }, [appointments]);

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "appointments", id), {
      status,
      reviewedAt: serverTimestamp(),
    });

    await loadAppointments();
  };

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard-wrapper">
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        <button
          onClick={onBack}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontWeight: "bold",
            transition: "transform 0.2s ease, box-shadow 0.2s ease",
          }}
        >
          ← Back
        </button>
        {onLogout && (
          <button
            onClick={onLogout}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              cursor: "pointer",
              background: "#e74c3c",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}
          >
            Logout
          </button>
        )}
      </div>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <label>Schedule date:</label>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <label>Service:</label>
        <select
          value={serviceFilter}
          onChange={(event) => setServiceFilter(event.target.value)}
          style={{ padding: "5px 8px" }}
        >
          <option value="">All Services</option>
          {availableServices.map((service) => (
            <option key={service} value={service}>
              {service}
            </option>
          ))}
        </select>
      </div>

      <p style={{ marginTop: "15px" }}>
        Daily appointments: <strong>{filteredAppointments.length}</strong>
      </p>

      {loading && <p>Loading schedules...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        {filteredAppointments.map((appointment) => {
          const usage = usageByTime[appointment.time] || 0;

          return (
            <div
              key={appointment.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "12px",
                marginBottom: "10px",
              }}
            >
              <p style={{ margin: 0 }}>
                <strong>{appointment.time}</strong> - {appointment?.service?.name}
              </p>
              <p style={{ margin: "6px 0" }}>
                Names: {appointment?.userDetails?.name} | Phone number: {appointment?.userDetails?.phone}
              </p>
              <p style={{ margin: "6px 0" }}>
                Status: <strong>{appointment.status || "pending"}</strong>
              </p>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <button onClick={() => updateStatus(appointment.id, "approved")}>Approve</button>
                <button onClick={() => updateStatus(appointment.id, "denied")}>Deny</button>
              </div>
            </div>
          );
        })}

        {!loading && appointments.length === 0 && <p>No appointments for this day.</p>}
        {!loading && appointments.length > 0 && filteredAppointments.length === 0 && <p>No appointments match the selected service.</p>}
      </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
