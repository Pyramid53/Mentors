import React from 'react';
import { Link } from 'react-router-dom';
import {
  Anchor,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  Award,
  ArrowRight,
  Radio,
  ExternalLink
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B2545] text-slate-300 border-t border-slate-800">
      {/* Upper CTA Banner */}
      <div className="bg-[#081b33] border-b border-white/10 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center md:text-left">
              <div className="w-12 h-12 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-red-500 animate-pulse" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Need an Immediate Quotation for Suez Transit?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Our 24/7 provisioning desk guarantees a tailored, competitive price within 60 minutes.
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="https://wa.me/201008924477"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow"
              >
                <span>WhatsApp 24/7 Ops</span>
              </a>
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-2 bg-[#D0201E] hover:bg-[#b01716] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-lg active:scale-95"
              >
                <span>Get a Quote in 60 Mins</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 flex items-center justify-center text-sky-300">
                <Anchor className="w-6 h-6 stroke-[2.2]" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-wider text-white font-cinzel">
                  MENTORS
                </span>
                <p className="text-[10px] font-bold tracking-[0.2em] text-red-400 uppercase">
                  MARINE PROVISIONS
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              Suez-based premier ship chandler and offshore provisioning specialists. Delivering fresh, frozen, dry, technical, and bonded provisions directly to vessels transiting the Suez Canal and calling all major Egyptian ports.
            </p>

            <div className="pt-2">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span className="text-white font-medium">VHF Marine Watch: Channel 16 / 73</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Callsign: <strong className="text-slate-200 font-semibold">MENTORS SUEZ SUPPLY</strong>
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-300 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                <span>ISO 22000 & HACCP</span>
              </span>
              <span className="text-xs px-2.5 py-1 bg-white/5 border border-white/10 rounded text-slate-300 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>IMPA / ISSA Registered</span>
              </span>
            </div>
          </div>

          {/* Quick Services */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Our Provisions
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/services#provisions" className="hover:text-white transition-colors">
                  Fresh & Frozen Provisions
                </Link>
              </li>
              <li>
                <Link to="/services#dry-stores" className="hover:text-white transition-colors">
                  Dry Stores & Mineral Water
                </Link>
              </li>
              <li>
                <Link to="/services#technical-stores" className="hover:text-white transition-colors">
                  Deck & Engine Technical Stores
                </Link>
              </li>
              <li>
                <Link to="/services#bonded-stores" className="hover:text-white transition-colors">
                  Bonded Stores & Cigarettes
                </Link>
              </li>
              <li>
                <Link to="/services#crew-welfare" className="hover:text-white transition-colors">
                  Crew Welfare & SIM Cards
                </Link>
              </li>
              <li>
                <Link to="/services#safety-chemicals" className="hover:text-white transition-colors">
                  Safety Gear & Marine Chemicals
                </Link>
              </li>
            </ul>
          </div>

          {/* Ports We Serve */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              Ports We Serve
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/ports#suez-port" className="hover:text-white transition-colors">
                  Port of Suez & Port Tawfik
                </Link>
              </li>
              <li>
                <Link to="/ports#ain-sokhna" className="hover:text-white transition-colors">
                  Ain Sokhna Deepwater Port
                </Link>
              </li>
              <li>
                <Link to="/ports#adabiya" className="hover:text-white transition-colors">
                  Adabiya Commercial Berths
                </Link>
              </li>
              <li>
                <Link to="/ports#suez-anchorage" className="hover:text-white transition-colors">
                  Suez Anchorage (V-Zone)
                </Link>
              </li>
              <li>
                <Link to="/ports#port-said" className="hover:text-white transition-colors">
                  Port Said (SCCT / West)
                </Link>
              </li>
              <li>
                <Link to="/ports#damietta" className="hover:text-white transition-colors">
                  Damietta & Alexandria
                </Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Operations Contact */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4 border-b border-white/10 pb-2">
              24/7 Operations Desk
            </h4>
            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span>Maritime Center, Port Tawfik, Suez Governorate, Egypt</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a href="tel:+201008924477" className="hover:text-white">
                  +20 100 892 4477
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>+20 62 333 4567 (Office)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-amber-400 shrink-0" />
                <a href="mailto:operations@mentors-marine.com" className="hover:text-white">
                  operations@mentors-marine.com
                </a>
              </div>
              <div className="pt-2">
                <Link
                  to="/track-vessel"
                  className="inline-flex items-center gap-1.5 text-xs text-sky-300 hover:text-white font-medium"
                >
                  <span>Open Live Vessel Tracker</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Tagline separator banner */}
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-sm font-semibold tracking-wide text-slate-200">
            Your Suez Provisioning Desk – 24/7 &nbsp;|&nbsp; Fresh Supplies &nbsp;|&nbsp; Global Standards &nbsp;|&nbsp; Trusted Partnership
          </p>
          <p className="font-script text-2xl sm:text-3xl text-sky-300 mt-2">
            Supplying Today For a Better Tomorrow
          </p>
        </div>

        {/* Bottom copyright & status */}
        <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Mentors Marine Provisions S.A.E. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/why-us#food-safety" className="hover:text-slate-200">
              Food Safety Policy
            </Link>
            <span>•</span>
            <Link to="/why-us#certifications" className="hover:text-slate-200">
              Quality Certifications
            </Link>
            <span>•</span>
            <Link to="/contact" className="hover:text-slate-200">
              Suez Operations Desk
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
