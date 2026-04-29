const TZ = "Europe/Berlin" as const;

export function toLocal(dt: string | number | Date, tz: string = TZ): string {
  try {
    return new Intl.DateTimeFormat("de-DE", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: tz,
    }).format(new Date(dt));
  } catch {
    return String(dt);
  }
}

/**
 * Formatiert ein Date in "YYYY-MM-DDTHH:mm" (lokale Zeit, ohne Sekunden),
 * passend für <input type="datetime-local">
 */
export function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad(d.getMonth() + 1);
  const dd = pad(d.getDate());
  const hh = pad(d.getHours());
  const min = pad(d.getMinutes());
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

/**
 * Parst "YYYY-MM-DDTHH:mm" (lokal) zurück in ISO-String.
 * Achtung: new Date(localStr) interpretiert lokal → danach .toISOString()
 */
export function localInputToISO(localStr: string): string {
  return new Date(localStr).toISOString();
}

/**
 * Safely converts backend date values
 *
 * Why:
 * GraphQL Date → string → can break UI
 */
export function parseDate(value?: string | Date | null): Date | null {
  if (!value) return null;

  const date = new Date(value);

  if (isNaN(date.getTime())) {
    return null;
  }

  return date;
}

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

type TranslateFn = (key: any, values?: Record<string, string | number>) => string;

export function formatChildEventDateRange(
  startsAt: string | undefined,
  endsAt: string | undefined,
  locale: string,
  t: TranslateFn,
): string | null {
  if (!startsAt) {
    return null;
  }

  const startDate = new Date(startsAt);
  const endDate = endsAt ? new Date(endsAt) : null;

  if (Number.isNaN(startDate.getTime())) {
    return null;
  }

  const dateFormatter = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const date = dateFormatter.format(startDate);
  const startTime = timeFormatter.format(startDate);

  // 👉 Kein Enddatum
  if (!endDate || Number.isNaN(endDate.getTime())) {
    return t("children.dateSingle", {
      date,
      time: startTime,
    });
  }

  const endTime = timeFormatter.format(endDate);

  // 👉 Same day check
  const isSameDay =
    startDate.getFullYear() === endDate.getFullYear() &&
    startDate.getMonth() === endDate.getMonth() &&
    startDate.getDate() === endDate.getDate();

  if (isSameDay) {
    return t("children.dateRange", {
      date,
      start: startTime,
      end: endTime,
    });
  }

  // 👉 Multi-day case
  const endDateLabel = dateFormatter.format(endDate);

  return t("children.dateRangeMultiDay", {
    startDate: date,
    startTime,
    endDate: endDateLabel,
    endTime,
  });
}
