import { d2r, r2d, fixAngle } from '../utils/math';
import { calculateJulianDay, calculateJulianCentury } from './julian';
import { SunCoordinates } from '../types';

/**
 * Menghitung koordinat Matahari (Deklinasi & Equation of Time)
 * berdasarkan tanggal Masehi dan jam dalam UTC (Meeus/Ephemeris singkat dari com.digital.falak).
 */
export function calculateSunCoordinates(date: Date): SunCoordinates {
  // Ambil waktu UTC
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60.0 + date.getUTCSeconds() / 3600.0;

  const jd = calculateJulianDay(year, month, day, hours);
  const T = calculateJulianCentury(jd);

  // Geometric Mean Longitude of the Sun (L0)
  const L0 = fixAngle(280.46646 + T * (36000.76983 + T * 0.0003032));

  // Sun Mean Anomaly (M)
  const M = fixAngle(357.52911 + T * (35999.05029 - T * 0.0001537));
  const M_rad = d2r(M);

  // Sun Equation of Center (C)
  const C =
    Math.sin(M_rad) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * M_rad) * (0.019993 - 0.000101 * T) +
    Math.sin(3 * M_rad) * 0.000289;

  // Sun True Longitude & Apparent Longitude (lambda)
  const sunTrueLong = L0 + C;
  const omega = 125.04 - 1934.136 * T;
  const lambda = d2r(sunTrueLong - 0.00569 - 0.00478 * Math.sin(d2r(omega)));

  // Obliquity of the Ecliptic (epsilon) / Kemiringan Sumbu Bumi
  const eps0 = 23.0 + (26.0 + (21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))) / 60.0) / 60.0;
  const epsilon = d2r(eps0 + 0.00256 * Math.cos(d2r(omega)));

  // 1. Kalkulasi Deklinasi (Declination - δ)
  const sinDec = Math.sin(epsilon) * Math.sin(lambda);
  const declination = r2d(Math.asin(sinDec));

  // 2. Kalkulasi Equation of Time (e)
  const y = Math.tan(epsilon / 2) * Math.tan(epsilon / 2);
  const L0_rad = d2r(L0);

  const Etime =
    y * Math.sin(2 * L0_rad) -
    2 * 0.016708634 * Math.sin(M_rad) +
    4 * 0.016708634 * y * Math.sin(M_rad) * Math.cos(2 * L0_rad) -
    0.5 * y * y * Math.sin(4 * L0_rad) -
    1.25 * (0.016708634 * 0.016708634) * Math.sin(2 * M_rad);

  // Konversi dari radian ke jam (1 rad = 12/PI jam)
  const equationOfTime = (Etime * 12.0) / Math.PI;

  return {
    declination,
    equationOfTime,
  };
}
