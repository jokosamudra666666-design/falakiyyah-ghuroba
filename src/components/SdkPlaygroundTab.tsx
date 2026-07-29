import React, { useState } from 'react';
import { Code, Terminal, Copy, Check, Play } from 'lucide-react';
import { DigitalFalak, LocationCoordinates } from '../engine/DigitalFalak';

interface SdkPlaygroundTabProps {
  engine: DigitalFalak;
  location: LocationCoordinates;
}

export const SdkPlaygroundTab: React.FC<SdkPlaygroundTabProps> = ({ engine, location }) => {
  const [selectedMethod, setSelectedMethod] = useState<string>('getPrayerTimes');
  const [copied, setCopied] = useState<boolean>(false);

  const getOutputJson = () => {
    switch (selectedMethod) {
      case 'getPrayerTimes':
        return JSON.stringify(engine.getPrayerTimes(), null, 2);
      case 'getQibla':
        return JSON.stringify(engine.getQibla(), null, 2);
      case 'getHijriDate':
        return JSON.stringify(engine.getHijriDate(), null, 2);
      case 'getSunCoordinates':
        return JSON.stringify(engine.getSunCoordinates(), null, 2);
      case 'getMoonCoordinates':
        return JSON.stringify(engine.getMoonCoordinates(), null, 2);
      case 'checkHilalVisibility':
        return JSON.stringify(
          engine.checkHilalVisibility(new Date(2026, 2, 19, 17, 50), new Date(2026, 2, 19, 8, 15)),
          null,
          2
        );
      case 'getRashdulQibla':
        return JSON.stringify(engine.getRashdulQibla(), null, 2);
      default:
        return '{}';
    }
  };

  const sampleCode = `import { DigitalFalak } from 'digital-falak-engine';

// 1. Inisialisasi Engine dengan Koordinat ${location.city || 'Custom'}
const falak = new DigitalFalak({
  latitude: ${location.latitude},
  longitude: ${location.longitude},
  elevation: ${location.elevation || 10},
  timezone: '${location.timezone}',
});

// 2. Memanggil Method ${selectedMethod}
const result = falak.${selectedMethod}();
console.log(result);`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(sampleCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code className="w-6 h-6 text-emerald-400" />
            Developer SDK & Live API Inspector
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Engine Digital Falak dapat di-import langsung sebagai TypeScript Library / SDK pada aplikasi Web, Express Backend, atau React Native.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 px-3.5 py-2 rounded-xl text-xs font-mono text-emerald-400">
          npm install digital-falak-engine
        </div>
      </div>

      {/* Code Runner Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Left: Code Snippet */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">contoh_penggunaan.ts</span>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs rounded-lg transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
              <span>{copied ? 'Tercopy' : 'Copy'}</span>
            </button>
          </div>

          <pre className="p-4 text-xs font-mono text-emerald-300/90 bg-slate-950/80 overflow-x-auto flex-1 leading-relaxed">
            <code>{sampleCode}</code>
          </pre>
        </div>

        {/* Right: Live JSON Output Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold text-slate-200">Live Engine Output JSON</span>
            </div>

            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="bg-slate-800 border border-slate-700 rounded-lg text-xs font-mono text-emerald-300 px-2.5 py-1 focus:outline-none cursor-pointer"
            >
              <option value="getPrayerTimes">getPrayerTimes()</option>
              <option value="getQibla">getQibla()</option>
              <option value="getHijriDate">getHijriDate()</option>
              <option value="getSunCoordinates">getSunCoordinates()</option>
              <option value="getMoonCoordinates">getMoonCoordinates()</option>
              <option value="checkHilalVisibility">checkHilalVisibility()</option>
              <option value="getRashdulQibla">getRashdulQibla()</option>
            </select>
          </div>

          <pre className="p-4 text-xs font-mono text-amber-200/90 bg-slate-950/90 overflow-x-auto flex-1 leading-relaxed">
            <code>{getOutputJson()}</code>
          </pre>
        </div>

      </div>
    </div>
  );
};
