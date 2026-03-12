export function splitISOToDateTime(iso) {
  if (!iso) return { date: "", time: "" };

  const d = new Date(iso);

  const date = d.toLocaleDateString("en-CA");
  // gives YYYY-MM-DD

  const time = d.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  return { date, time };
}

export function combineDateAndTime({ date, time }) {
  if (!date || !time) return null;

  return date
    .hour(time.hour())
    .minute(time.minute())
    .second(0)
    .millisecond(0)
    .toISOString();
}

// This guy is prob redundant now

export function mergeDateAndTimeISO(dateStr, timeStr) {
  if (!dateStr || !timeStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hour, minute] = timeStr.split(":").map(Number);

  const date = new Date(year, month - 1, day, hour, minute);

  return date.toISOString();
}
