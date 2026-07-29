import { d2r, r2d, fixAngle, formatDecimalToTime, getTimezoneOffsetHours } from '../utils/math';
import { LocationCoordinates, QiblaResult, RashdulQiblaResult } from '../types';

const MECCA_LAT = 21.422487; // Koordinat Ka'bah, Makkah
const MECCA_LNG = 39.826206;

/**
 * Menghitung Arah Kiblat & Jarak ke Ka'bah menggunakan rumus Great Circle / Haversine
 */
export function calculateQibla(location: LocationCoordinates): QiblaResult {
  const phi1 = d2r(location.latitude);
  const phi2 = d2r(MECCA_LAT);
  const deltaLambda = d2r(MECCA_LNG - location.longitude);

  const y = Math.sin(deltaLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(deltaLambda);

  let qiblaAngle = r2d(Math.atan2(y, x));
  qiblaAngle = fixAngle(qiblaAngle);

  // Kalkulasi Jarak Haversine (Jari-jari Bumi = 6371 km)
  const dLat = d2r(MECCA_LAT - location.latitude);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distanceKm = 6371 * c;

  // Cardinal direction text (e.g. 295.14° dari Utara / UTBB)
  const degFromNorth = qiblaAngle.toFixed(2);

  return {
    direction: Number(qiblaAngle.toFixed(2)),
    directionCardinal: `${degFromNorth}° dari Utara (UTBB)`,
    distanceKm: Math.round(distanceKm),
  };
}

/**
 * Menghitung Waktu Rashdul Qibla (Saat bayangan matahari tepat menghadap/membelakangi Ka'bah)
 */
export function calculateRashdulQibla(date: Date, location: LocationCoordinates): RashdulQiblaResult[] {
  // Rashdul Qibla Utama (Matahari tepat melintasi Zenith Ka'bah):
  // 1. 27/28 Mei (~16:18 WIB / 09:18 UTC)
  // 2. 15/16 Juli (~16:27 WIB / 09:27 UTC)
  const year = date.getFullYear();
  const tzOffset = getTimezoneOffsetHours(date, location.timezone);

  const event1Utc = new Date(Date.UTC(year, 4, 28, 9, 18, 0)); // May 28
  const event2Utc = new Date(Date.UTC(year, 6, 16, 9, 27, 0)); // July 16

  const isLeap = (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  if (isLeap) {
    event1Utc.setUTCDate(27);
    event2Utc.setUTCDate(15);
  }

  const formatLocal = (d: Date) => {
    const localMs = d.getTime() + tzOffset * 3600 * 1000;
    const localDate = new Date(localMs);
    const h = localDate.getUTCHours().toString().padStart(2, '0');
    const m = localDate.getUTCMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  };

  return [
    {
      date: event1Utc,
      timeString: formatLocal(event1Utc),
      isGlobalEvent: true,
      description: 'Rashdul Qibla Utama I (Matahari di Atas Ka\'bah)',
    },
    {
      date: event2Utc,
      timeString: formatLocal(event2Utc),
      isGlobalEvent: true,
      description: 'Rashdul Qibla Utama II (Matahari di Atas Ka\'bah)',
    },
  ];
}
