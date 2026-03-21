import { useState } from "react";

const UserDetailsStep = ({ onNext, onBack, isSubmitting = false }) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [nationalId, setNationalId] = useState("");

  const handleNext = () => {
    onNext({ name, phone, nationalId });
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

      <label>Phone Number:</label>
      <input
        type="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <label>National ID:</label>
      <input
        type="text"
        value={nationalId}
        onChange={(e) => setNationalId(e.target.value)}
        style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
      />

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        <button onClick={onBack} style={{ marginRight: "10px" }}>
          Back
        </button>
        <button
          onClick={handleNext}
          disabled={!name || !phone || !nationalId || isSubmitting}
        >
          {isSubmitting ? "Saving..." : "Confirm Booking"}
        </button>
      </div>
    </div>
  );
};

export default UserDetailsStep;
