import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Clock,
  UploadCloud,
  FileText,
  CheckCircle2,
  Phone,
  MessageSquare,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Ship,
  Sparkles,
  RefreshCw,
  Plus,
  Trash2,
  Download,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { QuoteFormData } from '../types';
import { requestStore } from '../services/requestStore';
import { languageStore, Language } from '../services/languageStore';

export const GetAQuotePage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service');
  const initialVessel = searchParams.get('vessel');
  const initialIMO = searchParams.get('imo');
  const initialTab = searchParams.get('tab') === 'list' ? 'list' : 'basic';

  const [activeTab, setActiveTab] = useState<'basic' | 'list' | 'additional'>(initialTab);

  // Form State
  const [formData, setFormData] = useState<QuoteFormData>({
    vesselName: initialVessel || '',
    imoNumber: initialIMO || '',
    portOfCall: 'Suez Anchorage (V-Zone)',
    etaDate: '2026-05-14',
    etaTime: '14:30',
    services: initialService ? [initialService] : ['Provisions', 'Dry Stores & Beverages'],
    fileName: '',
    fileSize: '',
    selectedItems: ['Mineral Water 1.5L (Case of 12)', 'Fresh Table Eggs Grade AA', 'USDA Boneless Beef (Halal)'],
    crewNationalities: 'Mixed (Filipino, European, Indian)',
    priority: 'Standard (60 Min)',
    additionalNotes: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    companyName: '',
  });

  // Upload simulation state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedQuoteId, setSubmittedQuoteId] = useState<string | null>(null);

  // Common provision catalog items for quick-tagging
  const commonItemsEn = [
    'Mineral Water 1.5L (Case of 12)',
    'USDA Boneless Beef (Halal)',
    'Whole Chicken Grade A (Frozen)',
    'Fresh Table Eggs Grade AA',
    'Basmati Long Grain Rice 25KG',
    'Fresh Egyptian Citrus & Bananas',
    'Engine Oil 15W40 (208L Drum)',
    'Mooring Rope 8-Strand 56mm x 220m',
    'Marlboro Red Cigarettes (Duty Free)',
    '4G Suez Transit Data SIM Card (100GB)',
  ];

  const commonItemsAr = [
    'مياه معدنية 1.5 لتر (كرتونة 12 زجاجة)',
    'لحوم بقري حلال فاخرة بالعظم وبدون عظم',
    'دجاج مجمد كامل نخب أول',
    'بيض مائدة طازج نخب ممتاز AA',
    'أرز بسمتي هندي حبة طويلة 25 كجم',
    'حمضيات وموز وفواكه مصرية طازجة',
    'زيوت محركات بحرية 15W40 (برميل 208 لتر)',
    'حبال رباط وتراكي 8 جدلات 56 مم × 220 م',
    'سجائر مارلبورو أحمر (بضائع حرة معفاة)',
    'شريحة بيانات إنترنت 4G لعبور السويس (100 جيجابايت)',
  ];

  const commonItems = isAr ? commonItemsAr : commonItemsEn;

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => {
      const exists = prev.services.includes(serviceName);
      return {
        ...prev,
        services: exists
          ? prev.services.filter((s) => s !== serviceName)
          : [...prev.services, serviceName],
      };
    });
  };

  const handleItemToggle = (item: string) => {
    setFormData((prev) => {
      const exists = prev.selectedItems.includes(item);
      return {
        ...prev,
        selectedItems: exists
          ? prev.selectedItems.filter((i) => i !== item)
          : [...prev.selectedItems, item],
      };
    });
  };

  const handleSimulatedFileUpload = (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setFormData((f) => ({
            ...f,
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
          }));
          return 100;
        }
        return prev + 25;
      });
    }, 120);
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulatedFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleSimulatedFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Persist into store
    const saved = requestStore.addQuoteRequest(formData);

    // Simulate 1.2s loading state
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedQuoteId(saved.id);
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }, 1000);
  };

  const serviceCheckboxes = isAr
    ? [
        { key: 'Fresh & Frozen Provisions', label: 'المؤن الغذائية الطازجة والمجمدة' },
        { key: 'Dry Stores & Beverages', label: 'المخازن الجافة والمشروبات' },
        { key: 'Technical Stores (IMPA)', label: 'المهمات الفنية والميكانيكية (IMPA)' },
        { key: 'Bonded Stores & Tobacco', label: 'البضائع الجمركية والتبغ والمعفى' },
        { key: 'Crew Welfare & SIMs', label: 'خدمات الطاقم وشرائح الإنترنت 4G' },
        { key: 'Safety & Marine Chemicals', label: 'السلامة البحرية والكيماويات والزيوت' },
      ]
    : [
        { key: 'Fresh & Frozen Provisions', label: 'Fresh & Frozen Provisions' },
        { key: 'Dry Stores & Beverages', label: 'Dry Stores & Beverages' },
        { key: 'Technical Stores (IMPA)', label: 'Technical Stores (IMPA)' },
        { key: 'Bonded Stores & Tobacco', label: 'Bonded Stores & Tobacco' },
        { key: 'Crew Welfare & SIMs', label: 'Crew Welfare & SIMs' },
        { key: 'Safety & Marine Chemicals', label: 'Safety & Marine Chemicals' },
      ];

  const priorityOptions = isAr
    ? [
        { key: 'Standard (60 Min)', label: 'عادي (خلال 60 دقيقة)' },
        { key: 'Urgent (< 30 Min)', label: 'عاجل (أقل من 30 دقيقة)' },
        { key: 'Anchorage Delivery', label: 'تسليم فوري في المخطاف' },
      ]
    : [
        { key: 'Standard (60 Min)', label: 'Standard (60 Min)' },
        { key: 'Urgent (< 30 Min)', label: 'Urgent (< 30 Min)' },
        { key: 'Anchorage Delivery', label: 'Anchorage Delivery' },
      ];

  return (
    <div className="w-full bg-slate-50 min-h-screen py-10 sm:py-14 font-sans" id="get-a-quote-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header (Blueprint Page 2) */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#D0201E] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Clock className="w-4 h-4" />
            <span>{isAr ? 'ضمان سرعة الرد والتسعير' : 'Fast Turnaround Guarantee'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            {isAr ? 'احصل على عرض سعر خلال 60 دقيقة' : 'Get a Quotation in 60 Minutes'}
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            {isAr
              ? 'أرسل لنا متطلبات واحتياجات سفينتكم وسنوافيكم بعرض أسعار تنافسي مفصل ومطابق لأكواد IMPA بأسرع وقت.'
              : 'Send us your requirements and we will provide a competitive quotation as soon as possible.'}
          </p>
        </div>

        {/* Success Confirmation Modal / Card if submitted */}
        {submittedQuoteId ? (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-emerald-200 p-8 text-center animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
              {isAr ? 'تم استلام طلب التسعير بنجاح' : 'Request Received Successfully'}
            </span>
            <h2 className="text-2xl font-bold text-[#0B2545] font-cinzel mt-3">
              {isAr ? (
                <>
                  طلب عرض سعر رقم <span dir="ltr" className="inline-block unicode-isolate font-mono">{submittedQuoteId}</span>
                </>
              ) : (
                `Quotation Request ${submittedQuoteId}`
              )}
            </h2>
            <p className="text-slate-600 text-sm mt-2 max-w-md mx-auto leading-relaxed">
              {isAr ? (
                <>
                  استلمت غرفة عمليات السويس 24/7 قائمة الاحتياجات الخاصة بسفينة{' '}
                  <strong className="text-slate-900 font-semibold">{formData.vesselName || 'سفينتكم'}</strong> الراسية أو المتجهة إلى{' '}
                  <strong className="text-slate-900 font-semibold">{formData.portOfCall}</strong>.
                </>
              ) : (
                <>
                  Our 24/7 Suez Operations Desk has received the requisition for{' '}
                  <strong className="text-slate-900 font-semibold">{formData.vesselName || 'your vessel'}</strong> calling at{' '}
                  <strong className="text-slate-900 font-semibold">{formData.portOfCall}</strong>.
                </>
              )}
            </p>

            {/* Countdown / Guarantee Pill */}
            <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  {isAr ? 'زمن الرد المضمون' : 'Guaranteed Response'}
                </span>
                <span className="text-emerald-700 font-bold text-sm flex items-center gap-1 mt-0.5">
                  <Clock className="w-4 h-4" />
                  <span>{isAr ? 'خلال 60 دقيقة' : 'Within 60 Minutes'}</span>
                </span>
              </div>
              <div className="h-8 w-px bg-slate-200"></div>
              <div>
                <span className="text-slate-400 block uppercase font-bold text-[10px]">
                  {isAr ? 'ضابط النوبة المكلف' : 'Duty Officer Assigned'}
                </span>
                <span className="text-[#0B2545] font-bold text-sm mt-0.5 block">
                  {isAr ? 'كابتن طارق (عمليات السويس)' : 'Capt. Tarek (Suez Desk)'}
                </span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <a
                href={`https://wa.me/201008924477?text=Hello%20Mentors%20Marine,%20following%20up%20on%20quote%20request%20${submittedQuoteId}%20for%20vessel%20${encodeURIComponent(formData.vesselName || 'Vessel')}`}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{isAr ? 'تأكيد المتابعة عبر واتساب' : 'Confirm on WhatsApp'}</span>
              </a>

              <Link
                to="/services"
                className="bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2 shadow border border-sky-400/40"
              >
                <span>{isAr ? 'استعراض خدمات التموين البحري' : 'View Marine Provisions Services'}</span>
                {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </Link>

              <button
                onClick={() => {
                  setSubmittedQuoteId(null);
                  setFormData((prev) => ({ ...prev, fileName: '', fileSize: '' }));
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-5 py-2.5 rounded-lg transition-colors cursor-pointer"
              >
                {isAr ? 'تقديم طلب تسعير آخر' : 'Submit Another Request'}
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Layout (Form on Left, Stepper & Support on Right) */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* LEFT COLUMN: Tabbed Form (8 Cols on desktop) */}
            <div className="lg:col-span-8 bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden">
              {/* Tabs header */}
              <div className="flex border-b border-slate-200 bg-slate-100/70 p-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('basic')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'basic'
                      ? 'bg-white text-[#0B2545] shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-[#0B2545] hover:bg-white/60'
                  }`}
                >
                  <Ship className="w-4 h-4 text-sky-600" />
                  <span>{isAr ? '١. بيانات السفينة' : '1. Basic Info'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'list'
                      ? 'bg-white text-[#0B2545] shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-[#0B2545] hover:bg-white/60'
                  }`}
                >
                  <UploadCloud className="w-4 h-4 text-[#D0201E]" />
                  <span>{isAr ? '٢. قائمة المؤن والمهمات' : '2. Provision List'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('additional')}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    activeTab === 'additional'
                      ? 'bg-white text-[#0B2545] shadow-sm border border-slate-200'
                      : 'text-slate-600 hover:text-[#0B2545] hover:bg-white/60'
                  }`}
                >
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>{isAr ? '٣. التواصل والملاحظات' : '3. Additional Info'}</span>
                </button>
              </div>

              {/* Tab Forms Content */}
              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
                {/* TAB 1: BASIC INFO */}
                {activeTab === 'basic' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'اسم السفينة' : 'Vessel Name'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isAr ? 'مثال: ANJI FORTUNE' : 'e.g. ANJI FORTUNE'}
                          value={formData.vesselName}
                          onChange={(e) => setFormData({ ...formData, vesselName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'رقم المنظمة البحرية الدولية (IMO)' : 'IMO Number'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 9281234"
                          value={formData.imoNumber}
                          onChange={(e) => setFormData({ ...formData, imoNumber: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800 font-mono"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'ميناء الرسو / المخطاف' : 'Port of Call / Anchorage'} <span className="text-red-500">*</span>
                        </label>
                        <select
                          value={formData.portOfCall}
                          onChange={(e) => setFormData({ ...formData, portOfCall: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800 bg-white"
                        >
                          <option value="Suez Anchorage (V-Zone)">
                            {isAr ? 'مخطاف السويس (منطقة الانتظار V / المخطاف الجنوبي)' : 'Suez Anchorage (V-Zone / South)'}
                          </option>
                          <option value="Port of Suez / Port Tawfik">
                            {isAr ? 'ميناء السويس وبورتوفيق' : 'Port of Suez & Port Tawfik'}
                          </option>
                          <option value="Ain Sokhna Port">
                            {isAr ? 'ميناء العين السخنة' : 'Ain Sokhna Port'}
                          </option>
                          <option value="Adabiya Commercial Port">
                            {isAr ? 'ميناء الأدبية التجاري' : 'Adabiya Commercial Port'}
                          </option>
                          <option value="Port Said (Northbound Convoy)">
                            {isAr ? 'بورسعيد (قافلة الشمال)' : 'Port Said (Northbound Convoy)'}
                          </option>
                          <option value="Port Said West / East SCCT">
                            {isAr ? 'ميناء شرق وغرب بورسعيد (محطة الحاويات SCCT)' : 'Port Said East (SCCT) / West'}
                          </option>
                          <option value="Damietta Port">
                            {isAr ? 'ميناء دمياط' : 'Damietta Port'}
                          </option>
                          <option value="Alexandria / Dekheila">
                            {isAr ? 'ميناء الإسكندرية والدخيلة' : 'Alexandria / Dekheila'}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'موعد الوصول المتوقع (ETA)' : 'Estimated Time of Arrival (ETA)'} <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-2" dir="ltr">
                          <input
                            type="date"
                            required
                            value={formData.etaDate}
                            onChange={(e) => setFormData({ ...formData, etaDate: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-xs text-slate-800 bg-white"
                          />
                          <input
                            type="time"
                            required
                            value={formData.etaTime}
                            onChange={(e) => setFormData({ ...formData, etaTime: e.target.value })}
                            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-xs text-slate-800 bg-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Services Required Checkboxes */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                        {isAr ? 'الخدمات والمؤن المطلوبة (اختر كل ما ينطبق)' : 'Services Required (Check all that apply)'} <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {serviceCheckboxes.map((item) => {
                          const isChecked = formData.services.includes(item.key);
                          return (
                            <label
                              key={item.key}
                              onClick={() => handleServiceToggle(item.key)}
                              className={`flex items-center gap-2.5 p-3 rounded-lg border text-xs cursor-pointer select-none transition-all ${
                                isChecked
                                  ? 'bg-blue-50 border-blue-400 text-[#0B2545] font-bold shadow-xs'
                                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => {}}
                                className="w-4 h-4 text-[#0B2545] rounded focus:ring-0"
                              />
                              <span>{item.label}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className="bg-[#0B2545] hover:bg-[#12345C] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <span>{isAr ? 'المتابعة لقائمة المؤن' : 'Continue to Provision List'}</span>
                        {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 2: PROVISION LIST */}
                {activeTab === 'list' && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <div>
                      <h3 className="text-sm font-bold text-[#0B2545] mb-1">
                        {isAr ? 'رفع ملف قائمة الاحتياجات والطلبيات' : 'Upload Your Requisition Document'}
                      </h3>
                      <p className="text-xs text-slate-500 mb-3">
                        {isAr
                          ? 'يقبل ملفات Excel (.xlsx, .xls)، PDF، Word (.docx)، أو كشوفات الجرد المصورة.'
                          : 'Accepts standard PDF, Excel (.xlsx, .xls), Word (.docx), or scanned inventory sheets.'}
                      </p>

                      {/* Drag & Drop Upload Container */}
                      <div
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={handleFileDrop}
                        className="border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-8 text-center bg-slate-50/70 transition-colors relative"
                      >
                        <input
                          type="file"
                          id="provision-file-input"
                          onChange={handleFileInputChange}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept=".pdf,.xlsx,.xls,.doc,.docx,.csv,.jpg,.png"
                        />
                        <div className="flex flex-col items-center justify-center pointer-events-none">
                          <div className="w-14 h-14 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                            <UploadCloud className="w-7 h-7" />
                          </div>
                          <p className="text-sm font-bold text-slate-800">
                            {isAr ? 'اسحب وأفلت ملف الطلبية وقائمة المؤن هنا' : 'Drag & drop your requisition file here'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {isAr ? (
                              <>أو <span className="text-sky-600 underline font-semibold">تصفح الملفات</span> من جهازك</>
                            ) : (
                              <>or <span className="text-sky-600 underline font-semibold">browse files</span> from your computer</>
                            )}
                          </p>
                          <span className="text-[10px] text-slate-400 mt-2" dir="ltr">
                            PDF, Excel, Word, or Image (Max 25MB)
                          </span>
                        </div>
                      </div>

                      {/* Upload Progress Bar (Simulated) */}
                      {isUploading && (
                        <div className="mt-3 bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="font-semibold text-slate-700">
                              {isAr ? 'جارٍ رفع ملف الطلبية...' : 'Uploading requisition file...'}
                            </span>
                            <span className="font-mono text-sky-600 font-bold" dir="ltr">{uploadProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden" dir="ltr">
                            <div
                              className="bg-[#D0201E] h-full transition-all duration-150"
                              style={{ width: `${uploadProgress}%` }}
                            ></div>
                          </div>
                        </div>
                      )}

                      {/* File Name Chip if uploaded */}
                      {formData.fileName && !isUploading && (
                        <div className="mt-3 bg-emerald-50 border border-emerald-200 p-3 rounded-lg flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <FileText className="w-4 h-4 text-emerald-600" />
                            <span className="font-bold text-emerald-900">{formData.fileName}</span>
                            <span className="text-emerald-700 font-mono" dir="ltr">({formData.fileSize})</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, fileName: '', fileSize: '' })}
                            className="text-slate-400 hover:text-red-500 p-1 cursor-pointer"
                            title={isAr ? 'حذف الملف' : 'Remove file'}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Quick Add Common Items */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                          {isAr ? 'أو اختر من التوريدات القياسية الشائعة' : 'Or Select Common Standard Supplies'}
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">
                          {isAr
                            ? `تم تحديد ${formData.selectedItems.length} صنف`
                            : `${formData.selectedItems.length} items checked`}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto p-1 border border-slate-200 rounded-lg bg-white">
                        {commonItems.map((item) => {
                          const isSelected = formData.selectedItems.includes(item);
                          return (
                            <div
                              key={item}
                              onClick={() => handleItemToggle(item)}
                              className={`flex items-center justify-between p-2 rounded cursor-pointer text-xs transition-colors ${
                                isSelected ? 'bg-sky-50 text-sky-900 font-semibold' : 'text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <span>{item}</span>
                              {isSelected ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                              ) : (
                                <Plus className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab('basic')}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5"
                      >
                        {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        <span>{isAr ? 'العودة لبيانات السفينة' : 'Back to Basic Info'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab('additional')}
                        className="bg-[#0B2545] hover:bg-[#12345C] text-white text-xs sm:text-sm font-bold px-6 py-2.5 rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                      >
                        <span>{isAr ? 'المتابعة لبيانات التواصل والملاحظات' : 'Continue to Notes & Contact'}</span>
                        {isAr ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {/* TAB 3: ADDITIONAL INFO */}
                {activeTab === 'additional' && (
                  <div className="space-y-5 animate-in fade-in duration-200">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'اسم المسؤول بالكامل' : 'Your Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          placeholder={isAr ? 'مثال: القبطان جيمس ميلر' : 'e.g. Capt. James Miller'}
                          value={formData.contactName}
                          onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          placeholder="master.anjifortune@shipping.com"
                          value={formData.contactEmail}
                          onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                          dir="ltr"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'رقم الواتساب / الهاتف المباشر' : 'Direct WhatsApp / Mobile Phone'} <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          required
                          placeholder="+20 100 892 4477"
                          value={formData.contactPhone}
                          onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                          dir="ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                          {isAr ? 'شركة الملاحة / مدير السفينة' : 'Shipping Company / Ship Manager'}
                        </label>
                        <input
                          type="text"
                          placeholder={isAr ? 'مثال: Apex Marine Management Ltd.' : 'e.g. Apex Marine Management Ltd.'}
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                        />
                      </div>
                    </div>

                    {/* Priority speed */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {isAr ? 'أولوية وسرعة التسعير' : 'Quotation Urgency'}
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {priorityOptions.map((p) => (
                          <button
                            type="button"
                            key={p.key}
                            onClick={() => setFormData({ ...formData, priority: p.key as any })}
                            className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                              formData.priority === p.key
                                ? 'bg-[#0B2545] text-white border-[#0B2545]'
                                : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {p.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Additional Notes Textarea */}
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                        {isAr ? 'ملاحظات إضافية / اشتراطات خاصة' : 'Additional Notes / Special Requirements'}
                      </label>
                      <textarea
                        rows={3}
                        placeholder={
                          isAr
                            ? 'أي طلبات خاصة: شهادات حلال، بوالص الجمارك، تفضيل لنش تبريد، مواصفات وجبات الطاقم...'
                            : 'Any special requests: Halal certification requirements, customs bonded delivery notes, reefer launch preference, crew diet notes...'
                        }
                        value={formData.additionalNotes}
                        onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                      ></textarea>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveTab('list')}
                        className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer flex items-center gap-1.5"
                      >
                        {isAr ? <ArrowRight className="w-3.5 h-3.5" /> : <ArrowLeft className="w-3.5 h-3.5" />}
                        <span>{isAr ? 'العودة لقائمة المؤن' : 'Back to Provision List'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Primary Submit Button */}
                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#D0201E] hover:bg-[#b01716] text-white font-extrabold text-base tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>{isAr ? 'جارٍ الإرسال إلى غرفة عمليات السويس...' : 'Sending to 24/7 Operations Desk...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isAr ? 'إرسال طلب عرض السعر الآن' : 'Submit Request'}</span>
                        {isAr ? <ArrowLeft className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
                      </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      {isAr
                        ? 'بدون أي التزام. أسعار شفافة مطابقة لأكواد IMPA/ISSA تسلم لكم خلال 60 دقيقة.'
                        : 'No obligation. Transparent IMPA/ISSA pricing delivered within 60 minutes.'}
                    </span>
                  </p>
                </div>
              </form>
            </div>

            {/* RIGHT COLUMN: Process Stepper & Immediate Assistance Card */}
            <div className="lg:col-span-4 space-y-6">
              {/* Vertical Process Stepper */}
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-md">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#0B2545] mb-5 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D0201E]" />
                  <span>{isAr ? 'كيف تتم عملية التسعير؟' : 'How It Works'}</span>
                </h3>

                <div className="space-y-6 relative before:absolute before:inset-0 before:start-3.5 before:w-0.5 before:bg-slate-200 before:z-0">
                  {/* Step 1 */}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                      1
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        {isAr ? 'إرسال طلبكم' : 'Submit Your Request'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAr
                          ? 'املأ بيانات السفينة وارفع ملف قائمة الاحتياجات أو اختر الأصناف.'
                          : 'Fill in the form and upload your requisition list.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-[#0B2545] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                      2
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        {isAr ? 'المراجعة والتحقق' : 'We Review'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAr
                          ? 'يتحقق فريقنا في السويس من توفر المخزون والجودة الطازجة والمواصفات.'
                          : 'Our Suez chandlery team checks stock, fresh quality, and specifications.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-[#D0201E] text-white font-bold text-xs flex items-center justify-center shrink-0 shadow animate-pulse">
                      3
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#D0201E]">
                        {isAr ? 'استلام عرض الأسعار' : 'Get Your Quotation'}
                      </h4>
                      <p className="text-xs text-slate-600 font-medium mt-0.5">
                        {isAr
                          ? 'تستلم عرض سعر تفصيلي شامل الأسعار والبنود خلال 60 دقيقة.'
                          : 'Receive a comprehensive, itemized quote within 60 minutes.'}
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex items-start gap-4 relative z-10">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow">
                      4
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0B2545]">
                        {isAr ? 'التأكيد والتسليم' : 'Confirmation & Delivery'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {isAr
                          ? 'نجهز الطلبية وننقلها بلنشات التوريد مباشرة إلى رصيف أو مخطاف سفينتكم.'
                          : 'We arrange supply boat or quay delivery directly to your vessel.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Immediate Assistance Card */}
              <div className="bg-gradient-to-br from-[#0B2545] to-[#12345C] text-white rounded-2xl p-6 shadow-md">
                <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300 block mb-1">
                  {isAr ? 'متطلب عاجل لقافلة العبور؟' : 'Urgent Convoy Requirement?'}
                </span>
                <h3 className="text-lg font-bold text-white font-cinzel">
                  {isAr ? 'هل تحتاج إلى مساعدة فورية؟' : 'Need Immediate Assistance?'}
                </h3>
                <p className="text-xs text-slate-300 mt-1 mb-4 leading-relaxed">
                  {isAr
                    ? 'تواصل مباشرة مع ضباط الصعود الميدانيين على مدار 24 ساعة لتلبية أي مؤن طارئة قبل مغادرة القافلة.'
                    : 'Contact our round-the-clock boarding officers directly for last-minute provisions before convoy departure.'}
                </p>

                <div className="bg-white/10 rounded-xl p-3 mb-4 space-y-1">
                  <span className="text-[11px] text-slate-300 block">
                    {isAr ? 'الخط الساخن لعمليات السويس:' : 'Suez Operations Hotline:'}
                  </span>
                  <a
                    href="tel:+201008924477"
                    className="text-base sm:text-lg font-bold text-white hover:text-sky-300 flex items-center gap-2"
                    dir="ltr"
                  >
                    <Phone className="w-4 h-4 text-sky-400" />
                    <span className="inline-block unicode-isolate font-mono">+20 100 892 4477</span>
                  </a>
                  <span className="text-[10px] text-slate-400 block" dir="ltr">
                    VHF: Ch 16 / Ch 73 "Mentors Supply"
                  </span>
                </div>

                {/* Green WhatsApp-Style Button */}
                <a
                  href="https://wa.me/201008924477?text=Hello%20Mentors%20Marine,%20I%20need%20urgent%20provisions%20quotation%20for%20my%20vessel%20at%20Suez."
                  target="_blank"
                  rel="noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>{isAr ? 'واتساب العمليات مباشرة' : 'WhatsApp Us Directly'}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
