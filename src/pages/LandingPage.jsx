import '../styles/LandingPage.css';

export default function LandingPage({ onCitizen, onAdmin }) {
  return (
    <div className="landing-page">
      <div className="landing-container">
        <div className="landing-header">
          <h1>ePassport Booking System</h1>
          <p>Manage your passport appointments efficiently</p>
        </div>

        <div className="landing-buttons">
          <button
            className="landing-button citizen-button"
            onClick={onCitizen}
          >
            <span className="landing-icon">👤</span>
            Click here to view and make a booking
          </button>

          <button
            className="landing-button admin-button"
            onClick={onAdmin}
          >
            <span className="landing-icon">⚙️</span>
            Admin Dashboard
          </button>
        </div>

        <div className="landing-subtitle">
          Select your role to continue
        </div>
      </div>
    </div>
  );
}
