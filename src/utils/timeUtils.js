// Example office hours
export const OFFICE_START = 8;  // 8 AM
export const OFFICE_END = 16;   // 4 PM

// Generate time slots based on duration
export const generateTimeSlots = (duration) => {
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

// Format time to 12-hour format
export const formatTime12Hour = (time24) => {
  const [hours, minutes] = time24.split(":");
  let hrs = parseInt(hours);
  const ampm = hrs >= 12 ? "PM" : "AM";
  hrs = hrs % 12 || 12;
  return `${hrs}:${minutes} ${ampm}`;
};

// Get time period
export const getTimePeriod = (time24) => {
  const hour = parseInt(time24.split(":")[0]);
  if (hour < 12) return "Morning";
  return "Afternoon";
};
