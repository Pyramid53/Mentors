import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Ship,
  ArrowLeft,
  ArrowRight,
  Anchor
} from 'lucide-react';
import { authStore } from '../services/authStore';
import { languageStore, Language } from '../services/languageStore';

export const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password.length < 6) {
      setErrorMsg(
        isAr
          ? 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
          : 'Password must be at least 6 characters long.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg(
        isAr
          ? 'كلمتا المرور غير متطابقتين.'
          : 'Passwords do not match. Please verify and retype.'
      );
      return;
    }

    setIsSubmitting(true);
    const res = await authStore.updatePassword(password);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(
        isAr
          ? 'فشل تحديث كلمة المرور. قد تكون صلاحية رابط الاستعادة قد انتهت.'
          : (res.error || 'Failed to update password. Recovery link may have expired.')
      );
    } else {
      setSuccessMsg(
        isAr
          ? 'تم تحديث كلمة المرور بنجاح! سيتم نقلك إلى بوابة العملاء...'
          : 'Password has been reset successfully! Redirecting to client portal...'
      );
      setTimeout(() => {
        navigate('/client-portal');
      }, 2500);
    }
  };

  return (
    <div
      className="min-h-[85vh] bg-gradient-to-b from-[#061224] via-[#091D36] to-[#061224] text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Anchor className="w-[600px] h-[600px] text-sky-400" />
      </div>

      <div className="max-w-md w-full bg-[#0B2545]/95 border border-sky-500/25 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-md relative z-10">
        {/* Top Header Badge */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-500/15 border border-sky-500/30 text-sky-300 text-xs font-mono font-bold uppercase tracking-wider mb-4">
            <KeyRound className="w-3.5 h-3.5 text-amber-400" />
            <span>{isAr ? 'استعادة وتحديث كلمة المرور' : 'Secure Password Recovery'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold font-cinzel text-white mb-2">
            {isAr ? 'تعيين كلمة مرور جديدة' : 'Reset Your Password'}
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            {isAr
              ? 'أدخل كلمة مرور قوية لتأمين حساب إدارة تموين ومشتريات سفنك عبر قناة السويس والموانئ المصرية.'
              : 'Enter a new secure password for your Mentors Marine vessel procurement and dispatch account.'}
          </p>
        </div>

        {/* Feedback Messages */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <span className="font-semibold leading-relaxed">{errorMsg}</span>
          </div>
        )}

        {/* Password Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              {isAr ? 'كلمة المرور الجديدة' : 'New Password'} <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <Lock className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isAr ? '6 أحرف على الأقل' : 'At least 6 characters'}
                className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-white placeholder-slate-500`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={`absolute ${isAr ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-200`}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              {isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'} <span className="text-amber-400">*</span>
            </label>
            <div className="relative">
              <ShieldCheck className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={isAr ? 'أعد كتابة كلمة المرور' : 'Retype your new password'}
                className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-2.5 text-sm bg-slate-900/80 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-400 text-white placeholder-slate-500`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm py-3 rounded-xl shadow-lg shadow-amber-500/20 transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
          >
            <KeyRound className="w-4 h-4" />
            <span>
              {isSubmitting
                ? (isAr ? 'جارٍ حفظ كلمة المرور...' : 'Saving New Password...')
                : (isAr ? 'تأكيد وتحديث كلمة المرور' : 'Update & Save Password')}
            </span>
          </button>
        </form>

        {/* Back Link */}
        <div className="mt-6 pt-6 border-t border-white/10 text-center">
          <Link
            to="/client-portal"
            className="inline-flex items-center gap-2 text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors"
          >
            {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5 text-sky-400" />}
            <span>{isAr ? 'العودة لتسجيل الدخول في بوابة العملاء' : 'Back to Client Portal Login'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
