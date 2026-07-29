export interface LocationCoordinates {
  latitude: number; // Derajat (contoh: -7.73)
  longitude: number; // Derajat (contoh: 109.01)
  elevation?: number; // Meter di atas permukaan laut
  timezone: string; // IANA Timezone (contoh: "Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura")
  city?: string;
  province?: string;
}

export interface CalculationParameters {
  fajrAngle: number; // Subuh (biasanya -20° di Indonesia - Kemenag)
  ishaAngle: number; // Isya (biasanya -18° di Indonesia - Kemenag)
  dhuhaAngle: number; // Dhuha (biasanya 4.5° atau 3.5°)
  imsakMinutes: number; // Selisih Imsak sebelum Subuh (biasanya 10 menit)
  ihtiyatiMinutes: number; // Pengaman / Ihtiyath (biasanya 2-3 menit)
  shadowLength: number; // Factor shadow factor (1 = Syafi'i/Hanbali/Maliki, 2 = Hanafi)
}

export interface PrayerTimesResult {
  imsak: string;
  subuh: string;
  syuruq: string;
  dhuha: string;
  zuhur: string;
  ashar: string;
  magrib: string;
  isya: string;
  istiwak: string; // Jam Istiwak lokal saat Zuhur (12:00 Istiwa')
}

export interface QiblaResult {
  direction: number; // Azimut Kiblat dari Utara Sejati (0-360 derajat)
  directionCardinal: string; // Arah mata angin (misal: "294.12° (UTBB)")
  distanceKm: number; // Jarak ke Ka'bah dalam Kilometer
}

export interface RashdulQiblaResult {
  date: Date;
  timeString: string;
  isGlobalEvent: boolean;
  description: string;
}

export interface HijriDateResult {
  day: number;
  month: number;
  monthName: string;
  monthNameArabic: string;
  year: number;
  dayOfWeek: string;
  dayOfWeekArabic: string;
  pasaran: string; // Legi, Pahing, Pon, Wage, Kliwon
}

export interface SunCoordinates {
  declination: number; // Dalam derajat (δ)
  equationOfTime: number; // Dalam jam/fraksi jam (e)
}

export interface MoonPosition {
  rightAscension: number; // Dalam derajat
  declination: number; // Dalam derajat (δ_m)
  apparentRadius: number; // Semidiameter dalam derajat
  parallax: number; // Horizontal Parallax (HP) dalam derajat
  longitude: number; // Ekliptika Longitude (λ_m)
  latitude: number; // Ekliptika Latitude (β_m)
}

export interface HilalResult {
  sunsetTime: string; // Jam Terbenam Matahari (WIB/Lokal)
  moonAltitude: number; // Tinggi Hakiki Hilal (derajat)
  appMoonAltitude: number; // Tinggi Mar'i (Koreksi Toposentrik + Refraksi)
  elongation: number; // Elongasi Bulan-Matahari (derajat)
  moonAgeHours: number; // Umur Bulan sejak Ijtimak (jam)
  crescentWidth: number; // Tebal Hilal (menit busur)
  isMabimsMet: boolean; // Kriteria MABIMS Baru (Tinggi >= 3°, Elongasi >= 6.4°)
  statusDescription: string;
}
