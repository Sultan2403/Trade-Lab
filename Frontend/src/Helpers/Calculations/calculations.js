export function getRMultipleLabel(r) {
  if (r == null) return "";
  if (r > 3) return "Excellent";
  if (r > 2.5) return "Very Good";
  if (r > 2) return "Good";
  if (r < 1.5) return "Bad";
  return "Average";
}

export function getRMultipleColor(r) {
  if (r == null) return "text-text-muted";
  if (r > 3) return "text-state-success"; // Excellent
  if (r > 2.5) return "text-state-success"; // Very Good
  if (r > 2) return "text-state-success"; // Good
  if (r < 1.5) return "text-state-danger"; // Bad
  return "text-state-warning"; // Average
}