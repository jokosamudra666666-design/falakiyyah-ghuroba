import { d2r, r2d, fixHour, formatDecimalToTime, getTimezoneOffsetHours } from '../utils/math';
import { calculateSunCoordinates } from '../astronomy/sun';
import { LocationCoordinates, PrayerTimesResult, CalculationParameters } from '../types';

export const DEFAULT_PARAMS: CalculationParameters = {
  fajrAngle: -20, // Kemenag RI (-20°)
  ishaAngle: -18, // Kemenag RI (-18°)
  dhuhaAngle: 4.5, // Kemenag RI Dhuha (4.5°)
  imsakMinutes: 10,
  ihtiyatiMinutes: 2,
  shadowLength: 1, // Syafi'i/Hanbali/Maliki
};

/**
 * Menghitung Sudut Jam (Hour Angle - H) dalam Derajat
 */
function calculateHourAngle(phi: number, delta: number, altitudeDegree: number): number {
  const h = d2r(altitudeDegree);
  const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(delta)) / (Math.cos(phi) * Math.cos(delta));
  if (cosH > 1) return 0; // Matahari tidak pernah terbit (Kutub)
  if (cosH < -1) return 180; // Matahari tidak pernah terbenam (Kutub)
  return r2d(Math.acos(cosH));
}

/**
 * Menghitung Waktu Salat Lengkap (Subuh, Syuruq, Dhuha, Zuhur, Ashar, Magrib, Isya, Imsak, Istiwak)
 */
export function calculatePrayerTimes(
  date: Date,
  location: LocationCoordinates,
  params: CalculationParameters = DEFAULT_PARAMS
): PrayerTimesResult {
  const { latitude, longitude, elevation = 0, timezone } = location;

  // 1. Ekstrak offset Timezone dari String IANA (misal "Asia/Jakarta" -> +7)
  const tzOffsetHours = getTimezoneOffsetHours(date, timezone);

  // 2. Hitung Posisi Matahari pada Jam 12:00 Lokal (Estimasi Tengah Hari)
  const localMidDay = new Date(
    Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 12 - tzOffsetHours, 0, 0)
  );
  const { declination, equationOfTime } = calculateSunCoordinates(localMidDay);

  const phi = d2r(latitude);
  const delta = d2r(declination);

  // 3. Menghitung Waktu Transit / Zuhur (Transit = 12 + Timezone - Longitude/15 - e)
  const transit = fixHour(12 + tzOffsetHours - longitude / 15.0 - equationOfTime);

  // Dip (Koreksi ketinggian tempat / Elevasi)
  const dip = 0.0347 * Math.sqrt(elevation); // Dalam derajat
  const ref = 34.0 / 60.0; // Refraksi atmosfer (~34 menit busur)
  const sunRadius = 16.0 / 60.0; // Jari-jari semut matahari (~16 menit busur)

  // 4. Kalkulasi Sudut Jam (Hour Angle / H) untuk Masing-masing Waktu
  // A. Terbit / Syuruq & Magrib (Ketinggian Matahari = - (sunRadius + ref + dip))
  const hSunset = -(sunRadius + ref + dip);
  const HA_sunset = calculateHourAngle(phi, delta, hSunset);

  // B. Subuh & Isya
  const HA_fajr = calculateHourAngle(phi, delta, params.fajrAngle);
  const HA_isha = calculateHourAngle(phi, delta, params.ishaAngle);

  // C. Dhuha
  const HA_dhuha = calculateHourAngle(phi, delta, params.dhuhaAngle);

  // D. Ashar (Menggunakan rumus bayangan = panjang benda + bayangan terpendek)
  const shadowLength = params.shadowLength || 1;
  const A = Math.abs(latitude - declination);
  const hAshar = r2d(Math.atan(1 / (shadowLength + Math.tan(d2r(A)))));
  const HA_ashar = calculateHourAngle(phi, delta, hAshar);

  // 5. Konversi Jam Desimal ke Format HH:mm
  const ihtiyath = params.ihtiyatiMinutes / 60.0;

  const zuhurTime = transit + 2.0 / 60.0; // Tambahan ~2 menit untuk kehati-hatian
  const subuhTime = transit - HA_fajr / 15.0 + ihtiyath;
  const syuruqTime = transit - HA_sunset / 15.0 - ihtiyath;
  const dhuhaTime = transit - HA_dhuha / 15.0 + ihtiyath;
  const asharTime = transit + HA_ashar / 15.0 + ihtiyath;
  const magribTime = transit + HA_sunset / 15.0 + ihtiyath;
  const isyaTime = transit + HA_isha / 15.0 + ihtiyath;
  const imsakTime = subuhTime - params.imsakMinutes / 60.0;

  return {
    imsak: formatDecimalToTime(imsakTime),
    subuh: formatDecimalToTime(subuhTime),
    syuruq: formatDecimalToTime(syuruqTime),
    dhuha: formatDecimalToTime(dhuhaTime),
    zuhur: formatDecimalToTime(zuhurTime),
    ashar: formatDecimalToTime(asharTime),
    magrib: formatDecimalToTime(magribTime),
    isya: formatDecimalToTime(isyaTime),
    istiwak: '12:00 (Istiwa\')',
  };
}
