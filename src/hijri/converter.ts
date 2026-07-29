import { calculateJulianDay } from '../astronomy/julian';
import { HijriDateResult } from '../types';

const HIJRI_MONTHS = [
  'Muharram',
  'Safar',
  'Rabi\'ul Awwal',
  'Rabi\'ul Akhir',
  'Jumadil Awwal',
  'Jumadil Akhir',
  'Rajab',
  'Sya\'ban',
  'Ramadhan',
  'Syawwal',
  'Dzulqa\'dah',
  'Dzulhijjah',
];

const HIJRI_MONTHS_ARABIC = [
  'محرم',
  'صفر',
  'ربيع الأول',
  'ربيع الثاني',
  'جمادى الأولى',
  'جمادى الآخرة',
  'رجب',
  'شعبان',
  'رمضان',
  'شوال',
  'ذو القعدة',
  'ذو الحجة',
];

const DAYS_INDONESIAN = ['Ahad / Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const DAYS_ARABIC = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const PASARAN = ['Legi', 'Pahing', 'Pon', 'Wage', 'Kliwon'];

/**
 * Konversi Tanggal Masehi (Gregorian) ke Kalender Hijriah
 */
export function convertToHijri(date: Date): HijriDateResult {
  const gYear = date.getFullYear();
  const gMonth = date.getMonth() + 1;
  const gDay = date.getDate();

  const jd = calculateJulianDay(gYear, gMonth, gDay, 12);

  // Day of week (0 = Sunday)
  const dayOfWeekIdx = Math.floor(jd + 1.5) % 7;
  const pasaranIdx = Math.floor(jd + 1.5) % 5;

  // Hijri calculation algorithm (Kuwaiti / Tabular method adjusted)
  const l = Math.floor(jd) - 1948440 + 10632;
  const n = Math.floor((l - 1) / 10631);
  const l2 = l - 10631 * n + 354;
  const j =
    Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
    Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
  const l3 =
    l2 -
    Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
    Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
    29;
  const m = Math.floor((24 * l3) / 709);
  const d = l3 - Math.floor((709 * m) / 24);
  const y = 30 * n + j - 30;

  const monthIdx = Math.min(11, Math.max(0, m - 1));

  return {
    day: d,
    month: m,
    monthName: HIJRI_MONTHS[monthIdx],
    monthNameArabic: HIJRI_MONTHS_ARABIC[monthIdx],
    year: y,
    dayOfWeek: DAYS_INDONESIAN[dayOfWeekIdx],
    dayOfWeekArabic: DAYS_ARABIC[dayOfWeekIdx],
    pasaran: PASARAN[pasaranIdx],
  };
}

/**
 * Konversi Tanggal Hijriah ke Masehi (Estimasi Tabular)
 */
export function convertHijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
  const jd = Math.floor((11 * hYear + 3) / 30) + 354 * hYear + 30 * hMonth - Math.floor((hMonth - 1) / 2) + hDay + 1948440 - 385;

  // Convert JD back to Gregorian
  const z = Math.floor(jd + 0.5);
  const a = Math.floor((z - 1867216.25) / 36524.25);
  const b = z + 1 + a - Math.floor(a / 4);
  const c = b + 1524;
  const d = Math.floor((c - 122.1) / 365.25);
  const e = Math.floor(365.25 * d);
  const g = Math.floor((c - e) / 30.6001);

  const day = c - e - Math.floor(30.6001 * g);
  const month = g < 14 ? g - 1 : g - 13;
  const year = month > 2 ? d - 4716 : d - 4715;

  return new Date(year, month - 1, day);
}
