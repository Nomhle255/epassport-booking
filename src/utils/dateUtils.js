// Helper function to format date as local YYYY-MM-DD string
export const formatLocalDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get next 30 weekdays (excluding Saturday and Sunday)
export const getNext30Days = () => {
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

// Helper function to get days in a month
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};

// Helper function to get the first day of the month (0=Sun, 1=Mon, etc.)
export const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month, 1).getDay();
};
