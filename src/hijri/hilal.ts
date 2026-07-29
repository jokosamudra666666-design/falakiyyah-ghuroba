import { d2r, r2d, fixHour, fixAngle } from '../utils/math';
import { calculateJulianDay } from '../astronomy/julian';
import { calculateSunCoordinates } from '../astronomy/sun';
import { calculateMoonPosition } from '../moon/moon';
import { LocationCoordinates, HilalResult } from '../types';

/**
 * Menghitung Hisab Hilal / Visibilitas Bulan Baru (Kriteria MABIMS Baru: Tinggi Mar'i >= 3°, Elongasi >= 6.4°)
 */
export function calculateHilal(
  date: Date,
  location: LocationCoordinates,
  ijtimakDate: Date
): HilalResult {
  const { latitude, longitude, elevation = 0 } = location;

  // 1. Dapatkan perkiraan waktu Sunset (Magrib)
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // Konversi jam perkiraan terbenam ke Julian Day (Gunakan 11:00 UTC ~ 18:00 WIB)
  const jdSunset = calculateJulianDay(year, month, day, 11.0);

  // Dapatkan posisi Matahari & Bulan saat Sunset
  const sun = calculateSunCoordinates(date);
  const moon = calculateMoonPosition(jdSunset);

  const phi = d2r(latitude);
  const deltaSun = d2r(sun.declination);
  const deltaMoon = d2r(moon.declination);

  // 2. Hitung Tinggi Hakiki Bulan (Geocentric Altitude - h_m)
  // Dip (Koreksi Ufuk/Elevasi)
  const dip = 0.0347 * Math.sqrt(elevation);

  // Hour Angle Bulan saat Sunset
  const HA_moon = fixAngle(sun.equationOfTime * 15 + (longitude - longitude));
  const HA_m_rad = d2r(HA_moon);

  const sinAltitude =
    Math.sin(phi) * Math.sin(deltaMoon) +
    Math.cos(phi) * Math.cos(deltaMoon) * Math.cos(HA_m_rad);

  const moonAltitude = r2d(Math.asin(sinAltitude));

  // 3. Koreksi Toposentrik (Paralaks & Refraksi) -> Tinggi Mar'i
  const parallaxCorr = moon.parallax * Math.cos(d2r(moonAltitude));
  const appMoonAltitude = moonAltitude - parallaxCorr - dip;

  // 4. Hitung Elongasi Bulan - Matahari (E)
  const dLong = d2r(moon.longitude - sun.declination);
  const dLat = d2r(moon.latitude);

  const cosElongation = Math.cos(dLat) * Math.cos(dLong);
  const elongation = r2d(Math.acos(cosElongation));

  // 5. Umur Bulan (Umur Hilal dari Waktu Ijtimak)
  const diffMs = date.getTime() - ijtimakDate.getTime();
  const moonAgeHours = Math.max(0, diffMs / (1000 * 60 * 60));

  // 6. Tebal Hilal (Crescent Width) dalam menit busur
  const crescentWidth = moon.apparentRadius * (1 - Math.cos(d2r(elongation))) * 60;

  // 7. Kriteria MABIMS Baru (Tinggi Mar'i >= 3° DAN Elongasi >= 6.4°)
  const isMabimsMet = appMoonAltitude >= 3.0 && elongation >= 6.4;

  let statusDescription = '';
  if (isMabimsMet) {
    statusDescription = 'Memenuhi Kriteria MABIMS Baru (Hilal Kemungkinan Terlihat)';
  } else if (appMoonAltitude > 0) {
    statusDescription = 'Bulan di Atas Ufuk tetapi Belum Memenuhi Kriteria MABIMS Baru (3° & 6.4°)';
  } else {
    statusDescription = 'Hilal di Bawah Ufuk (Tidak Mungkin Terlihat / Istikmal)';
  }

  // Format jam terbenam estimasi
  const sunsetHour = 17 + Math.floor((109.0 - longitude) * 4 / 60);
  const sunsetMin = 45 + Math.floor(sun.equationOfTime * 60);
  const sunsetTimeStr = `${sunsetHour.toString().padStart(2, '0')}:${Math.abs(sunsetMin % 60).toString().padStart(2, '0')} WIB/Lokal`;

  return {
    sunsetTime: sunsetTimeStr,
    moonAltitude: Number(moonAltitude.toFixed(2)),
    appMoonAltitude: Number(appMoonAltitude.toFixed(2)),
    elongation: Number(elongation.toFixed(2)),
    moonAgeHours: Number(moonAgeHours.toFixed(1)),
    crescentWidth: Number(crescentWidth.toFixed(2)),
    isMabimsMet,
    statusDescription,
  };
}

/**
 * Estimasi Waktu Ijtimak (Conjunction) untuk Bulan Hijriah
 */
export function estimateIjtimakDate(year: number, month: number, day: number): Date {
  // Conjunction occurs around new moon
  return new Date(Date.UTC(year, month - 1, day, 8, 15, 0));
}
