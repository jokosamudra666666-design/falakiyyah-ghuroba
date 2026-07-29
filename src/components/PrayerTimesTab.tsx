import React, { useState, useEffect } from 'react';
import { Clock, Calendar, ChevronLeft, ChevronRight, Copy, Check, Sun, Moon as MoonIcon, Sparkles } from 'lucide-react';
import { DigitalFalak, LocationCoordinates, PrayerTimesResult } from '../engine/DigitalFalak';

interface PrayerTimesTabProps {
  engine: DigitalFalak;
  location: LocationCoordinates;
}

export const PrayerTimesTab: React.FC<PrayerTimesTabProps> = ({ engine, location }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimesResult | null>(null);
  const [nextPrayerName, setNextPrayerName] = useState<string>('');
  const [countdownText, setCountdownText] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');

  useEffect(() => {
    const times = engine.getPrayerTimes(selectedDate);
    setPrayerTimes(times);
  }, [engine, location, selectedDate]);

  // Live Next Prayer Countdown
  useEffect(() => {
    if (!prayerTimes) return;

    const updateCountdown = () => {
      const now = new Date();
      const isToday =
        selectedDate.getFullYear() === now.getFullYear() &&
        selectedDate.getMonth() === now.getMonth() &&
        selectedDate.getDate() === now.getDate();

      if (!isToday) {
        setNextPrayerName('');
        setCountdownText('');
        return;
      }

      const timesList = [
        { name: 'Imsak', timeStr: prayerTimes.imsak },
        { name: 'Subuh', timeStr: prayerTimes.subuh },
        { name: 'Syuruq (Terbit)', timeStr: prayerTimes.syuruq },
        { name: 'Dhuha', timeStr: prayerTimes.dhuha },
        { name: 'Zuhur', timeStr: prayerTimes.zuhur },
        { name: 'Ashar', timeStr: prayerTimes.ashar },
        { name: 'Magrib', timeStr: prayerTimes.magrib },
        { name: 'Isya', timeStr: prayerTimes.isya },
      ];

      let upcoming = null;
      for (const item of timesList) {
        const [h, m] = item.timeStr.split(':').map(Number);
        const pDate = new Date(now);
        pDate.setHours(h, m, 0, 0);

        if (pDate > now) {
          upcoming = { name: item.name, date: pDate };
          break;
        }
      }

      if (!upcoming) {
        // Next is tomorrow's Imsak
        const tomorrowImsak = new Date(now);
        tomorrowImsak.setDate(tomorrowImsak.getDate() + 1);
        const [h, m] = prayerTimes.imsak.split(':').map(Number);
        tomorrowImsak.setHours(h, m, 0, 0);
        upcoming = { name: 'Imsak (Besok)', date: tomorrowImsak };
      }

      setNextPrayerName(upcoming.name);

      const diffMs = upcoming.date.getTime() - now.getTime();
      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((diffMs % (1000 * 60)) / 1000);

      setCountdownText(
        `-${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      );
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [selectedDate, prayerTimes]);

  const handlePrevDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() - 1);
    setSelectedDate(d);
  };

  const handleNextDay = () => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + 1);
    setSelectedDate(d);
  };

  const handleToday = () => {
    setSelectedDate(new Date());
  };

  const handleCopySchedule = () => {
    if (!prayerTimes) return;
    const text = `Jadwal Salat & Istiwak (${location.city || 'Lokasi Custom'})\nTanggal: ${selectedDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n\nImsak: ${prayerTimes.imsak}\nSubuh: ${prayerTimes.subuh}\nSyuruq: ${prayerTimes.syuruq}\nDhuha: ${prayerTimes.dhuha}\nZuhur: ${prayerTimes.zuhur}\nAshar: ${prayerTimes.ashar}\nMagrib: ${prayerTimes.magrib}\nIsya: ${prayerTimes.isya}\nJam Istiwak (Zuhur): ${prayerTimes.istiwak}\n\nDiproses oleh Digital Falak Engine`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Monthly Table Generator
  const generateMonthlySchedule = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const rows = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, month, day);
      const times = engine.getPrayerTimes(d);
      const hijri = engine.getHijriDate(d);
      rows.push({
        date: d,
        dayNum: day,
        dayName: d.toLocaleDateString('id-ID', { weekday: 'short' }),
        hijriStr: `${hijri.day} ${hijri.monthName}`,
        times,
      });
    }
    return rows;
  };

  const PRAYER_CARDS = [
    { key: 'imsak', label: 'Imsak', time: prayerTimes?.imsak, icon: MoonIcon, color: 'text-indigo-400', bg: 'bg-indigo-950/40 border-indigo-800/40' },
    { key: 'subuh', label: 'Subuh', time: prayerTimes?.subuh, icon: MoonIcon, color: 'text-cyan-400', bg: 'bg-cyan-950/40 border-cyan-800/40' },
    { key: 'syuruq', label: 'Syuruq', time: prayerTimes?.syuruq, icon: Sun, color: 'text-amber-400', bg: 'bg-amber-950/40 border-amber-800/40' },
    { key: 'dhuha', label: 'Dhuha', time: prayerTimes?.dhuha, icon: Sun, color: 'text-yellow-400', bg: 'bg-yellow-950/40 border-yellow-800/40' },
    { key: 'zuhur', label: 'Zuhur', time: prayerTimes?.zuhur, icon: Sun, color: 'text-emerald-400', bg: 'bg-emerald-950/40 border-emerald-800/40' },
    { key: 'ashar', label: 'Ashar', time: prayerTimes?.ashar, icon: Sun, color: 'text-teal-400', bg: 'bg-teal-950/40 border-teal-800/40' },
    { key: 'magrib', label: 'Magrib', time: prayerTimes?.magrib, icon: MoonIcon, color: 'text-orange-400', bg: 'bg-orange-950/40 border-orange-800/40' },
    { key: 'isya', label: 'Isya', time: prayerTimes?.isya, icon: MoonIcon, color: 'text-purple-400', bg: 'bg-purple-950/40 border-purple-800/40' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Control Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Date Selector */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevDay}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 bg-slate-800 px-3 py-2 rounded-xl border border-slate-700">
            <Calendar className="w-4 h-4 text-emerald-400" />
            <input
              type="date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={(e) => {
                if (e.target.value) setSelectedDate(new Date(e.target.value));
              }}
              className="bg-transparent text-sm font-semibold text-white focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={handleNextDay}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={handleToday}
            className="px-3 py-2 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold rounded-xl border border-emerald-500/30 transition-colors"
          >
            Hari Ini
          </button>
        </div>

        {/* View Mode & Actions */}
        <div className="flex items-center space-x-2">
          <div className="bg-slate-800 p-1 rounded-xl border border-slate-700 flex items-center">
            <button
              onClick={() => setViewMode('daily')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'daily'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Harian
            </button>
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                viewMode === 'monthly'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bulanan
            </button>
          </div>

          <button
            onClick={handleCopySchedule}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
            <span>{copied ? 'Tercopy' : 'Salin Text'}</span>
          </button>
        </div>
      </div>

      {/* Countdown Card (If today) */}
      {nextPrayerName && countdownText && (
        <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border border-emerald-800/60 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <div className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
                Waktu Salat Berikutnya
              </div>
              <div className="text-lg font-bold text-white">
                Menuju <span className="text-emerald-300">{nextPrayerName}</span>
              </div>
            </div>
          </div>

          <div className="text-center sm:text-right">
            <div className="text-xs text-slate-400 mb-0.5">Sisa Waktu</div>
            <div className="text-2xl sm:text-3xl font-mono font-bold text-emerald-400 tracking-wider">
              {countdownText}
            </div>
          </div>
        </div>
      )}

      {/* DAILY VIEW */}
      {viewMode === 'daily' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PRAYER_CARDS.map((card) => {
            const Icon = card.icon;
            const isNext = nextPrayerName.toLowerCase().includes(card.label.toLowerCase());

            return (
              <div
                key={card.key}
                className={`p-5 rounded-2xl border transition-all ${card.bg} ${
                  isNext ? 'ring-2 ring-emerald-400 shadow-lg shadow-emerald-950' : ''
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    {card.label}
                  </span>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
                <div className="text-2xl font-mono font-bold text-white tracking-tight">
                  {card.time || '--:--'}
                </div>
                <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Standard WIBI</span>
                  {isNext && <span className="text-emerald-400 font-bold">Berikutnya</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MONTHLY SCHEDULE TABLE */}
      {viewMode === 'monthly' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/40">
            <h3 className="text-sm font-bold text-slate-200">
              Jadwal Salat Bulan {selectedDate.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
            </h3>
            <span className="text-xs text-slate-400">
              Lokasi: {location.city || 'Custom'} ({location.latitude}°, {location.longitude}°)
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-800/80 text-slate-300 font-semibold border-b border-slate-800">
                <tr>
                  <th className="p-3">Tgl</th>
                  <th className="p-3">Hari</th>
                  <th className="p-3">Hijriah</th>
                  <th className="p-3 text-indigo-400">Imsak</th>
                  <th className="p-3 text-cyan-400">Subuh</th>
                  <th className="p-3 text-amber-400">Syuruq</th>
                  <th className="p-3 text-yellow-400">Dhuha</th>
                  <th className="p-3 text-emerald-400">Zuhur</th>
                  <th className="p-3 text-teal-400">Ashar</th>
                  <th className="p-3 text-orange-400">Magrib</th>
                  <th className="p-3 text-purple-400">Isya</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-200">
                {generateMonthlySchedule().map((row) => {
                  const isToday =
                    row.date.toDateString() === new Date().toDateString();
                  return (
                    <tr
                      key={row.dayNum}
                      className={`hover:bg-slate-800/50 transition-colors ${
                        isToday ? 'bg-emerald-950/40 font-bold text-emerald-200' : ''
                      }`}
                    >
                      <td className="p-3 font-semibold">{row.dayNum}</td>
                      <td className="p-3 font-sans text-slate-300">{row.dayName}</td>
                      <td className="p-3 font-sans text-slate-400">{row.hijriStr}</td>
                      <td className="p-3">{row.times.imsak}</td>
                      <td className="p-3">{row.times.subuh}</td>
                      <td className="p-3">{row.times.syuruq}</td>
                      <td className="p-3">{row.times.dhuha}</td>
                      <td className="p-3 text-emerald-400 font-bold">{row.times.zuhur}</td>
                      <td className="p-3">{row.times.ashar}</td>
                      <td className="p-3">{row.times.magrib}</td>
                      <td className="p-3">{row.times.isya}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
