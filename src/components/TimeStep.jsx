import { useState, useEffect } from "react";
import { generateTimeSlots, formatTime12Hour, getTimePeriod } from "../utils/timeUtils";
import "../styles/TimeStep.css";

const TimeStep = ({ service, bookedSlots = {}, slotCapacity = 1, onNext, onBack }) => {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slots, setSlots] = useState([]);

  useEffect(() => {
    const generatedSlots = generateTimeSlots(service.duration);
    setSlots(generatedSlots);
  }, [service]);

  // Group slots by period
  const morningSlots = slots.filter((slot) => getTimePeriod(slot) === "Morning");
  const afternoonSlots = slots.filter((slot) => getTimePeriod(slot) === "Afternoon");

  const renderSlotButton = (slot) => {
    const bookedCount = bookedSlots[slot] || 0;
    const isFull = bookedCount >= slotCapacity;
    const isSelected = selectedSlot === slot;

    // Don't render if full
    if (isFull) return null;

    // Determine color based on availability
    const isAlmostFull = bookedCount > 0 && bookedCount < slotCapacity;

    return (
      <button
        key={slot}
        onClick={() => setSelectedSlot(slot)}
        className={`time-slot-button ${isSelected ? "selected" : ""} ${isAlmostFull ? "almost-full" : ""}`}
      >
        {formatTime12Hour(slot)}
      </button>
    );
  };

  return (
    <div className="time-step-container">
      <h2>Select a Time Slot</h2>

      {/* Morning Slots */}
      {morningSlots.length > 0 && (
        <div className="time-period-section">
          <h3 className="time-period-title">🌅 Morning Slots</h3>
          <div className="time-slots-grid">
            {morningSlots.map(renderSlotButton)}
          </div>
        </div>
      )}

      {/* Afternoon Slots */}
      {afternoonSlots.length > 0 && (
        <div className="time-period-section">
          <h3 className="time-period-title">☀️ Afternoon Slots</h3>
          <div className="time-slots-grid">
            {afternoonSlots.map(renderSlotButton)}
          </div>
        </div>
      )}

      {/* Selected Slot Summary */}
      {selectedSlot && (
        <div className="selected-slot-summary">
          <strong>Selected:</strong> {formatTime12Hour(selectedSlot)}
        </div>
      )}

      {/* Buttons */}
      <div className="time-step-buttons">
        <button onClick={onBack}>Back</button>
        <button onClick={() => onNext(selectedSlot)} disabled={!selectedSlot}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TimeStep;
