import { useState } from "react";
import Booking from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import ViewAppointmentStatus from "./pages/ViewAppointmentStatus";
import CitizenPortal from "./pages/CitizenPortal";
import LandingPage from "./pages/LandingPage";

function App() {
  const [view, setView] = useState("landing");

  const handleCitizen = () => setView("citizen-portal");
  const handleAdmin = () => setView("admin");
  const handleViewStatus = () => setView("status");
  const handleBook = () => setView("booking");
  const handleBack = () => setView("landing");
  const handleBackToCitizen = () => setView("citizen-portal");

  return (
    <div>
      {view === "landing" && <LandingPage onCitizen={handleCitizen} onAdmin={handleAdmin} />}
      {view === "citizen-portal" && <CitizenPortal onViewStatus={handleViewStatus} onBook={handleBook} onBack={handleBack} />}
      {view === "booking" && <Booking onBack={handleBackToCitizen} />}
      {view === "status" && <ViewAppointmentStatus onBack={handleBackToCitizen} />}
      {view === "admin" && <AdminDashboard onBack={handleBack} />}
    </div>
  );
}

export default App;
