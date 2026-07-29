import React, { useState } from 'react';
import { X, RotateCcw, Check } from 'lucide-react';
import { CalculationParameters } from '../types';
import { DEFAULT_PARAMS } from '../prayer/prayerTimes';

interface CalculationParamsModalProps {
  isOpen: boolean;
  onClose: () => void;
  params: CalculationParameters;
  onSave: (newParams: CalculationParameters) => void;
}

export const CalculationParamsModal: React.FC<CalculationParamsModalProps> = ({
  isOpen,
  onClose,
  params,
  onSave,
}) => {
  const [formData, setFormData] = useState<CalculationParameters>({ ...params });

  if (!isOpen) return null;

  const handleChange = (field: keyof CalculationParameters, value: number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleResetDefault = () => {
    setFormData({ ...DEFAULT_PARAMS });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <span>⚙️</span> Parameter & Kriteria Waktu Salat
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Fajr Angle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sudut Subuh (Kemenag: -20°)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.fajrAngle}
                onChange={(e) => handleChange('fajrAngle', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Isha Angle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sudut Isya (Kemenag: -18°)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.ishaAngle}
                onChange={(e) => handleChange('ishaAngle', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Dhuha Angle */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sudut Dhuha (Default: 4.5°)
              </label>
              <input
                type="number"
                step="0.5"
                value={formData.dhuhaAngle}
                onChange={(e) => handleChange('dhuhaAngle', parseFloat(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Imsak Minutes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Imsak (Menit sblm Subuh)
              </label>
              <input
                type="number"
                value={formData.imsakMinutes}
                onChange={(e) => handleChange('imsakMinutes', parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Ihtiyati Minutes */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Pengaman / Ihtiyath (Menit)
              </label>
              <input
                type="number"
                value={formData.ihtiyatiMinutes}
                onChange={(e) => handleChange('ihtiyatiMinutes', parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Shadow Factor / Mazhab */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Kriteria Waktu Ashar
              </label>
              <select
                value={formData.shadowLength}
                onChange={(e) => handleChange('shadowLength', parseInt(e.target.value, 10))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
              >
                <option value={1}>Syafi&apos;i / Hanbali / Maliki (Length + 1)</option>
                <option value={2}>Hanafi (Length + 2)</option>
              </select>
            </div>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-lg border border-slate-700/50 text-xs text-slate-400">
            <strong>Catatan Kemenag RI / MABIMS:</strong> Standar Kementerian Agama Republik Indonesia menggunakan Sudut Subuh -20° dan Isya -18° dengan pengaman (Ihtiyath) +2 menit.
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleResetDefault}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Kemenag RI</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg shadow-md transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Simpan Kriteria</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
