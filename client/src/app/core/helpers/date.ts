/**
 * Formats a date as YYYY-MM-DD.
 *
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDate(date: Date): string {
  const year: number = date.getFullYear();
  const month: string = String(date.getMonth() + 1).padStart(2, '0');
  const day: string = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Gets the start date of a given month.
 *
 * @param year - The year.
 * @param month - The month (0-based).
 * @returns The start date of the month.
 */
export function getStartOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1);
}

/**
 * Gets the end date of a given month.
 *
 * @param year - The year.
 * @param month - The month (0-based).
 * @returns The end date of the month.
 */
export function getEndOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0);
}
