import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Phone,
  Clock,
  ShieldCheck,
  Ship,
  ChevronDown,
  Menu,
  X,
  FileText,
  Radio,
  MapPin,
  CheckCircle2,
  Lock,
  ArrowRight,
  Package,
  Wrench,
  Wine,
  Users,
  Compass
} from 'lucide-react';

interface NavbarProps {
  onOpenQuickQuote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="w-full sticky top-0 z-50 shadow-md bg-white">
      {/* 1. TOP UTILITY BAR (Blueprint layout) */}
      <div className="bg-[#0B2545] text-slate-200 border-b border-white/10 text-xs hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-10">
            {/* Quick service pills / items */}
            <div className="flex items-center space-x-4 xl:space-x-5 overflow-x-auto text-[11px] xl:text-xs text-slate-300 font-medium py-1">
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <Package className="w-3.5 h-3.5 text-sky-400" />
                <span>Fresh & Frozen Provisions</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                <span>Dry Stores & Beverages</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <Wrench className="w-3.5 h-3.5 text-sky-400" />
                <span>Technical Stores</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 text-amber-300 font-semibold whitespace-nowrap">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>60 Min Fast Quotation</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <Compass className="w-3.5 h-3.5 text-teal-400" />
                <span>Suez & Red Sea Ports</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <Ship className="w-3.5 h-3.5 text-sky-400" />
                <span>Direct to Vessel Support</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold whitespace-nowrap">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>24/7 Service</span>
              </span>
              <span className="text-white/20">|</span>
              <span className="flex items-center gap-1.5 hover:text-white transition-colors cursor-default whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
                <span>Trusted & Compliant</span>
              </span>
            </div>

            {/* Red Request a Quote CTA */}
            <div className="flex items-center pl-4">
              <Link
                to="/get-a-quote"
                className="inline-flex items-center gap-1.5 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold px-3.5 py-1.5 rounded text-xs transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
              >
                <span>Request a Quote</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVIGATION */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20" ref={dropdownRef}>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-lg bg-[#0B2545] flex items-center justify-center text-white shadow group-hover:bg-[#12345C] transition-colors">
              <Anchor className="w-7 h-7 text-sky-300 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-[#0B2545] font-cinzel leading-none">
                MENTORS
              </span>
              <span className="text-[11px] font-bold tracking-[0.2em] text-[#D0201E] uppercase leading-tight mt-0.5">
                MARINE PROVISIONS
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden sm:block">
                Your Suez Provisioning Desk – 24/7
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {/* Home */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            {/* About Us */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/about')
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              About Us
            </Link>

            {/* Our Services Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('services')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/services') || activeDropdown === 'services'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>Our Services</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-4 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 mb-1">
                    Ship Supply Solutions
                  </div>
                  <Link
                    to="/services"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Package className="w-4 h-4 text-sky-500" />
                    <span>All Provisions & Stores Overview</span>
                  </Link>
                  <Link
                    to="/services#provisions"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 ml-1"></span>
                    <span>Fresh & Frozen Provisions</span>
                  </Link>
                  <Link
                    to="/services#dry-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-500 ml-1"></span>
                    <span>Water & Beverages (Dry Stores)</span>
                  </Link>
                  <Link
                    to="/services#technical-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Wrench className="w-4 h-4 text-sky-600" />
                    <span>Deck & Engine Technical Stores</span>
                  </Link>
                  <Link
                    to="/services#bonded-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Wine className="w-4 h-4 text-purple-500" />
                    <span>Bonded Duty-Free Stores</span>
                  </Link>
                  <Link
                    to="/services#crew-welfare"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Users className="w-4 h-4 text-teal-500" />
                    <span>Crew Welfare & Telecommunications</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Get a Quote Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('quote')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/get-a-quote') || activeDropdown === 'quote'
                    ? 'text-[#D0201E] bg-red-50 font-bold'
                    : 'text-slate-700 hover:text-[#D0201E] hover:bg-slate-50'
                }`}
              >
                <span>Get a Quote</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'quote' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'quote' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/get-a-quote"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#D0201E] hover:bg-red-50"
                  >
                    <Clock className="w-4 h-4 text-[#D0201E]" />
                    <span>Instant 60-Min Quote Form</span>
                  </Link>
                  <Link
                    to="/get-a-quote?tab=list"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <FileText className="w-4 h-4 text-sky-500" />
                    <span>Upload Provision List (Excel/PDF)</span>
                  </Link>
                  <a
                    href="#download-catalog"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Standard Mentors Provisions & IMPA Catalog (PDF) download started.');
                    }}
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Package className="w-4 h-4 text-slate-400" />
                    <span>Price List & Catalog Download</span>
                  </a>
                </div>
              )}
            </div>

            {/* Ports We Serve Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('ports')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/ports') || activeDropdown === 'ports'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>Ports We Serve</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'ports' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'ports' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/ports"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#0B2545] hover:bg-slate-50"
                  >
                    <MapPin className="w-4 h-4 text-[#D0201E]" />
                    <span>All Egyptian Ports & Anchorages</span>
                  </Link>
                  <Link to="/ports#suez-port" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Port of Suez & Port Tawfik
                  </Link>
                  <Link to="/ports#ain-sokhna" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Ain Sokhna Port
                  </Link>
                  <Link to="/ports#adabiya" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Adabiya Commercial Port
                  </Link>
                  <Link to="/ports#suez-anchorage" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Suez Anchorage (V-Zone)
                  </Link>
                  <Link to="/ports#port-said" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Port Said (North Convoy)
                  </Link>
                </div>
              )}
            </div>

            {/* Why Us Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('whyus')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/why-us') || activeDropdown === 'whyus'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>Why Us</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'whyus' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'whyus' && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/why-us"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-[#0B2545] hover:bg-slate-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Our Key Advantages</span>
                  </Link>
                  <Link to="/why-us#certifications" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • HACCP & ISO Certifications
                  </Link>
                  <Link to="/why-us#food-safety" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Quality & Food Safety Protocol
                  </Link>
                  <Link to="/why-us#sustainability" className="block px-4 py-1.5 text-sm text-slate-700 hover:bg-slate-50">
                    • Sustainable Chandlery & Packaging
                  </Link>
                </div>
              )}
            </div>

            {/* Track Vessel Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('track')}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                  isActive('/track-vessel') || activeDropdown === 'track'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>Track Vessel</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${activeDropdown === 'track' ? 'rotate-180' : ''}`} />
              </button>

              {activeDropdown === 'track' && (
                <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-slate-100 py-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    to="/track-vessel?tab=map"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Compass className="w-4 h-4 text-sky-500" />
                    <span>Live Suez Canal Map</span>
                  </Link>
                  <Link
                    to="/track-vessel?tab=arrivals"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Ship className="w-4 h-4 text-teal-600" />
                    <span>Expected Arrivals (7 Days)</span>
                  </Link>
                  <Link
                    to="/track-vessel?tab=details"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545]"
                  >
                    <Radio className="w-4 h-4 text-emerald-500" />
                    <span>Check Vessel Status & IMO</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Contact Us */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-md text-sm font-semibold transition-colors ${
                isActive('/contact')
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              Contact Us
            </Link>

            {/* Client Portal Button (Blueprint spec) */}
            <Link
              to="/client-portal"
              className="ml-2 inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#12345C] text-white px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm active:scale-95"
            >
              <Lock className="w-4 h-4 text-sky-300" />
              <span>Client Portal</span>
            </Link>
          </nav>

          {/* Mobile menu trigger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              to="/get-a-quote"
              className="bg-[#D0201E] text-white text-xs font-bold px-3 py-2 rounded shadow flex items-center gap-1"
            >
              <span>Quote</span>
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE DRAWER (Panel 9 in blueprint) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl max-h-[85vh] overflow-y-auto">
          {/* Quick contact status bar */}
          <div className="bg-slate-900 text-white p-3 rounded-lg flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>24/7 Operations Desk</span>
            </div>
            <a href="tel:+201008924477" className="text-sky-300 font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>+20 100 892 4477</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <Link
              to="/get-a-quote"
              className="bg-[#D0201E] text-white text-center py-2.5 px-3 rounded-lg font-bold text-sm shadow"
            >
              Get a Quote (60 Min)
            </Link>
            <Link
              to="/track-vessel"
              className="bg-[#0B2545] text-white text-center py-2.5 px-3 rounded-lg font-bold text-sm shadow"
            >
              Track Vessel
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-sm font-semibold">
            <Link to="/" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Home
            </Link>
            <Link to="/about" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              About Us
            </Link>
            <Link to="/services" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Our Services (Provisions, Technical & Bonded)
            </Link>
            <Link to="/ports" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Ports We Serve (Suez, Ain Sokhna, Adabiya, Port Said)
            </Link>
            <Link to="/why-us" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Why Choose Mentors
            </Link>
            <Link to="/track-vessel" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Track Vessels in Suez (Live Map)
            </Link>
            <Link to="/contact" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              Contact Us & 24/7 Operations
            </Link>
            <Link to="/client-portal" className="block py-2.5 text-sky-700 font-bold">
              Client Portal (Login)
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
