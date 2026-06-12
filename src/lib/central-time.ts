export const PREP_TIMEZONE = "America/Chicago";

type CentralParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

export function getCentralParts(date: Date): CentralParts {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PREP_TIMEZONE,
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
    })
      .formatToParts(date)
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );

  return {
    year: Number(parts.year),
    month: Number(parts.month),
    day: Number(parts.day),
    hour: Number(parts.hour === "24" ? "0" : parts.hour),
    minute: Number(parts.minute),
  };
}

/** YYYY-MM-DD in America/Chicago */
export function formatCentralDay(date: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: PREP_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function parseCentralDay(day: string): { year: number; month: number; day: number } {
  const [year, month, dayNum] = day.split("-").map(Number);
  return { year, month, day: dayNum };
}

/** Midnight at the start of a calendar day in America/Chicago */
export function centralMidnight(year: number, month: number, day: number): Date {
  const start = Date.UTC(year, month - 1, day - 1, 4, 0, 0);
  const end = Date.UTC(year, month - 1, day + 1, 8, 0, 0);

  for (let ms = start; ms <= end; ms += 60_000) {
    const parts = getCentralParts(new Date(ms));
    if (
      parts.year === year &&
      parts.month === month &&
      parts.day === day &&
      parts.hour === 0 &&
      parts.minute === 0
    ) {
      return new Date(ms);
    }
  }

  throw new Error(`Could not resolve midnight Central for ${year}-${month}-${day}`);
}

/** Midnight Central for the calendar day of `date`, plus `dayOffset` days */
export function addCentralDays(from: Date, dayOffset: number): Date {
  const centralDay = formatCentralDay(from);
  const { year, month, day } = parseCentralDay(centralDay);
  const shifted = new Date(Date.UTC(year, month - 1, day + dayOffset));
  return centralMidnight(
    shifted.getUTCFullYear(),
    shifted.getUTCMonth() + 1,
    shifted.getUTCDate(),
  );
}

/** Next midnight Central after `now` (start of the following calendar day) */
export function nextCentralMidnight(now = new Date()): Date {
  return addCentralDays(now, 1);
}

export function isDueAtOrBefore(dueAt: Date, now = new Date()): boolean {
  return dueAt.getTime() <= now.getTime();
}
