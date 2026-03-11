export function splitISOToDateTime(iso) {
  const date = iso?.split("T")[0] || "";
  const time = iso?.split("T")[1]?.slice(0, 5) || ""; // "HH:MM"
  return { date, time };
}

export function mergeDateAndTimeISO(dateStr, timeStr) {
  // dateStr = "2026-03-11", timeStr = "14:30"
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}