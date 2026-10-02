import React, { useState } from 'react';
import { CropType, GrowthStage, SoilType, FieldVisualAnalysis } from '../../types/farm';
import { FieldPhotoSection } from './FieldPhotoSection';
import { Plus, Trash2, Edit2, Check, ArrowRight, Sprout, ChevronDown, ChevronUp } from 'lucide-react';

export interface UserConfiguredField {
  id: string;
  name: string;
  crop: CropType;
  area: number;
  soilType: SoilType;
  growthStage: GrowthStage;
  soilMoisture?: number; // Optional
  visualAnalysis?: FieldVisualAnalysis; // Optional
}

interface AddFieldsStepProps {
  fields: UserConfiguredField[];
  onFieldsChange: (fields: UserConfiguredField[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export const AddFieldsStep: React.FC<AddFieldsStepProps> = ({
  fields,
  onFieldsChange,
  onNext,
  onBack,
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  // New field draft form state
  const [draftName, setDraftName] = useState(`Field 0${fields.length + 1}`);
  const [draftCrop, setDraftCrop] = useState<CropType>('Rice');
  const [draftArea, setDraftArea] = useState<number>(1.5);
  const [draftSoil, setDraftSoil] = useState<SoilType>('Clay Loam');
  const [draftStage, setDraftStage] = useState<GrowthStage>('Vegetative');
  const [draftMoisture, setDraftMoisture] = useState<string>('');
  const [draftAnalysis, setDraftAnalysis] = useState<FieldVisualAnalysis | undefined>(undefined);
  const [isFormOpen, setIsFormOpen] = useState(fields.length === 0);

  const handleAddField = (e: React.FormEvent) => {
    e.preventDefault();

    const moistureVal = draftMoisture.trim() !== '' ? Number(draftMoisture) : undefined;

    if (editingId) {
      // Update existing
      const updated = fields.map((f) =>
        f.id === editingId
          ? {
              ...f,
              name: draftName,
              crop: draftCrop,
              area: draftArea,
              soilType: draftSoil,
              growthStage: draftStage,
              soilMoisture: moistureVal,
              visualAnalysis: draftAnalysis,
            }
          : f
      );
      onFieldsChange(updated);
      setEditingId(null);
    } else {
      // Add new
      const newField: UserConfiguredField = {
        id: `field-${Date.now()}`,
        name: draftName,
        crop: draftCrop,
        area: draftArea,
        soilType: draftSoil,
        growthStage: draftStage,
        soilMoisture: moistureVal,
        visualAnalysis: draftAnalysis,
      };
      onFieldsChange([...fields, newField]);
    }

    // Reset draft form
    setDraftName(`Field 0${fields.length + 2}`);
    setDraftCrop('Tomato');
    setDraftArea(1.0);
    setDraftSoil('Sandy Loam');
    setDraftStage('Flowering');
    setDraftMoisture('');
    setDraftAnalysis(undefined);
    setIsFormOpen(false);
  };

  const handleEditClick = (field: UserConfiguredField) => {
    setEditingId(field.id);
    setDraftName(field.name);
    setDraftCrop(field.crop);
    setDraftArea(field.area);
    setDraftSoil(field.soilType);
    setDraftStage(field.growthStage);
    setDraftMoisture(field.soilMoisture !== undefined ? String(field.soilMoisture) : '');
    setDraftAnalysis(field.visualAnalysis);
    setIsFormOpen(true);
  };

  const handleRemoveClick = (id: string) => {
    onFieldsChange(fields.filter((f) => f.id !== id));
    if (editingId === id) {
      setEditingId(null);
      setIsFormOpen(false);
    }
  };

  const handleContinue = () => {
    if (fields.length === 0) {
      alert('Please add at least one field to your farm');
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h3 className="text-xl font-bold font-display text-slate-900 tracking-tight">
          ADD YOUR FIELDS
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure the crops and plots for your digital twin. You can add multiple fields and optionally attach photos.
        </p>
      </div>

      {/* Field Roster List */}
      <div className="space-y-3">
        {fields.map((field) => (
          <div
            key={field.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all gap-3"
          >
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-lg bg-water-50 text-water-600 border border-water-200/60 shrink-0">
                <Sprout className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold font-display text-slate-900 text-xs sm:text-sm">
                    {field.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-semibold border border-slate-200">
                    {field.crop}
                  </span>
                  {field.visualAnalysis && (
                    <span className="px-2 py-0.5 rounded-md bg-water-50 text-water-700 text-[10px] font-semibold border border-water-200/60">
                      📷 Visual Insight
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {field.area} ha • {field.soilType} • <span className="italic">{field.growthStage}</span>
                  {field.soilMoisture !== undefined && ` • Moisture: ${field.soilMoisture}%`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto">
              <button
                type="button"
                onClick={() => handleEditClick(field)}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors border border-slate-200"
              >
                <Edit2 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
              <button
                type="button"
                onClick={() => handleRemoveClick(field.id)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                title="Remove Field"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Form Card */}
      {isFormOpen ? (
        <form onSubmit={handleAddField} className="bg-slate-50/70 rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <span className="font-bold font-display text-xs uppercase tracking-wider text-slate-900">
              {editingId ? 'Edit Field Details' : 'Configure New Field'}
            </span>
            {fields.length > 0 && (
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="text-xs text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Field Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                Field Name / Number
              </label>
              <input
                type="text"
                required
                value={draftName}
                onChange={(e) => setDraftName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              />
            </div>

            {/* Crop */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                Crop
              </label>
              <select
                value={draftCrop}
                onChange={(e) => setDraftCrop(e.target.value as CropType)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              >
                <option value="Rice">Rice (Paddy)</option>
                <option value="Tomato">Tomato</option>
                <option value="Groundnut">Groundnut</option>
                <option value="Maize">Maize</option>
                <option value="Cotton">Cotton</option>
                <option value="Sugarcane">Sugarcane</option>
              </select>
            </div>

            {/* Field Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                Field Area (ha)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                required
                value={draftArea}
                onChange={(e) => setDraftArea(Number(e.target.value))}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              />
            </div>

            {/* Soil Type */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                Soil Type
              </label>
              <select
                value={draftSoil}
                onChange={(e) => setDraftSoil(e.target.value as SoilType)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              >
                <option value="Clay Loam">Clay Loam</option>
                <option value="Sandy Loam">Sandy Loam</option>
                <option value="Red Soil">Red Soil</option>
                <option value="Alluvial">Alluvial</option>
              </select>
            </div>

            {/* Growth Stage */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                Growth Stage
              </label>
              <select
                value={draftStage}
                onChange={(e) => setDraftStage(e.target.value as GrowthStage)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              >
                <option value="Flowering">Flowering (High Sensitivity)</option>
                <option value="Vegetative">Vegetative</option>
                <option value="Pod Development">Pod Development</option>
                <option value="Silking / Tasseling">Silking / Tasseling</option>
                <option value="Boll Formation">Boll Formation</option>
                <option value="Tillering">Tillering</option>
              </select>
            </div>

            {/* Current Soil Moisture (OPTIONAL) */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-semibold text-slate-700 uppercase tracking-tight block">
                  Soil Moisture (%)
                </label>
                <span className="text-[10px] text-slate-400 italic">Optional if known</span>
              </div>
              <input
                type="number"
                min="5"
                max="95"
                placeholder="e.g. 24 (Leave blank if unknown)"
                value={draftMoisture}
                onChange={(e) => setDraftMoisture(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-slate-300 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 bg-white"
              />
            </div>
          </div>

          {/* Optional Field Photo & Visual Analysis */}
          <FieldPhotoSection
            fieldName={draftName}
            crop={draftCrop}
            growthStage={draftStage}
            soilType={draftSoil}
            visualAnalysis={draftAnalysis}
            onAnalysisComplete={(analysis) => setDraftAnalysis(analysis)}
          />

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? 'Save Changes' : 'Add Field to Roster'}</span>
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setDraftName(`Field 0${fields.length + 1}`);
            setDraftAnalysis(undefined);
            setIsFormOpen(true);
          }}
          className="w-full py-3 px-4 rounded-xl border border-dashed border-slate-300 hover:border-water-500 hover:bg-water-50/30 text-slate-600 hover:text-water-700 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4 text-water-600" />
          <span>+ ADD ANOTHER FIELD</span>
        </button>
      )}

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition-colors"
        >
          Back
        </button>

        <button
          type="button"
          onClick={handleContinue}
          className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs shadow-xs transition-colors"
        >
          <span>Review Farm ({fields.length} {fields.length === 1 ? 'Field' : 'Fields'})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
