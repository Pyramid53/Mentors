// src/services/languageStore.ts
// Centralized bilingual localization store for Mentors Marine Services with RTL & Number formatting
import React from 'react';

export type Language = 'en' | 'ar';

type Listener = (lang: Language) => void;

const LANG_STORAGE_KEY = 'mentors_marine_lang';

export const translations = {
  en: {
    // Brand
    brand_name: 'MENTORS MARINE',
    brand_sub: 'SHIP CHANDLERS & PROVISIONS',
    brand_slogan: 'Supplying Today For a Better Tomorrow',

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
    nav_safety_chem: 'Safety & Marine Chemicals',
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
    nav_portal: 'Login',
    nav_login: 'Client Sign In',
    nav_my_account: 'My Fleet & Orders',
    nav_sign_out: 'Sign Out',
    nav_staff_desk: 'Staff Operations',
    nav_cta_quote: 'Request Quotation',
    nav_new_requisition: 'New Requisition',

    // Top Utility Bar
    top_fast_quote: '60-Min Fast Quotation',
    top_vhf: 'VHF Marine Watch: CH 16 / 73',
    top_suez_time: 'Suez Dispatch 24/7',
    top_hotline: '+20 100 892 4477',
    top_hotline_label: '24/7 Marine Ops:',
    top_trusted: 'ISO 22000 & HACCP Certified Free Zone',
    top_lang_en: 'EN',
    top_lang_ar: 'العربية',
    top_callsign: 'Callsign: MENTORS SUEZ SUPPLY',
    top_local_time: 'SUEZ EET (LOCAL TIME):',

    // Hero Section
    hero_badge: 'SUEZ CANAL & RED SEA PORTS CHANDLERY • 24/7',
    hero_title_1: 'Your Suez',
    hero_title_2: 'Provisioning Desk',
    hero_title_3: '24/7',
    hero_desc: 'Full-service ship chandlery delivering certified fresh & frozen provisions, bonded stores, and IMPA technical hardware to vessels transiting the Suez Canal, Port Said, and Gulf of Suez anchorages.',
    hero_sub: 'Fresh Supplies. Reliable Service. Global Standards.',
    feat_fresh: 'Fresh & Frozen',
    feat_fresh_sub: 'Provisions',
    feat_tech: 'Technical Stores',
    feat_tech_sub: 'IMPA & ISSA',
    feat_dry: 'Beverages & Water',
    feat_dry_sub: 'Dry Provisions',
    feat_247: '24/7 Operations',
    feat_247_sub: 'Operations Desk',
    feat_ports: 'Suez & Red Sea',
    feat_ports_sub: 'All Ports & Roads',
    stat_vessels: 'Vessels Supplied',
    stat_vessels_sub: 'Across Suez Canal transit',
    stat_clients: 'Global Clients',
    stat_clients_sub: 'Top shipowners & managers',
    stat_support: 'Operational Support',
    stat_support_sub: 'Continuous launch readiness',
    stat_quality: 'Commitment to Quality',
    stat_quality_sub: 'HACCP cold chain guarantee',
    hero_cta_quote: 'Request 60-Min Quotation',
    hero_cta_video: 'Watch Operations Video',
    hero_stat_time: '< 60 Mins',
    hero_stat_time_label: 'Guaranteed RFQ Turnaround',
    hero_stat_vessels: '1,250+',
    hero_stat_vessels_label: 'Vessels Supplied Annually',
    hero_stat_compliance: '100% Halal',
    hero_stat_compliance_label: '& ISO Certified Sourcing',
    hero_stat_hours: '24/7/365',
    hero_stat_hours_label: 'Continuous Launch Dispatch',
    hero_trust_rfq: '60-Min Guaranteed RFQ',
    hero_trust_cert: 'HACCP & ISO Certified',

    // Home About Snippet
    home_about_badge: 'About Mentors Marine Provisions',
    home_about_title: 'Supplying Vessels Around the World',
    home_about_desc: 'Founded in Suez, Mentors Marine Provisions delivers world-class ship chandlery tailored to vessel masters and fleet managers. With our dedicated reefer fleet and licensed port launch boats, we guarantee punctual delivery right to your anchorage or berth without delaying transit schedules.',
    home_about_item1_title: '60-Min Quotation SLA',
    home_about_item1_sub: 'Fast-track pricing for urgent calls',
    home_about_item2_title: 'HACCP Certified Chain',
    home_about_item2_sub: 'Zero-break reefer transport to ship',
    home_about_link: 'Read more about our company and fleet',
    home_hub_badge: 'Suez Logistics Hub',
    home_hub_title: 'Ready For Northbound & Southbound Convoys',
    home_hub_ports: 'Port Tawfik • Suez Anchorage • Ain Sokhna • Adabiya • Port Said',

    // About Page
    about_hero_badge: 'Dedicated Suez Ship Chandlers',
    about_hero_title: 'Supplying Vessels. Building Lasting Partnerships.',
    about_hero_desc: 'Founded in Suez, Egypt, Mentors Marine Provisions has grown into a premier vessel supply partner for leading shipowners, technical managers, and catering operators traversing the Suez Canal and calling Egyptian ports.',
    about_heritage_badge: 'Our Suez Canal Heritage',
    about_heritage_title: 'Strategically Positioned at the Maritime Crossroads of the World',
    about_heritage_p1: 'The Suez Canal is the artery of global trade. When a vessel transits between the Mediterranean and the Red Sea, there is zero tolerance for delay, substandard food, or missing technical stores.',
    about_heritage_p2: 'Mentors Marine Provisions was built specifically to eliminate supply friction. We operate private refrigerated warehousing, custom launch craft, and in-house customs clearing agents right at Port Tawfik and Suez port entrances.',
    about_val_precision: 'Precision & Speed',
    about_val_precision_desc: 'Every item cross-checked against IMPA/ISSA codes before dispatch.',
    about_val_safety: 'Uncompromising Food Safety',
    about_val_safety_desc: 'HACCP certified cold storage protecting crew welfare.',
    about_cta_title: 'Ready to Experience Reliable Ship Chandlery?',
    about_cta_desc: 'Send us your next requisition for Suez transit, Ain Sokhna, or Port Said and see the difference in quality and responsiveness.',
    about_cta_btn1: 'Request a Quote in 60 Mins',
    about_cta_btn2: 'Contact Operations Desk',

    // Services Page
    services_hero_badge: 'Full-Spectrum Ship Chandler Services',
    services_hero_title: 'Complete Ship Supply Solutions',
    services_hero_desc: 'From fresh provisions to technical stores, we deliver everything your vessel needs.',
    services_hero_sub: 'All provisions are packaged in compliance with WHO International Health Regulations and delivered in temperature-controlled reefer launches directly to your shipboard crane.',
    services_learn_more: 'Learn More',
    services_request_quote: 'Request Quote',
    services_overview_spec: 'Overview & Specifications',
    services_inclusions: 'Standard Inclusions & Capabilities',
    services_sample_items: 'Sample Catalog Items',
    services_catalog_hint: 'IMPA / ISSA / Custom List',
    services_col_code: 'Item Code',
    services_col_desc: 'Description',
    services_col_unit: 'Unit',
    services_fast_dispatch: 'Fast launch dispatch to all anchorages within 60 minutes of confirmation.',
    services_cta_quote: 'Request Quote for this Service',

    // Ports Page
    ports_hero_badge: 'Strategic Egyptian Maritime Coverage',
    ports_hero_title: 'Ports We Serve',
    ports_hero_desc: '24/7 provision delivery across all major Egyptian waterways, anchorages, and container terminals.',
    ports_supply_services: 'Supply Services',
    ports_launch_label: 'Launch:',
    ports_contact_agent: 'Contact Port Agent',
    ports_quote_for_port: 'Quote for this Port',
    ports_water_depth: 'Water Depth:',
    ports_type_label: 'Terminal Type:',

    // Why Us Page
    why_hero_badge: 'The Mentors Difference',
    why_hero_title: 'Why Choose Mentors?',
    why_hero_desc: 'We go beyond supply. We deliver peace of mind.',
    why_hero_sub: 'From the moment your vessel enters Egyptian territorial waters to final receipt sign-off, our Suez operations hub ensures speed, transparency, and top-tier maritime provisioning.',
    why_p1_title: 'Fast Quotation',
    why_p1_sub: 'Within 60 Minutes',
    why_p1_desc: 'We understand maritime convoy urgency. Our dedicated pricing desk processes vessel requisitions and provides comprehensive, competitive quotations within an hour.',
    why_p2_title: '24/7 Support',
    why_p2_sub: 'Always Available',
    why_p2_desc: 'Vessels do not sleep, and neither do we. Our Port Tawfik desk operates 365 days a year with active VHF monitoring on Channel 16/73 and round-the-clock boarding officers.',
    why_p3_title: 'High Quality',
    why_p3_sub: 'HACCP & ISO Certified',
    why_p3_desc: 'Only Grade-A provisions, certified Halal meats, fresh Mediterranean fruits & vegetables, and genuine OEM or IMPA-standard deck & engine equipment.',
    why_p4_title: 'Complete Coverage',
    why_p4_sub: 'All Egyptian Ports',
    why_p4_desc: 'From Port Said in the north to Suez Anchorage, Ain Sokhna, Adabiya, Damietta, and Alexandria, our reefer fleet reaches every terminal.',
    why_p5_title: 'Competitive Prices',
    why_p5_sub: 'Transparent Pricing',
    why_p5_desc: 'Zero hidden port surcharges. Clear itemized invoices in USD, direct billing with major maritime agencies, and transparent exchange rates.',
    why_p6_title: 'Multi-Lingual Team',
    why_p6_sub: 'English & Arabic Desk',
    why_p6_desc: 'Seamless maritime communication with international masters, superintendents, and chief stewards in English and Arabic.',
    why_certs_badge: 'International Accreditations',
    why_certs_title: 'Certified Standards & Compliance',
    why_certs_desc: 'We operate under strict global maritime health, safety, and purchasing standards.',
    why_testimonials_badge: 'Captain & Superintendent Feedback',
    why_testimonials_title: 'Trusted by Global Fleets',

    // Get a Quote Page
    quote_hero_badge: 'Guaranteed 60-Minute Response',
    quote_hero_title: 'Request a Vessel Quotation',
    quote_hero_desc: 'Submit your vessel requisition list or select supplies below for immediate pricing in the Suez Canal & Egyptian ports.',
    quote_tab_basic: '1. Vessel & Port Information',
    quote_tab_list: '2. Provision List & Items',
    quote_tab_additional: '3. Urgency & Contact Details',
    quote_vessel_name: 'Vessel Name',
    quote_vessel_name_ph: 'e.g., MSC ORION',
    quote_imo: 'IMO Number (7 Digits)',
    quote_imo_ph: 'e.g., 9857145',
    quote_port: 'Port of Call / Anchorage',
    quote_eta_date: 'Expected Arrival Date (ETA)',
    quote_eta_time: 'Arrival Time (Local Cairo EET)',
    quote_select_services: 'Requested Supplies (Select all that apply)',
    quote_upload_title: 'Upload Requisition File (Excel / PDF / Word)',
    quote_upload_desc: 'Drag and drop your ship requisition list or click to browse files',
    quote_upload_support: 'Supports .xlsx, .xls, .pdf, .docx, .csv (Max 15MB)',
    quote_quick_items: 'Quick Select Popular Provision Items',
    quote_custom_item: 'Add Custom Item / IMPA Code',
    quote_custom_item_ph: 'e.g., IMPA 232115 - Mooring Rope 56mm x 220m',
    quote_btn_add: 'Add Item',
    quote_priority: 'Urgency Priority',
    quote_p_standard: 'Standard (Quotation within 60 Minutes)',
    quote_p_urgent: 'Urgent Transit (< 30 Mins Before Convoy Entry)',
    quote_p_anchorage: 'Anchorage Waiting (Launch Delivery at Sea)',
    quote_crew_nat: 'Crew Nationalities / Catering Requirements',
    quote_crew_nat_ph: 'e.g., Mixed Filipino, European, Indian (Halal)',
    quote_notes: 'Additional Notes / Master Special Requests',
    quote_notes_ph: 'Crane capacity, boarding launch preferences, customs bonded requests...',
    quote_contact_name: 'Contact Person / Title',
    quote_contact_name_ph: 'e.g., Capt. John Smith / Chief Steward',
    quote_contact_email: 'Official Business Email',
    quote_contact_email_ph: 'master.orion@fleet.com',
    quote_contact_phone: 'Phone / WhatsApp Number',
    quote_contact_phone_ph: '+20 100 892 4477',
    quote_company: 'Shipping Line / Agency Company',
    quote_company_ph: 'e.g., Mediterranean Shipping Company (MSC)',
    quote_btn_submit: 'Submit Quotation Request (60-Min SLA)',
    quote_submitting: 'Processing & Dispatching to Suez Desk...',
    quote_success_title: 'Quotation Request Received Successfully!',
    quote_success_ref: 'Reference Quote ID:',
    quote_success_msg: 'Our Port Tawfik operations desk has received your requisition. Our boarding officers and pricing team are preparing your itemized USD quotation within 60 minutes.',
    quote_success_track: 'Track in Account',
    quote_success_new: 'Submit Another Requisition',

    // Contact Page
    contact_hero_badge: '24/7 Suez Operations Desk',
    contact_hero_title: 'Get in Touch',
    contact_hero_desc: 'We are always ready to support your vessel.',
    contact_hero_sub: 'Whether your ship is steaming towards Suez, anchored in the waiting zone, or scheduled for next month’s convoy, our port officers are on standby 24/7.',
    contact_office_title: 'Head Office — Suez, Egypt',
    contact_office_sub: 'Global Maritime Support',
    contact_address_label: 'Maritime Operations Center',
    contact_address: 'Port Tawfik Free Zone, Suez Canal Authority Gateway, Suez Governorate, Egypt',
    contact_hotline_label: '24/7 Hotline & Emergency Boarding',
    contact_landline_label: 'Port Tawfik Office Desk',
    contact_vhf_label: 'Suez VHF Marine Watch',
    contact_vhf_val: 'VHF Channel 16 / 73',
    contact_email_label: 'Operations Inquiries & RFQs',
    contact_form_title: 'Send a Message / Direct Operational Inquiry',
    contact_input_name: 'Full Name',
    contact_input_company: 'Shipping Company / Vessel Agency',
    contact_input_email: 'Official Email',
    contact_input_phone: 'Phone / WhatsApp',
    contact_input_type: 'Inquiry Category',
    contact_type_general: 'General Maritime Inquiry',
    contact_type_transit: 'Suez Canal Transit Provisioning',
    contact_type_urgent: 'Urgent Anchorage Delivery (< 3 Hours)',
    contact_type_technical: 'Deck & Engine Spares (IMPA/ISSA)',
    contact_type_bunkering: 'Fresh Water & Bunkering Logistics',
    contact_input_msg: 'Your Message / Vessel Specifics',
    contact_btn_send: 'Send Operational Message',
    contact_sending: 'Dispatching Message...',
    contact_success_title: 'Message Sent Successfully!',
    contact_success_desc: 'Thank you for reaching out. Our Suez maritime desk will reply within 30 minutes.',

    // Client Portal Page
    portal_title: 'Login',
    portal_sub: 'Fleet Requisition & Live Tracking Desk',
    portal_signin_title: 'Sign In',
    portal_signup_title: 'Register New Fleet Account',
    portal_email: 'Business Email',
    portal_password: 'Password',
    portal_remember: 'Remember this device',
    portal_btn_signin: 'Sign In',
    portal_btn_signup: 'Create Account',
    portal_have_account: 'Already have an account? Sign In',
    portal_no_account: 'New vessel master or superintendent? Register',
    portal_active_rfqs: 'Active Fleet Requisitions',
    portal_filter_all: 'All Statuses',
    portal_col_ref: 'RFQ ID',
    portal_col_vessel: 'Vessel / IMO',
    portal_col_port: 'Port / ETA',
    portal_col_status: 'Status',
    portal_col_amount: 'Quoted Amount',
    portal_col_action: 'Action',
    portal_view_details: 'View Details',
    portal_modal_title: 'Requisition Details',
    portal_modal_officer: 'Assigned Boarding Officer:',
    portal_modal_launch: 'Launch Boat:',
    portal_modal_eta: 'Target ETA:',
    portal_modal_items: 'Requested Supplies:',
    portal_modal_notes: 'Operations Notes:',

    // Admin Dashboard
    admin_title: 'Staff Operations Desk',
    admin_sub: 'Suez Canal Vessel Supply & Dispatch Console',
    admin_tab_dash: 'Analytics Dashboard',
    admin_tab_rfqs: 'Incoming RFQs',
    admin_tab_quotes: 'Pricing & Quotations',
    admin_tab_orders: 'Active Dispatches',
    admin_tab_inquiries: 'Contact Messages',
    admin_kpi_total_rfqs: 'Total RFQs Today',
    admin_kpi_active_launches: 'Active Supply Launches',
    admin_kpi_turnaround: 'Avg RFQ Turnaround',
    admin_kpi_pending: 'Pending Quotations',
    admin_search_ph: 'Search by vessel, IMO, company, or ID...',
    admin_btn_quote: 'Set Price / Dispatch',
    admin_drawer_title: 'Manage Quotation & Dispatch',
    admin_drawer_price: 'Quoted Amount (USD)',
    admin_drawer_officer: 'Assigned Officer',
    admin_drawer_launch: 'Assigned Supply Boat',
    admin_drawer_notes: 'Operations & Manifest Notes',
    admin_drawer_btn_save: 'Update Status & Notify Client',

    // Common labels
    btn_submit: 'Submit Request',
    btn_cancel: 'Cancel',
    btn_search: 'Search',
    btn_view_details: 'View Details',
    btn_close: 'Close',
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
    status_new: 'New Requisition',
    status_pending: 'Pending Review',
    status_under_review: 'Under Review',
    status_quoted: 'Quoted (60m)',
    status_confirmed: 'Order Confirmed',
    status_dispatched: 'Dispatched via Launch',
    status_delivered: 'Delivered Onboard',
    priority_standard: 'Standard (12-24h)',
    priority_urgent: 'Urgent (< 30 Min Transit Call)',

    // Footer
    footer_tagline: 'Your Suez Provisioning Desk – 24/7 | Fresh Supplies | Global Standards | Trusted Maritime Partner',
    footer_about: 'Suez-based premier ship chandler providing 24/7 fresh, frozen, dry, technical, and bonded provisions directly to vessels transiting the Suez Canal and calling all major Egyptian ports.',
    footer_rights: 'All rights reserved.',
    footer_callsign: 'Callsign: MENTORS SUEZ SUPPLY',
    footer_cta_title: 'Need an Immediate Quotation for Suez Transit?',
    footer_cta_desc: 'Our 24/7 provisioning desk guarantees a tailored, competitive price within 60 minutes.',
    footer_whatsapp: 'WhatsApp 24/7 Ops',
    footer_get_quote: 'Get a Quote in 60 Mins',
    footer_food_safety: 'Food Safety Policy',
    footer_quality_certs: 'Quality Certifications',
    footer_suez_ops: 'Suez Operations',
    footer_watch: 'VHF Marine Watch: Channel 16 / 73',
    footer_callsign_label: 'Callsign:'
  },
  ar: {
    // Brand
    brand_name: 'مينتورز مارين',
    brand_sub: 'تموين وتوريدات السفن البحرية',
    brand_slogan: 'توريدات اليوم لمستقبل بحري أفضل',

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
    nav_safety_chem: 'مهمات السلامة والكيماويات البحرية',
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
    nav_portal: 'تسجيل الدخول',
    nav_login: 'دخول العملاء',
    nav_my_account: 'أسطولي وطلباتي',
    nav_sign_out: 'تسجيل الخروج',
    nav_staff_desk: 'مكتب العمليات (للموظفين)',
    nav_cta_quote: 'طلب عرض أسعار',
    nav_new_requisition: 'طلب تموين جديد',

    // Top Utility Bar
    top_fast_quote: 'عرض أسعار خلال 60 دقيقة',
    top_vhf: 'مراقبة اللاسلكي: قنوات VHF 16 / 73',
    top_suez_time: 'عمليات السويس على مدار 24 ساعة',
    top_hotline: '+20 100 892 4477',
    top_hotline_label: 'غرفة العمليات البحرية 24/7:',
    top_trusted: 'منطقة حرة معتمدة بشهادات ISO 22000 و HACCP',
    top_lang_en: 'EN',
    top_lang_ar: 'العربية',
    top_callsign: 'نداء اللاسلكي: MENTORS SUEZ SUPPLY',
    top_local_time: 'توقيت السويس المحلي (EET):',

    // Hero Section
    hero_badge: 'تموين السفن بموانئ قناة السويس والبحر الأحمر • على مدار 24/7',
    hero_title_1: 'محطة تموين السفن',
    hero_title_2: 'بقناة السويس',
    hero_title_3: 'على مدار 24/7',
    hero_desc: 'شركة توريدات بحرية معتمدة بشهادات ISO 22000 و HACCP، نقدم أجود المؤن الطازجة، المخازن الحرة، قطع غيار السطح والمحرك والمياه العذبة مباشرة إلى السفن في المخطاف أو على الأرصفة على مدار الساعة.',
    hero_sub: 'مؤن طازجة. خدمة موثوقة. معايير عالمية.',
    feat_fresh: 'طازجة ومجمدة',
    feat_fresh_sub: 'لحوم وخضروات',
    feat_tech: 'مهمات فنية',
    feat_tech_sub: 'أكواد IMPA & ISSA',
    feat_dry: 'مياه ومخازن جافة',
    feat_dry_sub: 'أرز وزيوت ومعلبات',
    feat_247: 'عمليات 24/7',
    feat_247_sub: 'غرفة عمليات السويس',
    feat_ports: 'السويس والبحر الأحمر',
    feat_ports_sub: 'الموانئ والمخطاف',
    stat_vessels: 'سفينة تم تزويدها',
    stat_vessels_sub: 'بمختلف أنواعها وحمولاتها',
    stat_clients: 'شركة ملاحة عالمية',
    stat_clients_sub: 'ملاك سفن وشركات إدارة',
    stat_support: 'دعم ميداني متواصل',
    stat_support_sub: 'جاهزية مستمرة للنشات التوريد',
    stat_quality: 'التزام تام بالجودة',
    stat_quality_sub: 'سلسلة تبريد معتمدة HACCP',
    hero_cta_quote: 'طلب عرض أسعار خلال 60 دقيقة',
    hero_cta_video: 'شاهد فيديو العمليات',
    hero_stat_time: 'أقل من 60 دقيقة',
    hero_stat_time_label: 'أسرع تسعير رسمي للمناقصات',
    hero_stat_vessels: '+1,250',
    hero_stat_vessels_label: 'سفينة تم تزويدها سنوياً',
    hero_stat_compliance: '100% حلال',
    hero_stat_compliance_label: 'مؤن معتمدة ومطابقة للمواصفات',
    hero_stat_hours: '24/7/365',
    hero_stat_hours_label: 'إبحار دائم بلنشات التموين',
    hero_trust_rfq: 'عروض أسعار خلال 60 دقيقة',
    hero_trust_cert: 'معتمد ISO 22000 و HACCP',

    // Home About Snippet
    home_about_badge: 'عن مينتورز مارين بروفيجينز',
    home_about_title: 'تموين السفن الموثوق عبر قناة السويس وكافة الموانئ',
    home_about_desc: 'تأسست مينتورز مارين لتقديم حلول تموين بحري عالمية المستوى تلبي أعلى متطلبات الملاك ومديري السفن. من خلال أسطول شاحنات مبردة ولنشات تموين سريعة مرخصة، نضمن وصول الطلبيات في التوقيت الدقيق دون أدنى تأخير في رحلة العبور.',
    home_about_item1_title: 'عرض أسعار خلال 60 دقيقة',
    home_about_item1_sub: 'تسعير رسمي وسريع لطلبات التوريد',
    home_about_item2_title: 'سلسلة تبريد معتمدة',
    home_about_item2_sub: 'حفظ درجات الحرارة حتى التسليم على السفينة',
    home_about_link: 'اقرأ المزيد عن شركتنا وأسطولنا البحري',
    home_hub_badge: 'مركز السويس اللوجستي',
    home_hub_title: 'أسطول جاهز لخدمة قوافل الشمال والجنوب',
    home_hub_ports: 'بورتوفيق • منطقة انتظار السويس • العين السخنة • الأدبية • بورسعيد',

    // About Page
    about_hero_badge: 'رواد تموين السفن بقناة السويس',
    about_hero_title: 'تموين السفن باحترافية. بناء شراكات ملاحية تدوم.',
    about_hero_desc: 'انطلقت مينتورز مارين من محافظة السويس بجمهورية مصر العربية، لتصبح الشريك المفضل لكبرى شركات الملاحة وإدارة الأساطيل ومسؤولي التموين العابرين لقناة السويس والمترددين على الموانئ المصرية.',
    about_heritage_badge: 'عراقة التواجد بقناة السويس',
    about_heritage_title: 'موقع استراتيجي استثنائي عند ملتقى الملاحة البحرية العالمية',
    about_heritage_p1: 'تعتبر قناة السويس شريان التجارة الدولية الأول. عند عبور السفينة بين البحر المتوسط والبحر الأحمر، لا مجال لأي تأخير أو تهاون في سلامة الأغذية أو نقص القطع الفنية الضرورية.',
    about_heritage_p2: 'تأسست مينتورز مارين خصيصاً لتيسير عمليات التموين وسرعتها، حيث نمتلك مستودعات مبردة خاصة، أسطول لنشات تموين سريعة، وفريق تخليص جمركي معتمد مباشرة عند مداخل ميناء السويس وبورتوفيق.',
    about_val_precision: 'الدقة والسرعة الفائقة',
    about_val_precision_desc: 'فحص كل بند بدقة ومطابقته مع أكواد IMPA و ISSA العالمية قبل الشحن.',
    about_val_safety: 'معايير صارمة لسلامة الأغذية',
    about_val_safety_desc: 'مستودعات مبردة معتمدة بشهادات الهاسب (HACCP) لضمان صحة وسلامة الطاقم.',
    about_cta_title: 'هل ترغب في تجربة خدمة تموين بحري موثوقة وفورية؟',
    about_cta_desc: 'أرسل كشف احتياجات سفينتك القادمة لعبور قناة السويس أو موانئ السخنة وبورسعيد، ولاحظ الفرق بنفسك في الجودة وسرعة الاستجابة.',
    about_cta_btn1: 'طلب عرض أسعار خلال 60 دقيقة',
    about_cta_btn2: 'التواصل مع غرفة العمليات',

    // Services Page
    services_hero_badge: 'منظومة خدمات التوريدات البحرية المتكاملة',
    services_hero_title: 'حلول تموين وتوريد السفن الشاملة',
    services_hero_desc: 'من المؤن الطازجة والمجمدة حتى قطع الغيار الفنية للمحركات، نوفر كل ما تحتاجه سفينتك.',
    services_hero_sub: 'يتم تجهيز وتغليف كافة المؤن طبقاً للوائح الصحية الدولية لمنظمة الصحة العالمية (WHO) وتسليمها بلنشات مبردة متطورة مباشرة إلى رافعة السفينة.',
    services_learn_more: 'تفاصيل الخدمة',
    services_request_quote: 'طلب تسعير',
    services_overview_spec: 'نظرة عامة والمواصفات الفنية',
    services_inclusions: 'المزايا والإمكانيات القياسية المشمولة',
    services_sample_items: 'أمثلة بنود من كتالوج التوريدات',
    services_catalog_hint: 'أكواد IMPA / ISSA / كشوفات مخصصة',
    services_col_code: 'كود الصنف',
    services_col_desc: 'الوصف والبيان',
    services_col_unit: 'الوحدة',
    services_fast_dispatch: 'إبحار سريع بلنشات التموين لكافة المراسي خلال 60 دقيقة من تأكيد الطلب.',
    services_cta_quote: 'طلب عرض أسعار لهذه الخدمة',

    // Ports Page
    ports_hero_badge: 'تغطية بحرية استراتيجية لكافة الموانئ المصرية',
    ports_hero_title: 'الموانئ التي نخدمها',
    ports_hero_desc: 'توريد وتسليم المؤن على مدار 24/7 عبر كافة الممرات المائية والمراسي ومحطات الحاويات في مصر.',
    ports_supply_services: 'الخدمات المتاحة بالميناء',
    ports_launch_label: 'زمن وصول اللنش:',
    ports_contact_agent: 'الاتصال بوكيل الميناء',
    ports_quote_for_port: 'طلب تسعير لهذا الميناء',
    ports_water_depth: 'عمق الغاطس:',
    ports_type_label: 'تصنيف الميناء:',

    // Why Us Page
    why_hero_badge: 'ما يميز مينتورز مارين',
    why_hero_title: 'لماذا تختار مينتورز مارين؟',
    why_hero_desc: 'نحن لا نقدم مجرد توريدات، بل نمنحك راحة البال التامة لرحلتك البحرية.',
    why_hero_sub: 'من لحظة دخول سفينتك المياه الإقليمية المصرية وحتى التوقيع النهائي على إيصال الاستلام، تضمن غرفة عمليات السويس السرعة والشفافية وتطبيق أعلى معايير التموين البحري.',
    why_p1_title: 'تسعير سريع وفوري',
    why_p1_sub: 'خلال 60 دقيقة فقط',
    why_p1_desc: 'ندرك تماماً أهمية الوقت ودقة مواعيد قوافل قناة السويس. يقوم مكتب التسعير بمعالجة كشوفات السفينة وتقديم عروض أسعار شاملة وتنافسية خلال ساعة واحدة.',
    why_p2_title: 'دعم ميداني 24/7',
    why_p2_sub: 'جاهزية على مدار الساعة',
    why_p2_desc: 'السفن لا تنام، ونحن كذلك. يعمل مكتب بورتوفيق 365 يوماً في السنة مع مراقبة لاسلكية نشطة لقنوات VHF 16 و 73 وضباط صعود متواجدين دوماً.',
    why_p3_title: 'جودة استثنائية معتمدة',
    why_p3_sub: 'شهادات HACCP & ISO',
    why_p3_desc: 'أجود أصناف اللحوم الحلال المعتمدة، الخضروات والفواكه الطازجة، ومهمات المحرك والسطح المطابقة للمواصفات الأصلية وأكواد IMPA.',
    why_p4_title: 'تغطية شاملة لكل السواحل',
    why_p4_sub: 'جميع الموانئ المصرية',
    why_p4_desc: 'من بورسعيد شمالاً إلى مراسي السويس، العين السخنة، الأدبية، دمياط والإسكندرية، تصل شاحناتنا ولنشاتنا المبردة إلى أي رصيف أو مخطاف.',
    why_p5_title: 'أسعار تنافسية وشفافة',
    why_p5_sub: 'وضوح تام بالدولار',
    why_p5_desc: 'لا توجد أي رسوم أو تكاليف خفية. فواتير تفصيلية واضحة بالدولار الأمريكي مع تسهيلات محاسبية عبر كبرى الوكالات الملاحية المعتمدة.',
    why_p6_title: 'فريق متعدد اللغات',
    why_p6_sub: 'تواصل بحري محترف',
    why_p6_desc: 'تواصل سلس وسريع مع كافة القباطنة والمهندسين وكبار المضيفين باللغتين الإنجليزية والعربية دون أي عوائق في التفاهم.',
    why_certs_badge: 'الاعتمادات والمواصفات الدولية',
    why_certs_title: 'شهادات الجودة والسلامة البحرية',
    why_certs_desc: 'نعمل وفق أعلى معايير السلامة والصحة الغذائية والاشتراطات الصارمة المعتمدة دولياً في الملاحة.',
    why_testimonials_badge: 'آراء القباطنة ومديري الأساطيل',
    why_testimonials_title: 'ثقة كبرى خطوط الملاحة العالمية',

    // Get a Quote Page
    quote_hero_badge: 'استجابة مضمونة خلال 60 دقيقة',
    quote_hero_title: 'طلب عرض أسعار تموين سفينة',
    quote_hero_desc: 'أرسل كشف احتياجات السفينة أو اختر المواد المطلوبة أدناه للحصول على تسعير رسمي وفوري بموانئ قناة السويس والموانئ المصرية.',
    quote_tab_basic: '1. بيانات السفينة والميناء المستهدف',
    quote_tab_list: '2. كشف المؤن والبنود المطلوبة',
    quote_tab_additional: '3. درجة الاستعجال وبيانات الاتصال',
    quote_vessel_name: 'اسم السفينة',
    quote_vessel_name_ph: 'مثال: MSC ORION',
    quote_imo: 'رقم المنظمة البحرية IMO (7 أرقام)',
    quote_imo_ph: 'مثال: 9857145',
    quote_port: 'ميناء التوقف / المخطاف',
    quote_eta_date: 'تاريخ الوصول المتوقع (ETA)',
    quote_eta_time: 'توقيت الوصول (بتوقيت القاهرة المحلي EET)',
    quote_select_services: 'المؤن والخدمات المطلوبة (حدد كل ما يلزم)',
    quote_upload_title: 'تحميل ملف كشف الاحتياجات (Excel / PDF / Word)',
    quote_upload_desc: 'اسحب وأفلت ملف كشف السفينة هنا أو اضغط للاختيار من جهازك',
    quote_upload_support: 'يدعم ملفات .xlsx, .xls, .pdf, .docx, .csv (بحد أقصى 15 ميجابايت)',
    quote_quick_items: 'اختيار سريع للأصناف الأكثر طلباً',
    quote_custom_item: 'إضافة صنف مخصص / كود IMPA',
    quote_custom_item_ph: 'مثال: IMPA 232115 - حبل رباط 56 ملم × 220 متر',
    quote_btn_add: 'إضافة صنف',
    quote_priority: 'درجة الأولوية والسرعة',
    quote_p_standard: 'عادي (عرض أسعار رسمي خلال 60 دقيقة)',
    quote_p_urgent: 'عاجل جداً (أقل من 30 دقيقة قبل دخول القافلة)',
    quote_p_anchorage: 'تسليم بالمخطاف (توصيل بلنش سريع في عرض البحر)',
    quote_crew_nat: 'جنسيات الطاقم / المتطلبات الغذائية الخاصة',
    quote_crew_nat_ph: 'مثال: طاقم مختلط أوروبي وفلبيني وهندي (وجبات حلال)',
    quote_notes: 'ملاحظات إضافية / تعليمات خاصة للربان',
    quote_notes_ph: 'سعة رافعة السفينة، تفضيلات الصعود باللنش، تصاريح الجمارك والبوندد...',
    quote_contact_name: 'اسم المسؤول / الرتبة',
    quote_contact_name_ph: 'مثال: كابتن أحمد / كبير المضيفين',
    quote_contact_email: 'البريد الإلكتروني الرسمي',
    quote_contact_email_ph: 'master.orion@fleet.com',
    quote_contact_phone: 'رقم الهاتف / الواتساب',
    quote_contact_phone_ph: '+20 100 892 4477',
    quote_company: 'الشركة المالكة / التوكيل الملاحي',
    quote_company_ph: 'مثال: شركة البحر المتوسط للملاحة (MSC)',
    quote_btn_submit: 'إرسال طلب التسعير (ضمان الرد خلال 60 دقيقة)',
    quote_submitting: 'جاري الإرسال لمكتب عمليات السويس...',
    quote_success_title: 'تم استلام طلب التسعير بنجاح!',
    quote_success_ref: 'رقم مرجع التسعير:',
    quote_success_msg: 'استلمت غرفة عمليات بورتوفيق طلبك بنجاح. ضباط الميناء ومسؤولو التسعير يعكفون الآن على إعداد عرض أسعار مفصل بالدولار خلال أقل من 60 دقيقة.',
    quote_success_track: 'متابعة حالة الطلب',
    quote_success_new: 'إرسال كشف احتياجات آخر',

    // Contact Page
    contact_hero_badge: 'غرفة عمليات السويس 24/7',
    contact_hero_title: 'اتصل بنا',
    contact_hero_desc: 'نحن على أتم الاستعداد لدعم سفينتك وتقديم كافة التسهيلات.',
    contact_hero_sub: 'سواء كانت سفينتك تبحر نحو قناة السويس، أو راسية في منطقة الانتظار، أو مجدولة لقافلة الشهر القادم، فإن ضباط الميناء جاهزون على مدار 24/7.',
    contact_office_title: 'المقر الرئيسي — السويس، مصر',
    contact_office_sub: 'دعم ملاحي دولي متكامل',
    contact_address_label: 'مركز العمليات البحرية اللوجستي',
    contact_address: 'المنطقة الحرة ببورتوفيق، بوابة هيئة قناة السويس، محافظة السويس، جمهورية مصر العربية',
    contact_hotline_label: 'الخط الساخن المباشر وحالات الطوارئ 24/7',
    contact_landline_label: 'مكتب بورتوفيق الأرضي',
    contact_vhf_label: 'مراقبة اللاسلكي البحري بالسويس',
    contact_vhf_val: 'قنوات VHF 16 / 73',
    contact_email_label: 'البريد الإلكتروني للعمليات والتسعير',
    contact_form_title: 'إرسال رسالة / استفسار تشغيلي مباشر',
    contact_input_name: 'الاسم بالكامل',
    contact_input_company: 'الشركة المالكة أو التوكيل الملاحي',
    contact_input_email: 'البريد الإلكتروني الرسمي',
    contact_input_phone: 'رقم الهاتف / الواتساب',
    contact_input_type: 'تصنيف الاستفسار',
    contact_type_general: 'استفسار بحري عام',
    contact_type_transit: 'تموين عبور قناة السويس',
    contact_type_urgent: 'تسليم عاجل بالمخطاف (أقل من 3 ساعات)',
    contact_type_technical: 'قطع غيار السطح والمحرك (أكواد IMPA/ISSA)',
    contact_type_bunkering: 'إمداد المياه العذبة والوقود اللوجستي',
    contact_input_msg: 'نص الرسالة / تفاصيل طلب السفينة',
    contact_btn_send: 'إرسال الرسالة إلى غرفة العمليات',
    contact_sending: 'جاري إرسال الرسالة...',
    contact_success_title: 'تم إرسال رسالتك بنجاح!',
    contact_success_desc: 'شكراً لتواصلك معنا. سيقوم فريق العمليات الملاحية بالرد عليك خلال 30 دقيقة.',

    // Client Portal Page
    portal_title: 'تسجيل الدخول',
    portal_sub: 'إدارة وتتبع طلبات تموين الأسطول بالسويس',
    portal_signin_title: 'تسجيل الدخول',
    portal_signup_title: 'تسجيل حساب أسطول جديد',
    portal_email: 'البريد الإلكتروني للعمل',
    portal_password: 'كلمة المرور',
    portal_remember: 'تذكر هذا الجهاز',
    portal_btn_signin: 'تسجيل الدخول',
    portal_btn_signup: 'إنشاء الحساب',
    portal_have_account: 'لديك حساب بالفعل؟ تسجيل الدخول',
    portal_no_account: 'ربان سفينة أو مدير أسطول جديد؟ سجل حسابك',
    portal_active_rfqs: 'طلبات التموين النشطة للأسطول',
    portal_filter_all: 'جميع الحالات',
    portal_col_ref: 'رقم الطلب',
    portal_col_vessel: 'السفينة / IMO',
    portal_col_port: 'الميناء / موعد الوصول',
    portal_col_status: 'الحالة',
    portal_col_amount: 'القيمة المسعرة',
    portal_col_action: 'الإجراء',
    portal_view_details: 'عرض التفاصيل',
    portal_modal_title: 'تفاصيل طلب التموين',
    portal_modal_officer: 'ضابط الصعود المكلف:',
    portal_modal_launch: 'لنش التموين المخصص:',
    portal_modal_eta: 'موعد الوصول المستهدف:',
    portal_modal_items: 'المؤن والبنود المطلوبة:',
    portal_modal_notes: 'ملاحظات غرفة العمليات:',

    // Admin Dashboard
    admin_title: 'مكتب العمليات (للموظفين)',
    admin_sub: 'لوحة التحكم وإدارة لنشات تموين قوافل السويس',
    admin_tab_dash: 'لوحة المؤشرات والتحليلات',
    admin_tab_rfqs: 'طلبات التسعير الواردة',
    admin_tab_quotes: 'عروض الأسعار والتسعير',
    admin_tab_orders: 'الشحنات واللنشات النشطة',
    admin_tab_inquiries: 'رسائل واستفسارات الاتصال',
    admin_kpi_total_rfqs: 'إجمالي الطلبات اليوم',
    admin_kpi_active_launches: 'لنشات التموين في البحر',
    admin_kpi_turnaround: 'متوسط زمن الرد والتسعير',
    admin_kpi_pending: 'طلبات قيد التسعير',
    admin_search_ph: 'البحث باسم السفينة، رقم IMO، أو التوكيل...',
    admin_btn_quote: 'تحديد السعر / تخصيص اللنش',
    admin_drawer_title: 'إدارة التسعير ومسار التوريد',
    admin_drawer_price: 'المبلغ الإجمالي بالدولار (USD)',
    admin_drawer_officer: 'ضابط الميناء المكلف',
    admin_drawer_launch: 'لنش التموين المخصص',
    admin_drawer_notes: 'ملاحظات المانيفست والتصريح الجمركي',
    admin_drawer_btn_save: 'تحديث الحالة وإشعار العميل',

    // Common labels
    btn_submit: 'إرسال الطلب',
    btn_cancel: 'إلغاء',
    btn_search: 'بحث',
    btn_view_details: 'عرض التفاصيل',
    btn_close: 'إغلاق',
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
    status_new: 'طلب تموين جديد',
    status_pending: 'قيد المراجعة',
    status_under_review: 'جاري الفحص والتسعير',
    status_quoted: 'تم التسعير (خلال 60 دقيقة)',
    status_confirmed: 'تم تأكيد أمر التوريد',
    status_dispatched: 'قيد الشحن والتسليم باللنش',
    status_delivered: 'تم التسليم على ظهر السفينة بنجاح',
    priority_standard: 'عادي (12 - 24 ساعة)',
    priority_urgent: 'عاجل جداً (< 30 دقيقة قبل العبور)',

    // Footer
    footer_tagline: 'مكتب تموين السويس على مدار الساعة | مؤن طازجة | معايير عالمية | شريك بحري موثوق',
    footer_about: 'شركة التوريدات البحرية الرائدة في السويس، تقدم المؤن الطازجة والمجمدة والجافة والمهمات الفنية والبوندد مباشرة إلى السفن العابرة لقناة السويس وفي جميع الموانئ المصرية.',
    footer_rights: 'جميع الحقوق محفوظة.',
    footer_callsign: 'نداء اللاسلكي: MENTORS SUEZ SUPPLY',
    footer_cta_title: 'هل تحتاج إلى عرض أسعار فوري لعبور قناة السويس؟',
    footer_cta_desc: 'فريق العمليات متواجد على مدار 24 ساعة لتقديم أفضل الأسعار خلال 60 دقيقة فقط.',
    footer_whatsapp: 'واتساب العمليات 24/7',
    footer_get_quote: 'طلب عرض أسعار (60 دقيقة)',
    footer_food_safety: 'سياسة سلامة الغذاء',
    footer_quality_certs: 'شهادات الجودة',
    footer_suez_ops: 'عمليات السويس',
    footer_watch: 'مراقبة اللاسلكي: قنوات VHF 16 / 73',
    footer_callsign_label: 'نداء العمليات:'
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

  public t(key: keyof typeof translations['en'] | string, fallback?: string): string {
    const dict = translations[this.currentLang] || translations.en;
    const value = (dict as any)[key] || (translations.en as any)[key];
    return value !== undefined ? value : (fallback || String(key));
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

/**
 * NUMBER & RTL TYPOGRAPHY HELPERS:
 * Prevents bidi (bidirectional) layout bugs in Arabic mode.
 * Fixes flipped phone numbers, reversed mathematical symbols (+, %, /),
 * coordinates, and IMPA numbers.
 */

export const formatPhone = (phone: string): string => {
  return phone;
};

export const formatCoordinates = (coords: string): string => {
  return coords;
};
