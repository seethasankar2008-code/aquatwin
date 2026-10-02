import React, { useState } from 'react';
import { Droplets, Phone, KeyRound, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Globe } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Language } from '../../types/farm';

interface AuthScreenProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ language, onLanguageChange }) => {
  const { isConfigured, sendOtp, verifyOtp, enterGuestMode } = useAuth();

  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('+91 ');
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const isTa = language === 'ta';

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const clean = phone.trim();
    if (clean.length < 10) {
      setErrorMessage(isTa ? 'செல்லுபடியாகும் கைபேசி எண்ணை உள்ளிடவும்.' : 'Please enter a valid mobile number with country code.');
      return;
    }

    setIsLoading(true);
    const res = await sendOtp(clean);
    setIsLoading(false);

    if (res.success) {
      setSuccessMessage(res.message);
      setStep('otp');
    } else {
      setErrorMessage(res.message);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (otp.trim().length < 6) {
      setErrorMessage(isTa ? '6 இலக்க சரிபார்ப்புக் குறியீட்டை உள்ளிடவும்.' : 'Please enter the 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    const res = await verifyOtp(phone.trim(), otp.trim());
    setIsLoading(false);

    if (!res.success) {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-sky-50/40 flex flex-col justify-center items-center px-4 py-8 relative">
      {/* Language Switcher in Corner */}
      <div className="absolute top-5 right-5 z-20 flex items-center bg-white/90 border border-sky-200/90 rounded-lg p-0.5 text-xs shadow-xs">
        <Globe className="w-3.5 h-3.5 text-water-600 ml-1.5 mr-1" />
        <button
          onClick={() => onLanguageChange('en')}
          className={`px-2 py-0.5 rounded font-bold transition-all ${
            language === 'en' ? 'bg-water-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => onLanguageChange('ta')}
          className={`px-2 py-0.5 rounded font-bold transition-all font-tamil ${
            language === 'ta' ? 'bg-water-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          தமிழ்
        </button>
      </div>

      {/* Main Login Card */}
      <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-2xl p-6 sm:p-8 border border-sky-200/90 shadow-xl shadow-sky-950/5 relative z-10 animate-in fade-in duration-300">
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-water-600 flex items-center justify-center text-white shadow-md shadow-water-600/30 mb-3">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-black font-display tracking-tight text-sky-950">
            AQUATWIN
          </h1>
          <p className="text-xs font-bold text-water-700 uppercase tracking-widest mt-0.5">
            {isTa ? 'பண்ணை நீர் மேலாண்மை இயங்குதளம்' : 'Farm Water Operating System'}
          </p>
          <p className="text-xs text-slate-600 mt-2 max-w-xs font-medium">
            {isTa
              ? 'உங்கள் பண்ணை கணக்கில் உள்நுழைந்து துல்லியமான நீர் ஒதுக்கீடு பரிந்துரைகளைப் பெறுங்கள்.'
              : 'Log in with your mobile number to access your digital farm twin and water plans.'}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* STEP 1: Mobile Phone Number Input */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                {isTa ? 'கைபேசி எண்' : 'Mobile Phone Number'}
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-sky-300 text-sm font-semibold text-slate-900 bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 focus:bg-white transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 inline shrink-0" />
                <span>{isTa ? 'பாதுகாப்பான OTP சரிபார்ப்பு அனுப்பப்படும்' : 'Secure OTP verification will be sent'}</span>
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-water-600 hover:bg-water-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-water-600/20 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isTa ? 'அனுப்பப்படுகிறது...' : 'Sending OTP...'}</span>
                </>
              ) : (
                <>
                  <span>{isTa ? 'OTP பெறுக' : 'Send OTP'}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        )}

        {/* STEP 2: 6-Digit OTP Verification */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  {isTa ? '6 இலக்க குறியீடு' : '6-Digit Verification Code'}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setOtp('');
                    setErrorMessage(null);
                  }}
                  className="text-xs text-water-700 hover:underline font-bold"
                >
                  {isTa ? 'எண்ணை மாற்று' : 'Change Number'}
                </button>
              </div>

              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  maxLength={6}
                  required
                  autoFocus
                  placeholder="123456"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg border border-sky-300 text-lg font-black tracking-widest text-center text-sky-950 bg-sky-50/40 focus:outline-none focus:ring-2 focus:ring-water-500/20 focus:border-water-500 focus:bg-white transition-all font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1.5 text-center font-medium">
                {isTa ? `${phone} என்ற எண்ணிற்கு அனுப்பப்பட்ட குறியீட்டை உள்ளிடவும்` : `Enter the verification code sent to ${phone}`}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="w-full flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all active:scale-98 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{isTa ? 'சரிபார்க்கிறது...' : 'Verifying...'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isTa ? 'சரிபார்த்து உள்நுழைக' : 'Verify & Access Farm'}</span>
                </>
              )}
            </button>
          </form>
        )}

        {/* Development & Testing Info Badge */}
        <div className="mt-6 pt-5 border-t border-sky-100 text-center space-y-2">
          {!isConfigured && (
            <div className="p-2.5 rounded-lg bg-amber-50/90 border border-amber-200 text-left text-[11px] text-amber-900">
              <p className="font-bold flex items-center gap-1 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Supabase Configuration Pending</span>
              </p>
              <p className="text-[10px] text-amber-700 mt-0.5">
                Add <code className="bg-amber-100 px-1 rounded font-mono">VITE_SUPABASE_URL</code> and <code className="bg-amber-100 px-1 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 rounded font-mono">.env</code>.
              </p>
            </div>
          )}

          {/* Guest / Simulation Mode Button */}
          <button
            type="button"
            onClick={enterGuestMode}
            className="w-full flex items-center justify-center space-x-1.5 py-2 px-3 rounded-lg bg-sky-100/70 hover:bg-sky-100 text-sky-900 font-bold text-xs border border-sky-200/90 transition-all active:scale-98"
          >
            <Sparkles className="w-3.5 h-3.5 text-water-600" />
            <span>{isTa ? 'சோதனை / மாதிரி முறையில் காண்க' : 'Explore in Simulation / Demo Mode'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
