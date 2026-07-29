/**
 * Menghitung Julian Day (JD) dari tanggal Masehi (UT/GMT)
 */
export function calculateJulianDay(
  year: number,
  month: number,
  day: number,
  hours: number = 0
): number {
  let Y = year;
  let M = month;

  if (M <= 2) {
    Y -= 1;
    M += 12;
  }

  const A = Math.floor(Y / 100);
  const B = 2 - A + Math.floor(A / 4);
  const dayFraction = hours / 24.0;

  return (
    Math.floor(365.25 * (Y + 4716)) +
    Math.floor(30.6001 * (M + 1)) +
    day +
    dayFraction +
    B -
    1524.5
  );
}

/**
 * Menghitung Julian Century (T) dari Julian Day (relatif terhadap J2000.0)
 */
export function calculateJulianCentury(jd: number): number {
  return (jd - 2451545.0) / 36525.0;
}
