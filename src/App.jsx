import { useState } from "react";
import Booking from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  const [view, setView] = useState("citizen");

  return (
    <div style={{ padding: "20px" }}>
      <h1>ePassport Booking</h1>
      <p>
        Reduce walk-in congestion with online booking, staff review, and reminder tracking.
      </p>

      <div style={{ display: "flex", gap: "10px" }}>
        <button onClick={() => setView("admin")}>Admin Dashboard</button>
      </div>

      {view === "admin" ? <AdminDashboard /> : <Booking />}
    </div>
  );
}

export default App;
