export function splitISOToDateTime(iso) {
  if (!iso) return { date: "", time: "" };

  const d = new Date(iso);

  const date = d.toISOString().slice(0, 10);
  const time = d.toISOString().slice(11, 16);

  return { date, time };
}

export function mergeDateAndTimeISO(dateStr, timeStr) {
  // dateStr = "2026-03-11", timeStr = "14:30"
  return new Date(`${dateStr}T${timeStr}:00`).toISOString();
}
