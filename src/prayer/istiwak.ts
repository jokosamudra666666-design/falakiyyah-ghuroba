import { calculateSunCoordinates } from '../astronomy/sun';
import { LocationCoordinates } from '../types';
import { fixHour, getTimezoneOffsetHours } from '../utils/math';

/**
 * Menghitung Jam Istiwak lokal saat ini (JAM SUN / Jam Matahari Hakiki WIB/WITA/WIT)
 * pada detik berjalan.
 */
export function getLocalIstiwak(date: Date, location: LocationCoordinates): string {
  const { longitude, timezone } = location;
  const { equationOfTime } = calculateSunCoordinates(date);

  // Ambil waktu lokal dalam desimal jam
  const localHours = date.getHours() + date.getMinutes() / 60.0 + date.getSeconds() / 3600.0;

  // Hitung LMT (Local Mean Time)
  // Selisih Bujur Lokal terhadap Meridian Standar (15 * Timezone Offset)
  const tzOffset = getTimezoneOffsetHours(date, timezone);
  const standardLongitude = tzOffset * 15.0;

  // Waktu Istiwak = Waktu Lokal + (Bujur Lokal - Bujur Standar)/15 + Equation of Time
  const istiwakDecimal = fixHour(localHours + (longitude - standardLongitude) / 15.0 + equationOfTime);

  const hours = Math.floor(istiwakDecimal);
  const minutes = Math.floor((istiwakDecimal - hours) * 60);
  const seconds = Math.floor((((istiwakDecimal - hours) * 60) - minutes) * 60);

  const h = hours.toString().padStart(2, '0');
  const m = minutes.toString().padStart(2, '0');
  const s = seconds.toString().padStart(2, '0');

  return `${h}:${m}:${s} WIS`; // Waktu Istiwak Sun
}
