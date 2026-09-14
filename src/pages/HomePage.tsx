import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  ShieldCheck,
  Ship,
  CheckCircle2,
  Play,
  ArrowRight,
  Package,
  Wrench,
  Coffee,
  Compass,
  Radio,
  MapPin,
  ChevronRight,
  Sparkles,
  Anchor,
  Phone,
  Award
} from 'lucide-react';
import { VideoModal } from '../components/VideoModal';
import { languageStore, Language } from '../services/languageStore';
import mentorsSupplyBoat from '../assets/images/mentors_supply_boat_1789321730085.jpg';
import mentorsProvisionDock from '../assets/images/mentors_provision_dock_1789321743086.jpg';

export const HomePage: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  return (
    <div className="w-full bg-white font-sans" id="home-page-container">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[620px] lg:min-h-[700px] bg-[#07172C] flex items-center overflow-hidden">
        {/* Maritime Vessel Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={mentorsSupplyBoat}
            alt="Mentors Marine vessel supply boat operating in the Suez Canal"
            className="w-full h-full object-cover object-center brightness-[0.45] contrast-125"
            referrerPolicy="no-referrer"
          />
          {/* Subtle Deep Navy Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#07172C] via-[#07172C]/85 to-transparent"></div>
          {/* Subtle Nautical Grid Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 w-full">
          <div className="max-w-2xl text-white space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold tracking-wide text-sky-200 shadow-sm">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>
                {isAr
                  ? 'تموين السفن بموانئ قناة السويس والبحر الأحمر • 24/7'
                  : 'SUEZ CANAL & RED SEA PORTS CHANDLERY • 24/7'}
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-cinzel leading-tight text-white">
              {isAr ? (
                <>
                  محطة تموين السفن <br />
                  <span className="text-sky-300">بقناة السويس</span> <br />
                  <span className="text-[#C81D25] tracking-wider">على مدار 24/7</span>
                </>
              ) : (
                <>
                  Your Suez <br />
                  <span className="text-sky-300">Provisioning Desk</span> <br />
                  <span className="text-[#C81D25] tracking-wider">24/7</span>
                </>
              )}
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-200 font-medium tracking-wide">
              {languageStore.t('hero_sub')}
            </p>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
              {isAr
                ? 'خدمات تموين بحري متكاملة توفر اللحوم المعتمدة حلال، الخضروات والفواكه الطازجة، مخازن الجفاف، وقطع الغيار الفنية المعتمدة بحسب كود IMPA لكافة السفن العابرة لقناة السويس ومناطق الانتظار.'
                : 'Full-service ship chandlery delivering certified fresh & frozen provisions, bonded stores, and IMPA technical hardware to vessels transiting the Suez Canal, Port Said, and Gulf of Suez anchorages.'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2.5 bg-[#C81D25] hover:bg-[#a8161d] text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 rounded-xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95 border border-red-500/30"
              >
                <span>{languageStore.t('hero_cta_quote')}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>

              <Link
                to="/services"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm sm:text-base px-6 py-3.5 rounded-xl border border-white/30 backdrop-blur-md transition-all active:scale-95"
              >
                <Package className="w-4 h-4 text-sky-300" />
                <span>{languageStore.t('nav_services')}</span>
              </Link>

              <button
                type="button"
                onClick={() => setIsVideoModalOpen(true)}
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-300 hover:text-white px-3 py-3 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center text-amber-400">
                  <Play className="w-4 h-4 fill-current ml-0.5" />
                </div>
                <span>{isAr ? 'شاهد فيديو العمليات' : 'Watch Operations Video'}</span>
              </button>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>{isAr ? 'عروض أسعار خلال 60 دقيقة' : '60-Min Guaranteed RFQ'}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'معتمد ISO 22000 و HACCP' : 'HACCP & ISO Certified'}</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FIVE ICON FEATURE CHIPS */}
      <section className="bg-slate-50 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Fresh Provisions */}
            <Link
              to="/services#provisions"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  {languageStore.t('feat_fresh')}
                </h4>
                <p className="text-[11px] text-slate-500">{isAr ? 'لحوم وخضروات' : 'Provisions'}</p>
              </div>
            </Link>

            {/* 2. Technical Stores */}
            <Link
              to="/services#technical-stores"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  {languageStore.t('feat_tech')}
                </h4>
                <p className="text-[11px] text-slate-500">{isAr ? 'أكواد IMPA & ISSA' : 'IMPA & ISSA'}</p>
              </div>
            </Link>

            {/* 3. Beverages & Dry Stores */}
            <Link
              to="/services#dry-stores"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  {languageStore.t('feat_dry')}
                </h4>
                <p className="text-[11px] text-slate-500">{isAr ? 'أرز وزيوت ومياه' : 'Dry Provisions'}</p>
              </div>
            </Link>

            {/* 4. 24/7 Service */}
            <Link
              to="/contact"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  {languageStore.t('feat_247')}
                </h4>
                <p className="text-[11px] text-slate-500">{isAr ? 'غرفة عمليات السويس' : 'Operations Desk'}</p>
              </div>
            </Link>

            {/* 5. Suez & Red Sea Ports */}
            <Link
              to="/ports"
              className="col-span-2 sm:col-span-1 bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3.5 group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  {languageStore.t('feat_ports')}
                </h4>
                <p className="text-[11px] text-slate-500">{isAr ? 'الموانئ والمخطاف' : 'All Ports & Roads'}</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. NUMERICAL STATS BAND */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x lg:divide-x-reverse divide-slate-100">
            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight" dir="ltr">
                <span className="inline-block unicode-isolate font-mono">500+</span>
              </span>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mt-1">
                {languageStore.t('stat_vessels')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{isAr ? 'بمختلف أنواعها وحمولاتها' : 'Across Suez Canal transit'}</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight" dir="ltr">
                <span className="inline-block unicode-isolate font-mono">50+</span>
              </span>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mt-1">
                {languageStore.t('stat_clients')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{isAr ? 'ملاك سفن وشركات إدارة' : 'Top shipowners & managers'}</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#C81D25] block font-cinzel tracking-tight" dir="ltr">
                <span className="inline-block unicode-isolate font-mono">24/7</span>
              </span>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mt-1">
                {languageStore.t('stat_support')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{isAr ? 'جاهزية مستمرة للنشات التوريد' : 'Continuous launch readiness'}</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight" dir="ltr">
                <span className="inline-block unicode-isolate font-mono">100%</span>
              </span>
              <p className="text-sm font-semibold text-slate-700 uppercase tracking-wider mt-1">
                {languageStore.t('stat_quality')}
              </p>
              <p className="text-xs text-slate-400 mt-0.5">{isAr ? 'سلسلة تبريد معتمدة HACCP' : 'HACCP cold chain guarantee'}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SECTION */}
      <section className="py-16 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C81D25]">
                <Anchor className="w-4 h-4" />
                <span>{isAr ? 'عن مينتورز مارين بروفيجينز' : 'About Mentors Marine Provisions'}</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight font-cinzel leading-tight">
                {isAr ? 'تموين السفن الموثوق عبر قناة السويس' : 'Supplying Vessels Around the World'}
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                {isAr
                  ? 'تأسست مينتورز مارين لتقديم حلول تموين بحري عالمية المستوى تلبي أعلى متطلبات الملاك ومديري السفن. من خلال أسطول شاحنات مبردة ولنشات تموين سريعة مرخصة، نضمن وصول الطلبيات في التوقيت الدقيق دون أدنى تأخير في رحلة العبور.'
                  : 'Founded in Suez, Mentors Marine Provisions delivers world-class ship chandlery tailored to vessel masters and fleet managers. With our dedicated reefer fleet and licensed port launch boats, we guarantee punctual delivery right to your anchorage or berth without delaying transit schedules.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">
                      {isAr ? 'عرض أسعار خلال 60 دقيقة' : '60-Min Quotation SLA'}
                    </strong>
                    <span className="text-xs text-slate-500">
                      {isAr ? 'تسعير رسمي وسريع لطلبات التوريد' : 'Fast-track pricing for urgent calls'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-sm font-bold text-slate-900">
                      {isAr ? 'سلسلة تبريد معتمدة' : 'HACCP Certified Chain'}
                    </strong>
                    <span className="text-xs text-slate-500">
                      {isAr ? 'حفظ درجات الحرارة حتى التسليم' : 'Zero-break reefer transport to ship'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#0B2545] hover:text-[#C81D25] transition-colors"
                >
                  <span>{isAr ? 'اقرأ المزيد عن شركتنا وأسطولنا' : 'Read more about our company and fleet'}</span>
                  <ChevronRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200">
                <img
                  src={mentorsProvisionDock}
                  alt="Mentors Marine provisions supply vessel and harbor loading dock"
                  className="w-full h-[400px] object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    {isAr ? 'مركز السويس اللوجستي' : 'Suez Logistics Hub'}
                  </span>
                  <h3 className="text-xl font-bold font-cinzel mt-1">
                    {isAr ? 'أسطول جاهز لخدمة قوافل الشمال والجنوب' : 'Ready For Northbound & Southbound Convoys'}
                  </h3>
                  <p className="text-xs text-slate-200 mt-1">
                    {isAr
                      ? 'بورتوفيق • مخططاف السويس • العين السخنة • الأدبية • بورسعيد'
                      : 'Port Tawfik • Suez Anchorage • Ain Sokhna • Adabiya • Port Said'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Modal */}
      {isVideoModalOpen && (
        <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
      )}
    </div>
  );
};
