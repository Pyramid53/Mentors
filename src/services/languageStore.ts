// src/services/languageStore.ts
// Centralized bilingual localization store for Mentors Marine Services

export type Language = 'en' | 'ar';

type Listener = (lang: Language) => void;

const LANG_STORAGE_KEY = 'mentors_marine_lang';

export const translations = {
  en: {
    // Navigation
    nav_home: 'Home',
    nav_about: 'About Us',
    nav_services: 'Our Services',
    nav_all_services: 'All Provisions & Stores Overview',
    nav_fresh_provisions: 'Fresh & Frozen Provisions',
    nav_dry_stores: 'Dry Stores & Beverages',
    nav_tech_stores: 'Deck & Engine Technical Stores',
    nav_bonded: 'Bonded Stores',
    nav_crew_welfare: 'Crew Welfare & Connectivity',
    nav_quote: 'Get a Quote',
    nav_quote_instant: 'Instant 60-Min Quotation',
    nav_quote_upload: 'Upload Requisition List',
    nav_quote_catalog: 'IMPA Catalog & Pricing',
    nav_ports: 'Ports We Serve',
    nav_all_ports: 'All Egyptian Ports & Anchorages',
    nav_suez_port: 'Port of Suez & Port Tawfik',
    nav_sokhna: 'Ain Sokhna Deepwater Port',
    nav_adabiya: 'Adabiya Commercial Port',
    nav_anchorage: 'Suez Anchorage (V-Zone)',
    nav_port_said: 'Port Said (North Convoy)',
    nav_damietta: 'Damietta & Alexandria Ports',
    nav_why_us: 'Why Us',
    nav_advantages: 'Our Key Advantages',
    nav_certifications: 'HACCP & ISO Certifications',
    nav_food_safety: 'Quality & Food Safety Protocols',
    nav_track: 'Track Vessel',
    nav_track_map: 'Live Suez Canal AIS Map',
    nav_track_arrivals: 'Expected Vessel Arrivals (7 Days)',
    nav_track_status: 'Check Vessel Requisition Status',
    nav_contact: 'Contact Us',
    nav_portal: 'Client Portal',
    nav_login: 'Client Sign In',
    nav_my_account: 'My Fleet & Orders',
    nav_sign_out: 'Sign Out',
    nav_staff_desk: 'Staff Operations',
    nav_cta_quote: 'Request Quotation',

    // Top Utility Bar
    top_fast_quote: '60-Min Fast Quotation',
    top_vhf: 'VHF Ch 16 / 73 Watch',
    top_suez_time: 'Suez Dispatch 24/7',
    top_hotline: '24/7 Marine Ops: +20 100 892 4477',
    top_trusted: 'ISO 22000 & HACCP Certified',
    top_lang_en: 'English',
    top_lang_ar: 'العربية',

    // Hero Section
    hero_badge: 'PREMIER SUEZ CANAL SHIP CHANDLERS & TECHNICAL SUPPLIERS',
    hero_title_1: 'Precision Ship Supplies & Provisions at',
    hero_title_2: 'Suez Canal & Egyptian Ports',
    hero_desc: 'ISO 22000 & HACCP certified marine supplier delivering top-grade fresh provisions, bonded stores, deck & engine spares, and fresh water directly to vessels at anchor or alongside berths 24/7.',
    hero_sub: 'Fresh Supplies. Reliable Service. Global Standards.',
    feat_fresh: 'Fresh & Frozen',
    feat_tech: 'Technical Stores',
    feat_dry: 'Beverages & Water',
    feat_247: '24/7 Operations',
    feat_ports: 'Suez & Red Sea',
    stat_vessels: 'Vessels Supplied',
    stat_clients: 'Global Clients',
    stat_support: 'Operational Support',
    stat_quality: 'Commitment to Quality',
    hero_cta_quote: 'Request 60-Min Quotation',
    hero_cta_track: 'Live Suez Vessel Tracker',
    hero_stat_time: '< 60 Mins',
    hero_stat_time_label: 'Guaranteed RFQ Turnaround',
    hero_stat_vessels: '1,250+',
    hero_stat_vessels_label: 'Vessels Supplied Annually',
    hero_stat_compliance: '100% Halal',
    hero_stat_compliance_label: '& ISO Certified Sourcing',
    hero_stat_hours: '24/7/365',
    hero_stat_hours_label: 'Continuous Launch Dispatch',

    // Quick Promise Bar
    promise_60m: '60-Minute Rapid Quotation',
    promise_60m_desc: 'Fastest RFQ response in the Suez Canal zone with transparent USD pricing.',
    promise_quality: 'Strict Temperature-Controlled Cold Chain',
    promise_quality_desc: 'Refrigerated launches and HACCP compliant handling from warehouse to ship gangway.',
    promise_ports: 'All Egyptian Commercial Ports & Roads',
    promise_ports_desc: 'Full coverage of Suez Anchorage, Port Said, Ain Sokhna, Adabiya, Damietta, and Alexandria.',

    // Common labels
    btn_submit: 'Submit Request',
    btn_cancel: 'Cancel',
    btn_search: 'Search',
    btn_view_details: 'View Details',
    label_vessel_name: 'Vessel Name',
    label_imo: 'IMO Number',
    label_port: 'Port of Call / Anchorage',
    label_eta: 'Estimated Time of Arrival (ETA)',
    label_priority: 'Urgency Priority',
    label_services: 'Requested Supplies & Stores',
    label_contact_name: 'Contact Person',
    label_contact_email: 'Official Email',
    label_contact_phone: 'Phone / WhatsApp',
    label_company: 'Shipping Company / Agency',
    label_status: 'Status',
    status_pending: 'Pending Review',
    status_under_review: 'Under Review',
    status_quoted: 'Quoted',
    status_dispatched: 'Dispatched',
    status_delivered: 'Delivered',
    priority_standard: 'Standard (12-24h)',
    priority_urgent: 'Urgent (< 30 Min Transit Call)',

    // Footer
    footer_tagline: 'Your Suez Provisioning Desk – 24/7 | Fresh Supplies | Global Standards | Trusted Maritime Partner',
    footer_about: 'Suez-based premier ship chandler providing 24/7 fresh, frozen, dry, technical, and bonded provisions directly to vessels transiting the Suez Canal and calling all major Egyptian ports.',
    footer_rights: 'All rights reserved.',
    footer_callsign: 'Callsign: MENTORS SUEZ SUPPLY'
  },
  ar: {
    // Navigation
    nav_home: 'الرئيسية',
    nav_about: 'من نحن',
    nav_services: 'خدماتنا البحرية',
    nav_all_services: 'نظرة شاملة لكافة المؤن والقطع الفنية',
    nav_fresh_provisions: 'المؤن الطازجة والمجمدة',
    nav_dry_stores: 'المؤن الجافة والمشروبات',
    nav_tech_stores: 'مهمات السطح والمحركات الفنية',
    nav_bonded: 'المخازن الجمركية الحرة (بوندد)',
    nav_crew_welfare: 'خدمات راحة الطاقم والاتصالات',
    nav_quote: 'طلب عرض أسعار',
    nav_quote_instant: 'عرض أسعار فوري خلال 60 دقيقة',
    nav_quote_upload: 'تحميل كشف احتياجات السفينة',
    nav_quote_catalog: 'كتالوج الأسعار ودليل IMPA',
    nav_ports: 'الموانئ المخدومة',
    nav_all_ports: 'جميع الموانئ والمراسي المصرية',
    nav_suez_port: 'ميناء السويس وبورتوفيق',
    nav_sokhna: 'ميناء العين السخنة للحاويات',
    nav_adabiya: 'ميناء الأدبية التجاري',
    nav_anchorage: 'منطقة انتظار السويس (V-Zone)',
    nav_port_said: 'بورسعيد (قافلة الشمال)',
    nav_damietta: 'موانئ دمياط والإسكندرية',
    nav_why_us: 'لماذا تختارنا',
    nav_advantages: 'أهم مزايانا التنافسية',
    nav_certifications: 'شهادات الآيزو والهاسب (HACCP & ISO)',
    nav_food_safety: 'معايير سلامة الأغذية البحرية',
    nav_track: 'تتبع السفن',
    nav_track_map: 'خريطة رادار قناة السويس الحية (AIS)',
    nav_track_arrivals: 'السفن المتوقع وصولها (7 أيام)',
    nav_track_status: 'استعلام حالة طلب المؤن للسفينة',
    nav_contact: 'اتصل بنا',
    nav_portal: 'بوابة العملاء',
    nav_login: 'دخول العملاء',
    nav_my_account: 'أسطولي وطلباتي',
    nav_sign_out: 'تسجيل الخروج',
    nav_staff_desk: 'مكتب العمليات (للموظفين)',
    nav_cta_quote: 'طلب عرض أسعار',

    // Top Utility Bar
    top_fast_quote: 'عرض أسعار خلال 60 دقيقة',
    top_vhf: 'مراقبة اللاسلكي VHF قنوات 16 / 73',
    top_suez_time: 'عمليات السويس على مدار 24 ساعة',
    top_hotline: 'غرفة العمليات البحرية: 4477 892 100 20+',
    top_trusted: 'معتمدون دولياً ISO 22000 & HACCP',
    top_lang_en: 'English',
    top_lang_ar: 'العربية',

    // Hero Section
    hero_badge: 'رواد تموين السفن وتوريدات الملاحة بقناة السويس والموانئ المصرية',
    hero_title_1: 'تموين السفن باحترافية وسرعة فائقة في',
    hero_title_2: 'قناة السويس وكافة الموانئ المصرية',
    hero_desc: 'شركة توريدات بحرية معتمدة بشهادات ISO 22000 وHACCP، نقدم أجود المؤن الطازجة، المخازن الحرة، قطع غيار السطح والمحرك والمياه العذبة مباشرة إلى السفن في المخطاف أو على الأرصفة 24/7.',
    hero_sub: 'مؤن طازجة. خدمة موثوقة. معايير عالمية.',
    feat_fresh: 'طازجة ومجمدة',
    feat_tech: 'مهمات فنية',
    feat_dry: 'مياه ومخازن جافة',
    feat_247: 'عمليات 24/7',
    feat_ports: 'السويس والبحر الأحمر',
    stat_vessels: 'سفينة تم تزويدها',
    stat_clients: 'شركة ملاحة عالمية',
    stat_support: 'دعم ميداني متواصل',
    stat_quality: 'التزام تام بالجودة',
    hero_cta_quote: 'طلب عرض أسعار خلال 60 دقيقة',
    hero_cta_track: 'تتبع حركة السفن بقناة السويس',
    hero_stat_time: '< 60 دقيقة',
    hero_stat_time_label: 'أسرع تسعير رسمي للمناقصات',
    hero_stat_vessels: '+1,250',
    hero_stat_vessels_label: 'سفينة تم تزويدها سنوياً',
    hero_stat_compliance: '100% حلال',
    hero_stat_compliance_label: 'مؤن معتمدة ومطابقة للمواصفات',
    hero_stat_hours: '24/7/365',
    hero_stat_hours_label: 'إبحار دائم بلنشات التموين',

    // Quick Promise Bar
    promise_60m: 'تسعير فوري خلال 60 دقيقة',
    promise_60m_desc: 'أسرع استجابة لتسعير احتياجات السفن بمنطقة قناة السويس بأسعار شفافة بالدولار.',
    promise_quality: 'سلسلة تبريد وحفظ فائقة الصرامة',
    promise_quality_desc: 'لنشان مبردة وتخزين مطابق لمعايير الهاسب العالمية من مستودعاتنا حتى سلم السفينة.',
    promise_ports: 'تغطية شاملة لكافة الموانئ المصرية',
    promise_ports_desc: 'خدمة كاملة في مراسي السويس، بورسعيد، العين السخنة، الأدبية، دمياط والإسكندرية.',

    // Common labels
    btn_submit: 'إرسال الطلب',
    btn_cancel: 'إلغاء',
    btn_search: 'بحث',
    btn_view_details: 'عرض التفاصيل',
    label_vessel_name: 'اسم السفينة',
    label_imo: 'رقم المنظمة البحرية (IMO)',
    label_port: 'الميناء أو المخطاف المستهدف',
    label_eta: 'الموعد المتوقع للوصول (ETA)',
    label_priority: 'درجة الأولوية والسرعة',
    label_services: 'المؤن والخدمات المطلوبة',
    label_contact_name: 'اسم المسؤول',
    label_contact_email: 'البريد الإلكتروني الرسمي',
    label_contact_phone: 'رقم الهاتف / الواتساب',
    label_company: 'الشركة المالكة أو التوكيل الملاحي',
    label_status: 'الحالة',
    status_pending: 'قيد المراجعة',
    status_under_review: 'جاري الفحص والتسعير',
    status_quoted: 'تم التسعير',
    status_dispatched: 'قيد الشحن والتسليم باللنش',
    status_delivered: 'تم التسليم على ظهر السفينة بنجاح',
    priority_standard: 'عادي (12 - 24 ساعة)',
    priority_urgent: 'عاجل جداً (< 30 دقيقة قبل العبور)',

    // Footer
    footer_tagline: 'مكتب تموين السويس على مدار الساعة | مؤن طازجة | معايير عالمية | شريك بحري موثوق',
    footer_about: 'شركة التوريدات البحرية الرائدة في السويس، تقدم المؤن الطازجة والمجمدة والجافة والمهمات الفنية والبوندد مباشرة إلى السفن العابرة لقناة السويس وفي جميع الموانئ المصرية.',
    footer_rights: 'جميع الحقوق محفوظة.',
    footer_callsign: 'نداء اللاسلكي: MENTORS SUEZ SUPPLY'
  }
};

class LanguageStore {
  private currentLang: Language = 'en';
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(LANG_STORAGE_KEY) as Language | null;
      if (stored === 'ar' || stored === 'en') {
        this.currentLang = stored;
      }
      this.applyDomAttributes(this.currentLang);
    }
  }

  public getLanguage(): Language {
    return this.currentLang;
  }

  public isRTL(): boolean {
    return this.currentLang === 'ar';
  }

  public setLanguage(lang: Language): void {
    if (this.currentLang === lang) return;
    this.currentLang = lang;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LANG_STORAGE_KEY, lang);
      } catch (e) {
        console.warn('Could not save language preference:', e);
      }
      this.applyDomAttributes(lang);
    }
    this.notifyListeners();
  }

  public toggleLanguage(): void {
    this.setLanguage(this.currentLang === 'en' ? 'ar' : 'en');
  }

  public t(key: keyof typeof translations['en']): string {
    const dict = translations[this.currentLang] || translations.en;
    return (dict as any)[key] || translations.en[key] || String(key);
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    this.listeners.forEach((fn) => {
      try {
        fn(this.currentLang);
      } catch (e) {
        console.error('Error in language listener:', e);
      }
    });
  }

  private applyDomAttributes(lang: Language): void {
    if (typeof document === 'undefined') return;
    const isAr = lang === 'ar';
    document.documentElement.dir = isAr ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    if (isAr) {
      document.body.classList.add('font-cairo');
    } else {
      document.body.classList.remove('font-cairo');
    }
  }
}

export const languageStore = new LanguageStore();
