import { useState } from "react";

// Country-specific phone validation and formatting
const COUNTRIES = {
  SA: {
    name: "South Africa",
    formats: ["0123456789", "+27123456789"],
    placeholder: "0123456789 or +27123456789",
    regex: [/^0\d{9}$/, /^\+27\d{9}$/],
  },
  LS: {
    name: "Lesotho",
    formats: ["22123456", "51234567", "61234567", "+26622123456"],
    placeholder: "22123456, 51234567, 61234567, or +26622123456",
    regex: [/^[2568]\d{7}$/, /^\+266\d{8}$/],
  },
  NG: {
    name: "Nigeria",
    formats: ["01234567890", "+2341234567890"],
    placeholder: "01234567890 or +2341234567890",
    regex: [/^0\d{10}$/, /^\+234\d{10}$/],
  },
};

const isValidPhoneNumber = (phoneNumber, country) => {
  if (!country || !COUNTRIES[country]) return false;
  
  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");
  const regexPatterns = COUNTRIES[country].regex;
  
  return regexPatterns.some((pattern) => pattern.test(cleaned));
};

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
    <div style={{ maxWidth: "400px", margin: "0 auto", textAlign: "left" }}>
      <h2>Enter Your Details</h2>

      <label>Name:</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <label>Country:</label>
      <select
        value={country}
        onChange={(e) => {
          setCountry(e.target.value);
          setPhone("");
          setPhoneError("");
        }}
        style={{
          width: "100%",
          padding: "8px",
          marginBottom: "10px",
          borderColor: !country ? "#ccc" : "#ccc",
          borderWidth: "1px",
          borderStyle: "solid",
        }}
      >
        <option value="">Select Your Country</option>
        {Object.entries(COUNTRIES).map(([code, data]) => (
          <option key={code} value={code}>
            {data.name}
          </option>
        ))}
      </select>

      {country && (
        <>
          <label>Phone Number:</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhoneChange}
            placeholder={countryData?.placeholder}
            style={{
              width: "100%",
              padding: "8px",
              marginBottom: "5px",
              borderColor: phoneError ? "#dc3545" : "#ccc",
              borderWidth: "1px",
              borderStyle: "solid",
            }}
          />
          {phoneError && (
            <p style={{ color: "#dc3545", fontSize: "12px", margin: "0 0 10px 0" }}>
              {phoneError}
            </p>
          )}
          <p style={{ fontSize: "12px", color: "#666", marginBottom: "10px" }}>
            Your phone number will be used to send appointment reminders via SMS.
          </p>
        </>
      )}

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={onBack} style={{ marginRight: "10px" }}>
          Back
        </button>
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
