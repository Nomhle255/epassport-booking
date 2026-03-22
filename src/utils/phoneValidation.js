// Country-specific phone validation and formatting
export const COUNTRIES = {
  SA: {
    name: "South Africa",
    formats: ["0123456789", "+27123456789"],
    placeholder: "0123456789 or +27123456789",
    regex: [/^0\d{9}$/, /^\+27\d{9}$/],
  },
  LS: {
    name: "Lesotho",
    formats: ["22123456", "51234567", "61234567"],
    placeholder: "22123456, 51234567, or 61234567",
    regex: [/^[256]\d{7}$/, /^\+266\d{8}$/],
  },
  NG: {
    name: "Nigeria",
    formats: ["01234567890", "+2341234567890"],
    placeholder: "01234567890 or +2341234567890",
    regex: [/^0\d{10}$/, /^\+234\d{10}$/],
  },
};

export const isValidPhoneNumber = (phoneNumber, country) => {
  if (!country || !COUNTRIES[country]) return false;

  const cleaned = phoneNumber.replace(/[\s\-\(\)]/g, "");
  const regexPatterns = COUNTRIES[country].regex;

  return regexPatterns.some((pattern) => pattern.test(cleaned));
};
