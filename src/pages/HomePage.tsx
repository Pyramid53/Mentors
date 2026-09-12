import React, { useState } from 'react';
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
  Anchor
} from 'lucide-react';
import { VideoModal } from '../components/VideoModal';
import { MOCK_SERVICES, MOCK_TESTIMONIALS } from '../data/mockData';

export const HomePage: React.FC = () => {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  return (
    <div className="w-full bg-white">
      {/* 1. HERO SECTION (Blueprint Page 1) */}
      <section className="relative min-h-[620px] lg:min-h-[680px] bg-[#0B2545] flex items-center overflow-hidden">
        {/* Maritime Vessel / Port Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&w=2000&q=80"
            alt="Suez Canal vessel supply and port operations"
            className="w-full h-full object-cover object-center brightness-90"
          />
          {/* Navy overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B2545] via-[#0B2545]/90 to-[#0B2545]/65"></div>
          {/* Subtle nautical grid lines */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-2xl text-white space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 text-xs font-semibold tracking-wide text-sky-200">
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>SUEZ CANAL & RED SEA PORTS CHANDLERY</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-cinzel leading-tight text-white">
              Your Suez <br />
              <span className="text-sky-300">Provisioning Desk</span> <br />
              <span className="text-[#D0201E] tracking-wider">24/7</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-slate-200 font-medium tracking-wide">
              Fresh Supplies. Reliable Service. Global Standards.
            </p>

            <p className="text-sm text-slate-300 max-w-lg leading-relaxed">
              Full-service ship chandlery delivering premier fresh & frozen provisions, bonded stores, and IMPA technical hardware to vessels transiting the Suez Canal, Port Said, and Gulf of Suez anchorages.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2.5 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-base px-7 py-3.5 rounded-lg shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-0.5 active:scale-95"
              >
                <span>Get a Quote</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                to="/track-vessel"
                className="inline-flex items-center gap-2.5 bg-transparent hover:bg-white/10 text-white font-bold text-base px-7 py-3.5 rounded-lg border-2 border-white/80 hover:border-white transition-all backdrop-blur-sm"
              >
                <Ship className="w-5 h-5 text-sky-300" />
                <span>Track a Vessel</span>
              </Link>
            </div>

            {/* Quick trust metrics */}
            <div className="pt-6 flex items-center gap-6 text-xs text-slate-300">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-amber-400" />
                <span>60-Min Guaranteed RFQ</span>
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>HACCP & ISO Certified</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ROW OF 5 ICON FEATURE CHIPS (Blueprint Page 1 below hero) */}
      <section className="bg-slate-100 border-b border-slate-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            {/* 1. Fresh & Frozen Provisions */}
            <Link
              to="/services#provisions"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  Fresh & Frozen
                </h4>
                <p className="text-[11px] text-slate-500">Provisions</p>
              </div>
            </Link>

            {/* 2. Technical Stores */}
            <Link
              to="/services#technical-stores"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  Technical Stores
                </h4>
                <p className="text-[11px] text-slate-500">IMPA & ISSA</p>
              </div>
            </Link>

            {/* 3. Beverages & Water */}
            <Link
              to="/services#dry-stores"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Coffee className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  Beverages & Water
                </h4>
                <p className="text-[11px] text-slate-500">Dry Provisions</p>
              </div>
            </Link>

            {/* 4. 24/7 Service */}
            <Link
              to="/contact"
              className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  24/7 Service
                </h4>
                <p className="text-[11px] text-slate-500">Operations Desk</p>
              </div>
            </Link>

            {/* 5. Suez & Red Sea Ports */}
            <Link
              to="/ports"
              className="col-span-2 sm:col-span-1 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-sky-300 transition-all flex items-center gap-3 group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#0B2545] leading-tight">
                  Suez & Red Sea
                </h4>
                <p className="text-[11px] text-slate-500">All Ports & Roads</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. STATS BAND (Blueprint Page 1) */}
      <section className="bg-white py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight">
                500+
              </span>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Vessels Supplied
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Across Suez Canal transit</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight">
                50+
              </span>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Global Clients
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Top shipowners & managers</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#D0201E] block font-cinzel tracking-tight">
                24/7
              </span>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Operational Support
              </p>
              <p className="text-xs text-slate-400 mt-0.5">Continuous launch readiness</p>
            </div>

            <div className="pt-4 lg:pt-0">
              <span className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] block font-cinzel tracking-tight">
                100%
              </span>
              <p className="text-sm font-semibold text-slate-600 uppercase tracking-wider mt-1">
                Commitment to Quality
              </p>
              <p className="text-xs text-slate-400 mt-0.5">HACCP cold chain guarantee</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. "SUPPLYING VESSELS AROUND THE WORLD" SECTION (Blueprint Page 1) */}
      <section className="py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left descriptive copy */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#D0201E]">
                <Anchor className="w-4 h-4" />
                <span>About Mentors Marine Provisions</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#0B2545] tracking-tight font-cinzel leading-tight">
                Supplying Vessels Around the World
              </h2>

              <p className="text-slate-600 text-base leading-relaxed">
                Mentors Marine Provisions is a Suez-based ship chandler providing high-quality marine provisions and supplies to vessels transiting the Suez Canal and Egyptian ports. We combine local expertise with global standards to keep your crew and vessel fully supported.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900 font-semibold">Strategic Suez Foothold:</strong> Warehouses located minutes from Port Tawfik and Suez port gates ensure zero transit delays for urgent convoys.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900 font-semibold">Unbroken Cold Chain:</strong> Modern refrigerated trucks and insulated reefer delivery launches maintain exact temperatures from farm to vessel deck.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">
                    <strong className="text-slate-900 font-semibold">Customs Coordination:</strong> In-house clearance agents expedite bonded stores, cigarettes, and imported spare parts with official seals.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm px-6 py-3 rounded-lg shadow transition-colors"
                >
                  <span>Learn More About Us</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/get-a-quote"
                  className="inline-flex items-center gap-2 text-sm font-bold text-[#D0201E] hover:underline"
                >
                  <span>Request Instant Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Video Thumbnail (Blueprint: Video-style thumbnail with play button "Watch Our Story") */}
            <div className="lg:col-span-6">
              <div
                onClick={() => setIsVideoModalOpen(true)}
                className="relative rounded-2xl overflow-hidden shadow-2xl group cursor-pointer border-4 border-white aspect-video bg-slate-900"
              >
                <img
                  src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80"
                  alt="Mentors Marine Provisions fleet delivery operations"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B2545]/90 via-[#0B2545]/30 to-transparent"></div>

                {/* Animated Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-[#D0201E] group-hover:bg-[#b01716] text-white flex items-center justify-center shadow-2xl transition-transform group-hover:scale-110 group-active:scale-95">
                    <Play className="w-8 h-8 ml-1 fill-white" />
                  </div>
                </div>

                {/* Bottom title & label */}
                <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                  <div>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 backdrop-blur-md text-sky-300 text-xs font-semibold mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Behind the Scenes</span>
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-wide">
                      Watch Our Story
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      24/7 Provisions Delivery in Suez Canal & Egyptian Ports
                    </p>
                  </div>
                  <span className="text-xs font-mono text-white/80 bg-black/50 px-2.5 py-1 rounded">
                    04:30
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SERVICES PREVIEW TEASER */}
      <section className="py-16 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#D0201E]">
                Comprehensive Ship Chandler Services
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-cinzel mt-1">
                Complete Supply Solutions For Every Call
              </h2>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-sm font-bold text-[#0B2545] hover:text-[#D0201E] transition-colors"
            >
              <span>Explore All 6 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_SERVICES.slice(0, 3).map((service) => (
              <div
                key={service.id}
                className="bg-slate-50 rounded-xl overflow-hidden border border-slate-200 hover:shadow-lg transition-all flex flex-col group"
              >
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-[#0B2545] text-white text-[11px] font-bold px-2.5 py-1 rounded shadow">
                    {service.badge}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-[#0B2545] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-2">
                      {service.shortDesc}
                    </p>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200 flex items-center justify-between">
                    <Link
                      to={`/services#${service.id}`}
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1"
                    >
                      <span>Learn More</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <Link
                      to={`/get-a-quote?service=${encodeURIComponent(service.title)}`}
                      className="text-xs font-bold text-[#D0201E] hover:underline"
                    >
                      Quick Quote
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. TRUSTED PARTNERS / CLIENT TESTIMONIALS */}
      <section className="py-14 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold tracking-widest text-sky-400 uppercase">
              Proven Track Record
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel mt-1">
              Trusted by Masters & Fleet Managers Worldwide
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_TESTIMONIALS.map((item, idx) => (
              <div
                key={idx}
                className="bg-white/5 border border-white/10 rounded-xl p-6 flex flex-col justify-between"
              >
                <p className="text-slate-300 text-xs sm:text-sm italic leading-relaxed mb-4">
                  "{item.quote}"
                </p>
                <div className="pt-3 border-t border-white/10">
                  <strong className="text-white text-sm block font-semibold">
                    {item.author}
                  </strong>
                  <span className="text-xs text-slate-400 block">{item.role}</span>
                  <span className="text-xs text-sky-400 font-semibold">{item.vessel}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Modal component */}
      <VideoModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  );
};
