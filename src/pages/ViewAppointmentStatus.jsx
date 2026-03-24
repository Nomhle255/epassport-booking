import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/config";
import '../styles/ViewAppointmentStatus.css';

export default function ViewAppointmentStatus({ onBack }) {
  const [phone, setPhone] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setAppointments([]);

    if (!phone.trim()) {
      setError("Please enter a phone number");
      setLoading(false);
      return;
    }

    try {
      // Search by phone number
      const appointmentsQuery = query(
        collection(db, "appointments"),
        where("userDetails.phone", "==", phone.trim())
      );

      const snapshot = await getDocs(appointmentsQuery);
      const results = [];

      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });

      setAppointments(results);
      setSearched(true);

      if (results.length === 0) {
        setError("No appointments found for this phone number");
      }
    } catch (err) {
      setError("Failed to search appointments. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    return "#667eea";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "approved":
        return "✓ Approved";
      case "pending":
        return "⏳ Pending";
      case "denied":
        return "✗ Denied";
      default:
        return status;
    }
  };

  return (
    <div className="view-appointment-page">
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
          marginBottom: "20px",
          display: "block",
          width: "fit-content",
        }}
      >
        ← Back
      </button>

      <div className="view-appointment-container">
        <h3>View Appointment Status</h3>
        <p className="subtitle">Enter your phone number to check your appointment</p>

        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group">
            <label htmlFor="phone">Phone Number</label>
            <input
              id="phone"
              type="text"
              placeholder="e.g., 0711234567 or +27711234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="phone-input"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="search-button"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </form>

        {error && <p className="error-message">{error}</p>}

        {searched && appointments.length > 0 && (
          <div className="appointments-list">
            <h2>Your Appointments ({appointments.length})</h2>
            {appointments.map((appointment) => (
              <div key={appointment.id} className="appointment-card">
                <div className="appointment-header">
                  <h3>{appointment.service?.name}</h3>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: getStatusColor(appointment.status) }}
                  >
                    {getStatusLabel(appointment.status)}
                  </span>
                </div>

                <div className="appointment-details">
                  <div className="detail-row">
                    <span className="label">Date:</span>
                    <span className="value">{appointment.date}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Time:</span>
                    <span className="value">{appointment.time}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Name:</span>
                    <span className="value">{appointment.userDetails?.name}</span>
                  </div>
                  {appointment.status === "denied" && appointment.denialReason && (
                    <div className="detail-row denial">
                      <span className="label">Reason:</span>
                      <span className="value">{appointment.denialReason}</span>
                    </div>
                  )}
                </div>

                <div className="appointment-footer">
                  {appointment.status === "approved" && (
                    <p className="confirmed-message">✓ Your appointment is confirmed</p>
                  )}
                  {appointment.status === "pending" && (
                    <p className="pending-message">⏳ Awaiting admin review</p>
                  )}
                  {appointment.status === "denied" && (
                    <p className="denied-message">✗ This appointment was denied</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: "30px", display: "flex", gap: "10px", justifyContent: "center" }}>
          <button
            onClick={onBack}
            className="finish-button"
            style={{
              padding: "12px 30px",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              fontWeight: "bold",
              cursor: "pointer",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
}
