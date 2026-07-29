import React, { useState, useEffect } from 'react';
import { Moon, Calendar, AlertCircle, CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';
import { DigitalFalak, LocationCoordinates, HilalResult } from '../engine/DigitalFalak';
import { estimateIjtimakDate } from '../hijri/hilal';

interface HilalTabProps {
  engine: DigitalFalak;
  location: LocationCoordinates;
}

export const HilalTab: React.FC<HilalTabProps> = ({ engine, location }) => {
  const [sunsetDate, setSunsetDate] = useState<Date>(new Date(2026, 2, 19, 17, 50)); // Magrib Ramadan 1447 H / 19 Maret 2026
  const [ijtimakDate, setIjtimakDate] = useState<Date>(new Date(2026, 2, 19, 8, 15)); // Ijtimak 08:15 WIB
  const [hilalResult, setHilalResult] = useState<HilalResult | null>(null);

  useEffect(() => {
    const result = engine.checkHilalVisibility(sunsetDate, ijtimakDate);
    setHilalResult(result);
  }, [engine, location, sunsetDate, ijtimakDate]);

  return (
    <div className="space-y-6">
      {/* Top Banner Intro */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Moon className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-bold text-white">
              Hisab Hilal & Visibilitas Awal Bulan Hijriah
            </h2>
          </div>
          <p className="text-xs text-slate-300 max-w-2xl">
            Simulasi kalkulasi tinggi hilal, elongasi, umur bulan, dan tebal hilal saat terbenam matahari (Magrib) menggunakan <strong>Kriteria MABIMS Baru</strong> (Menteri Agama Brunei, Indonesia, Malaysia, Singapura).
          </p>
        </div>

        <div className="bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300">
          <span className="text-amber-400 font-bold">Kriteria MABIMS Baru:</span>
          <div className="font-mono mt-0.5">
            • Tinggi Mar&apos;i ≥ <strong>3.0°</strong>
            <br />• Elongasi ≥ <strong>6.4°</strong>
          </div>
        </div>
      </div>

      {/* Date Controls & Parameters */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-xl">
        {/* Sunset / Observation Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-emerald-400" />
            Tanggal & Jam Observasi (Saat Magrib / Sunset)
          </label>
          <input
            type="datetime-local"
            value={sunsetDate.toISOString().slice(0, 16)}
            onChange={(e) => {
              if (e.target.value) setSunsetDate(new Date(e.target.value));
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>

        {/* Ijtimak / Conjunction Date */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Waktu Terjadinya Ijtimak (Konjungsi Geosentrik)
          </label>
          <input
            type="datetime-local"
            value={ijtimakDate.toISOString().slice(0, 16)}
            onChange={(e) => {
              if (e.target.value) setIjtimakDate(new Date(e.target.value));
            }}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-mono"
          />
        </div>
      </div>

      {/* RESULT CARDS & STATUS */}
      {hilalResult && (
        <div className="space-y-6">
          {/* Main Status Banner */}
          <div
            className={`p-5 rounded-2xl border shadow-xl flex items-center justify-between flex-wrap gap-4 ${
              hilalResult.isMabimsMet
                ? 'bg-emerald-950/50 border-emerald-800 text-emerald-100'
                : hilalResult.appMoonAltitude > 0
                ? 'bg-amber-950/50 border-amber-800 text-amber-100'
                : 'bg-rose-950/50 border-rose-800 text-rose-100'
            }`}
          >
            <div className="flex items-center space-x-3">
              {hilalResult.isMabimsMet ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : hilalResult.appMoonAltitude > 0 ? (
                <AlertCircle className="w-8 h-8 text-amber-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <div className="text-xs uppercase tracking-wider font-semibold opacity-80">
                  Hasil Uji Kriteria MABIMS Baru
                </div>
                <div className="text-lg font-bold">
                  {hilalResult.isMabimsMet
                    ? 'IMKANUR RUKYAT (LULUS MABIMS)'
                    : 'BELUM MEMENUHI KRITERIA MABIMS'}
                </div>
                <p className="text-xs mt-0.5 opacity-90">{hilalResult.statusDescription}</p>
              </div>
            </div>

            <div className="text-right font-mono text-xs space-y-1">
              <div>Terbenam Matahari: <strong>{hilalResult.sunsetTime}</strong></div>
              <div>Lokasi: <strong>{location.city || 'Pelabuhan Ratu'}</strong></div>
            </div>
          </div>

          {/* Grid Parameters Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            
            {/* Tinggi Mar'i */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg">
              <div className="text-[11px] text-slate-400">Tinggi Mar&apos;i (Apparent)</div>
              <div className={`text-2xl font-mono font-bold ${hilalResult.appMoonAltitude >= 3.0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                {hilalResult.appMoonAltitude}°
              </div>
              <div className="text-[10px] text-slate-500">Syarat: ≥ 3.0°</div>
            </div>

            {/* Elongasi */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg">
              <div className="text-[11px] text-slate-400">Elongasi Bulan-Matahari</div>
              <div className={`text-2xl font-mono font-bold ${hilalResult.elongation >= 6.4 ? 'text-emerald-400' : 'text-slate-200'}`}>
                {hilalResult.elongation}°
              </div>
              <div className="text-[10px] text-slate-500">Syarat: ≥ 6.4°</div>
            </div>

            {/* Tinggi Hakiki */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg">
              <div className="text-[11px] text-slate-400">Tinggi Hakiki (Geocentric)</div>
              <div className="text-2xl font-mono font-bold text-slate-200">
                {hilalResult.moonAltitude}°
              </div>
              <div className="text-[10px] text-slate-500">Sebelum Paralaks/Refraksi</div>
            </div>

            {/* Umur Hilal */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg">
              <div className="text-[11px] text-slate-400">Umur Hilal</div>
              <div className="text-2xl font-mono font-bold text-indigo-400">
                {hilalResult.moonAgeHours} <span className="text-sm font-normal">jam</span>
              </div>
              <div className="text-[10px] text-slate-500">Sejak Ijtimak</div>
            </div>

            {/* Tebal Hilal */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg">
              <div className="text-[11px] text-slate-400">Tebal Hilal</div>
              <div className="text-2xl font-mono font-bold text-amber-400">
                {hilalResult.crescentWidth} <span className="text-sm font-normal">menit</span>
              </div>
              <div className="text-[10px] text-slate-500">Crescent Width</div>
            </div>

            {/* Status MABIMS */}
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl text-center space-y-1 shadow-lg flex flex-col items-center justify-center">
              <div className="text-[11px] text-slate-400">Kriteria MABIMS</div>
              <div className={`text-base font-bold ${hilalResult.isMabimsMet ? 'text-emerald-400' : 'text-rose-400'}`}>
                {hilalResult.isMabimsMet ? '✔ MEMENUHI' : '❌ BELUM'}
              </div>
            </div>

          </div>

          {/* Explanation Box */}
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl text-xs text-slate-300 space-y-2">
            <h4 className="font-bold text-slate-100 flex items-center gap-1.5">
              <Info className="w-4 h-4 text-indigo-400" />
              Penjelasan Metodologi Falakiyah Hisab Hilal:
            </h4>
            <p className="leading-relaxed">
              1. <strong>Tinggi Hakiki (h_m)</strong> adalah sudut ketinggian pusat piringan Bulan dihitung dari pusat bumi (geosentrik) terhadap ufuk mar&apos;i saat Matahari terbenam.
              <br />
              2. <strong>Tinggi Mar&apos;i (Apparent Altitude)</strong> adalah tinggi hilal nyata setelah memperhitungkan koreksi Paralaks Horizontal (Horizontal Parallax), Refraksi Atmosfer, dan Kerendahan Ufuk (Dip/Elevasi tempat).
              <br />
              3. <strong>Kriteria MABIMS Baru</strong> diberlakukan secara resmi di Indonesia sejak tahun 2022 menggantikan kriteria lama (2° / 3° / 8°).
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
