import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Compass,
  Anchor,
  ArrowLeft,
  ArrowRight,
  Ship,
  Phone,
  FileText,
  MapPin,
  LifeBuoy,
  AlertOctagon
} from 'lucide-react';
import { languageStore, Language } from '../services/languageStore';

export const NotFoundPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  return (
    <div
      className="min-h-[80vh] bg-gradient-to-b from-[#07172C] via-[#0B2545] to-[#07172C] text-white flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Nautical Compass Rose background watermark */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
        <Compass className="w-[600px] h-[600px] text-sky-200" />
      </div>

      <div className="max-w-2xl w-full bg-[#0B2545]/90 border border-white/15 rounded-3xl p-8 sm:p-12 shadow-2xl backdrop-blur-md relative z-10 text-center">
        {/* Radar Icon & Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono font-bold uppercase tracking-wider mb-6">
          <AlertOctagon className="w-4 h-4 animate-pulse" />
          <span>{isAr ? 'خطأ ملاحي 404 • السفينة خارج المسار' : 'Error 404 • Vessel Off Course'}</span>
        </div>

        {/* Big 404 Display */}
        <div className="relative mb-6">
          <h1 className="text-7xl sm:text-9xl font-black font-cinzel tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-300 to-amber-500 drop-shadow-lg">
            404
          </h1>
          <div className="flex items-center justify-center gap-2 text-xs font-mono text-sky-300/80 mt-1">
            <Compass className="w-3.5 h-3.5 text-amber-400" />
            <span>SUEZ V-ZONE ANCHORAGE: LAT 29°55'N / LON 32°33'E</span>
          </div>
        </div>

        {/* Title & Explanatory Text */}
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          {isAr ? 'النقطة الملاحية غير موجودة على الخارطة' : 'Waypoint Not Found on Nautical Chart'}
        </h2>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
          {isAr
            ? 'المسار أو الصفحة التي تحاول الوصول إليها قد تم نقلها، أو لم تعد متوفرة في قنوات التوجيه الحالية. برجاء العودة إلى قناة السويس الرئيسية أو مراجعة مكتب العمليات.'
            : 'The navigational route or page coordinates you requested do not exist or have shifted anchorage. Please set course back to the Suez Operations Bridge.'}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-10">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? 'العودة لغرفة القيادة الرئيسية' : 'Return to Operations Bridge'}</span>
          </Link>

          <Link
            to="/get-a-quote"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/15 transition-all"
          >
            <FileText className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'طلب تسعير سريع (60 دقيقة)' : '60-Min Fast RFQ Quote'}</span>
          </Link>
        </div>

        {/* Helpful Waypoints Grid */}
        <div className="pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <Link
            to="/services"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <Ship className="w-4 h-4 text-sky-400" />
            <span>{isAr ? 'الخدمات البحرية' : 'Marine Services'}</span>
          </Link>

          <Link
            to="/ports"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>{isAr ? 'الموانئ المصرية' : 'Egyptian Ports'}</span>
          </Link>

          <Link
            to="/client-portal"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <LifeBuoy className="w-4 h-4 text-amber-400" />
            <span>{isAr ? 'بوابة التوكيل والربان' : 'Client Portal'}</span>
          </Link>

          <Link
            to="/contact"
            className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-colors flex flex-col items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <Phone className="w-4 h-4 text-rose-400" />
            <span>{isAr ? 'مكتب العمليات 24/7' : '24/7 Dispatch'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
