import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Radio,
  Send,
  CheckCircle2,
  MessageSquare,
  Globe,
  ShieldCheck,
  RefreshCw,
  Ship
} from 'lucide-react';
import { ContactMessage } from '../types';
import { requestStore } from '../services/requestStore';
import { languageStore, Language } from '../services/languageStore';

export const ContactPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  const [formData, setFormData] = useState<ContactMessage>({
    fullName: '',
    company: '',
    email: '',
    phone: '',
    inquiryType: 'General Inquiry',
    message: '',
  });

  const [isSending, setIsSending] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    // Save to request store
    requestStore.addContactInquiry(formData);

    setTimeout(() => {
      setIsSending(false);
      setIsSent(true);
    }, 800);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-12 sm:py-16 font-sans" id="contact-page">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header (Blueprint Page 6) */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-red-100 text-[#D0201E] px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <Radio className="w-3.5 h-3.5 text-[#D0201E] animate-pulse" />
            <span>{isAr ? 'غرفة عمليات السويس 24/7' : '24/7 Suez Operations Desk'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            {languageStore.t('contact_title')}
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-2 font-medium">
            {isAr ? 'جاهزون دائماً وعلى مدار الساعة لخدمة سفينتكم.' : 'We are always ready to support your vessel.'}
          </p>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl mx-auto">
            {isAr
              ? 'سواء كانت سفينتكم مبحرة نحو قناة السويس، أو راسية في منطقة الانتظار والمخطاف، أو مجدولة لعبور الشهر القادم، فريقنا الميداني في كامل الجاهزية 24/7.'
              : 'Whether your ship is steaming towards Suez, anchored in the waiting zone, or scheduled for next month’s convoy, our port officers are on standby 24/7.'}
          </p>
        </div>

        {/* 2-Column Layout (Blueprint Page 6) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* LEFT COLUMN: Head Office & Contact Details (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#0B2545] text-white rounded-2xl p-8 shadow-xl space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-300 block mb-1">
                  {isAr ? 'دعم ملاحي وبحري عالمي' : 'Global Maritime Support'}
                </span>
                <h3 className="text-2xl font-bold font-cinzel text-white">
                  {isAr ? 'المقر الرئيسي — السويس، مصر' : 'Head Office — Suez, Egypt'}
                </h3>
              </div>

              <div className="space-y-4 text-sm text-slate-200">
                {/* Address */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-red-400 mt-0.5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      {isAr ? 'مركز العمليات البحرية واللوجستية' : 'Maritime Operations Center'}
                    </strong>
                    <span className="text-xs text-slate-300 leading-relaxed block mt-0.5">
                      {isAr
                        ? 'المنطقة الحرة ببورتوفيق، مدخل هيئة قناة السويس، محافظة السويس، جمهورية مصر العربية'
                        : 'Port Tawfik Free Zone, Suez Canal Authority Gateway, Suez Governorate, Egypt'}
                    </span>
                  </div>
                </div>

                {/* Direct Phone */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-sky-400 mt-0.5">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      {isAr ? 'الخط الساخن والصعود الطارئ 24/7' : '24/7 Hotline & Emergency Boarding'}
                    </strong>
                    <a href="tel:+201008924477" className="text-sky-300 hover:underline block mt-0.5" dir="ltr">
                      <span className="inline-block unicode-isolate font-mono font-semibold text-sm">+20 100 892 4477</span>
                    </a>
                    <span className="text-xs text-slate-400 block mt-0.5" dir="ltr">
                      <span className="inline-block unicode-isolate font-mono font-semibold">+20 62 333 4567</span> {isAr ? '(أرضي السويس)' : '(Head Office Landline)'}
                    </span>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center shrink-0 text-amber-400 mt-0.5">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-semibold">
                      {isAr ? 'مكتب العمليات وتلقي الطلبيات' : 'Operations & Requisition Desk'}
                    </strong>
                    <a href="mailto:operations@mentors-marine.com" className="text-slate-200 hover:text-white text-xs block mt-0.5" dir="ltr">
                      <span className="inline-block unicode-isolate">operations@mentors-marine.com</span>
                    </a>
                    <a href="mailto:quotes@mentors-marine.com" className="text-sky-300 hover:text-white text-xs block mt-0.5" dir="ltr">
                      <span className="inline-block unicode-isolate">quotes@mentors-marine.com</span>
                    </a>
                  </div>
                </div>

                {/* 24/7 VHF Support Note (Blueprint spec) */}
                <div className="bg-white/10 rounded-xl p-4 border border-white/15">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold mb-1">
                    <Radio className="w-4 h-4 animate-pulse" />
                    <span>{isAr ? 'مراقبة الراديو اللاسلكي 24/7' : '24/7 Operational Support & Radio Watch'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {isAr ? (
                      <>
                        تراقب محطتنا الساحلية باستمرار القنوات البحرية <strong className="text-white font-mono" dir="ltr">VHF CH 16 / CH 73</strong>. نداء اللاسلكي: <strong className="text-sky-200">"Mentors Suez Supply"</strong>.
                      </>
                    ) : (
                      <>
                        Our shore station continuously monitors <strong className="text-white">VHF Marine Channel 16 / Channel 73</strong>. Call: <strong className="text-sky-200">"Mentors Suez Supply"</strong>.
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Social & Instant Direct Channels */}
              <div className="pt-2 border-t border-white/10">
                <span className="text-xs text-slate-400 block mb-3 font-semibold uppercase tracking-wider">
                  {isAr ? 'قنوات المراسلة الفورية المباشرة' : 'Direct Messaging Channels'}
                </span>
                <div className="flex items-center gap-3">
                  <a
                    href="https://wa.me/201008924477"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isAr ? 'واتساب مباشر' : 'WhatsApp'}</span>
                  </a>

                  <a
                    href="https://www.linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="flex-1 bg-[#0077b5] hover:bg-[#006097] text-white p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <Globe className="w-4 h-4" />
                    <span>{isAr ? 'لينكد إن' : 'LinkedIn'}</span>
                  </a>

                  <a
                    href="mailto:operations@mentors-marine.com"
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white p-2.5 rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-colors shadow"
                  >
                    <Mail className="w-4 h-4" />
                    <span>{isAr ? 'مراسلتنا' : 'Email Us'}</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Contact Form (7 Cols - Blueprint spec) */}
          <div className="lg:col-span-7 bg-white rounded-2xl shadow-md border border-slate-200 p-8 sm:p-10">
            {isSent ? (
              <div className="text-center py-12 space-y-4 animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-[#0B2545] font-cinzel">
                  {isAr ? 'تم إرسال رسالتكم بنجاح' : 'Message Sent Successfully'}
                </h3>
                <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                  {isAr ? (
                    <>
                      شكراً لك، <strong className="text-slate-900 font-semibold">{formData.fullName}</strong>. تم تحويل استفساركم مباشرة إلى مراقب نوبات السويس. سنوافيكم بالرد على <strong className="text-slate-900 font-semibold" dir="ltr">{formData.email}</strong> خلال 30 دقيقة.
                    </>
                  ) : (
                    <>
                      Thank you, <strong className="text-slate-900 font-semibold">{formData.fullName}</strong>. Your message has been routed to our Suez duty superintendent. We will respond to <strong className="text-slate-900 font-semibold">{formData.email}</strong> within 30 minutes.
                    </>
                  )}
                </p>
                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href="https://wa.me/201008924477?text=Hello%20Mentors%20Marine,%20I%20have%20sent%20an%20inquiry%20via%20your%20website"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg flex items-center gap-2 shadow"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{isAr ? 'متابعة عاجلة عبر واتساب' : 'Urgent Follow-up via WhatsApp'}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => {
                      setIsSent(false);
                      setFormData({
                        fullName: '',
                        company: '',
                        email: '',
                        phone: '',
                        inquiryType: 'General Inquiry',
                        message: '',
                      });
                    }}
                    className="bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs sm:text-sm px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                  >
                    {isAr ? 'إرسال رسالة أخرى' : 'Send Another Message'}
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <h3 className="text-xl font-bold text-[#0B2545] font-cinzel">
                    {isAr ? 'إرسال استفسار أو طلب توريد' : 'Send Us an Inquiry'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr
                      ? 'املأ النموذج أدناه وسيقوم منسق العمليات بالرد والتواصل معكم بأسرع وقت.'
                      : 'Fill out the form below and our operations coordinator will respond promptly.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: القبطان أحمد سالم' : 'e.g. Johnathan Vance'}
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {isAr ? 'اسم الشركة / السفينة' : 'Company / Vessel Name'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? 'مثال: MV Red Sea Star' : 'e.g. Pacific Bulk Maritime'}
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {isAr ? 'البريد الإلكتروني الرسمي' : 'Official Email'} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="superintendent@shipping.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                      dir="ltr"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      {isAr ? 'رقم الهاتف / المحمول' : 'Phone / Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      placeholder={isAr ? '+20 100 123 4567' : 'e.g. +30 210 1234567'}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                      dir="ltr"
                    />
                  </div>
                </div>

                {/* Inquiry Type Dropdown */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {isAr ? 'نوع الاستفسار' : 'Inquiry Type'} <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800 bg-white"
                  >
                    <option value="General Inquiry">
                      {isAr ? 'استفسار عام' : 'General Inquiry'}
                    </option>
                    <option value="Quote Request">
                      {isAr ? 'طلب تسعير (مؤن / قطع غيار / بضائع جمركية)' : 'Quote Request (Provisions / Technical / Bonded)'}
                    </option>
                    <option value="Support">
                      {isAr ? 'متابعة طلبية جارية لسفينة' : 'Support / Active Vessel Order'}
                    </option>
                    <option value="Partnership">
                      {isAr ? 'اتفاقية إدارة أسطول / شراكة استراتيجية' : 'Partnership / Fleet Contract Agreement'}
                    </option>
                    <option value="Emergency Supply">
                      {isAr ? 'تموين طارئ في المخطاف (أقل من ساعتين)' : 'Urgent Anchorage Supply (< 2 Hours)'}
                    </option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                    {isAr ? 'تفاصيل الرسالة أو الطلب' : 'Message'} <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder={
                      isAr
                        ? 'اكتب رسالتك وتفاصيل السفينة، الميناء المقصود، موعد الوصول المتوقع (ETA) أو قائمة الاحتياجات...'
                        : 'Type your message here with vessel details, port, ETA or supply needs...'
                    }
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                  ></textarea>
                </div>

                {/* Submit Button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSending}
                    className="w-full py-3.5 px-6 rounded-xl bg-[#D0201E] hover:bg-[#b01716] text-white font-extrabold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-75 cursor-pointer"
                  >
                    {isSending ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>{isAr ? 'جارٍ إرسال الرسالة...' : 'Sending message...'}</span>
                      </>
                    ) : (
                      <>
                        <span>{isAr ? 'إرسال الرسالة الآن' : 'Send Message'}</span>
                        <Send className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
