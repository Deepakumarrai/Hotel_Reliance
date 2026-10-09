/**
 * Combines CSS class names into a single string.
 */
export function cn(...classes: (string | undefined | null | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Formats a number to Indian Rupee (INR) currency style.
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return "Price on request";
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(price);
}

/**
 * Returns the number of nights between two date strings (YYYY-MM-DD)
 */
export function getNightsCount(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end.getTime() - start.getTime();
  if (diffTime <= 0) return 0;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Safely parses any date string (ISO "2026-10-06T00:00:00.000Z" or "YYYY-MM-DD")
 * without UTC timezone shifting.
 */
export function parseDateSafe(dateString: string | null | undefined): Date | null {
  if (!dateString) return null;
  const str = String(dateString).trim();
  const datePart = str.includes("T") ? str.split("T")[0] : str.split(" ")[0];
  const parts = datePart.split("-");
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (!isNaN(year) && !isNaN(month) && !isNaN(day)) {
      return new Date(year, month, day);
    }
  }
  const fallback = new Date(str);
  return isNaN(fallback.getTime()) ? null : fallback;
}

/**
 * Normalizes any date representation to standard "YYYY-MM-DD" string.
 */
export function normalizeDateString(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const str = String(dateString).trim();
  if (str.includes("T")) {
    return str.split("T")[0];
  }
  const parts = str.split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    return str;
  }
  const d = new Date(str);
  if (isNaN(d.getTime())) return str;
  return d.toISOString().split("T")[0];
}

/**
 * Formats a date string (ISO or YYYY-MM-DD) to a human-readable date e.g. "6 Oct 2026".
 */
export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = parseDateSafe(dateString);
  if (!d) return String(dateString);
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

/**
 * Formats a date string with weekday e.g. "Tue, 6 Oct 2026".
 */
export function formatFullDate(dateString: string | null | undefined): string {
  if (!dateString) return "";
  const d = parseDateSafe(dateString);
  if (!d) return String(dateString);
  return d.toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

