import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Radio,
  ExternalLink,
  Lock
} from 'lucide-react';
import { languageStore, Language } from '../services/languageStore';
import { authStore } from '../services/authStore';

export const Footer: React.FC = () => {
  const [lang, setLang] = useState<Language>(languageStore.getLanguage());
  const [currentUser, setCurrentUser] = useState(authStore.getCurrentUser());

  useEffect(() => {
    const unsubLang = languageStore.subscribe((l) => setLang(l));
    const unsubAuth = authStore.subscribe((u) => setCurrentUser(u));
    return () => {
      unsubLang();
      unsubAuth();
    };
  }, []);

  const isAr = lang === 'ar';

  return (
    <footer className="bg-[#081426] text-slate-300 border-t border-slate-800/80" id="main-footer">
      {/* Upper CTA Banner */}
      <div className="bg-[#050D1A] border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-red-400 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  {isAr
                    ? 'هل تحتاج إلى عرض أسعار فوري لعبور قناة السويس؟'
                    : 'Need an Immediate Quotation for Suez Transit?'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  {isAr
                    ? 'فريق العمليات متواجد على مدار 24 ساعة لتقديم أفضل الأسعار خلال 60 دقيقة فقط.'
                    : 'Our 24/7 provisioning desk guarantees a tailored, competitive price within 60 minutes.'}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/201008924477"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-md"
              >
                <span>{isAr ? 'واتساب العمليات 24/7' : 'WhatsApp 24/7 Ops'}</span>
              </a>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2 bg-[#C81D25] hover:bg-[#a8161d] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg active:scale-95"
              >
                <span>{isAr ? 'طلب عرض أسعار (60 دقيقة)' : 'Get a Quote in 60 Mins'}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-amber-400">
                <Anchor className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white font-cinzel">
                  MENTORS
                </span>
                <p className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
                  MARINE PROVISIONS
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              {languageStore.t('footer_about')}
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-white font-medium">
                  {isAr ? 'مراقبة اللاسلكي: قنوات VHF 16 / 73' : 'VHF Marine Watch: Channel 16 / 73'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {isAr ? 'نداء العمليات:' : 'Callsign:'}{' '}
                <strong className="text-slate-200 font-semibold">MENTORS SUEZ SUPPLY</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>ISO 22000 & HACCP</span>
              </span>
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded-lg text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>IMPA / ISSA Registered</span>
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {isAr ? 'المؤن والخدمات' : 'Our Provisions'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/services#provisions" className="hover:text-white transition-colors">
                  {languageStore.t('nav_fresh_provisions')}
                </Link>
              </li>
              <li>
                <Link to="/services#dry-stores" className="hover:text-white transition-colors">
                  {languageStore.t('nav_dry_stores')}
                </Link>
              </li>
              <li>
                <Link to="/services#technical-stores" className="hover:text-white transition-colors">
                  {languageStore.t('nav_tech_stores')}
                </Link>
              </li>
              <li>
                <Link to="/services#bonded-stores" className="hover:text-white transition-colors">
                  {languageStore.t('nav_bonded')}
                </Link>
              </li>
              <li>
                <Link to="/services#crew-welfare" className="hover:text-white transition-colors">
                  {languageStore.t('nav_crew_welfare')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Ports We Serve */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {languageStore.t('nav_ports')}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/ports#suez-port" className="hover:text-white transition-colors">
                  {languageStore.t('nav_suez_port')}
                </Link>
              </li>
              <li>
                <Link to="/ports#ain-sokhna" className="hover:text-white transition-colors">
                  {languageStore.t('nav_sokhna')}
                </Link>
              </li>
              <li>
                <Link to="/ports#adabiya" className="hover:text-white transition-colors">
                  {languageStore.t('nav_adabiya')}
                </Link>
              </li>
              <li>
                <Link to="/ports#suez-anchorage" className="hover:text-white transition-colors">
                  {languageStore.t('nav_anchorage')}
                </Link>
              </li>
              <li>
                <Link to="/ports#port-said" className="hover:text-white transition-colors">
                  {languageStore.t('nav_port_said')}
                </Link>
              </li>
              <li>
                <Link to="/ports#damietta" className="hover:text-white transition-colors">
                  {languageStore.t('nav_damietta')}
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Operations Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              {isAr ? 'غرفة العمليات 24/7' : '24/7 Operations Desk'}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>
                  {isAr
                    ? 'المركز البحري، بورتوفيق، محافظة السويس، جمهورية مصر العربية'
                    : 'Maritime Center, Port Tawfik, Suez Governorate, Egypt'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+201008924477" className="hover:text-white font-mono">
                  +20 100 892 4477
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-mono">+20 62 333 4567</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:operations@mentors-marine.com" className="hover:text-white">
                  operations@mentors-marine.com
                </a>
              </div>
              <div className="pt-2 flex flex-col gap-1.5">
                <Link
                  to="/track-vessel"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white font-medium"
                >
                  <span>{isAr ? 'فتح رادار تتبع السفن' : 'Open Live Vessel Tracker'}</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                {/* Only visible if staff is logged in */}
                {currentUser?.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-1.5 text-xs text-amber-300 hover:text-white font-bold"
                  >
                    <span>{isAr ? 'مكتب العمليات (للموظفين)' : 'Staff Operations Desk'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Tagline separator banner */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-200">
            {languageStore.t('footer_tagline')}
          </p>
          <p className="font-script text-2xl sm:text-3xl text-amber-300 mt-2">
            Supplying Today For a Better Tomorrow
          </p>
        </div>

        {/* Bottom copyright & status */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Mentors Marine Provisions S.A.E. {languageStore.t('footer_rights')}</p>
          <div className="flex items-center gap-4">
            <Link to="/why-us#food-safety" className="hover:text-slate-200">
              {isAr ? 'سياسة سلامة الغذاء' : 'Food Safety Policy'}
            </Link>
            <span>•</span>
            <Link to="/why-us#certifications" className="hover:text-slate-200">
              {isAr ? 'شهادات الجودة' : 'Quality Certifications'}
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200">
              {isAr ? 'عمليات السويس' : 'Suez Operations'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
