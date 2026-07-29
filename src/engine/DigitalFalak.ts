import { LocationCoordinates, PrayerTimesResult, QiblaResult, HijriDateResult, SunCoordinates, MoonPosition, HilalResult, RashdulQiblaResult, CalculationParameters } from '../types';
import { calculateSunCoordinates } from '../astronomy/sun';
import { calculateMoonCoordinates } from '../moon/moon';
import { calculatePrayerTimes, DEFAULT_PARAMS } from '../prayer/prayerTimes';
import { getLocalIstiwak } from '../prayer/istiwak';
import { calculateQibla, calculateRashdulQibla } from '../qibla/qibla';
import { convertToHijri, convertHijriToGregorian } from '../hijri/converter';
import { calculateHilal } from '../hijri/hilal';

export class DigitalFalak {
  private location: LocationCoordinates;
  private calculationParams: CalculationParameters;

  constructor(location: LocationCoordinates, params: CalculationParameters = DEFAULT_PARAMS) {
    this.location = location;
    this.calculationParams = params;
  }

  /**
   * Mengubah lokasi koordinat engine
   */
  public setLocation(location: LocationCoordinates): void {
    this.location = location;
  }

  /**
   * Mengambil lokasi koordinat engine saat ini
   */
  public getLocation(): LocationCoordinates {
    return this.location;
  }

  /**
   * Mengubah parameter perhitungan waktu salat
   */
  public setCalculationParams(params: CalculationParameters): void {
    this.calculationParams = params;
  }

  public getCalculationParams(): CalculationParameters {
    return this.calculationParams;
  }

  /**
   * Mengambil Waktu Salat Lengkap untuk tanggal tertentu
   */
  public getPrayerTimes(date: Date = new Date()): PrayerTimesResult {
    return calculatePrayerTimes(date, this.location, this.calculationParams);
  }

  /**
   * Mengambil Jam Istiwak (Matahari Hakiki) lokal saat ini
   */
  public getIstiwakTime(date: Date = new Date()): string {
    return getLocalIstiwak(date, this.location);
  }

  /**
   * Mengambil kalkulasi Arah Kiblat dan Jarak ke Ka'bah
   */
  public getQibla(): QiblaResult {
    return calculateQibla(this.location);
  }

  /**
   * Mengambil jadwal Rashdul Qibla
   */
  public getRashdulQibla(date: Date = new Date()): RashdulQiblaResult[] {
    return calculateRashdulQibla(date, this.location);
  }

  /**
   * Mengambil tanggal Kalender Hijriah
   */
  public getHijriDate(date: Date = new Date()): HijriDateResult {
    return convertToHijri(date);
  }

  /**
   * Konversi Hijriah ke Masehi
   */
  public convertHijriToGregorian(hYear: number, hMonth: number, hDay: number): Date {
    return convertHijriToGregorian(hYear, hMonth, hDay);
  }

  /**
   * Mengambil koordinat & data posisi Matahari
   */
  public getSunCoordinates(date: Date = new Date()): SunCoordinates {
    return calculateSunCoordinates(date);
  }

  /**
   * Mengambil koordinat & data posisi Bulan
   */
  public getMoonCoordinates(date: Date = new Date()): MoonPosition {
    return calculateMoonCoordinates(date);
  }

  /**
   * Melakukan Hisab Visibilitas Hilal (Kriteria MABIMS Baru)
   */
  public checkHilalVisibility(sunsetDate: Date, ijtimakDate: Date): HilalResult {
    return calculateHilal(sunsetDate, this.location, ijtimakDate);
  }
}

// Re-export all types and modules
export * from '../types';
export * from '../astronomy/sun';
export * from '../moon/moon';
export * from '../prayer/prayerTimes';
export * from '../qibla/qibla';
export * from '../hijri/converter';
export * from '../hijri/hilal';
