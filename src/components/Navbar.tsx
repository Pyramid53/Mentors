import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Clock,
  PhoneCall,
  LayoutDashboard,
  User,
  LogOut,
  Globe,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  Package,
  Wrench,
  Wine,
  Users,
  MapPin
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
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'ports' | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());
  const [unreadCount, setUnreadCount] = useState({ quotes: 0, inquiries: 0, total: 0 });
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  const navRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Subscribe to localization & authentication changes
  useEffect(() => {
    const unsubLang = languageStore.subscribe((l) => setCurrentLang(l));
    const unsubAuth = authStore.subscribe((user) => setCurrentUser(user));
    return () => {
      unsubLang();
      unsubAuth();
    };
  }, []);

  // Unread counts for staff
  useEffect(() => {
    const updateCounts = () => {
      setUnreadCount(requestStore.getUnreadCount());
    };
    updateCounts();
    const unsub = requestStore.subscribe(updateCounts);
    return () => unsub();
  }, []);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveDropdown(null);
    setUserDropdownOpen(false);
  }, [location.pathname]);

  const handleLanguageChange = (lang: Language) => {
    languageStore.setLanguage(lang);
  };

  const isRTL = currentLang === 'ar';

  const isCurrent = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className="w-full sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-200/90"
      id="main-header"
      ref={navRef}
    >
      {/* SINGLE FULL-WIDTH NAVBAR CONTAINER */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-20 gap-4">
          {/* BRAND LOGO & TITLE */}
          <Link
            to="/"
            className="flex items-center gap-3.5 group shrink-0"
            id="brand-logo-link"
          >
            <div className="w-11 h-11 rounded-xl bg-[#0B2545] flex items-center justify-center text-white shadow-xs border border-slate-700/50 group-hover:border-amber-400/80 transition-all shrink-0">
              <Anchor className="w-6 h-6 text-amber-400 stroke-[2.2]" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-extrabold text-lg sm:text-xl xl:text-2xl tracking-wide text-[#0B2545] font-cinzel leading-none whitespace-nowrap">
                {isRTL ? 'MENTORS MARINE' : 'MENTORS MARINE'}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#C81D25] uppercase leading-tight mt-1 whitespace-nowrap">
                {isRTL ? 'تموين وتوريدات السفن البحرية' : 'SHIP CHANDLERS & PROVISIONS'}
              </span>
            </div>
          </Link>

          {/* DESKTOP NAVIGATION LINKS - ALL GUARANTEED ON 1 LINE */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 shrink-0" id="desktop-nav">
            {/* Home */}
            <Link
              to="/"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                isCurrent('/') && location.pathname === '/'
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              <span className="whitespace-nowrap">{languageStore.t('nav_home')}</span>
            </Link>

            {/* Services Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'services' ? null : 'services')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  isCurrent('/services') || activeDropdown === 'services'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap">{languageStore.t('nav_services')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    activeDropdown === 'services' ? 'rotate-180 text-[#0B2545]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'services' && (
                <div
                  className={`absolute top-full ${
                    isRTL ? 'right-0' : 'left-0'
                  } mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1`}
                >
                  <Link
                    to="/services"
                    className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-[#0B2545] hover:bg-slate-50 border-b border-slate-100 whitespace-nowrap"
                  >
                    <Package className="w-4 h-4 text-sky-600 shrink-0" />
                    <span className="whitespace-nowrap">{languageStore.t('nav_all_services')}</span>
                  </Link>

                  <Link
                    to="/services#provisions"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                    <span className="whitespace-nowrap">{languageStore.t('nav_fresh_provisions')}</span>
                  </Link>

                  <Link
                    to="/services#technical-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] whitespace-nowrap"
                  >
                    <Wrench className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="whitespace-nowrap">{languageStore.t('nav_tech_stores')}</span>
                  </Link>

                  <Link
                    to="/services#dry-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] whitespace-nowrap"
                  >
                    <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0"></span>
                    <span className="whitespace-nowrap">{languageStore.t('nav_dry_stores')}</span>
                  </Link>

                  <Link
                    to="/services#bonded-stores"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] whitespace-nowrap"
                  >
                    <Wine className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                    <span className="whitespace-nowrap">{languageStore.t('nav_bonded')}</span>
                  </Link>

                  <Link
                    to="/services#crew-welfare"
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[#0B2545] whitespace-nowrap"
                  >
                    <Users className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                    <span className="whitespace-nowrap">{languageStore.t('nav_crew_welfare')}</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Ports Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setActiveDropdown(activeDropdown === 'ports' ? null : 'ports')}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                  isCurrent('/ports') || activeDropdown === 'ports'
                    ? 'text-[#0B2545] bg-slate-100 font-bold'
                    : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
                }`}
              >
                <span className="whitespace-nowrap">{languageStore.t('nav_ports')}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 shrink-0 ${
                    activeDropdown === 'ports' ? 'rotate-180 text-[#0B2545]' : ''
                  }`}
                />
              </button>

              {activeDropdown === 'ports' && (
                <div
                  className={`absolute top-full ${
                    isRTL ? 'right-0' : 'left-0'
                  } mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-1`}
                >
                  <Link
                    to="/ports"
                    className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#0B2545] hover:bg-slate-50 border-b border-slate-100 whitespace-nowrap"
                  >
                    <MapPin className="w-3.5 h-3.5 text-[#C81D25] shrink-0" />
                    <span className="whitespace-nowrap">{languageStore.t('nav_all_ports')}</span>
                  </Link>

                  <Link to="/ports#suez-port" className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <span className="whitespace-nowrap">{languageStore.t('nav_suez_port')}</span>
                    <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">HQ</span>
                  </Link>
                  <Link to="/ports#ain-sokhna" className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <span className="whitespace-nowrap">{languageStore.t('nav_sokhna')}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold whitespace-nowrap">Deepwater</span>
                  </Link>
                  <Link to="/ports#adabiya" className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <span className="whitespace-nowrap">{languageStore.t('nav_adabiya')}</span>
                    <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">Commercial</span>
                  </Link>
                  <Link to="/ports#suez-anchorage" className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <span className="whitespace-nowrap">{languageStore.t('nav_anchorage')}</span>
                    <span className="text-[10px] text-sky-600 font-semibold whitespace-nowrap">V-Zone</span>
                  </Link>
                  <Link to="/ports#port-said" className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 whitespace-nowrap">
                    <span className="whitespace-nowrap">{languageStore.t('nav_port_said')}</span>
                    <span className="text-[10px] text-slate-400 font-semibold whitespace-nowrap">North</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Why Us */}
            <Link
              to="/why-us"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                isCurrent('/why-us')
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              <span className="whitespace-nowrap">{languageStore.t('nav_why_us')}</span>
            </Link>

            {/* About */}
            <Link
              to="/about"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                isCurrent('/about')
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              <span className="whitespace-nowrap">{languageStore.t('nav_about')}</span>
            </Link>

            {/* Contact */}
            <Link
              to="/contact"
              className={`px-3.5 py-2 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                isCurrent('/contact')
                  ? 'text-[#0B2545] bg-slate-100 font-bold'
                  : 'text-slate-600 hover:text-[#0B2545] hover:bg-slate-50'
              }`}
            >
              <span className="whitespace-nowrap">{languageStore.t('nav_contact')}</span>
            </Link>
          </nav>

          {/* RIGHT ACTION BUTTONS: CLEAN, ELEGANT, STRICT 1-LINE CONTROLS */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {/* Language Switcher Pill */}
            <div className="inline-flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
              <button
                type="button"
                onClick={() => handleLanguageChange('en')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase transition-all whitespace-nowrap ${
                  currentLang === 'en'
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="English"
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => handleLanguageChange('ar')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold font-cairo transition-all whitespace-nowrap ${
                  currentLang === 'ar'
                    ? 'bg-[#0B2545] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="العربية"
              >
                العربية
              </button>
            </div>

            {/* Client Portal Button / User Menu */}
            {currentUser ? (
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="inline-flex items-center gap-2 bg-slate-50 hover:bg-slate-100 text-[#0B2545] border border-slate-200/90 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-2xs active:scale-[0.98] whitespace-nowrap"
                  id="user-menu-btn"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0B2545] text-amber-400 font-extrabold text-[10px] flex items-center justify-center shrink-0">
                    {currentUser.avatarInitials || 'MM'}
                  </div>
                  <span className="truncate whitespace-nowrap">{currentUser.name.split(' ')[0]}</span>
                  {currentUser.role === 'admin' && (
                    <span className="bg-amber-400 text-slate-950 text-[9px] uppercase px-1.5 py-0.5 rounded font-black whitespace-nowrap">
                      {isRTL ? 'طاقم العمل' : 'Staff'}
                    </span>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </button>

                {userDropdownOpen && (
                  <div
                    className={`absolute ${
                      isRTL ? 'left-0' : 'right-0'
                    } mt-2 w-64 rounded-xl bg-white border border-slate-200 shadow-xl py-2 z-50 text-xs animate-in fade-in`}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/60">
                      <strong className="block font-bold text-slate-900 truncate whitespace-nowrap">
                        {currentUser.name}
                      </strong>
                      <span className="block text-slate-500 text-[10px] truncate font-mono whitespace-nowrap">
                        {currentUser.email}
                      </span>
                    </div>

                    <div className="py-1">
                      {currentUser.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center justify-between px-4 py-2.5 hover:bg-amber-50 text-amber-900 font-bold whitespace-nowrap"
                        >
                          <div className="flex items-center gap-2 whitespace-nowrap">
                            <LayoutDashboard className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span className="whitespace-nowrap">{isRTL ? 'مكتب العمليات' : 'Operations Admin'}</span>
                          </div>
                          {unreadCount.total > 0 && (
                            <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full whitespace-nowrap">
                              {unreadCount.total}
                            </span>
                          )}
                        </Link>
                      )}

                      <Link
                        to="/client-portal"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium whitespace-nowrap"
                      >
                        <User className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                        <span className="whitespace-nowrap">{languageStore.t('nav_my_account')}</span>
                      </Link>

                      <Link
                        to="/get-a-quote"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-slate-50 text-slate-700 font-medium whitespace-nowrap"
                      >
                        <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="whitespace-nowrap">{languageStore.t('nav_new_requisition')}</span>
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
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                      >
                        <LogOut className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        <span className="whitespace-nowrap">{languageStore.t('nav_sign_out')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/client-portal"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all text-slate-700 hover:text-[#0B2545] hover:bg-slate-100/90 border border-slate-200/90 shadow-2xs active:scale-[0.98] whitespace-nowrap shrink-0"
                id="main-signin-btn"
                title={isRTL ? "تسجيل الدخول" : "Login"}
              >
                <User className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="whitespace-nowrap">{languageStore.t('nav_portal')}</span>
              </Link>
            )}

            {/* Primary CTA: 60-Minute Fast Quotation - STRICT SINGLE LINE */}
            <Link
              to="/get-a-quote"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm hover:shadow-md active:scale-[0.98] bg-[#C81D25] hover:bg-[#a8161d] text-white whitespace-nowrap shrink-0"
              id="main-quote-btn"
            >
              <Clock className="w-4 h-4 text-amber-300 shrink-0" />
              <span className="whitespace-nowrap">{languageStore.t('nav_quote_instant')}</span>
              <ArrowRight className={`w-4 h-4 shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
            </Link>
          </div>

          {/* MOBILE CONTROLS: LANGUAGE & MENU BUTTON */}
          <div className="flex items-center gap-2.5 lg:hidden">
            <button
              type="button"
              onClick={() => handleLanguageChange(currentLang === 'en' ? 'ar' : 'en')}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-800 bg-slate-50 flex items-center gap-1.5"
              aria-label="Toggle language"
            >
              <Globe className="w-3.5 h-3.5 text-sky-600" />
              <span>{currentLang === 'en' ? 'عربي' : 'EN'}</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-800 hover:bg-slate-100 focus:outline-none border border-slate-200/70"
              aria-label="Toggle navigation menu"
              id="mobile-menu-toggle"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-[#0B2545]" />}
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE RESPONSIVE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-4 shadow-xl max-h-[85vh] overflow-y-auto animate-in slide-in-from-top-1">
          {/* Quick Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/get-a-quote"
              className="bg-[#C81D25] text-white text-center py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
            >
              <Clock className="w-3.5 h-3.5 text-amber-300" />
              <span>{languageStore.t('nav_quote_instant')}</span>
            </Link>
            <Link
              to="/contact"
              className="bg-[#0B2545] text-white text-center py-2.5 px-3 rounded-xl font-bold text-xs shadow-xs flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5 text-sky-400" />
              <span>{languageStore.t('nav_contact')}</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100 text-sm font-semibold">
            <Link to="/" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_home')}
            </Link>

            <Link to="/services" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_services')}
            </Link>

            <Link to="/ports" className="block py-2.5 text-slate-800 hover:text-[#0B2545]">
              {languageStore.t('nav_ports')}
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

            <Link to="/client-portal" className="flex items-center gap-2 py-2.5 text-[#0B2545]">
              <User className="w-4 h-4 text-sky-600" />
              <span>{languageStore.t('nav_portal')}</span>
            </Link>

            {currentUser?.role === 'admin' && (
              <Link to="/admin" className="block py-2.5 text-amber-700 font-bold">
                {isRTL ? 'مكتب العمليات والموظفين' : 'Operations Admin Desk (Staff)'}
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
