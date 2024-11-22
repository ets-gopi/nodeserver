const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
function format(date) {
  if (!(date instanceof Date) || isNaN(date)) {
    return "Invalid Date"; // Return an error message if the date is invalid
  }
  return `${daysOfWeek[date.getDay()]}, ${
    months[date.getMonth()]
  } ${date.getDate()}`;
}
const countdownFormat = (date) => {
  if (!(date instanceof Date)) {
    return "Invalid Date";
  }
  const newDate = new Date(date);
  return `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(newDate.getDate()).padStart(2, "0")}`;
};

const countdownDateTimeFormat = (date) => {
  if (!(date instanceof Date)) {
    return "Invalid Date";
  }
  const newDate = new Date(date);
  const YYYY = newDate.getFullYear();
  const MM = String(newDate.getMonth() + 1).padStart(2, "0");
  const DD = String(newDate.getDate()).padStart(2, "0");
  const hh = String(newDate.getHours()).padStart(2, "0");
  const mm = String(newDate.getMinutes()).padStart(2, "0");
  return `${YYYY}-${MM}-${DD}T${hh}:${mm}`;
};

module.exports = { countdownFormat };
