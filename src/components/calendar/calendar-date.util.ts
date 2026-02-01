export function addMonths(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + delta);
  return d;
}

export function addYears(date: Date, delta: number): Date {
  const d = new Date(date);
  d.setFullYear(d.getFullYear() + delta);
  return d;
}
