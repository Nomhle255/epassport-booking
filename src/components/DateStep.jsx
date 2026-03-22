import { useState } from "react";

// Helper function to format date as local YYYY-MM-DD string
const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get next 30 weekdays (excluding Saturday and Sunday)
const getNext30Days = () => {
  const dates = [];
  const today = new Date();
  let i = 0;
  while (dates.length < 30) {
    const date = new Date();
    date.setDate(today.getDate() + i);
    const day = date.getDay();
    // Exclude Saturday (6) and Sunday (0)
    if (day !== 0 && day !== 6) {
      dates.push(date);
    }
    i++;
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
          const dateStr = formatLocalDate(date); // Local YYYY-MM-DD
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
