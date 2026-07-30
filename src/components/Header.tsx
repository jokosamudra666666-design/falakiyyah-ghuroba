import React, { useState, useEffect } from 'react';
import { Compass, Clock, MapPin, Moon, Sun, Sliders, Navigation } from 'lucide-react';
import { DigitalFalak, LocationCoordinates, HijriDateResult } from '../engine/DigitalFalak';
import { INDONESIA_CITIES, CityData } from '../data/cities';

interface HeaderProps {
  engine: DigitalFalak;
  currentLocation: LocationCoordinates;
  onLocationChange: (location: LocationCoordinates) => void;
  onOpenParamsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  engine,
  currentLocation,
  onLocationChange,
  onOpenParamsModal,
}) => {
  const [now, setNow] = useState<Date>(new Date());
  const [istiwakTime, setIstiwakTime] = useState<string>('');
  const [hijriDate, setHijriDate] = useState<HijriDateResult | null>(null);
  const [selectedCityName, setSelectedCityName] = useState<string>('Kediri');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const currentDate = new Date();
      setNow(currentDate);
      setIstiwakTime(engine.getIstiwakTime(currentDate));
    }, 1000);

    setHijriDate(engine.getHijriDate(new Date()));

    return () => clearInterval(timer);
  }, [engine, currentLocation]);

  const handleCitySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value;
    setSelectedCityName(cityName);
    if (cityName === 'custom') return;

    const city = INDONESIA_CITIES.find((c) => c.name === cityName);
    if (city) {
      onLocationChange({
        latitude: city.latitude,
        longitude: city.longitude,
        elevation: city.elevation,
        timezone: city.timezone,
        city: city.name,
        province: city.province,
      });
    }
  };

  const handleGetGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const newLoc: LocationCoordinates = {
          latitude: Number(pos.coords.latitude.toFixed(4)),
          longitude: Number(pos.coords.longitude.toFixed(4)),
          elevation: pos.coords.altitude ? Math.round(pos.coords.altitude) : 10,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Jakarta',
          city: 'Lokasi GPS Anda',
          province: 'Kustom',
        };
        setSelectedCityName('custom');
        onLocationChange(newLoc);
      },
      (err) => {
        setIsLocating(false);
        alert(`Gagal mengambil koordinat GPS: ${err.message}`);
      }
    );
  };

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-11 h-11 rounded-xl bg-slate-950 p-0.5 border border-emerald-500/40 shadow-md shadow-emerald-950/50 overflow-hidden flex-shrink-0">
              <img
                src="/icon-192.png"
                alt="Falakiyah Ghuroba Logo"
                className="w-full h-full object-cover rounded-lg"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-bold tracking-tight text-emerald-400">
                  Digital Falak Engine
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800">
                  Falakiyah Ghuroba
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aplikasi Web Falakiyyah, Waktu Salat, Jam Istiwak & Hisab Hilal
              </p>
            </div>
          </div>

          {/* Live Clocks (Standard & Istiwak) */}
          <div className="flex items-center space-x-4 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700/60 backdrop-blur">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-emerald-400 animate-pulse" />
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider">Jam Lokal</div>
                <div className="text-sm font-mono font-bold text-slate-100">
                  {now.toLocaleTimeString('id-ID')}
                </div>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-700" />

            <div className="flex items-center space-x-2">
              <Sun className="w-4 h-4 text-amber-400" />
              <div>
                <div className="text-xs text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  Jam Istiwak <span className="text-[10px] text-amber-300/80">(WIS)</span>
                </div>
                <div className="text-sm font-mono font-bold text-amber-300">
                  {istiwakTime || '--:--:--'}
                </div>
              </div>
            </div>
          </div>

          {/* Location & Options Bar */}
          <div className="flex items-center flex-wrap gap-2">
            <div className="flex items-center space-x-1.5 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <select
                value={selectedCityName}
                onChange={handleCitySelect}
                className="bg-transparent text-sm text-slate-200 font-medium focus:outline-none cursor-pointer"
              >
                {INDONESIA_CITIES.map((c) => (
                  <option key={c.name} value={c.name} className="bg-slate-900 text-white">
                    {c.name} ({c.province})
                  </option>
                ))}
                <option value="custom" className="bg-slate-900 text-white">
                  📍 Kustom ({currentLocation.latitude.toFixed(2)}°, {currentLocation.longitude.toFixed(2)}°)
                </option>
              </select>
            </div>

            <button
              onClick={handleGetGPS}
              disabled={isLocating}
              title="Gunakan Lokasi GPS Presisi"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'Cari...' : 'GPS'}</span>
            </button>

            <button
              onClick={onOpenParamsModal}
              title="Pengaturan Parameter Sudut & Kemenag"
              className="flex items-center space-x-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline">Kriteria</span>
            </button>
          </div>

        </div>

        {/* Hijri Banner Bar */}
        {hijriDate && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="text-amber-400 font-medium">Hari Ini:</span>
              <span className="font-semibold text-slate-100">
                {hijriDate.dayOfWeek} {hijriDate.pasaran}
              </span>
              <span>•</span>
              <span className="text-emerald-300 font-medium">
                {hijriDate.day} {hijriDate.monthName} {hijriDate.year} H
              </span>
              <span className="text-slate-400 hidden sm:inline">({hijriDate.monthNameArabic})</span>
            </div>
            <div className="text-slate-400">
              Koordinat: {currentLocation.latitude}° L, {currentLocation.longitude}° B • Elevasi: {currentLocation.elevation || 0} m
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
