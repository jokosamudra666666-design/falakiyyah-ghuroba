/**
 * Helper Trigonometri (Deg/Rad) & Format Waktu
 */

export const d2r = (deg: number): number => (deg * Math.PI) / 180.0;

export const r2d = (rad: number): number => (rad * 180.0) / Math.PI;

export const fixAngle = (a: number): number => {
  let b = a - 360.0 * Math.floor(a / 360.0);
  return b < 0 ? b + 360.0 : b;
};

export const fixHour = (a: number): number => {
  let b = a - 24.0 * Math.floor(a / 24.0);
  return b < 0 ? b + 24.0 : b;
};

/**
 * Helper Konversi Jam Desimal (contoh: 12.25) ke Format Waktu Jam "12:15" atau "12:15:00"
 */
export function formatDecimalToTime(decimalHours: number, includeSeconds: boolean = false): string {
  const norm = fixHour(decimalHours);
  const hours = Math.floor(norm);
  const totalMinutes = (norm - hours) * 60;
  const minutes = Math.floor(totalMinutes);
  const seconds = Math.round((totalMinutes - minutes) * 60);

  let finalMinutes = minutes;
  let finalHours = hours;
  let finalSeconds = seconds;

  if (finalSeconds >= 60) {
    finalSeconds = 0;
    finalMinutes += 1;
  }

  if (!includeSeconds && finalSeconds >= 30) {
    finalMinutes += 1;
  }

  if (finalMinutes >= 60) {
    finalMinutes = 0;
    finalHours = (finalHours + 1) % 24;
  }

  const hStr = finalHours.toString().padStart(2, '0');
  const mStr = finalMinutes.toString().padStart(2, '0');

  if (includeSeconds) {
    const sStr = finalSeconds.toString().padStart(2, '0');
    return `${hStr}:${mStr}:${sStr}`;
  }

  return `${hStr}:${mStr}`;
}

/**
 * Helper Ekstraksi Timezone Offset Hours dari IANA Timezone string
 */
export function getTimezoneOffsetHours(date: Date, timezone: string): number {
  try {
    const utcDate = new Date(date.toLocaleString('en-US', { timeZone: 'UTC' }));
    const tzDate = new Date(date.toLocaleString('en-US', { timeZone: timezone }));
    return (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60);
  } catch (e) {
    // Fallback if timezone string is invalid or not supported
    return -date.getTimezoneOffset() / 60.0;
  }
}
