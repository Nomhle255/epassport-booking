import { useState, useEffect } from "react";

// Example office hours
const OFFICE_START = 8; // 8 AM
const OFFICE_END = 16;  // 4 PM

// Generate time slots based on duration
const generateTimeSlots = (duration) => {
  const slots = [];
  for (let hour = OFFICE_START; hour < OFFICE_END; hour++) {
    for (let min = 0; min < 60; min += duration) {
      const hh = hour.toString().padStart(2, "0");
      const mm = min.toString().padStart(2, "0");
      slots.push(`${hh}:${mm}`);
    }
  }
  return slots;
};

const TimeStep = ({ service, onNext, onBack }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const generatedSlots = generateTimeSlots(service.duration);
    setSlots(generatedSlots);
  }, [service]);

  return (
    <div>
      <h2>Select a Time Slot</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", justifyContent: "center" }}>
        {slots.map((slot) => (
          <button
            key={slot}
            onClick={() => setSelectedSlot(slot)}
            style={{
              padding: "10px 15px",
              background: selectedSlot === slot ? "#007bff" : "#eee",
              color: selectedSlot === slot ? "white" : "black",
              cursor: "pointer",
            }}
          >
            {slot}
          </button>
        ))}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={onBack} style={{ marginRight: "10px" }}>
          Back
        </button>
        <button onClick={() => onNext(selectedSlot)} disabled={!selectedSlot}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TimeStep;
