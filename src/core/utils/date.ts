export function toMonthKey(isoDate: string): string {
  return isoDate.slice(0, 7);
}

export function formatDate(isoDate: string): string {
  const [y, m, d] = isoDate.split('-').map(Number);
  // Build the Date from local y/m/d parts (not `new Date(isoDate)`) to avoid UTC-parsing
  // shifting the displayed day in negative-offset timezones.
  return new Intl.DateTimeFormat(undefined, { year: 'numeric', month: 'short', day: 'numeric' }).format(
    new Date(y, m - 1, d),
  );
}

export function currentMonthKey(): string {
  return new Date().toISOString().slice(0, 7);
}
