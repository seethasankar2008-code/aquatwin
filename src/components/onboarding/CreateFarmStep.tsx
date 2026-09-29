import React from 'react';
import { FarmProfile, Language } from '../../types/farm';
import { translations } from '../../i18n/translations';
import { Sprout, MapPin, Droplets, ArrowRight } from 'lucide-react';

interface CreateFarmStepProps {
  profile: FarmProfile;
  onChange: (updated: Partial<FarmProfile>) => void;
  onNext: () => void;
  language: Language;
}

export const CreateFarmStep: React.FC<CreateFarmStepProps> = ({
  profile,
  onChange,
  onNext,
  language,
}) => {
  const t = translations[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile.farmName.trim()) {
      alert('Please enter your farm name');
      return;
    }
    onNext();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          CREATE YOUR FARM
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Tell AquaTwin about your farm. We'll use this baseline to build your digital farm twin.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Farm Name */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Farm Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Green Valley Farm"
            value={profile.farmName}
            onChange={(e) => onChange({ farmName: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
          />
        </div>

        {/* Location */}
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Location
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              placeholder="e.g. Thanjavur, Tamil Nadu"
              value={profile.location}
              onChange={(e) => onChange({ location: e.target.value })}
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
            />
          </div>
        </div>

        {/* Total Farm Area & Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Total Farm Area
          </label>
          <input
            type="number"
            min="0.1"
            step="0.1"
            required
            value={profile.totalArea || ''}
            onChange={(e) => onChange({ totalArea: Number(e.target.value) })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Area Unit
          </label>
          <select
            value={profile.areaUnit}
            onChange={(e) => onChange({ areaUnit: e.target.value as 'Acres' | 'Hectares' })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
          >
            <option value="Acres">Acres</option>
            <option value="Hectares">Hectares</option>
          </select>
        </div>

        {/* Primary Water Source */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Primary Water Source
          </label>
          <select
            value={profile.waterSource}
            onChange={(e) => onChange({ waterSource: e.target.value as any })}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
          >
            <option value="Farm Pond">Farm Pond</option>
            <option value="Borewell">Borewell</option>
            <option value="Canal">Canal</option>
            <option value="Reservoir">Reservoir</option>
            <option value="Rainwater">Rainwater Harvesting</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Available Water & Unit */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-tight block">
            Available Water Pool
          </label>
          <div className="flex space-x-2">
            <input
              type="number"
              min="500"
              step="500"
              required
              value={profile.availableWater || ''}
              onChange={(e) => onChange({ availableWater: Number(e.target.value) })}
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
            />
            <select
              value={profile.waterUnit}
              onChange={(e) => onChange({ waterUnit: e.target.value as 'Litres' | 'Kilolitres' })}
              className="w-28 px-2 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-aqua-500 bg-slate-50/50"
            >
              <option value="Litres">Litres (L)</option>
              <option value="Kilolitres">Kilolitres (kL)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="p-3.5 rounded-2xl bg-eco-50/80 border border-eco-200/80 text-xs text-eco-950 flex items-start space-x-2.5">
        <Droplets className="w-4 h-4 text-eco-700 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Note:</strong> You do not need to enter temperature, rainfall probability, or future stress. AquaTwin's autonomous intelligence calculates those automatically.
        </p>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-eco-900 hover:bg-eco-800 text-white font-extrabold text-xs shadow-md transition-all active:scale-98"
        >
          <span>Continue to Add Fields</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
};
