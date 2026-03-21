import { useState } from "react";

// Helper function to get next 30 days
const getNext30Days = () => {
  const dates = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    dates.push(date);
  }
  return dates;
};

const DateStep = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const availableDates = getNext30Days();

  return (
    <div>
      <h2>Select a Date</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {availableDates.map((date) => {
          const dateStr = date.toISOString().split("T")[0]; // YYYY-MM-DD
          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              style={{
                padding: "10px",
                minWidth: "100px",
                background: selectedDate === dateStr ? "#007bff" : "#eee",
                color: selectedDate === dateStr ? "white" : "black",
                cursor: "pointer",
              }}
            >
              {date.toDateString()}
            </button>
          );
        })}
      </div>

      <div style={{ marginTop: "20px" }}>
        <button onClick={onBack} style={{ marginRight: "10px" }}>
          Back
        </button>
        <button
          onClick={() => onNext(selectedDate)}
          disabled={!selectedDate}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DateStep;
