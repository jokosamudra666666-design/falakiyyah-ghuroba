import React, { useState, useEffect } from 'react';
import { Sun, Moon, Calendar, Orbit } from 'lucide-react';
import { DigitalFalak, SunCoordinates, MoonPosition } from '../engine/DigitalFalak';
import { calculateJulianDay, calculateJulianCentury } from '../astronomy/julian';

interface EphemerisTabProps {
  engine: DigitalFalak;
}

export const EphemerisTab: React.FC<EphemerisTabProps> = ({ engine }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [sunData, setSunData] = useState<SunCoordinates | null>(null);
  const [moonData, setMoonData] = useState<MoonPosition | null>(null);
  const [julianDay, setJulianDay] = useState<number>(0);
  const [julianCentury, setJulianCentury] = useState<number>(0);

  useEffect(() => {
    const s = engine.getSunCoordinates(selectedDate);
    const m = engine.getMoonCoordinates(selectedDate);

    const year = selectedDate.getUTCFullYear();
    const month = selectedDate.getUTCMonth() + 1;
    const day = selectedDate.getUTCDate();
    const hours = selectedDate.getUTCHours() + selectedDate.getUTCMinutes() / 60.0;

    const jd = calculateJulianDay(year, month, day, hours);
    const T = calculateJulianCentury(jd);

    setSunData(s);
    setMoonData(m);
    setJulianDay(jd);
    setJulianCentury(T);
  }, [engine, selectedDate]);

  return (
    <div className="space-y-6">
      
      {/* Date Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-2">
          <Orbit className="w-5 h-5 text-amber-400" />
          <h3 className="text-base font-bold text-slate-100">
            Ephemeris & Astronomi Benda Langit (Matahari & Bulan)
          </h3>
        </div>

        <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <input
            type="datetime-local"
            value={selectedDate.toISOString().slice(0, 16)}
            onChange={(e) => {
              if (e.target.value) setSelectedDate(new Date(e.target.value));
            }}
            className="bg-transparent text-sm font-mono font-semibold text-white focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Julian Day & Century Header */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400">Julian Day (JD)</div>
            <div className="text-xl font-mono font-bold text-emerald-400">{julianDay.toFixed(5)}</div>
          </div>
          <div className="text-xs text-slate-500 text-right">Matahari & Bulan Ephemeris</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-lg">
          <div>
            <div className="text-xs text-slate-400">Julian Century (T)</div>
            <div className="text-xl font-mono font-bold text-amber-400">{julianCentury.toFixed(7)}</div>
          </div>
          <div className="text-xs text-slate-500 text-right">Relatif terhadap J2000.0</div>
        </div>
      </div>

      {/* Ephemeris Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sun Ephemeris Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Parameter Matahari (Sun Coordinates)
            </h3>
          </div>

          {sunData && (
            <div className="space-y-3 font-mono text-sm">
              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-sans">Deklinasi Matahari (δ)</span>
                <span className="font-bold text-amber-300">{sunData.declination.toFixed(4)}°</span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-sans">Equation of Time (e)</span>
                <span className="font-bold text-amber-300">
                  {sunData.equationOfTime.toFixed(4)} <span className="text-xs font-sans text-slate-400">jam</span>
                </span>
              </div>

              <div className="bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-sans">Perataan Waktu (Menit)</span>
                <span className="font-bold text-amber-300">
                  {(sunData.equationOfTime * 60).toFixed(2)} <span className="text-xs font-sans text-slate-400">menit</span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Moon Ephemeris Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Moon className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Parameter Bulan (Moon Ephemeris Meeus)
            </h3>
          </div>

          {moonData && (
            <div className="space-y-3 font-mono text-xs">
              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Right Ascension (α)</span>
                <span className="font-bold text-indigo-300">{moonData.rightAscension.toFixed(4)}°</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Deklinasi Bulan (δ_m)</span>
                <span className="font-bold text-indigo-300">{moonData.declination.toFixed(4)}°</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Longitude Ekliptika (λ_m)</span>
                <span className="font-bold text-indigo-300">{moonData.longitude.toFixed(4)}°</span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 text-xs font-sans">Paralaks Horizontal (HP)</span>
                <span className="font-bold text-indigo-300">
                  {moonData.parallax.toFixed(4)}° <span className="text-[10px] text-slate-400">({(moonData.parallax * 3600).toFixed(1)}&quot;)</span>
                </span>
              </div>

              <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 flex items-center justify-between">
                <span className="text-slate-400 font-sans">Semidiameter (s_m)</span>
                <span className="font-bold text-indigo-300">
                  {moonData.apparentRadius.toFixed(4)}° <span className="text-[10px] text-slate-400">({(moonData.apparentRadius * 3600).toFixed(1)}&quot;)</span>
                </span>
              </div>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
