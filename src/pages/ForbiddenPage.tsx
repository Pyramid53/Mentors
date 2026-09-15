import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldAlert,
  Lock,
  ArrowLeft,
  ArrowRight,
  KeyRound,
  ShieldCheck,
  Building2,
  Phone,
  UserCheck
} from 'lucide-react';
import { languageStore, Language } from '../services/languageStore';

export const ForbiddenPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  return (
    <div
      className="min-h-[80vh] bg-gradient-to-b from-[#061224] via-[#091D36] to-[#061224] text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Background Security Shield Watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <ShieldAlert className="w-[580px] h-[580px] text-amber-300" />
      </div>

      <div className="max-w-2xl w-full bg-[#0B2545]/90 border border-amber-500/25 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md relative z-10 text-center">
        {/* Clearance Alert Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>{isAr ? 'تصريح أمني مطلوب • كود 403' : 'Security Clearance Required • Error 403'}</span>
        </div>

        {/* Big 403 Display */}
        <div className="relative mb-6">
          <h1 className="text-7xl sm:text-9xl font-black font-cinzel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-amber-400 to-rose-500 drop-shadow-lg">
            403
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-300/80 mt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span>SUEZ CANAL AUTHORITY • RESTRICTED DISPATCH ZONE</span>
          </div>
        </div>

        {/* Title & Explanatory Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {isAr ? 'منطقة عمليات محظورة - الدخول غير مصرح به' : 'Restricted Anchorage & Operations Zone'}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          {isAr
            ? 'يتطلب الوصول إلى لوحة تحكم عمليات السويس والتخليص الجمركي وتوزيع لنشات التموين تصريحاً أمنياً معتمداً من إدارة مينتورز مارين.'
            : 'Access to the Suez Operations Dispatch Console, Customs Manifests, and Launch Boat Scheduling requires authorized officer clearance.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            to="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            <KeyRound className="w-4 h-4" />
            <span>{isAr ? 'تسجيل دخول ضباط العمليات' : 'Officer Clearance Login'}</span>
          </Link>

          <Link
            to="/client-portal"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
          >
            <UserCheck className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'بوابة التوكيلات الملاحية (العملاء)' : 'Client / Superintendent Portal'}</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm transition-all"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'الرئيسية' : 'Public Bridge'}</span>
          </Link>
        </div>

        {/* Security Notice Footer */}
        <div className="pt-6 border-t border-white/10 text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-500" />
            <span>Port of Suez Customs Free Zone &bull; Security Level MARSEC-1</span>
          </div>
          <Link to="/contact" className="text-amber-400 hover:underline inline-flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5" />
            <span>{isAr ? 'طلب مساعدة العمليات' : 'Contact Suez Operations Desk'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
