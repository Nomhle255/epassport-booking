import { useState } from "react";
import { COUNTRIES, isValidPhoneNumber } from "../utils/phoneValidation";
import "../styles/UserDetailsStep.css";

const UserDetailsStep = ({ onNext, onBack, isSubmitting = false }) => {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setPhone(value);
    
    // Show error only if user has started typing
    if (value.trim() && !isValidPhoneNumber(value, country)) {
      const countryData = COUNTRIES[country];
      setPhoneError(
        `Invalid ${countryData.name} phone number. Use: ${countryData.formats.join(" or ")}`
      );
    } else {
      setPhoneError("");
    }
  };

  const isPhoneValid = phone.trim() && country && isValidPhoneNumber(phone, country);
  const isFormValid = name.trim() && country && isPhoneValid;
  const countryData = country ? COUNTRIES[country] : null;

  const handleNext = () => {
    if (isFormValid) {
      onNext({ name, phone, country });
    }
  };

  return (
    <div className="user-details-container">
      <h2>Enter Your Details</h2>

      <div className="form-group">
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group country-select-group">
        <label>Country:</label>
        <select
          value={country}
          onChange={(e) => {
            setCountry(e.target.value);
            setPhone("");
            setPhoneError("");
          }}
        >
          <option value="">Select Your Country</option>
          {Object.entries(COUNTRIES).map(([code, data]) => (
            <option key={code} value={code}>
              {data.name}
            </option>
          ))}
        </select>
      </div>

      {country && (
        <div className="form-group">
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={countryData?.placeholder}
            className={phoneError ? "error" : ""}
          />
          {phoneError && (
            <p className="error-message">{phoneError}</p>
          )}
          <p className="form-hint">
            Your phone number will be used to send appointment reminders via SMS.
          </p>
        </div>
      )}

      <div className="buttons-group">
        <button onClick={onBack}>Back</button>
        <button
          onClick={handleNext}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default UserDetailsStep;
