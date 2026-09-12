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
  Radio,
  MapPin,
  Lock,
  ArrowRight,
  Package,
  Wrench,
  Wine,
  Users,
  Compass,
  LayoutDashboard,
  User,
  LogOut,
  Globe,
  Mail,
  CheckCircle,
  FileSpreadsheet
} from 'lucide-react';
import { requestStore } from '../services/requestStore';
import { authStore } from '../services/authStore';
import { languageStore, Language } from '../services/languageStore';
import { AppUser } from '../types';

interface NavbarProps {
  onOpenQuickQuote?: () => void;
}

export const Navbar: React.FC<NavbarProps> = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());
  const [unreadCount, setUnreadCount] = useState({ quotes: 0, inquiries: 0, total: 0 });
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());
  const [suezTime, setSuezTime] = useState<string>('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Live Suez Port Local Time (Africa/Cairo EET)
  useEffect(() => {
    const updateSuezClock = () => {
      try {
        const now = new Date();
        const formatter = new Intl.DateTimeFormat('en-GB', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
        setSuezTime(formatter.format(now));
      } catch {
        setSuezTime('24/7 ONLINE');
      }
    };
    updateSuezClock();
    const timer = setInterval(updateSuezClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubLang = languageStore.subscribe((l) => setCurrentLang(l));
    const unsubAuth = authStore.subscribe((user) => setCurrentUser(user));
    return () => {
      unsubLang();
      unsubAuth();
    };
  }, []);

  useEffect(() => {
    const updateCounts = () => {
      setUnreadCount(requestStore.getUnreadCount());
    };
    updateCounts();
    const unsub = requestStore.subscribe(updateCounts);
    return () => unsub();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserDropdownOpen(false);
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

  const handleLanguageChange = (lang: Language) => {
    languageStore.setLanguage(lang);
  };

  const isRTL = currentLang === 'ar';

  return (
    <header className="w-full sticky top-0 z-50 bg-white shadow-sm border-b border-slate-200" id="main-header">
      {/* 1. TOP MARITIME DISPATCH & TELEMETRY STRIP (Full Width, Highest Level) */}
      <div className="w-full bg-[#061528] text-slate-300 text-xs border-b border-white/10 hidden md:block select-none">
        <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <div className="flex items-center justify-between h-9">
            {/* Left Telemetry: Live Suez Time & Radio Watch */}
            <div className="flex items-center gap-3 lg:gap-5 text-[11px] xl:text-xs">
              <div className="flex items-center gap-1.5 text-emerald-400 font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <Radio className="w-3.5 h-3.5" />
                <span className="uppercase font-mono">
                  SUEZ PORT: <strong className="text-white font-bold">{suezTime || '24/7'}</strong> (EET)
                </span>
              </div>

              <span className="text-white/20 hidden lg:inline">|</span>

              <div className="hidden lg:flex items-center gap-1.5 text-slate-300 font-medium">
                <Compass className="w-3.5 h-3.5 text-sky-400" />
                <span>{languageStore.t('top_vhf')}</span>
              </div>

              <span className="text-white/20 hidden xl:inline">|</span>

              <div className="hidden xl:flex items-center gap-1.5 text-amber-300 font-semibold">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{languageStore.t('top_fast_quote')}</span>
              </div>

              <span className="text-white/20 hidden 2xl:inline">|</span>

              <div className="hidden 2xl:flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
                <span>{languageStore.t('top_trusted')}</span>
              </div>
            </div>

            {/* Right Telemetry: Hotline, Dispatch Email & Language Switcher */}
            <div className="flex items-center gap-3 lg:gap-4 text-[11px] xl:text-xs font-medium">
              <a
                href="mailto:ops@mentorsmarine.com"
                className="hidden xl:flex items-center gap-1.5 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="w-3 h-3 text-sky-400" />
                <span>ops@mentorsmarine.com</span>
              </a>

              <span className="text-white/20 hidden xl:inline">|</span>

              <a
                href="tel:+201008924477"
                className="flex items-center gap-1.5 text-slate-200 hover:text-amber-300 transition-colors font-mono font-semibold"
                id="header-hotline"
              >
                <Phone className="w-3 h-3 text-emerald-400" />
                <span>+20 100 892 4477</span>
              </a>

              <span className="text-white/20">|</span>

              {/* Language Selector (EN / العربية) */}
              <div className="inline-flex items-center bg-white/10 p-0.5 rounded-md border border-white/15">
                <button
                  type="button"
                  onClick={() => handleLanguageChange('en')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase transition-all ${
                    currentLang === 'en'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => handleLanguageChange('ar')}
                  className={`px-2 py-0.5 rounded text-[10px] font-bold font-cairo transition-all ${
                    currentLang === 'ar'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-slate-300 hover:text-white'
                  }`}
                  title="التحويل للغة العربية"
                >
                  العربية
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. MAIN LOGO & NAVIGATION HEADER (Full Width) */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex items-center justify-between h-20" ref={dropdownRef}>
          {/* Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group flex-shrink-0"
            id="brand-logo-link"
          >
            <div className="w-11 h-11 lg:w-12 lg:h-12 rounded-xl bg-gradient-to-br from-[#0B2545] via-[#0D2E57] to-[#061528] flex items-center justify-center text-white shadow-md border border-slate-700/30 group-hover:border-amber-400/60 transition-all flex-shrink-0">
              <Anchor className="w-6 h-6 lg:w-7 lg:h-7 text-amber-400 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl lg:text-2xl tracking-wider text-[#0B2545] font-cinzel leading-none">
                  MENTORS
                </span>
                <span className="hidden sm:inline-block text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300/60">
                  ISO 22000
                </span>
              </div>
              <span className="text-[10px] lg:text-[11px] font-bold tracking-[0.2em] text-[#C81D25] uppercase leading-tight mt-1">
                MARINE PROVISIONS & SHIP CHANDLERY
              </span>
              <span className="text-[10px] text-slate-500 font-medium hidden xl:block leading-none mt-0.5">
                Suez Canal, Ain Sokhna & All Egyptian Ports • 24/7 Operations
              </span>
            </div>
          </Link>

          {/* Desktop Reorganized Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2 2xl:space-x-3" id="desktop-nav">
            {/* 1. Home */}
            <Link
              to="/"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/') && location.pathname === '/'
                  ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              {languageStore.t('nav_home')}
            </Link>

            {/* 2. Services & Provisions (Dropdown) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('services')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/services') || activeDropdown === 'services'
                    ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>{languageStore.t('nav_services')}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'services' ? 'rotate-180 text-[#0B2545]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'services' && (
                <div
                  className={`absolute top-full ${
                    isRTL ? 'right-0' : 'left-0'
                  } mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="px-4 pb-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Marine Supply Divisions
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Cold chain delivered direct to anchorage & berths
                    </span>
                  </div>

                  <Link
                    to="/services"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-[#0B2545] hover:bg-slate-50 transition-colors"
                  >
                    <Package className="w-4 h-4 text-sky-600" />
                    <div className="flex flex-col">
                      <span>{languageStore.t('nav_all_services')}</span>
                      <span className="text-[10px] font-normal text-slate-500">Overview of certified ship stores</span>
                    </div>
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <Link
                    to="/services#provisions"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex-shrink-0"></span>
                    <div className="flex flex-col">
                      <span className="font-semibold">{languageStore.t('nav_fresh_provisions')}</span>
                      <span className="text-[10px] text-slate-500">HACCP meats, poultry, dairy & fresh produce</span>
                    </div>
                  </Link>

                  <Link
                    to="/services#technical-stores"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] transition-colors"
                  >
                    <Wrench className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{languageStore.t('nav_tech_stores')}</span>
                      <span className="text-[10px] text-slate-500">IMPA/ISSA valves, cables, ropes & tools</span>
                    </div>
                  </Link>

                  <Link
                    to="/services#dry-stores"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] transition-colors"
                  >
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500 flex-shrink-0"></span>
                    <div className="flex flex-col">
                      <span className="font-semibold">{languageStore.t('nav_dry_stores')}</span>
                      <span className="text-[10px] text-slate-500">Mineral water, grains, canned food & beverages</span>
                    </div>
                  </Link>

                  <Link
                    to="/services#bonded-stores"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] transition-colors"
                  >
                    <Wine className="w-4 h-4 text-purple-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{languageStore.t('nav_bonded')}</span>
                      <span className="text-[10px] text-slate-500">Duty-free tobacco, confectionary & crew rations</span>
                    </div>
                  </Link>

                  <Link
                    to="/services#crew-welfare"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] transition-colors"
                  >
                    <Users className="w-4 h-4 text-teal-500 flex-shrink-0" />
                    <div className="flex flex-col">
                      <span className="font-semibold">{languageStore.t('nav_crew_welfare')}</span>
                      <span className="text-[10px] text-slate-500">Safety PPE, SIM connectivity & medical kits</span>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* 3. Ports & Coverage (Dropdown) */}
            <div className="relative">
              <button
                type="button"
                onClick={() => toggleDropdown('ports')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                  isActive('/ports') || activeDropdown === 'ports'
                    ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                    : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span>{languageStore.t('nav_ports')}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    activeDropdown === 'ports' ? 'rotate-180 text-[#0B2545]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'ports' && (
                <div
                  className={`absolute top-full ${
                    isRTL ? 'right-0' : 'left-0'
                  } mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150`}
                >
                  <div className="px-4 pb-2 border-b border-slate-100 mb-1">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Egyptian Terminals & Roadsteads
                    </span>
                    <span className="text-[10px] text-slate-500">Barge launch & berthside delivery</span>
                  </div>

                  <Link
                    to="/ports"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm font-bold text-[#0B2545] hover:bg-slate-50"
                  >
                    <MapPin className="w-4 h-4 text-[#C81D25]" />
                    <span>{languageStore.t('nav_all_ports')}</span>
                  </Link>

                  <div className="border-t border-slate-100 my-1"></div>

                  <Link to="/ports#suez-port" className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    <span>{languageStore.t('nav_suez_port')}</span>
                    <span className="text-[10px] text-slate-400">Headquarters</span>
                  </Link>
                  <Link to="/ports#ain-sokhna" className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    <span>{languageStore.t('nav_sokhna')}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold">Deepwater</span>
                  </Link>
                  <Link to="/ports#adabiya" className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    <span>{languageStore.t('nav_adabiya')}</span>
                    <span className="text-[10px] text-slate-400">Commercial</span>
                  </Link>
                  <Link to="/ports#suez-anchorage" className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    <span>{languageStore.t('nav_anchorage')}</span>
                    <span className="text-[10px] text-sky-600 font-semibold">V-Zone Waiting</span>
                  </Link>
                  <Link to="/ports#port-said" className="flex items-center justify-between px-4 py-1.5 text-xs text-slate-700 hover:bg-slate-50 font-medium">
                    <span>{languageStore.t('nav_port_said')}</span>
                    <span className="text-[10px] text-slate-400">North Convoy</span>
                  </Link>
                </div>
              )}
            </div>

            {/* 4. Live AIS Suez Vessel Tracker */}
            <Link
              to="/track-vessel"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/track-vessel')
                  ? 'text-[#0B2545] bg-sky-50 font-bold border border-sky-200'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              <Compass className="w-4 h-4 text-sky-600 animate-spin-slow" />
              <span>{languageStore.t('nav_track')}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </Link>

            {/* 5. Why Us */}
            <Link
              to="/why-us"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/why-us')
                  ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              {languageStore.t('nav_why_us')}
            </Link>

            {/* 6. About Company */}
            <Link
              to="/about"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/about')
                  ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              {languageStore.t('nav_about')}
            </Link>

            {/* 7. Contact Us */}
            <Link
              to="/contact"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                isActive('/contact')
                  ? 'text-[#0B2545] bg-slate-100/80 font-bold'
                  : 'text-slate-700 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              {languageStore.t('nav_contact')}
            </Link>
          </nav>

          {/* Right Action Cluster: Client Portal & 60-Min Quotation CTA */}
          <div className="hidden lg:flex items-center gap-2.5 xl:gap-3 flex-shrink-0">
            {/* Authenticated User / Client Portal Button */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#12345C] text-white px-3 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 border border-sky-400/30"
                  id="user-menu-btn"
                >
                  <div className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 font-black text-[10px] flex items-center justify-center font-cinzel">
                    {currentUser.avatarInitials || 'MM'}
                  </div>
                  <span className="max-w-[90px] truncate">{currentUser.name.split(' ')[0]}</span>
                  {currentUser.role === 'admin' ? (
                    <span className="bg-amber-400 text-slate-950 text-[9px] uppercase px-1 py-0.2 rounded font-black">
                      Staff
                    </span>
                  ) : null}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute ${
                      isRTL ? 'left-0' : 'right-0'
                    } mt-2 w-64 rounded-2xl bg-white border border-slate-200 shadow-2xl py-2 z-50 text-xs animate-in fade-in`}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/70">
                      <strong className="block font-bold text-slate-900 text-sm truncate">
                        {currentUser.name}
                      </strong>
                      <span className="block text-slate-500 text-[11px] truncate">
                        {currentUser.company}
                      </span>
                      <span className="block text-slate-400 text-[10px] truncate mt-0.5 font-mono">
                        {currentUser.email}
                      </span>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2 hover:bg-amber-50 text-amber-900 font-bold"
                        >
                          <div className="flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4 text-amber-600" />
                            <span>Operations Admin Desk</span>
                          </div>
                          {unreadCount.total > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                              {unreadCount.total}
                            </span>
                          )}
                        </Link>
                      )}

                      <Link
                        to="/client-portal"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <User className="w-4 h-4 text-sky-600" />
                        <span>{languageStore.t('nav_my_account')}</span>
                      </Link>

                      <Link
                        to="/get-a-quote"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        <Package className="w-4 h-4 text-emerald-600" />
                        <span>New Vessel Requisition</span>
                      </Link>
                    </div>

                    <div className="border-t border-slate-100 pt-1">
                      <button
                        type="button"
                        onClick={() => {
                          authStore.logout();
                          setUserDropdownOpen(false);
                          navigate('/');
                        }}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>{languageStore.t('nav_sign_out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/client-portal"
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all text-slate-700 hover:text-[#0B2545] hover:bg-slate-100 border border-slate-200"
                id="main-signin-btn"
                title="Client Portal Sign In"
              >
                <Lock className="w-3.5 h-3.5 text-sky-600" />
                <span>{languageStore.t('nav_portal')}</span>
              </Link>
            )}

            {/* Signature 60-Minute Fast Quotation CTA */}
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95 bg-[#C81D25] hover:bg-[#a8161d] text-white border border-red-700/40"
              id="main-quote-btn"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{languageStore.t('nav_quote_instant')}</span>
              <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* Mobile Right Controls: Language & Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Language Switcher Button on Mobile */}
            <button
              type="button"
              onClick={() => handleLanguageChange(currentLang === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-bold text-slate-800 bg-slate-50 flex items-center gap-1"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentLang === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            {/* Fast Quote button on mobile */}
            <Link
              to="/get-a-quote"
              className="bg-[#C81D25] hover:bg-[#a8161d] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow flex items-center gap-1"
            >
              <span>{languageStore.t('nav_cta_quote')}</span>
            </Link>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300"
              aria-label="Toggle menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* 3. MOBILE RESPONSIVE DRAWER (Full Width, Categorized) */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-2xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-2">
          {/* Live status badge */}
          <div className="bg-[#0B2545] text-white p-3 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-semibold font-mono">Suez: {suezTime || '24/7'}</span>
            </div>
            <a href="tel:+201008924477" className="text-amber-300 font-mono font-bold flex items-center gap-1">
              <Phone className="w-3.5 h-3.5" />
              <span>+20 100 892 4477</span>
            </a>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/get-a-quote"
              className="bg-[#C81D25] text-white text-center py-2.5 px-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{languageStore.t('nav_quote_instant')}</span>
            </Link>
            <Link
              to="/track-vessel"
              className="bg-[#0B2545] text-white text-center py-2.5 px-3 rounded-xl font-bold text-xs shadow flex items-center justify-center gap-1.5"
            >
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>{languageStore.t('nav_track')}</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-sm font-semibold">
            <Link to="/" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_home')}
            </Link>

            {/* Services Group */}
            <div className="py-2.5 space-y-1">
              <Link to="/services" className="block text-[#0B2545] font-bold">
                {languageStore.t('nav_services')}
              </Link>
              <div className="pl-3 space-y-1 text-xs text-slate-600 pt-1">
                <Link to="/services#provisions" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_fresh_provisions')}
                </Link>
                <Link to="/services#technical-stores" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_tech_stores')}
                </Link>
                <Link to="/services#dry-stores" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_dry_stores')}
                </Link>
                <Link to="/services#bonded-stores" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_bonded')}
                </Link>
                <Link to="/services#crew-welfare" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_crew_welfare')}
                </Link>
              </div>
            </div>

            {/* Ports Group */}
            <div className="py-2.5 space-y-1">
              <Link to="/ports" className="block text-[#0B2545] font-bold">
                {languageStore.t('nav_ports')}
              </Link>
              <div className="pl-3 space-y-1 text-xs text-slate-600 pt-1">
                <Link to="/ports#suez-port" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_suez_port')}
                </Link>
                <Link to="/ports#ain-sokhna" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_sokhna')}
                </Link>
                <Link to="/ports#adabiya" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_adabiya')}
                </Link>
                <Link to="/ports#suez-anchorage" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_anchorage')}
                </Link>
                <Link to="/ports#port-said" className="block py-1 hover:text-[#0B2545]">
                  • {languageStore.t('nav_port_said')}
                </Link>
              </div>
            </div>

            <Link to="/track-vessel" className="flex items-center justify-between py-2.5 text-slate-800 hover:text-[#0B2545]">
              <span className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-sky-600" />
                <span>{languageStore.t('nav_track')}</span>
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                LIVE AIS
              </span>
            </Link>

            <Link to="/why-us" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_why_us')}
            </Link>

            <Link to="/about" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_about')}
            </Link>

            <Link to="/contact" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_contact')}
            </Link>

            <Link to="/client-portal" className="flex items-center gap-2 py-2.5 text-sky-700 hover:text-[#0B2545]">
              <Lock className="w-4 h-4" />
              <span>{languageStore.t('nav_portal')}</span>
            </Link>

            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="block py-2.5 text-amber-600 font-bold">
                Operations Admin Desk (Staff)
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
