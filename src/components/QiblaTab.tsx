import React, { useState, useEffect } from 'react';
import { Compass, Navigation, MapPin, Calendar, Sun, Info } from 'lucide-react';
import { DigitalFalak, LocationCoordinates, QiblaResult, RashdulQiblaResult } from '../engine/DigitalFalak';

interface QiblaTabProps {
  engine: DigitalFalak;
  location: LocationCoordinates;
}

export const QiblaTab: React.FC<QiblaTabProps> = ({ engine, location }) => {
  const [qibla, setQibla] = useState<QiblaResult | null>(null);
  const [rashdulList, setRashdulList] = useState<RashdulQiblaResult[]>([]);
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);

  useEffect(() => {
    const q = engine.getQibla();
    setQibla(q);

    const r = engine.getRashdulQibla(new Date());
    setRashdulList(r);
  }, [engine, location]);

  // Support Device Orientation if available
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      // @ts-expect-error webkitCompassHeading is available on iOS devices
      if (e.webkitCompassHeading !== undefined) {
        // @ts-expect-error webkitCompassHeading on iOS
        setDeviceHeading(e.webkitCompassHeading);
      } else if (e.alpha !== null) {
        setDeviceHeading(360 - e.alpha);
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }

    return () => {
      if (window.DeviceOrientationEvent) {
        window.removeEventListener('deviceorientation', handleOrientation, true);
      }
    };
  }, []);

  const qiblaAngle = qibla ? qibla.direction : 295.14;
  const compassRotation = deviceHeading !== null ? -deviceHeading : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Compass & Direction Card */}
      <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-between shadow-xl">
        <div className="w-full flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Compass className="w-5 h-5 text-emerald-400" />
              Arah Kiblat (Azimut Ka&apos;bah)
            </h3>
            <p className="text-xs text-slate-400">
              Dihitung menggunakan rumus Lingkaran Besar (Great Circle / Spherical Trigonometry)
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs text-slate-400">Jarak ke Ka&apos;bah</div>
            <div className="text-lg font-mono font-bold text-emerald-400">
              {qibla?.distanceKm.toLocaleString('id-ID')} km
            </div>
          </div>
        </div>

        {/* COMPASS VISUALIZER */}
        <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center my-4">
          {/* Compass Outer Ring */}
          <div
            className="absolute inset-0 rounded-full border-4 border-slate-800 bg-slate-950/80 shadow-2xl transition-transform duration-300"
            style={{ transform: `rotate(${compassRotation}deg)` }}
          >
            {/* Cardinal Directions */}
            <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">U (North)</span>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-400">S (South)</span>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">T (East)</span>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">B (West)</span>

            {/* Compass Ticks */}
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <div
                key={deg}
                className="absolute w-0.5 h-2 bg-slate-700 top-1 left-1/2 -translate-x-1/2 origin-[50%_120px] sm:origin-[50%_152px]"
                style={{ transform: `rotate(${deg}deg)` }}
              />
            ))}
          </div>

          {/* Qibla Direction Needle */}
          <div
            className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-500"
            style={{ transform: `rotate(${qiblaAngle + compassRotation}deg)` }}
          >
            <div className="relative w-full h-full flex items-center justify-center">
              {/* Green Qibla Arrow Pointer */}
              <div className="absolute top-4 w-1 h-28 bg-gradient-to-t from-transparent to-emerald-500 rounded-full" />
              <div className="absolute top-2 -translate-y-1/2 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shadow-lg text-xs">
                  🕌
                </div>
                <div className="bg-emerald-950 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-700/80 mt-1 shadow-md">
                  KIBLAT {qiblaAngle}°
                </div>
              </div>
            </div>
          </div>

          {/* Center Point */}
          <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-emerald-400 z-10 flex items-center justify-center shadow-lg">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          </div>
        </div>

        {/* Direction Stats */}
        <div className="w-full grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-800 text-center">
          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-xs text-slate-400">Sudut Azimut</div>
            <div className="text-xl font-mono font-bold text-white">{qiblaAngle}°</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Dari Utara Sejati</div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
            <div className="text-xs text-slate-400">Arah Kompas</div>
            <div className="text-xl font-mono font-bold text-emerald-400">
              {qibla?.directionCardinal || 'UTBB'}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Utara Ke Barat</div>
          </div>
        </div>
      </div>

      {/* Rashdul Qibla & Details Side Card */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Rashdul Qibla Info Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
            <Sun className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-slate-100">
              Rashdul Qibla (Istiwa&apos; A&apos;zam)
            </h3>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            Rashdul Qibla terjadi saat Matahari melintas persis di atas Ka&apos;bah (Zenith Ka&apos;bah). Pada momen ini, bayangan seluruh benda tegak di bumi akan lurus menghadap Kiblat.
          </p>

          <div className="space-y-3">
            {rashdulList.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 p-3.5 rounded-xl border border-slate-700/80 flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-emerald-300">{item.description}</div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {item.date.toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-amber-300">
                    {item.timeString} WIB
                  </div>
                  <div className="text-[10px] text-slate-400">Jam Bayangan</div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-amber-950/30 border border-amber-800/40 p-3 rounded-xl flex items-start space-x-2 text-xs text-amber-200">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Cara Kalibrasi:</strong> Tancapkan tongkat tegak di tanah lapang yang terkena sinar matahari pada jam di atas. Garis bayangan tongkat menuju matahari adalah Arah Kiblat presisi!
            </div>
          </div>
        </div>

        {/* Makkah Coordinates Info */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-xs text-slate-400 space-y-2">
          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-400" /> Acuan Koordinat Ka&apos;bah:
          </div>
          <div>• Lintang Ka&apos;bah (φ): 21.422487° LU</div>
          <div>• Bujur Ka&apos;bah (λ): 39.826206° BT</div>
        </div>

      </div>
    </div>
  );
};
