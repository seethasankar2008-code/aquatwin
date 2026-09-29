import React, { useState } from 'react';
import { FieldVisualAnalysis, CropType, GrowthStage, SoilType } from '../../types/farm';
import { analyzeFieldPhoto, SAMPLE_FIELD_PHOTOS } from '../../services/photoAnalysisService';
import { Camera, Upload, Trash2, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface FieldPhotoSectionProps {
  fieldName: string;
  crop: CropType | string;
  growthStage: GrowthStage | string;
  soilType: SoilType | string;
  visualAnalysis?: FieldVisualAnalysis;
  onAnalysisComplete: (analysis?: FieldVisualAnalysis) => void;
}

export const FieldPhotoSection: React.FC<FieldPhotoSectionProps> = ({
  fieldName,
  crop,
  growthStage,
  soilType,
  visualAnalysis,
  onAnalysisComplete,
}) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(visualAnalysis?.photoUrl || null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onload = (event) => {
      const url = event.target?.result as string;
      setSelectedImage(url);
      onAnalysisComplete(undefined); // Reset previous analysis until Analyze is clicked
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = (url: string) => {
    setErrorMsg(null);
    setSelectedImage(url);
    onAnalysisComplete(undefined);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setIsAnalyzing(true);
    setErrorMsg(null);

    try {
      const analysis = await analyzeFieldPhoto({
        imageUrl: selectedImage,
        crop,
        growthStage,
        soilType,
      });
      onAnalysisComplete(analysis);
    } catch (err) {
      console.error(err);
      setErrorMsg('Photo analysis is currently unavailable. You can continue using AquaTwin without visual analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleRemove = () => {
    setSelectedImage(null);
    setErrorMsg(null);
    onAnalysisComplete(undefined);
  };

  return (
    <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 text-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <div className="flex items-center space-x-1.5">
            <Camera className="w-4 h-4 text-cyan-700" />
            <span className="font-extrabold text-slate-900 text-xs uppercase tracking-tight">
              Field Visual Analysis
            </span>
            <span className="text-[10px] font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded-full">
              Optional
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Add a photo of this field to help AquaTwin understand visible crop and canopy conditions.
          </p>
        </div>
      </div>

      {/* Upload & Preset Options */}
      {!selectedImage ? (
        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <label className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold cursor-pointer transition-all shadow-2xs">
              <Upload className="w-3.5 h-3.5 text-cyan-600" />
              <span>Upload Field Photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            <label className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-bold cursor-pointer transition-all shadow-2xs">
              <Camera className="w-3.5 h-3.5 text-sky-700" />
              <span>Take Photo</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          {/* Quick Demo Samples */}
          <div className="pt-2 border-t border-slate-200/60">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1.5">
              Or pick sample field photo for demo:
            </span>
            <div className="flex flex-wrap gap-2">
              {SAMPLE_FIELD_PHOTOS.map((sample) => (
                <button
                  type="button"
                  key={sample.id}
                  onClick={() => handleSelectSample(sample.url)}
                  className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:border-cyan-400 text-slate-700 text-[11px] transition-colors"
                >
                  <ImageIcon className="w-3 h-3 text-slate-400" />
                  <span>{sample.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview & Analysis Card */
        <div className="space-y-3">
          <div className="flex items-start gap-4 p-3 bg-white rounded-xl border border-slate-200 shadow-2xs">
            <img
              src={selectedImage}
              alt="Field Preview"
              className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg border border-slate-200 shrink-0"
            />
            <div className="flex-1 space-y-2">
              <div className="flex justify-between items-start">
                <span className="font-bold text-slate-800 text-xs">
                  Photo Attached for {fieldName}
                </span>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="text-slate-400 hover:text-rose-600 p-1 transition-colors"
                  title="Remove Photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              {!visualAnalysis && (
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs shadow-2xs transition-all active:scale-98"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAnalyzing ? 'Analyzing Field Visuals...' : 'Analyze Field'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* VISUAL INSIGHT CARD (Section 12 requirement) */}
          {visualAnalysis && (
            <div className="bg-white rounded-xl p-4 border border-cyan-300 shadow-xs space-y-3 animate-in fade-in duration-200">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <div className="flex items-center space-x-1.5 text-cyan-900 font-extrabold text-xs uppercase tracking-tight">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Field Visual Insight</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">
                  Confidence: <strong className="text-slate-700">{visualAnalysis.confidence}</strong>
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Crop Appearance</span>
                  <span className="font-bold text-slate-800">{visualAnalysis.cropAppearance}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Surface Condition</span>
                  <span className="font-bold text-slate-800">{visualAnalysis.surfaceCondition}</span>
                </div>
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                  <span className="text-slate-400 block text-[10px]">Visible Crop Stress</span>
                  <span className="font-bold text-slate-800">{visualAnalysis.visibleStress}</span>
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="font-bold text-slate-900 mr-1">Observation:</span>
                {visualAnalysis.observation}
              </div>

              <div className="flex items-start space-x-1.5 text-[10px] text-slate-400 italic">
                <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0 mt-0.5" />
                <span>{visualAnalysis.disclaimer}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
