import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Ship,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Download,
  Filter,
  Search,
  Phone,
  Mail,
  MessageSquare,
  ShieldCheck,
  Send,
  ExternalLink,
  ChevronRight,
  Anchor,
  Plus,
  RefreshCw,
  Eye,
  EyeOff,
  Check,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  X,
  AlertCircle,
  Lock,
  LogOut,
  User,
  Shield,
  Printer,
  Globe,
  TrendingUp,
  DollarSign,
  BarChart2,
  PieChart,
  Users,
  Briefcase
} from 'lucide-react';
import { requestStore } from '../services/requestStore';
import { authStore } from '../services/authStore';
import { languageStore, Language } from '../services/languageStore';
import { getSupabaseClient } from '../services/supabaseClient';
import { AdminQuoteRequest, AdminContactInquiry, RFQStatus, ContactStatus, AppUser } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();

  // Authentication & Clearance State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Localization
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  // Operational State & Navigation tabs matching Blueprint Panel 8
  // Tabs: 'dashboard' (Analytics Overview), 'rfqs' (RFQs), 'quotes' (Quotes/Pricing), 'orders' (Orders), 'customers' (Customers), 'inquiries' (Messages)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rfqs' | 'quotes' | 'orders' | 'customers' | 'inquiries'>('dashboard');

  // Quotes & Inquiries from store
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [inquiries, setInquiries] = useState<AdminContactInquiry[]>([]);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected quote for detailed pricing drawer
  const [selectedQuote, setSelectedQuote] = useState<AdminQuoteRequest | null>(null);

  // Drawer form state for editing pricing/quote
  const [editQuotedAmount, setEditQuotedAmount] = useState<string>('');
  const [editOfficer, setEditOfficer] = useState<string>('');
  const [editLaunchBoat, setEditLaunchBoat] = useState<string>('');
  const [editAdminNotes, setEditAdminNotes] = useState<string>('');

  // Toast notifications
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Live Suez clocks
  const [suezTime, setSuezTime] = useState<string>('');
  const [zuluTime, setZuluTime] = useState<string>('');

  // Supabase connection status
  const [dbStatus, setDbStatus] = useState<{ configured: boolean; message: string; count: number } | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubLang = languageStore.subscribe((l) => setCurrentLang(l));
    const unsubAuth = authStore.subscribe((u) => setCurrentUser(u));
    return () => {
      unsubLang();
      unsubAuth();
    };
  }, []);

  const checkDbHealth = async () => {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        const data = await res.json();
        setDbStatus({
          configured: !!data.supabaseConfigured && data.database === 'supabase_connected_healthy',
          message: data.database === 'supabase_connected_healthy' ? 'Supabase Cloud Live' : data.database,
          count: (data.stats?.quoteRequests || 0) + (data.stats?.contactInquiries || 0)
        });
        return;
      }
    } catch {
      // Fallback for static hosting / GitHub Pages
    }

    const client = getSupabaseClient();
    const totalRecords = requestStore.getQuoteRequests().length + requestStore.getContactInquiries().length;
    if (client) {
      setDbStatus({
        configured: true,
        message: 'Supabase Direct Client',
        count: totalRecords
      });
    } else {
      setDbStatus({
        configured: false,
        message: 'Local Cache Active',
        count: totalRecords
      });
    }
  };

  useEffect(() => {
    checkDbHealth();
    const interval = setInterval(checkDbHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await requestStore.refreshFromBackend();
    await checkDbHealth();
    setIsSyncing(false);
    showToast('Database synchronized with Suez Cloud Dispatch repository.');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Clocks
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSuezTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'Africa/Cairo',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
      setZuluTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Subscribe to quote & inquiry changes
  useEffect(() => {
    const refreshData = () => {
      setQuotes(requestStore.getQuoteRequests());
      setInquiries(requestStore.getContactInquiries());
    };
    refreshData();
    const unsubReq = requestStore.subscribe(refreshData);
    return () => unsubReq();
  }, []);

  // Update selected quote state if drawer opens
  useEffect(() => {
    if (selectedQuote) {
      setEditQuotedAmount(selectedQuote.quotedAmountUSD ? String(selectedQuote.quotedAmountUSD) : '');
      setEditOfficer(selectedQuote.assignedOfficer || currentUser?.name || 'Capt. Tarek Mansour');
      setEditLaunchBoat(selectedQuote.dispatchLaunchBoat || 'Mentors Star I (Suez Anchorage)');
      setEditAdminNotes(selectedQuote.adminNotes || '');
    }
  }, [selectedQuote, currentUser]);

  const handleStaffLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);
    setIsAuthorizing(true);

    const res = await authStore.login(staffEmail, staffPassword);
    setIsAuthorizing(false);

    if (!res.success) {
      setStaffError(res.error || 'Authentication rejected. Access restricted to authorized personnel.');
    } else if (res.user?.role !== 'admin') {
      authStore.logout();
      setStaffError('Access Denied: Your account role is Client. Admin operations require authorized Suez dispatch credentials.');
    } else {
      showToast(`Operations Clearance Approved: Welcome ${res.user.name}`);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setSelectedQuote(null);
    showToast('Securely logged out from Operations Command.');
  };

  const handleStatusChange = (id: string, newStatus: RFQStatus) => {
    requestStore.updateQuoteStatus(id, newStatus);
    showToast(`Quote #${id} updated to status: ${newStatus}`);
    if (selectedQuote && selectedQuote.id === id) {
      setSelectedQuote((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  const handleSaveQuoteDetails = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedQuote) return;

    const amount = parseFloat(editQuotedAmount);
    requestStore.updateQuoteRequest(selectedQuote.id, {
      quotedAmountUSD: isNaN(amount) ? undefined : amount,
      assignedOfficer: editOfficer,
      dispatchLaunchBoat: editLaunchBoat,
      adminNotes: editAdminNotes
    });

    showToast(`Quotation #${selectedQuote.id} pricing and dispatch records updated.`);
    setSelectedQuote(null);
  };

  const isStaffAuthenticated = currentUser !== null && currentUser.role === 'admin';
  const isAr = currentLang === 'ar';

  const translateStatus = (status: string) => {
    if (!isAr) return status;
    const map: Record<string, string> = {
      'New': 'جديد',
      'In Review': 'قيد المراجعة',
      'Quoted (60m)': 'تم التسعير (60 دقيقة)',
      'Order Confirmed': 'تم تأكيد الطلب',
      'Dispatched': 'تم الإرسال',
      'Delivered': 'تم التسليم'
    };
    return map[status] || status;
  };

  const translateRating = (rating: string) => {
    if (!isAr) return rating;
    const map: Record<string, string> = {
      'VIP': 'عميل متميز (VIP)',
      'Frequent': 'عميل دائم',
      'Standard': 'عميل معتمد'
    };
    return map[rating] || rating;
  };

  // Calculations for KPI Panel 8:
  // Today's Overview from blueprint:
  // Vessels Detected (47), Leads Contacted (13), Replies (5), RFQs (2), Orders (1), Est. Revenue ($2,500)
  const vesselsDetectedCount = 47;
  const leadsContactedCount = 13;
  const repliesCount = 5;
  const rfqsCount = quotes.length > 0 ? quotes.length : 2;
  const activeOrdersCount = quotes.filter((q) => q.status === 'Order Confirmed' || q.status === 'Dispatched' || q.status === 'Delivered').length || 1;
  const estRevenueSum = quotes.reduce((acc, q) => acc + (q.quotedAmountUSD || 0), 0) || 2500;

  // Filtered quotes for RFQ table
  const filteredQuotes = quotes.filter((q) => {
    const matchStatus = statusFilter === 'ALL' || q.status === statusFilter;
    const matchSearch =
      q.vesselName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.imoNumber.includes(searchQuery) ||
      q.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Blueprint Top Customers
  const topCustomers = [
    { name: 'XYZ Shipping Ltd', orders: 12, flag: '🇨🇭', volume: '$48,200', rating: 'VIP' },
    { name: 'ABC Maritime Corp', orders: 8, flag: '🇬🇷', volume: '$32,500', rating: 'Frequent' },
    { name: 'Oceanic Line (Geneva)', orders: 6, flag: '🇮🇹', volume: '$27,800', rating: 'Frequent' },
    { name: 'Global Tankers AS', orders: 5, flag: '🇳🇴', volume: '$21,400', rating: 'Standard' },
    { name: 'Meridian Shipping Co', orders: 4, flag: '🇩🇰', volume: '$16,900', rating: 'Standard' }
  ];

  // 1. IF NOT AUTHENTICATED AS ADMIN: SHOW CLEARANCE CHALLENGE
  if (!isStaffAuthenticated) {
    return (
      <div className="w-full min-h-[85vh] bg-[#07172C] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full space-y-8 bg-[#0B2545] p-8 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden">
          {/* Subtle radar accent */}
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-sky-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-white/10 rounded-2xl border border-white/20 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
              <Shield className="w-8 h-8" />
            </div>
            <span className="text-xs font-mono font-bold tracking-widest uppercase text-sky-300 block">
              {isAr ? 'المنطقة الحرة لهيئة قناة السويس' : 'Suez Canal Authority Free Zone'}
            </span>
            <h2 className="text-2xl font-extrabold text-white font-cinzel mt-1 tracking-wide">
              {isAr ? 'مكتب تصريح العمليات الملاحية' : 'Operations Clearance Desk'}
            </h2>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {isAr
                ? 'مخصص لضباط ومشرفي عمليات مينتورز مارين وخدمات التخليص الجمركي واللوجستي المعتمدة.'
                : 'Restricted to authorized Mentors Marine Operations Superintendents, Dispatch Officers & Customs Logistics.'}
            </p>
          </div>

          {staffError && (
            <div className="p-3 bg-red-950/80 border border-red-500/60 rounded-xl text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{staffError}</span>
            </div>
          )}

          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {isAr ? 'البريد الإلكتروني للضابط المسئول' : 'Staff Officer Email'}
              </label>
              <div className="relative">
                <Mail className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                <input
                  type="email"
                  required
                  dir="ltr"
                  value={staffEmail}
                  onChange={(e) => setStaffEmail(e.target.value)}
                  placeholder="admin@mentors.com"
                  className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                {isAr ? 'كلمة المرور / مفتاح التصريح' : 'Password / Clearance Key'}
              </label>
              <div className="relative">
                <Lock className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  dir="ltr"
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder={isAr ? 'أدخل كلمة مرور المسؤول' : 'Enter administrator password'}
                  className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-2.5 bg-white/5 border border-white/15 rounded-xl text-white text-xs focus:outline-none focus:ring-2 focus:ring-sky-400 placeholder:text-slate-500`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={`absolute ${isAr ? 'left-3' : 'right-3'} top-2.5 text-slate-400 hover:text-white`}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full bg-[#C81D25] hover:bg-[#a8161d] text-white font-bold text-xs py-3 rounded-xl shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-4 disabled:opacity-60"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>
                {isAuthorizing
                  ? (isAr ? 'جارٍ التحقق من التصريح...' : 'Authorizing Dispatch...')
                  : (isAr ? 'تصريح الدخول لغرفة العمليات' : 'Authorize Operations Access')}
              </span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED OPERATIONS COMMAND CENTER (EXACT BLUEPRINT PANEL 8)
  return (
    <div className="w-full bg-[#0B2545] text-slate-100 min-h-screen pb-16 font-sans select-none" id="admin-analytics-desk" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 rtl:right-auto rtl:left-6 z-50 bg-emerald-900 border border-emerald-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* NAVIGATION TABS (MATCHING BLUEPRINT PANEL 8: Dashboard, RFQs, Quotes, Orders, Customers, Inquiries) */}
      <div className="border-b border-white/10 bg-[#081B33] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 py-2">
          <div className="flex items-center gap-1 overflow-x-auto py-1 text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'dashboard'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-sky-400" />
              <span>{isAr ? 'نظرة عامة على التحليلات' : 'Analytics Overview'}</span>
            </button>

            <button
              onClick={() => setActiveTab('rfqs')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 relative ${
                activeTab === 'rfqs'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'طلبات التسعير الحية' : 'Live RFQs'}</span>
              {quotes.length > 0 && (
                <span className="mx-1 px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{quotes.length}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'quotes'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'التسعير وعروض الأسعار' : 'Pricing & Quotations'}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'orders'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>
                {isAr ? 'الأوامر النشطة' : 'Active Orders'} (<span dir="ltr" className="unicode-isolate">{activeOrdersCount}</span>)
              </span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'customers'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'أهم العملاء' : 'Top Customers'}</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
                activeTab === 'inquiries'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>
                {isAr ? 'رسائل التواصل' : 'Contact Messages'} (<span dir="ltr" className="unicode-isolate">{inquiries.length}</span>)
              </span>
            </button>
          </div>

          {/* Right Controls: Sync & Logout */}
          <div className="flex items-center justify-end gap-2 shrink-0">
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-lg border border-white/15 transition-colors font-semibold"
              title={isAr ? 'مزامنة مع قاعدة البيانات' : 'Sync with Database'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isAr ? 'مزامنة' : 'Sync'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white text-xs px-3 py-2 rounded-lg border border-red-500/30 transition-colors font-semibold"
              title={isAr ? 'تسجيل الخروج من مكتب العمليات' : 'Logout from Operations Desk'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* TOP KPI ROW (EXACT BLUEPRINT PANEL 8: Today's Overview) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
              <span>{isAr ? 'ملخص اليوم (حركة الموانئ الحية)' : "Today's Overview (Live Port Activity)"}</span>
            </h2>
            <span className="text-[11px] text-emerald-400 font-mono">
              {isAr ? 'مسح الرادار ونظام AIS نشط' : 'Live AIS & Radar Sweep Active'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {/* 1. Vessels Detected */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'السفن المرصودة' : 'Vessels Detected'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">{vesselsDetectedCount}</span>
              </span>
              <span className="text-[10px] text-sky-400 mt-1 block">
                {isAr ? 'السويس ومنطقة الانتظار' : 'Suez & Waiting Area'}
              </span>
            </div>

            {/* 2. Leads Contacted */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'السفن المتواصل معها' : 'Leads Contacted'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">{leadsContactedCount}</span>
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                {isAr ? 'عبر AIS والبريد' : 'Via AIS & Email'}
              </span>
            </div>

            {/* 3. Replies */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'الردود المستلمة' : 'Replies'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">{repliesCount}</span>
              </span>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">
                {isAr ? 'معدل استجابة 38%' : '38% Response Rate'}
              </span>
            </div>

            {/* 4. RFQs */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'طلبات التسعير (RFQs)' : 'RFQs'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">{rfqsCount}</span>
              </span>
              <span className="text-[10px] text-amber-300/80 mt-1 block">
                {isAr ? 'ضمن مهلة 60 دقيقة' : 'Under 60-Min SLA'}
              </span>
            </div>

            {/* 5. Orders */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'الأوامر الجارية' : 'Orders'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">{activeOrdersCount}</span>
              </span>
              <span className="text-[10px] text-purple-300/80 mt-1 block">
                {isAr ? 'قيد التخليص الجمركي' : 'In Port Clearance'}
              </span>
            </div>

            {/* 6. Est. Revenue */}
            <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm hover:border-white/20 transition-all">
              <span className="text-[11px] font-semibold text-slate-400 block">
                {isAr ? 'الإيراد التقديري' : 'Est. Revenue'}
              </span>
              <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-cinzel block mt-1">
                <span dir="ltr" className="unicode-isolate">${estRevenueSum.toLocaleString()}</span>
              </span>
              <span className="text-[10px] text-emerald-400/80 mt-1 block">
                {isAr ? 'فواتير اليوم بالدولار' : 'USD Billed Today'}
              </span>
            </div>
          </div>
        </div>

        {/* MIDDLE ROW (EXACT BLUEPRINT PANEL 8: Donut Chart Vessels by Type + Bar Chart Monthly Orders) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: VESSELS BY TYPE (DONUT CHART) */}
          <div className="lg:col-span-6 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <PieChart className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  {isAr ? 'تصنيف السفن حسب النوع' : 'Vessels by Type'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isAr ? 'توزيع قوافل القناة' : 'Canal Convoy Distribution'}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-around gap-6 pt-2">
              {/* SVG Donut Chart */}
              <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  {/* Container 40% (Sky) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#38bdf8"
                    strokeWidth="14"
                    strokeDasharray="95.5 143.2"
                    strokeDashoffset="0"
                  />
                  {/* Bulk Carrier 25% (Amber) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f59e0b"
                    strokeWidth="14"
                    strokeDasharray="59.7 179"
                    strokeDashoffset="-95.5"
                  />
                  {/* Tanker 15% (Rose) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#f43f5e"
                    strokeWidth="14"
                    strokeDasharray="35.8 202.9"
                    strokeDashoffset="-155.2"
                  />
                  {/* General Cargo 12% (Emerald) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#10b981"
                    strokeWidth="14"
                    strokeDasharray="28.6 210.1"
                    strokeDashoffset="-191"
                  />
                  {/* Other 8% (Slate) */}
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="transparent"
                    stroke="#94a3b8"
                    strokeWidth="14"
                    strokeDasharray="19.1 219.6"
                    strokeDashoffset="-219.6"
                  />
                </svg>

                {/* Inner center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-xl font-extrabold text-white font-cinzel">
                    <span dir="ltr" className="unicode-isolate">47</span>
                  </span>
                  <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold">
                    {isAr ? 'سفينة' : 'Vessels'}
                  </span>
                </div>
              </div>

              {/* Legends matching blueprint values */}
              <div className="space-y-2 text-xs w-full max-w-xs">
                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#38bdf8]"></span>
                    <span className="text-slate-300">{isAr ? 'سفن حاويات' : 'Container Ship'}</span>
                  </div>
                  <strong className="text-white font-mono font-bold">
                    <span dir="ltr" className="unicode-isolate">40%</span>
                  </strong>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b]"></span>
                    <span className="text-slate-300">{isAr ? 'سفن صب جاف (بلك)' : 'Bulk Carrier'}</span>
                  </div>
                  <strong className="text-white font-mono font-bold">
                    <span dir="ltr" className="unicode-isolate">25%</span>
                  </strong>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#f43f5e]"></span>
                    <span className="text-slate-300">{isAr ? 'ناقلات نفط / مشتقات' : 'Crude/Product Tanker'}</span>
                  </div>
                  <strong className="text-white font-mono font-bold">
                    <span dir="ltr" className="unicode-isolate">15%</span>
                  </strong>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#10b981]"></span>
                    <span className="text-slate-300">{isAr ? 'بضائع عامة' : 'General Cargo'}</span>
                  </div>
                  <strong className="text-white font-mono font-bold">
                    <span dir="ltr" className="unicode-isolate">12%</span>
                  </strong>
                </div>

                <div className="flex items-center justify-between p-1.5 rounded-lg bg-white/5">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]"></span>
                    <span className="text-slate-300">{isAr ? 'أخرى (قاطرات، غاز)' : 'Other (Tugs, LNG)'}</span>
                  </div>
                  <strong className="text-white font-mono font-bold">
                    <span dir="ltr" className="unicode-isolate">8%</span>
                  </strong>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: MONTHLY ORDERS (BAR CHART) */}
          <div className="lg:col-span-6 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  {isAr ? 'الطلبات الشهرية' : 'Monthly Orders'}
                </h3>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-semibold">
                <span dir="ltr" className="unicode-isolate">+34% YOY Growth</span>
              </span>
            </div>

            {/* Custom SVG/HTML Bar chart for Jan - Jun */}
            <div className="pt-4 space-y-3">
              <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2 border-b border-white/15 pb-2">
                {/* Jan */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">18</span>
                  </span>
                  <div className="w-full bg-sky-500/40 group-hover:bg-sky-400 transition-all rounded-t-md h-[40%]"></div>
                  <span className="text-[11px] text-slate-400 font-bold">{isAr ? 'يناير' : 'Jan'}</span>
                </div>

                {/* Feb */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">24</span>
                  </span>
                  <div className="w-full bg-sky-500/50 group-hover:bg-sky-400 transition-all rounded-t-md h-[52%]"></div>
                  <span className="text-[11px] text-slate-400 font-bold">{isAr ? 'فبراير' : 'Feb'}</span>
                </div>

                {/* Mar */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">32</span>
                  </span>
                  <div className="w-full bg-sky-500/60 group-hover:bg-sky-400 transition-all rounded-t-md h-[68%]"></div>
                  <span className="text-[11px] text-slate-400 font-bold">{isAr ? 'مارس' : 'Mar'}</span>
                </div>

                {/* Apr */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">28</span>
                  </span>
                  <div className="w-full bg-sky-500/60 group-hover:bg-sky-400 transition-all rounded-t-md h-[60%]"></div>
                  <span className="text-[11px] text-slate-400 font-bold">{isAr ? 'أبريل' : 'Apr'}</span>
                </div>

                {/* May */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">41</span>
                  </span>
                  <div className="w-full bg-amber-400 group-hover:bg-amber-300 transition-all rounded-t-md h-[86%] shadow-xs"></div>
                  <span className="text-[11px] text-amber-300 font-bold">{isAr ? 'مايو' : 'May'}</span>
                </div>

                {/* Jun */}
                <div className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span dir="ltr" className="unicode-isolate">47</span>
                  </span>
                  <div className="w-full bg-emerald-400 group-hover:bg-emerald-300 transition-all rounded-t-md h-[98%] shadow-xs"></div>
                  <span className="text-[11px] text-emerald-300 font-bold">{isAr ? 'يونيو' : 'Jun'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 px-2">
                <span>{isAr ? 'موسم ذروة قوافل العبور' : 'Peak Convoy Season'}</span>
                <span>
                  {isAr ? 'متوسط القيمة:' : 'Average Value:'}{' '}
                  <strong className="text-white" dir="ltr"><span className="unicode-isolate">$14,200</span> / {isAr ? 'سفينة' : 'Vessel'}</strong>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM ROW (EXACT BLUEPRINT PANEL 8: Recent RFQs Left Table + Top Customers Right Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: RECENT RFQS TABLE */}
          <div className="lg:col-span-8 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  {isAr ? 'أحدث طلبات التسعير' : 'Recent RFQs'}
                </h3>
                <span className="text-xs text-slate-400 font-mono">
                  (<span dir="ltr" className="unicode-isolate">{filteredQuotes.length}</span> {isAr ? 'نشط' : 'active'})
                </span>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0B2545] border border-white/15 rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-400"
                >
                  <option value="ALL">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
                  <option value="New">{isAr ? 'جديد' : 'New'}</option>
                  <option value="In Review">{isAr ? 'قيد المراجعة' : 'In Review'}</option>
                  <option value="Quoted (60m)">{isAr ? 'تم التسعير (60 دقيقة)' : 'Quoted (60m)'}</option>
                  <option value="Order Confirmed">{isAr ? 'تم تأكيد الطلب' : 'Order Confirmed'}</option>
                  <option value="Dispatched">{isAr ? 'تم الإرسال' : 'Dispatched'}</option>
                  <option value="Delivered">{isAr ? 'تم التسليم' : 'Delivered'}</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left rtl:text-right text-xs">
                <thead className="text-[10px] uppercase font-bold text-slate-400 border-b border-white/10 bg-white/5">
                  <tr>
                    <th className="py-2.5 px-3">{isAr ? 'السفينة' : 'Vessel'}</th>
                    <th className="py-2.5 px-3">{isAr ? 'التاريخ وموعد الوصول' : 'Date / ETA'}</th>
                    <th className="py-2.5 px-3">{isAr ? 'الخدمة المطلوبة' : 'Category'}</th>
                    <th className="py-2.5 px-3">{isAr ? 'الحالة' : 'Status'}</th>
                    <th className="py-2.5 px-3 text-right rtl:text-left">{isAr ? 'الإجراء' : 'Action'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredQuotes.slice(0, 6).map((quote) => (
                    <tr key={quote.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-3">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <Ship className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                          <span>{quote.vesselName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          <span dir="ltr" className="unicode-isolate">IMO {quote.imoNumber}</span> • {quote.companyName}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        <div className="text-slate-200 font-medium">
                          <span dir="ltr" className="unicode-isolate">{quote.etaDate}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">{quote.portOfCall}</div>
                      </td>

                      <td className="py-3 px-3">
                        <span className="text-[11px] text-slate-300">
                          {quote.services.join(', ') || (isAr ? 'مؤن وخدمات فنية' : 'Provisions & Technical')}
                        </span>
                      </td>

                      <td className="py-3 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            quote.status === 'Quoted (60m)'
                              ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                              : quote.status === 'Order Confirmed'
                              ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                              : quote.status === 'Delivered'
                              ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                              : 'bg-white/10 text-slate-300'
                          }`}
                        >
                          {translateStatus(quote.status)}
                        </span>
                      </td>

                      <td className="py-3 px-3 text-right rtl:text-left">
                        <button
                          type="button"
                          onClick={() => setSelectedQuote(quote)}
                          className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 hover:text-white px-2.5 py-1 rounded-md text-[11px] font-bold transition-colors"
                        >
                          {isAr ? 'إدارة' : 'Manage'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* RIGHT: TOP CUSTOMERS TABLE */}
          <div className="lg:col-span-4 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-cinzel">
                  {isAr ? 'أهم العملاء' : 'Top Customers'}
                </h3>
              </div>
              <span className="text-xs text-slate-400">
                {isAr ? 'إجمالي الفواتير' : 'Total Billed'}
              </span>
            </div>

            <div className="space-y-2.5">
              {topCustomers.map((cust, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{cust.flag}</span>
                    <div>
                      <h4 className="text-xs font-bold text-white">{cust.name}</h4>
                      <span className="text-[10px] text-slate-400">
                        <span dir="ltr" className="unicode-isolate font-mono font-bold text-slate-300">{cust.volume}</span>{' '}
                        {isAr ? 'إجمالي التعامل' : 'Total volume'}
                      </span>
                    </div>
                  </div>

                  <div className="text-right rtl:text-left">
                    <span className="text-xs font-bold font-mono text-amber-400 block">
                      <span dir="ltr" className="unicode-isolate">{cust.orders}</span> {isAr ? 'طلبات' : 'Orders'}
                    </span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase">
                      {translateRating(cust.rating)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: QUOTE PRICING & DISPATCH DRAWER */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="bg-[#0B2545] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Ship className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel">
                    {isAr ? `إدارة طلب التسعير: ${selectedQuote.vesselName}` : `Manage RFQ: ${selectedQuote.vesselName}`}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    <span dir="ltr" className="unicode-isolate">Ref: {selectedQuote.id} • IMO: {selectedQuote.imoNumber}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-white font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveQuoteDetails} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isAr ? 'إجمالي السعر المعروض (دولار أمريكي)' : 'Quoted Total Price (USD)'}
                  </label>
                  <div className="relative">
                    <DollarSign className={`w-4 h-4 text-emerald-400 absolute ${isAr ? 'right-3' : 'left-3'} top-2.5`} />
                    <input
                      type="number"
                      dir="ltr"
                      value={editQuotedAmount}
                      onChange={(e) => setEditQuotedAmount(e.target.value)}
                      placeholder="14500"
                      className={`w-full ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-2 bg-white/5 border border-white/20 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isAr ? 'تحديث حالة طلب التسعير' : 'Update RFQ Status'}
                  </label>
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value as RFQStatus)}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white font-bold focus:outline-none focus:ring-2 focus:ring-sky-400"
                  >
                    <option value="New">{isAr ? 'جديد (تقديم أولي)' : 'New (Initial Submission)'}</option>
                    <option value="In Review">{isAr ? 'قيد المراجعة (مكتب العمليات)' : 'In Review (Operations Desk)'}</option>
                    <option value="Quoted (60m)">{isAr ? 'تم التسعير (60 دقيقة) (تم التسعير والإرسال)' : 'Quoted (60m) (Priced & Issued)'}</option>
                    <option value="Order Confirmed">{isAr ? 'تم تأكيد الطلب (معتمد من الربان)' : 'Order Confirmed (Master Approved)'}</option>
                    <option value="Dispatched">{isAr ? 'تم الإرسال (المنطقة الحرة / لنش الإمداد)' : 'Dispatched (Customs Free Zone / Launch Boat)'}</option>
                    <option value="Delivered">{isAr ? 'تم التسليم (اكتمل في المخطاف/الرصيف)' : 'Delivered (Completed at Anchorage/Berth)'}</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isAr ? 'ضابط الإرسال المعين' : 'Assigned Dispatch Officer'}
                  </label>
                  <input
                    type="text"
                    value={editOfficer}
                    onChange={(e) => setEditOfficer(e.target.value)}
                    placeholder={isAr ? 'القبطان طارق منصور' : 'Capt. Tarek Mansour'}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isAr ? 'لنش التموين والإمداد' : 'Port Launch Boat'}
                  </label>
                  <input
                    type="text"
                    value={editLaunchBoat}
                    onChange={(e) => setEditLaunchBoat(e.target.value)}
                    placeholder={isAr ? 'مينتورز ستار 1 (مخطاف السويس)' : 'Mentors Star I (Suez Anchorage)'}
                    className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 mb-1">
                  {isAr ? 'ملاحظات الجمارك والعمليات التشغيلية' : 'Customs & Operational Dispatch Notes'}
                </label>
                <textarea
                  rows={3}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مرفق شهادة الجودة والسلامة الغذائية HACCP، تم تخليص البضائع المعفاة جمركياً مع جمارك بورسعيد والسويس...'
                      : 'HACCP certificate attached, bonded goods cleared with Port Said Customs...'
                  }
                  className="w-full px-3 py-2 bg-white/5 border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setSelectedQuote(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white font-bold"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="bg-[#C81D25] hover:bg-[#a8161d] text-white px-5 py-2 rounded-xl font-bold transition-all shadow-md"
                >
                  {isAr ? 'حفظ العرض وإرساله للعميل' : 'Save Quotation & Issue to Client'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
