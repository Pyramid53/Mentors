import React from 'react';
import { Link } from 'react-router-dom';
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

export const AboutPage: React.FC = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero */}
      <section className="relative py-20 bg-[#0B2545] text-white overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-25">
          <img
            src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=2000&q=80"
            alt="Suez Canal shipping lanes"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/10 text-sky-300 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide uppercase mb-4">
            <Anchor className="w-4 h-4" />
            <span>Dedicated Suez Ship Chandlers</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-cinzel text-white leading-tight">
            Supplying Vessels. <br />
            Building Lasting Partnerships.
          </h1>
          <p className="text-base sm:text-lg text-slate-300 mt-4 leading-relaxed">
            Founded in Suez, Egypt, Mentors Marine Provisions has grown into a premier vessel supply partner for leading shipowners, technical managers, and catering operators traversing the Suez Canal and calling Egyptian ports.
          </p>
        </div>
      </section>

      {/* Story & Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-[#D0201E]">
                Our Suez Canal Heritage
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B2545] font-cinzel leading-tight">
                Strategically Positioned at the Maritime Crossroads of the World
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                The Suez Canal is the artery of global trade. When a vessel transits between the Mediterranean and the Red Sea, there is zero tolerance for delay, substandard food, or missing technical stores.
              </p>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Mentors Marine Provisions was built specifically to eliminate supply friction. We operate private refrigerated warehousing, custom launch craft, and in-house customs clearing agents right at Port Tawfik and Suez port entrances.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                  <strong className="text-2xl font-cinzel font-bold text-[#0B2545] block">
                    60 Mins
                  </strong>
                  <span className="text-xs text-slate-500 font-medium">Standard Quotation Speed</span>
                </div>
                <div className="border border-slate-200 p-4 rounded-xl bg-slate-50">
                  <strong className="text-2xl font-cinzel font-bold text-[#D0201E] block">
                    100%
                  </strong>
                  <span className="text-xs text-slate-500 font-medium">Temperature Monitored Chain</span>
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
                    <strong className="text-sm font-bold text-slate-900 block">Precision & Speed</strong>
                    <span className="text-xs text-slate-500">Every item cross-checked against IMPA/ISSA codes before dispatch.</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-sm font-bold text-slate-900 block">Uncompromising Food Safety</strong>
                    <span className="text-xs text-slate-500">HACCP certified cold storage protecting crew welfare.</span>
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
            Ready to Experience Reliable Ship Chandlery?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            Send us your next requisition for Suez transit, Ain Sokhna, or Port Said and see the difference in quality and responsiveness.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/get-a-quote"
              className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-sm px-6 py-3 rounded-lg shadow transition-colors flex items-center gap-2"
            >
              <span>Request a Quote in 60 Mins</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm px-6 py-3 rounded-lg transition-colors"
            >
              Contact Operations Desk
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
