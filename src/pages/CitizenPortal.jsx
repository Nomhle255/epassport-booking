import '../styles/CitizenPortal.css';

export default function CitizenPortal({ onViewStatus, onBook, onBack }) {
  return (
    <div className="citizen-portal-page">
      <div className="citizen-portal-wrapper">
       
        <div className="citizen-portal-container">
          <div className="portal-header">
            <h1>Citizen Portal</h1>
            <p>Select what you'd like to do</p>
          </div>

          <div className="portal-buttons">
            <button
              className="portal-button view-status-button"
              onClick={onViewStatus}
            >
              <span className="portal-icon">📋</span>
              <span className="portal-button-text">
                <strong>View Appointment Status</strong>
                <small>Check your appointment details</small>
              </span>
            </button>

            <button
              className="portal-button book-appointment-button"
              onClick={onBook}
            >
              <span className="portal-icon">📅</span>
              <span className="portal-button-text">
                <strong>Book Appointment</strong>
                <small>Schedule a new appointment</small>
              </span>
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
