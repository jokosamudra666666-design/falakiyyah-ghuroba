import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Compass, Moon, Calendar, Orbit, Code } from 'lucide-react';
import { DigitalFalak, LocationCoordinates, CalculationParameters } from './engine/DigitalFalak';
import { DEFAULT_PARAMS } from './prayer/prayerTimes';
import { Header } from './components/Header';
import { CalculationParamsModal } from './components/CalculationParamsModal';
import { PrayerTimesTab } from './components/PrayerTimesTab';
import { QiblaTab } from './components/QiblaTab';
import { HilalTab } from './components/HilalTab';
import { HijriConverterTab } from './components/HijriConverterTab';
import { EphemerisTab } from './components/EphemerisTab';
import { SdkPlaygroundTab } from './components/SdkPlaygroundTab';

export default function App() {
  // Default location: Kediri, Jawa Timur (-7.848, 112.0178) as featured in PDF test suites
  const [location, setLocation] = useState<LocationCoordinates>({
    latitude: -7.848,
    longitude: 112.0178,
    elevation: 67,
    timezone: 'Asia/Jakarta',
    city: 'Kediri',
    province: 'Jawa Timur',
  });

  const [params, setParams] = useState<CalculationParameters>({ ...DEFAULT_PARAMS });
  const [isParamsModalOpen, setIsParamsModalOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'prayer' | 'qibla' | 'hilal' | 'hijri' | 'ephemeris' | 'sdk'>('prayer');

  // Initialize DigitalFalak engine instance
  const engine = useMemo(() => {
    return new DigitalFalak(location, params);
  }, [location, params]);

  const TABS = [
    { id: 'prayer', label: 'Waktu Salat & Istiwak', icon: Clock },
    { id: 'qibla', label: 'Arah Kiblat & Rashdul', icon: Compass },
    { id: 'hilal', label: 'Hisab Hilal MABIMS', icon: Moon },
    { id: 'hijri', label: 'Kalender Masehi-Hijriah', icon: Calendar },
    { id: 'ephemeris', label: 'Ephemeris Benda Langit', icon: Orbit },
    { id: 'sdk', label: 'SDK & Playground', icon: Code },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-emerald-500 selection:text-slate-950 flex flex-col">
      {/* Header */}
      <Header
        engine={engine}
        currentLocation={location}
        onLocationChange={(newLoc) => setLocation(newLoc)}
        onOpenParamsModal={() => setIsParamsModalOpen(true)}
      />

      {/* Main Body Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Navigation Tab Bar */}
        <div className="bg-slate-900/90 border border-slate-800/80 p-1.5 rounded-2xl flex items-center overflow-x-auto gap-1 shadow-lg scrollbar-none">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="absolute inset-0 bg-emerald-600 rounded-xl shadow-md"
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Contents with Animated Transition */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'prayer' && <PrayerTimesTab engine={engine} location={location} />}
              {activeTab === 'qibla' && <QiblaTab engine={engine} location={location} />}
              {activeTab === 'hilal' && <HilalTab engine={engine} location={location} />}
              {activeTab === 'hijri' && <HijriConverterTab engine={engine} />}
              {activeTab === 'ephemeris' && <EphemerisTab engine={engine} />}
              {activeTab === 'sdk' && <SdkPlaygroundTab engine={engine} location={location} />}
            </motion.div>
          </AnimatePresence>
        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900 py-6 mt-12 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-medium text-slate-300">
            Digital Falak Engine v1.0 • Berbasis Reverse Engineering Source Code Android <span className="text-emerald-400">com.digital.falak</span>
          </p>
          <p className="text-slate-400">
            Algoritma Astronomi Meeus Ephemeris, Waktu Salat Kemenag RI, Jam Istiwak Sun & Hisab Hilal Kriteria MABIMS Baru.
          </p>
        </div>
      </footer>

      {/* Calculation Parameters Modal */}
      <CalculationParamsModal
        isOpen={isParamsModalOpen}
        onClose={() => setIsParamsModalOpen(false)}
        params={params}
        onSave={(newParams) => setParams(newParams)}
      />
    </div>
  );
}
