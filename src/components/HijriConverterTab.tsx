import React, { useState, useEffect } from 'react';
import { Calendar, ArrowRightLeft, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { DigitalFalak, HijriDateResult } from '../engine/DigitalFalak';

interface HijriConverterTabProps {
  engine: DigitalFalak;
}

export const HijriConverterTab: React.FC<HijriConverterTabProps> = ({ engine }) => {
  // Masehi to Hijri state
  const [gregDate, setGregDate] = useState<Date>(new Date());
  const [convertedHijri, setConvertedHijri] = useState<HijriDateResult | null>(null);

  // Hijri to Masehi state
  const [hYearInput, setHYearInput] = useState<number>(1448);
  const [hMonthInput, setHMonthInput] = useState<number>(1);
  const [hDayInput, setHDayInput] = useState<number>(1);
  const [convertedGreg, setConvertedGreg] = useState<Date | null>(null);

  // Month Calendar View State
  const [calMonthDate, setCalMonthDate] = useState<Date>(new Date());

  useEffect(() => {
    setConvertedHijri(engine.getHijriDate(gregDate));
  }, [engine, gregDate]);

  useEffect(() => {
    const d = engine.convertHijriToGregorian(hYearInput, hMonthInput, hDayInput);
    setConvertedGreg(d);
  }, [engine, hYearInput, hMonthInput, hDayInput]);

  const HIJRI_MONTH_NAMES = [
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

  // Calendar Grid Generator
  const generateMonthGrid = () => {
    const year = calMonthDate.getFullYear();
    const month = calMonthDate.getMonth();
    
    const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sunday
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    // Leading empty cells
    for (let i = 0; i < firstDayIndex; i++) {
      days.push(null);
    }
    // Days
    for (let d = 1; d <= totalDays; d++) {
      const dateObj = new Date(year, month, d);
      const hijri = engine.getHijriDate(dateObj);
      days.push({
        gDay: d,
        dateObj,
        hijriDay: hijri.day,
        hijriMonthName: hijri.monthName,
        pasaran: hijri.pasaran,
        dayOfWeek: hijri.dayOfWeek,
      });
    }

    return days;
  };

  return (
    <div className="space-y-6">
      
      {/* Two Way Converter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Masehi -> Hijri */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-slate-100">
              Konversi Masehi ➔ Hijriah
            </h3>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Pilih Tanggal Masehi (Gregorian):
            </label>
            <input
              type="date"
              value={gregDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) setGregDate(new Date(e.target.value));
              }}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-semibold"
            />
          </div>

          {convertedHijri && (
            <div className="bg-gradient-to-tr from-emerald-950/60 to-slate-800 p-4 rounded-xl border border-emerald-800/60 space-y-2">
              <div className="text-xs text-emerald-400 uppercase tracking-wider font-semibold">
                Hasil Konversi Hijriah:
              </div>
              <div className="text-xl font-bold text-white">
                {convertedHijri.day} {convertedHijri.monthName} {convertedHijri.year} H
              </div>
              <div className="text-xs text-slate-300 flex items-center justify-between pt-2 border-t border-emerald-900/60">
                <span>Hari & Pasaran: <strong>{convertedHijri.dayOfWeek} {convertedHijri.pasaran}</strong></span>
                <span className="text-emerald-400 font-mono">{convertedHijri.dayOfWeekArabic}</span>
              </div>
            </div>
          )}
        </div>

        {/* Hijri -> Masehi */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <ArrowRightLeft className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">
              Konversi Hijriah ➔ Masehi
            </h3>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Tanggal</label>
              <input
                type="number"
                min={1}
                max={30}
                value={hDayInput}
                onChange={(e) => setHDayInput(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Bulan</label>
              <select
                value={hMonthInput}
                onChange={(e) => setHMonthInput(parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2 py-2 text-xs text-white focus:outline-none font-semibold cursor-pointer"
              >
                {HIJRI_MONTH_NAMES.map((m, idx) => (
                  <option key={idx} value={idx + 1}>
                    {idx + 1}. {m}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">Tahun (H)</label>
              <input
                type="number"
                value={hYearInput}
                onChange={(e) => setHYearInput(parseInt(e.target.value, 10) || 1448)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none font-semibold"
              />
            </div>
          </div>

          {convertedGreg && (
            <div className="bg-gradient-to-tr from-indigo-950/60 to-slate-800 p-4 rounded-xl border border-indigo-800/60 space-y-2">
              <div className="text-xs text-indigo-400 uppercase tracking-wider font-semibold">
                Estimasi Masehi:
              </div>
              <div className="text-xl font-bold text-white">
                {convertedGreg.toLocaleDateString('id-ID', {
                  weekday: 'long',
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </div>
              <div className="text-xs text-slate-400 pt-1">
                Dihitung menggunakan algoritma Siklus Tabular Hijriah (Tabular Islamic Calendar).
              </div>
            </div>
          )}
        </div>

      </div>

      {/* MONTHLY DUAL CALENDAR GRID */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        
        {/* Calendar Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-lg font-bold text-slate-100">
              Kalender Ganda (Masehi • Hijriah • Pasaran Jawa)
            </h3>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                const d = new Date(calMonthDate);
                d.setMonth(d.getMonth() - 1);
                setCalMonthDate(d);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-bold text-emerald-400 font-mono min-w-[140px] text-center">
              {calMonthDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </span>
            <button
              onClick={() => {
                const d = new Date(calMonthDate);
                d.setMonth(d.getMonth() + 1);
                setCalMonthDate(d);
              }}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-800">
          <span className="text-rose-400">Ahad</span>
          <span>Senin</span>
          <span>Selasa</span>
          <span>Rabu</span>
          <span>Kamis</span>
          <span className="text-emerald-400">Jumat</span>
          <span>Sabtu</span>
        </div>

        {/* Calendar Cells */}
        <div className="grid grid-cols-7 gap-2">
          {generateMonthGrid().map((cell, idx) => {
            if (!cell) {
              return <div key={idx} className="h-20 bg-slate-950/40 rounded-xl opacity-20" />;
            }

            const isToday = cell.dateObj.toDateString() === new Date().toDateString();

            return (
              <div
                key={idx}
                className={`h-20 p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  isToday
                    ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-lg shadow-emerald-950'
                    : 'bg-slate-800/50 border-slate-700/60 hover:bg-slate-800 text-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="text-base font-bold font-mono">{cell.gDay}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950/80 px-1 py-0.5 rounded border border-emerald-800/80">
                    {cell.hijriDay}
                  </span>
                </div>

                <div className="text-[10px] space-y-0.5">
                  <div className="text-slate-400 truncate">{cell.hijriMonthName}</div>
                  <div className="text-amber-300/90 font-medium">{cell.pasaran}</div>
                </div>
              </div>
            );
          })}
        </div>

      </div>

    </div>
  );
};
