import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mentorsSupplyBoat from '../assets/images/mentors_supply_boat_1789321730085.jpg';
import {
  Anchor,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Compass,
  CheckCircle2,
  Ship,
  ArrowRight,
  Target,
  Sparkles
} from 'lucide-react';
import { languageStore, Language } from '../services/languageStore';

export const AboutPage: React.FC = () => {
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  useEffect(() => {
    const unsub = languageStore.subscribe((l) => setCurrentLang(l));
    return () => unsub();
  }, []);

  const isAr = currentLang === 'ar';

  return (
    <div className="w-full bg-white font-sans" id="about-page">
      {/* Hero */}
      <section className="relative py-20 bg-[#0B2545] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src={mentorsSupplyBoat}
            alt="Mentors Marine vessel provisioning in Suez Canal"
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-sky-300 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            <Anchor className="w-4 h-4" />
            <span>{isAr ? 'تموين سفن متخصص بقناة السويس' : 'Dedicated Suez Ship Chandlers'}</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-cinzel text-white leading-tight">
            {isAr ? (
              <>
                تموين السفن باحترافية. <br />
                وبناء شراكات بحرية مستدامة.
              </>
            ) : (
              <>
                Supplying Vessels. <br />
                Building Lasting Partnerships.
              </>
            )}
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            {isAr
              ? 'تأسست شركة مينتورز مارين بروفيجينز في مدينة السويس، مصر، لتغدو الشريك الرائد في التموين والتوريدات البحرية لكبرى شركات الملاحة العالمية، ومديري السفن الفنيين، ومشغلي الإعاشة أثناء عبور قناة السويس والرسو بالموانئ المصرية.'
              : 'Founded in Suez, Egypt, Mentors Marine Provisions has grown into a premier vessel supply partner for leading shipowners, technical managers, and catering operators traversing the Suez Canal and calling Egyptian ports.'}
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D0201E]">
                {isAr ? 'تاريخنا العريق بقناة السويس' : 'Our Suez Canal Heritage'}
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B2545] font-cinzel leading-tight">
                {isAr
                  ? 'موقع استراتيجي في مفترق طرق الملاحة والتجارة العالمية'
                  : 'Strategically Positioned at the Maritime Crossroads of the World'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? 'قناة السويس هي شريان التجارة الدولية النابض. عندما تعبر السفينة بين البحر المتوسط والبحر الأحمر، لا يوجد مجال لأي تأخير أو نقص في جودة الأغذية أو غياب المستلزمات الفنية الأساسية.'
                  : 'The Suez Canal is the artery of global trade. When a vessel transits between the Mediterranean and the Red Sea, there is zero tolerance for delay, substandard food, or missing technical stores.'}
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {isAr
                  ? 'تأسست مينتورز مارين خصيصاً لإلغاء أي عوائق تشغيلية؛ فنحن نمتلك ونشغل مستودعات تبريد وتجميد خاصة، ولنشات تموين بحري حديثة ومرخصة، وفريق تخليص جمركي معتمد في بورتوفيق ومداخل موانئ السويس وبورسعيد.'
                  : 'Mentors Marine Provisions was built specifically to eliminate supply friction. We operate private refrigerated warehousing, custom launch craft, and in-house customs clearing agents right at Port Tawfik and Suez port entrances.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                  <strong className="text-2xl font-cinzel font-bold text-[#0B2545] block" dir="ltr">
                    <span className="inline-block unicode-isolate font-mono">
                      {isAr ? '60 دقيقة' : '60 Mins'}
                    </span>
                  </strong>
                  <span className="text-xs text-slate-500 font-medium">
                    {isAr ? 'سرعة إصدار عروض الأسعار' : 'Standard Quotation Speed'}
                  </span>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                  <strong className="text-2xl font-cinzel font-bold text-[#D0201E] block" dir="ltr">
                    <span className="inline-block unicode-isolate font-mono">100%</span>
                  </strong>
                  <span className="text-xs text-slate-500 font-medium">
                    {isAr ? 'سلسلة تبريد بمراقبة رقمية حرارية' : 'Temperature Monitored Chain'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6 space-y-4">
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-slate-900 aspect-video relative">
                <img
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80"
                  alt="Port logistics and vessel crane loading"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Core Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Target className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {isAr ? 'الدقة والسرعة القصوى' : 'Precision & Speed'}
                    </strong>
                    <span className="text-xs text-slate-500">
                      {isAr
                        ? 'مراجعة ومطابقة كل بند مع أكواد IMPA و ISSA قبل إرسال الشحنات للسفينة.'
                        : 'Every item cross-checked against IMPA/ISSA codes before dispatch.'}
                    </span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-slate-900 block">
                      {isAr ? 'معايير سلامة الغذاء الصارمة' : 'Uncompromising Food Safety'}
                    </strong>
                    <span className="text-xs text-slate-500">
                      {isAr
                        ? 'مستودعات مبردة ومجمدة معتمدة بشهادة HACCP للحفاظ على صحة وراحة أطقم الملاحة.'
                        : 'HACCP certified cold storage protecting crew welfare.'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Logistics CTA */}
      <section className="py-14 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-2xl">
          <h3 className="text-2xl font-bold text-[#0B2545] font-cinzel">
            {isAr
              ? 'هل ترغب في تجربة تموين بحري موثوقة وعالية الكفاءة؟'
              : 'Ready to Experience Reliable Ship Chandlery?'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            {isAr
              ? 'أرسل لنا طلب التموين القادم لعبور قناة السويس، العين السخنة، أو بورسعيد لتشهد سرعة الاستجابة ودقة التنفيذ.'
              : 'Send us your next requisition for Suez transit, Ain Sokhna, or Port Said and see the difference in quality and responsiveness.'}
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/get-a-quote"
              className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-sm px-6 py-3 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <span>{isAr ? 'طلب عرض أسعار (خلال 60 دقيقة)' : 'Request a Quote in 60 Mins'}</span>
              <ArrowRight className={`w-4 h-4 ${isAr ? 'rotate-180' : ''}`} />
            </Link>
            <Link
              to="/contact"
              className="bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              {isAr ? 'الاتصال بغرفة العمليات' : 'Contact Operations Desk'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
