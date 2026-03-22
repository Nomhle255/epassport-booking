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

const AdminDashboard = () => {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

  const updateStatus = async (id, status) => {
    await updateDoc(doc(db, "appointments", id), {
      status,
      reviewedAt: serverTimestamp(),
    });

    await loadAppointments();
  };

  return (
    <div style={{ maxWidth: "980px", margin: "30px auto", textAlign: "left" }}>
      <h2>Admin Dashboard</h2>

      <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
        <label>Schedule date:</label>
        <input type="date" value={date} onChange={(event) => setDate(event.target.value)} />
      </div>

      <p style={{ marginTop: "15px" }}>
        Daily appointments: <strong>{appointments.length}</strong>
      </p>

      {loading && <p>Loading schedules...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ marginTop: "20px" }}>
        {appointments.map((appointment) => {
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
                Citizen: {appointment?.userDetails?.name} | Phone: {appointment?.userDetails?.phone}
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
      </div>
    </div>
  );
};

export default AdminDashboard;
