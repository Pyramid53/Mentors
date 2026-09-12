import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  Radio,
  Award,
  Compass,
  ShieldCheck,
  Users,
  CheckCircle2,
  Anchor,
  ArrowRight,
  Leaf,
  FileCheck,
  Ship,
  Sparkles
} from 'lucide-react';
import { MOCK_CERTIFICATIONS } from '../data/mockData';

export const WhyUsPage: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* 1. Page Header (Blueprint Page 5) */}
      <section className="py-12 sm:py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>The Mentors Difference</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
            Why Choose Mentors?
          </h1>
          <p className="text-slate-600 text-base sm:text-lg mt-3 font-medium">
            We go beyond supply. We deliver peace of mind.
          </p>
          <p className="text-slate-500 text-xs sm:text-sm mt-1 max-w-xl mx-auto">
            From the moment your vessel enters Egyptian territorial waters to final receipt sign-off, our Suez operations hub ensures speed, transparency, and top-tier maritime provisioning.
          </p>
        </div>
      </section>

      {/* 2. 2x3 ICON GRID (Blueprint Page 5) */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Fast Quotation */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-red-100 text-[#D0201E] flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                Fast Quotation
              </h3>
              <span className="text-xs font-bold text-[#D0201E] uppercase tracking-wider block mb-2">
                Within 60 Minutes
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                We understand maritime convoy urgency. Our dedicated pricing desk processes vessel requisitions and provides comprehensive, competitive quotations within an hour.
              </p>
            </div>

            {/* 2. 24/7 Support */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-sky-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Radio className="w-7 h-7 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                24/7 Support
              </h3>
              <span className="text-xs font-bold text-sky-700 uppercase tracking-wider block mb-2">
                Always Available
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Vessels do not sleep, and neither do we. Our Port Tawfik desk operates 365 days a year with active VHF monitoring on Channel 16/73 and round-the-clock boarding officers.
              </p>
            </div>

            {/* 3. High Quality */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Award className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                High Quality
              </h3>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block mb-2">
                Fresh & Certified Products
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Handpicked farm-fresh produce, USDA and Halal certified premium meats, and long-shelf-life dry stores maintained inside calibrated temperature-controlled cold chains.
              </p>
            </div>

            {/* 4. Strategic Location */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Compass className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                Strategic Location
              </h3>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block mb-2">
                In the Heart of Suez
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Direct quayside berths and cold warehouses positioned at the entrance of the Suez Canal, serving Port Said, Great Bitter Lake, Adabiya, and Ain Sokhna without transit delays.
              </p>
            </div>

            {/* 5. Global Standards */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                Global Standards
              </h3>
              <span className="text-xs font-bold text-purple-700 uppercase tracking-wider block mb-2">
                HACCP, MLC 2006 & ISO 22000
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Strict food safety hygiene protocols compliant with the Maritime Labour Convention (MLC 2006) Title 3.2, ensuring crew health and international port state inspection approval.
              </p>
            </div>

            {/* 6. Trusted Partner */}
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 hover:border-sky-300 hover:shadow-xl transition-all duration-300 group">
              <div className="w-14 h-14 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-[#0B2545] mb-2 font-cinzel">
                Trusted Partner
              </h3>
              <span className="text-xs font-bold text-teal-700 uppercase tracking-wider block mb-2">
                Long-Term Relationships
              </span>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Trusted contract chandler for global shipping lines, ship managers, and catering management firms who depend on transparent billing and verified delivery notes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FULL-WIDTH IMAGE BAND WITH OVERLAID STATS (Blueprint Page 5) */}
      <section className="relative py-20 bg-slate-900 overflow-hidden">
        {/* Port sunset background image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=2000&q=80"
            alt="Vessels docked at Suez port at sunset"
            className="w-full h-full object-cover brightness-75"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545]/95 via-[#0B2545]/85 to-[#0B2545]/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-white/20">
            {/* Stat 1 */}
            <div className="pt-4 lg:pt-0">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-cinzel block tracking-tight">
                500+
              </span>
              <p className="text-sm sm:text-base font-bold text-sky-300 uppercase tracking-wider mt-2">
                Vessels Supplied
              </p>
              <p className="text-xs text-slate-300 mt-1">Suez Canal & Red Sea</p>
            </div>

            {/* Stat 2 */}
            <div className="pt-4 lg:pt-0">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white font-cinzel block tracking-tight">
                50+
              </span>
              <p className="text-sm sm:text-base font-bold text-sky-300 uppercase tracking-wider mt-2">
                Global Clients
              </p>
              <p className="text-xs text-slate-300 mt-1">Contracted fleet owners</p>
            </div>

            {/* Stat 3 */}
            <div className="pt-4 lg:pt-0">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#D0201E] font-cinzel block tracking-tight">
                24/7
              </span>
              <p className="text-sm sm:text-base font-bold text-white uppercase tracking-wider mt-2">
                On-Time Delivery
              </p>
              <p className="text-xs text-slate-300 mt-1">Convoys never delayed</p>
            </div>

            {/* Stat 4 */}
            <div className="pt-4 lg:pt-0">
              <span className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-emerald-400 font-cinzel block tracking-tight">
                0
              </span>
              <p className="text-sm sm:text-base font-bold text-emerald-300 uppercase tracking-wider mt-2">
                Safety Incidents
              </p>
              <p className="text-xs text-slate-300 mt-1">Perfect offshore record</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CERTIFICATIONS & FOOD SAFETY SHOWCASE */}
      <section id="certifications" className="py-16 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-bold tracking-widest text-[#D0201E] uppercase">
              International Audit & Compliance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-cinzel mt-1">
              Accredited Quality & Safety Credentials
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Every provision order is inspected, temperature-logged, and packaged in certified marine export crates.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {MOCK_CERTIFICATIONS.map((cert, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-start gap-4"
              >
                <div className="w-12 h-12 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
                  <FileCheck className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-[#0B2545] font-cinzel">
                    {cert.name}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">{cert.category}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {cert.issuer}
                    </span>
                    <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Verified</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-sm px-7 py-3 rounded-lg shadow-md transition-colors"
            >
              <span>Experience Mentors Quality — Request a Quote</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
