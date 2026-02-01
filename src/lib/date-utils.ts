import dayjs from "./dayjs";

export function isThisWeek(date: string | Date) {
  const d = dayjs(date);
  const now = dayjs();
  return d.week() === now.week() && d.year() === now.year();
}
