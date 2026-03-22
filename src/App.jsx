import { useState } from "react";
import Booking from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import LandingPage from "./pages/LandingPage";

function App() {
  const [view, setView] = useState("landing");

  const handleBooking = () => setView("citizen");
  const handleAdmin = () => setView("admin");
  const handleBack = () => setView("landing");

  return (
    <div>
      {view === "landing" && <LandingPage onBooking={handleBooking} onAdmin={handleAdmin} />}
      {view === "citizen" && <Booking onBack={handleBack} />}
      {view === "admin" && <AdminDashboard onBack={handleBack} />}
    </div>
  );
}

export default App;
