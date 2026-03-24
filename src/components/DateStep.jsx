import { useState } from "react";
import { formatLocalDate, getNext30Days, getDaysInMonth, getFirstDayOfMonth } from "../utils/dateUtils";
import "../styles/DateStep.css";

const DateStep = ({ onNext, onBack }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  
  const availableDates = getNext30Days();
  const availableDateStrings = new Set(availableDates.map(formatLocalDate));

  // Generate calendar grid for the current month
  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const calendarDays = [];

  // Add empty cells for days before the month starts
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long", year: "numeric" });

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const isDateAvailable = (day) => {
    if (!day) return false;
    const dateStr = formatLocalDate(new Date(currentYear, currentMonth, day));
    return availableDateStrings.has(dateStr);
  };

  const handleDateClick = (day) => {
    if (isDateAvailable(day)) {
      const dateStr = formatLocalDate(new Date(currentYear, currentMonth, day));
      setSelectedDate(dateStr);
    }
  };

  return (
    <div className="date-step-container">
      <h2>Select a Date</h2>

      {/* Month Navigation */}
      <div className="month-navigation">
        <button onClick={handlePrevMonth}>&lt; Prev</button>
        <h3>{monthName}</h3>
        <button onClick={handleNextMonth}>Next &gt;</button>
      </div>

      {/* Day Headers */}
      <div className="day-headers">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="calendar-grid">
        {calendarDays.map((day, index) => {
          const isAvailable = isDateAvailable(day);
          const dateStr = day ? formatLocalDate(new Date(currentYear, currentMonth, day)) : null;
          const isSelected = selectedDate === dateStr;

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              disabled={!isAvailable}
              className={`calendar-day-button ${isSelected ? "selected" : ""}`}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="date-step-buttons">
        <button 
          onClick={onBack}
          style={{
            padding: "12px 30px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "5px",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 5px 15px rgba(102, 126, 234, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          ← Back
        </button>
        <button onClick={() => onNext(selectedDate)} disabled={!selectedDate}>
          Next
        </button>
      </div>
    </div>
  );
};

export default DateStep;
