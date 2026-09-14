import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
  Clock,
  Sparkles,
  Package,
  Layers,
  Phone
} from 'lucide-react';
import { MOCK_SERVICES } from '../data/mockData';
import { ServiceDetail } from '../types';
import { ServiceModal } from '../components/ServiceModal';
import { languageStore, Language } from '../services/languageStore';

export const ServicesPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<ServiceDetail | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  const handleOpenService = (service: ServiceDetail) => {
    setSelectedService(service);
    setModalOpen(true);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-16 font-sans" id="services-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header (Blueprint Page 4) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Package className="w-3.5 h-3.5 text-sky-600" />
            <span>{isAr ? 'خدمات تموين وتوريدات بحرية شاملة' : 'Full-Spectrum Ship Chandler Services'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            {languageStore.t('nav_services')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2 font-medium">
            {isAr
              ? 'من المؤن والأغذية الطازجة إلى قطع الغيار والعدد الفنية، نوفر كل ما يلزم سفينتكم وطاقمها.'
              : 'From fresh provisions to technical stores, we deliver everything your vessel needs.'}
          </p>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            {isAr
              ? 'تُغلّف كافة المواد الغذائية والمؤن بما يتوافق مع اللوائح الصحية لمنظمة الصحة العالمية (WHO) وتُنقل عبر لنشات مبردة رقمياً مباشرة إلى رافعة السفينة.'
              : 'All provisions are packaged in compliance with WHO International Health Regulations and delivered in temperature-controlled reefer launches directly to your shipboard crane.'}
          </p>
        </div>

        {/* 2x3 Grid of Service Cards (Blueprint Page 4) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_SERVICES.map((service) => (
            <div
              key={service.id}
              id={service.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
            >
              {/* Card Image */}
              <div className="relative h-56 overflow-hidden bg-slate-900">
                <img
                  src={service.image}
                  alt={isAr ? (service.titleAr || service.title) : service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                {/* Badge */}
                <span className={`absolute top-3 ${isAr ? 'right-3' : 'left-3'} bg-[#0B2545] text-white text-[11px] font-bold px-3 py-1 rounded-md shadow`}>
                  {isAr ? (service.badgeAr || service.badge) : service.badge}
                </span>

                {/* Title inside bottom of photo for visual punch */}
                <h3 className="absolute bottom-3 left-4 right-4 text-xl font-bold text-white tracking-wide font-cinzel">
                  {isAr ? (service.titleAr || service.title) : service.title}
                </h3>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {isAr ? (service.shortDescAr || service.shortDesc) : service.shortDesc}
                </p>

                {/* Bullet highlights */}
                <ul className="space-y-1.5 text-xs text-slate-700 pt-1">
                  {((isAr && service.featuresAr) ? service.featuresAr : service.features).slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="line-clamp-1">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Card Actions (Learn More -> and Request Quote) */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => handleOpenService(service)}
                    className="text-sm font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 group/btn"
                  >
                    <span>{isAr ? 'تفاصيل الخدمة' : 'Learn More'}</span>
                    <ArrowRight className={`w-4 h-4 transition-transform ${isAr ? 'rotate-180 group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'}`} />
                  </button>

                  <Link
                    to={`/get-a-quote?service=${encodeURIComponent(isAr ? (service.titleAr || service.title) : service.title)}`}
                    className="bg-red-50 hover:bg-[#D0201E] text-[#D0201E] hover:text-white font-bold text-xs px-3.5 py-1.5 rounded-md transition-colors"
                  >
                    {isAr ? 'طلب تسعير' : 'Quote This'}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* IMPA & ISSA Catalog Standard Banner */}
        <div className="mt-16 bg-[#0B2545] text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.15),transparent_70%)] pointer-events-none"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-sky-300 block">
                {isAr ? 'مشتريات بحرية موحدة ومطابقة للكتالوجات العالمية' : 'Standardized Marine Purchasing'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel">
                {isAr ? 'مطابقة وفهرسة أكواد IMPA و ISSA بالكامل' : 'Full IMPA & ISSA Cross-Referencing'}
              </h3>
              <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? 'أرسل لنا طلبيتك مع أكواد IMPA أو ISSA المكونة من 6 أرقام. يقوم نظام التسعير الفوري بمطابقة البنود والتحقق من توفرها بمستودعاتنا بالسويس والإسكندرية وبورسعيد لتفادي أي أخطاء أو تأخير.'
                  : 'Send us your requisition with standard 6-digit IMPA or ISSA item numbers. Our automated quotation engine cross-checks warehouse availability in Suez, Alexandria, and Port Said to eliminate discrepancies and misdelivered parts.'}
              </p>
              <div className="flex flex-wrap gap-4 text-xs text-slate-300 pt-2">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{isAr ? 'شهادات اختبار المصنع وشهادات هيئات التصنيف' : 'Exact Mill Test & Class Certificates'}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isAr ? 'جاهزية كاملة للتوريد الليلي الطارئ' : 'Emergency Night Dispatch Available'}</span>
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <Link
                to="/get-a-quote"
                className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-center text-sm py-3.5 px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>{isAr ? 'إرسال قائمة الطلبات (Requisition)' : 'Upload Requisition List'}</span>
                <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
              </Link>
              <a
                href="tel:+201008924477"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-center text-sm py-3.5 px-6 rounded-xl border border-white/20 transition-colors flex items-center justify-center gap-2"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'اتصل بغرفة العمليات 24/7' : 'Call 24/7 Operations Desk'}</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceModal
        service={selectedService}
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setSelectedService(null);
        }}
      />
    </div>
  );
};
