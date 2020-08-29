export function formatDateTime(time: number): string {
  let date = new Date(time);
  if (date.toLocaleDateString() == new Date().toLocaleDateString()) {
    // same day
    return date.toLocaleTimeString();
  }
  return date.toLocaleString();
}
