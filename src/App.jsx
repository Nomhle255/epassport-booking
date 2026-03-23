import { useState, useEffect } from "react";
import { auth } from "./firebase/config";
import { signOut, onAuthStateChanged } from "firebase/auth";
import Booking from "./pages/Bookings";
import AdminDashboard from "./pages/AdminDashboard";
import ViewAppointmentStatus from "./pages/ViewAppointmentStatus";
import CitizenPortal from "./pages/CitizenPortal";
import LandingPage from "./pages/LandingPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";

function App() {
  const [view, setView] = useState("landing");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleCitizen = () => setView("citizen-portal");
  const handleAdmin = () => {
    if (currentUser) {
      setView("admin");
    } else {
      setView("signin");
    }
  };
  const handleViewStatus = () => setView("status");
  const handleBook = () => setView("booking");
  const handleBack = () => setView("landing");
  const handleBackToCitizen = () => setView("citizen-portal");
  const handleSwitchToSignUp = () => setView("signup");
  const handleSwitchToSignIn = () => setView("signin");
  const handleSignInSuccess = () => setView("admin");
  const handleSignUpSuccess = () => setView("signin");
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setView("landing");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh" }}>Loading...</div>;
  }

  return (
    <div>
      {view === "landing" && <LandingPage onCitizen={handleCitizen} onAdmin={handleAdmin} />}
      {view === "signin" && <SignIn onSignInSuccess={handleSignInSuccess} onSwitchToSignUp={handleSwitchToSignUp} onBack={handleBack} />}
      {view === "signup" && <SignUp onSignUpSuccess={handleSignUpSuccess} onSwitchToSignIn={handleSwitchToSignIn} onBack={handleBack} />}
      {view === "citizen-portal" && <CitizenPortal onViewStatus={handleViewStatus} onBook={handleBook} onBack={handleBack} />}
      {view === "booking" && <Booking onBack={handleBackToCitizen} />}
      {view === "status" && <ViewAppointmentStatus onBack={handleBackToCitizen} />}
      {view === "admin" && currentUser && <AdminDashboard onBack={handleBack} onLogout={handleLogout} />}
      {view === "admin" && !currentUser && handleBack()}
    </div>
  );
}

export default App;
