import { d2r, r2d, fixAngle } from '../utils/math';
import { calculateJulianCentury } from '../astronomy/julian';
import { MoonPosition } from '../types';

/**
 * Menghitung Koordinat Posisi Bulan (Persamaan Utama Meeus / Ephemeris)
 * dari Julian Day (JD)
 */
export function calculateMoonPosition(jd: number): MoonPosition {
  const T = calculateJulianCentury(jd);

  // Mean Longitude Bulan (L')
  const L_prime = fixAngle(218.3164477 + 481267.88123421 * T);

  // Mean Elongation Bulan (D)
  const D = fixAngle(297.8501921 + 445267.1114034 * T);

  // Sun Mean Anomaly (M)
  const M = fixAngle(357.5291092 + 35999.0502909 * T);

  // Moon Mean Anomaly (M')
  const M_prime = fixAngle(134.9633964 + 477198.8675055 * T);

  // Moon Argument of Latitude (F)
  const F = fixAngle(93.272095 + 483202.0175233 * T);

  const D_rad = d2r(D);
  const M_rad = d2r(M);
  const Mp_rad = d2r(M_prime);
  const F_rad = d2r(F);

  // Perturbasi Geocentric Longitude (Σl)
  const dLongitude =
    6288774 * Math.sin(Mp_rad) +
    1274027 * Math.sin(2 * D_rad - Mp_rad) +
    658314 * Math.sin(2 * D_rad) +
    213618 * Math.sin(2 * Mp_rad) -
    185116 * Math.sin(M_rad) -
    114332 * Math.sin(2 * F_rad);

  const longitude = fixAngle(L_prime + dLongitude / 1000000.0);

  // Perturbasi Latitude (Σb)
  const dLatitude =
    5128122 * Math.sin(F_rad) +
    280602 * Math.sin(Mp_rad + F_rad) +
    277693 * Math.sin(Mp_rad - F_rad) +
    173237 * Math.sin(2 * D_rad - F_rad);

  const latitude = dLatitude / 1000000.0;

  // Horizontal Parallax (HP dalam derajat)
  const dParallax =
    342219 +
    28078 * Math.cos(Mp_rad) +
    12960 * Math.cos(2 * D_rad - Mp_rad) +
    8622 * Math.cos(2 * D_rad);

  const parallax = dParallax / 3600000.0; // Detik busur ke derajat

  // Semidiameter Bulan (s_m)
  const apparentRadius = 0.272481 * parallax;

  // Obliquity of Ecliptic (ε)
  const eps = d2r(23.439291 - 0.0130042 * T);

  // Konversi Ekliptika ke Ekuator (Right Ascension & Declination)
  const lam_rad = d2r(longitude);
  const bet_rad = d2r(latitude);

  const sinDec =
    Math.sin(bet_rad) * Math.cos(eps) +
    Math.cos(bet_rad) * Math.sin(eps) * Math.sin(lam_rad);

  const declination = r2d(Math.asin(sinDec));

  const y = Math.sin(lam_rad) * Math.cos(eps) - Math.tan(bet_rad) * Math.sin(eps);
  const x = Math.cos(lam_rad);
  const rightAscension = fixAngle(r2d(Math.atan2(y, x)));

  return {
    rightAscension,
    declination,
    apparentRadius,
    parallax,
    longitude,
    latitude,
  };
}

export function calculateMoonCoordinates(date: Date): MoonPosition {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth() + 1;
  const day = date.getUTCDate();
  const hours = date.getUTCHours() + date.getUTCMinutes() / 60.0 + date.getUTCSeconds() / 3600.0;

  // Convert to JD
  let Y = year;
  let M = month;
  if (M <= 2) {
    Y -= 1;
    M += 12;
  }
  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = hours / 24.0;
  const jd = Math.floor(365.25 * (Y + 4716)) + Math.floor(30.6001 * (M + 1)) + day + dayFraction + B - 1524.5;

  return calculateMoonPosition(jd);
}
