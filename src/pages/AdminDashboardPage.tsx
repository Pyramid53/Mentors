import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  TrendingUp,
  DollarSign,
  BarChart2,
  PieChart,
  Users,
  Briefcase,
  Trash2,
  ArrowUpRight
} from 'lucide-react';
import { requestStore } from '../services/requestStore';
import { authStore } from '../services/authStore';
import { languageStore, Language } from '../services/languageStore';
import { getSupabaseClient } from '../services/supabaseClient';
import { AdminQuoteRequest, AdminContactInquiry, RFQStatus, ContactStatus, AppUser } from '../types';

export const AdminDashboardPage: React.FC = () => {
  // Authentication & Clearance State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());
  const [staffEmail, setStaffEmail] = useState('');
  const [staffPassword, setStaffPassword] = useState('');
  const [staffError, setStaffError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // Localization
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

  // Operational Navigation tabs:
  // 'dashboard' (Analytics Overview), 'rfqs' (Live RFQs), 'quotes' (Pricing & Quotations), 'orders' (Active Orders), 'customers' (Top Customers), 'inquiries' (Contact Messages)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rfqs' | 'quotes' | 'orders' | 'customers' | 'inquiries'>('dashboard');

  // Quotes & Inquiries from store
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [inquiries, setInquiries] = useState<AdminContactInquiry[]>([]);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected quote for detailed pricing drawer
  const [selectedQuote, setSelectedQuote] = useState<AdminQuoteRequest | null>(null);

  // Selected inquiry for message modal
  const [selectedInquiry, setSelectedInquiry] = useState<AdminContactInquiry | null>(null);

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

  const handleDeleteQuote = (id: string, vesselName: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف طلب تسعير السفينة ${vesselName}؟` : `Are you sure you want to delete quotation request for ${vesselName}?`)) {
      requestStore.deleteQuoteRequest(id);
      showToast(isAr ? `تم حذف طلب التسعير #${id}` : `Quotation #${id} deleted.`);
      if (selectedQuote && selectedQuote.id === id) {
        setSelectedQuote(null);
      }
    }
  };

  const handleDeleteInquiry = (id: string, senderName: string) => {
    if (window.confirm(isAr ? `هل أنت متأكد من حذف رسالة ${senderName}؟` : `Are you sure you want to delete message from ${senderName}?`)) {
      requestStore.deleteContactInquiry(id);
      showToast(isAr ? `تم حذف الرسالة #${id}` : `Inquiry #${id} deleted.`);
      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry(null);
      }
    }
  };

  const handleInquiryStatusChange = (id: string, newStatus: ContactStatus) => {
    requestStore.updateContactInquiry(id, { status: newStatus });
    showToast(`Inquiry #${id} marked as ${newStatus}`);
    if (selectedInquiry && selectedInquiry.id === id) {
      setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus } : null));
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

  const translateInquiryStatus = (status: string) => {
    if (!isAr) return status;
    const map: Record<string, string> = {
      'New': 'جديدة',
      'In Progress': 'قيد المعالجة',
      'Replied': 'تم الرد'
    };
    return map[status] || status;
  };

  // Real KPI calculations from real data
  const totalQuotesCount = quotes.length;
  const activeOrders = quotes.filter((q) => q.status === 'Order Confirmed' || q.status === 'Dispatched' || q.status === 'Delivered');
  const activeOrdersCount = activeOrders.length;
  const pendingReviewCount = quotes.filter((q) => q.status === 'New' || q.status === 'In Review').length;
  const quotedPipelineCount = quotes.filter((q) => q.status === 'Quoted (60m)' || q.status === 'QUOTED').length;
  const estRevenueSum = quotes.reduce((acc, q) => acc + (q.quotedAmountUSD || 0), 0);
  const inquiriesCount = inquiries.length;

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

  // Filtered inquiries for Inquiries table
  const filteredInquiries = inquiries.filter((inq) => {
    const matchStatus = inquiryStatusFilter === 'ALL' || inq.status === inquiryStatusFilter;
    const matchSearch =
      inq.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.companyName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (inq.vesselName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inq.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  // Dynamic real aggregated customers from real database quotes
  const aggregatedCustomersMap: Record<string, { company: string; contactName: string; email: string; phone: string; quotesCount: number; ordersCount: number; totalUSD: number; latestVessel: string; latestEta: string }> = {};

  quotes.forEach((q) => {
    const key = (q.companyName || q.contactEmail || q.contactName || 'Maritime Operator').trim();
    if (!aggregatedCustomersMap[key]) {
      aggregatedCustomersMap[key] = {
        company: q.companyName || 'Maritime Operator',
        contactName: q.contactName || 'Superintendent',
        email: q.contactEmail || '',
        phone: q.contactPhone || '',
        quotesCount: 0,
        ordersCount: 0,
        totalUSD: 0,
        latestVessel: q.vesselName,
        latestEta: q.etaDate
      };
    }
    aggregatedCustomersMap[key].quotesCount += 1;
    if (q.status === 'Order Confirmed' || q.status === 'Dispatched' || q.status === 'Delivered') {
      aggregatedCustomersMap[key].ordersCount += 1;
    }
    if (q.quotedAmountUSD) {
      aggregatedCustomersMap[key].totalUSD += q.quotedAmountUSD;
    }
  });

  const dynamicCustomers = Object.values(aggregatedCustomersMap).sort((a, b) => b.totalUSD - a.totalUSD);

  // Dynamic service breakdown calculation
  const serviceCountMap: Record<string, number> = {};
  quotes.forEach((q) => {
    (q.services || []).forEach((s) => {
      serviceCountMap[s] = (serviceCountMap[s] || 0) + 1;
    });
  });
  const totalServiceMentions = Object.values(serviceCountMap).reduce((a, b) => a + b, 0);

  // 1. IF NOT AUTHENTICATED AS ADMIN: SHOW CLEARANCE CHALLENGE
  if (!isStaffAuthenticated) {
    return (
      <div className="w-full min-h-[85vh] bg-[#07172C] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="max-w-md w-full space-y-8 bg-[#0B2545] p-8 rounded-2xl border border-white/15 shadow-2xl relative overflow-hidden">
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

  // 2. AUTHENTICATED OPERATIONS COMMAND CENTER
  return (
    <div className="w-full bg-[#0B2545] text-slate-100 min-h-screen pb-16 font-sans select-none" id="admin-analytics-desk" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 rtl:right-auto rtl:left-6 z-50 bg-emerald-900 border border-emerald-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top text-xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER BAR: Live Suez Clocks, Status, Sync, Export & Logout */}
      <div className="bg-[#07172C] border-b border-white/10 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-bold text-white font-cinzel tracking-wider">
                {isAr ? 'غرفة عمليات السويس وبورتوفيق 24/7' : 'Suez & Port Tawfik Operations Desk 24/7'}
              </span>
            </div>

            <div className="flex items-center gap-3 font-mono text-[11px] text-slate-300">
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                SUEZ: <strong className="text-amber-400" dir="ltr">{suezTime || '--:--:--'}</strong>
              </span>
              <span className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                UTC: <strong className="text-sky-300" dir="ltr">{zuluTime || '--:--:--'}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                dbStatus?.configured
                  ? 'bg-emerald-950 text-emerald-300 border-emerald-700/60'
                  : 'bg-amber-950 text-amber-300 border-amber-700/60'
              }`}
            >
              {dbStatus?.message || 'Database Ready'}
            </span>

            <button
              onClick={() => requestStore.exportQuotesToCSV()}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/15 transition-colors font-semibold"
              title={isAr ? 'تصدير طلبات التسعير كملف CSV' : 'Export RFQs as CSV'}
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isAr ? 'تصدير CSV' : 'Export CSV'}</span>
            </button>

            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-2.5 py-1.5 rounded-lg border border-white/15 transition-colors font-semibold"
              title={isAr ? 'مزامنة مع قاعدة البيانات' : 'Sync with Database'}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAr ? 'مزامنة' : 'Sync'}</span>
            </button>

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1 bg-red-500/20 hover:bg-red-500/40 text-red-300 hover:text-white text-xs px-2.5 py-1.5 rounded-lg border border-red-500/30 transition-colors font-semibold"
              title={isAr ? 'تسجيل الخروج' : 'Logout'}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{isAr ? 'خروج' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* NAVIGATION TABS: Dashboard, RFQs, Quotes, Orders, Customers, Inquiries */}
      <div className="border-b border-white/10 bg-[#081B33] sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 py-2 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-1 text-xs font-bold shrink-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
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
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 relative ${
                activeTab === 'rfqs'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4 text-emerald-400" />
              <span>{isAr ? 'طلبات التسعير الحية' : 'Live RFQs'}</span>
              {totalQuotesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-red-500 text-white text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{totalQuotesCount}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'quotes'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <DollarSign className="w-4 h-4 text-amber-400" />
              <span>{isAr ? 'التسعير وعروض الأسعار' : 'Pricing & Quotations'}</span>
              {quotedPipelineCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-amber-500/30 text-amber-300 text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{quotedPipelineCount}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4 text-purple-400" />
              <span>{isAr ? 'الأوامر النشطة' : 'Active Orders'}</span>
              {activeOrdersCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-purple-500/30 text-purple-300 text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{activeOrdersCount}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'customers'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4 text-teal-400" />
              <span>{isAr ? 'أهم العملاء' : 'Top Customers'}</span>
              {dynamicCustomers.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-teal-500/30 text-teal-300 text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{dynamicCustomers.length}</span>
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'bg-white/15 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4 text-sky-400" />
              <span>{isAr ? 'رسائل التواصل' : 'Contact Messages'}</span>
              {inquiriesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-sky-500/30 text-sky-300 text-[10px]">
                  <span dir="ltr" className="unicode-isolate">{inquiriesCount}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* ========================================================
            TAB 1: ANALYTICS OVERVIEW (DASHBOARD)
            ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* Real KPI Summary Bar */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-sky-400" />
                  <span>{isAr ? 'ملخص العمليات الفعلي (بيانات قاعدة البيانات الحية)' : 'Operations Overview (Live Database Metrics)'}</span>
                </h2>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {isAr ? 'تحديث لحظي ومزامنة مباشرة' : 'Real-time Synchronization Active'}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
                {/* 1. Total RFQs */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'إجمالي طلبات التسعير' : 'Total RFQs'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">{totalQuotesCount}</span>
                  </span>
                  <span className="text-[10px] text-sky-400 mt-1 block">
                    {isAr ? 'طلبات السفن المسجلة' : 'Recorded Vessel RFQs'}
                  </span>
                </div>

                {/* 2. Pending Review */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'قيد المراجعة / جديد' : 'Pending Review'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">{pendingReviewCount}</span>
                  </span>
                  <span className="text-[10px] text-amber-300/80 mt-1 block">
                    {isAr ? 'مهلة تسعير 60 دقيقة' : '60-Min Fast Response'}
                  </span>
                </div>

                {/* 3. Quoted Pipeline */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'عروض أسعار صادرة' : 'Quoted Pipeline'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-sky-300 font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">{quotedPipelineCount}</span>
                  </span>
                  <span className="text-[10px] text-sky-400/80 mt-1 block">
                    {isAr ? 'بانتظار اعتماد الربان' : 'Awaiting Master Sign-off'}
                  </span>
                </div>

                {/* 4. Active Orders */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'الأوامر النشطة' : 'Active Orders'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">{activeOrdersCount}</span>
                  </span>
                  <span className="text-[10px] text-purple-300/80 mt-1 block">
                    {isAr ? 'قيد التوريد والتخليص' : 'In Transit / Clearance'}
                  </span>
                </div>

                {/* 5. Est. Quoted Revenue */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'قيمة العروض المسعرة' : 'Quoted Volume'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-emerald-300 font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">${estRevenueSum.toLocaleString()}</span>
                  </span>
                  <span className="text-[10px] text-emerald-400/80 mt-1 block">
                    {isAr ? 'إجمالي بالدولار الأمريكي' : 'USD Total Pipeline'}
                  </span>
                </div>

                {/* 6. Inquiries */}
                <div className="bg-[#102C4E] border border-white/10 rounded-xl p-4 shadow-sm">
                  <span className="text-[11px] font-semibold text-slate-400 block">
                    {isAr ? 'رسائل التواصل' : 'Contact Messages'}
                  </span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-teal-300 font-cinzel block mt-1">
                    <span dir="ltr" className="unicode-isolate">{inquiriesCount}</span>
                  </span>
                  <span className="text-[10px] text-teal-400/80 mt-1 block">
                    {isAr ? 'استفسارات مكتب التنسيق' : 'Inbound Inquiries'}
                  </span>
                </div>
              </div>
            </div>

            {/* Middle Section: Suez Operational Logistics Readiness & Demand Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* LEFT: Suez Convoy & Launch Stations */}
              <div className="lg:col-span-6 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Anchor className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'حالة محطات الإمداد وقوافل قناة السويس' : 'Suez Convoy Stations & Launch Logistics'}
                    </h3>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    {isAr ? 'تشغيل مستمر 24/7' : '24/7 Active Duty'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-sky-300">
                      {isAr ? 'محطة السويس وبورتوفيق' : 'Suez & Port Tawfik Desk'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isAr ? 'منطقة الانتظار الجنوبية (South Convoy)' : 'South Convoy Waiting Anchorage'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      VHF Marine Ch 16 / 73 • Dispatch Officer On Duty
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-emerald-300">
                      {isAr ? 'محطة بورسعيد وشرق التفريعة' : 'Port Said & East Hub Desk'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isAr ? 'منطقة الانتظار الشمالية (North Convoy)' : 'North Convoy Waiting Anchorage'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      VHF Marine Ch 16 / 12 • Customs Free Zone Ready
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-amber-300">
                      {isAr ? 'قوارب الإمداد السريع' : 'Dedicated Launch Fleet'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isAr ? 'مينتورز ستار 1 و 2 (جاهزية تامة)' : 'Mentors Star I & II (Standby)'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Equipped with Crane & Reefer Cold-Storage Units
                    </div>
                  </div>

                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-purple-300">
                      {isAr ? 'مستودعات المنطقة الحرة' : 'Free Zone Bonded Warehouse'}
                    </div>
                    <div className="text-xs font-bold text-white">
                      {isAr ? 'الأدبية وبورتوفيق وبورسعيد' : 'Adabiya & Port Tawfik Warehouses'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      ISO 22000 & HACCP Certified Temperature Controlled
                    </div>
                  </div>
                </div>
              </div>

              {/* RIGHT: Real Service Demand Breakdown */}
              <div className="lg:col-span-6 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-amber-400" />
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'توزيع الخدمات المطلوبة' : 'Requested Supply Scope Breakdown'}
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400">
                    {isAr ? `${totalQuotesCount} طلب تسعير` : `${totalQuotesCount} RFQs Recorded`}
                  </span>
                </div>

                {totalServiceMentions === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <Layers className="w-8 h-8 text-slate-500 mx-auto" />
                    <p className="text-xs">
                      {isAr
                        ? 'بانتظار استلام طلبات التسعير الأولى لرسم منحنى الطلب على المؤن والخدمات الفنية.'
                        : 'Awaiting incoming vessel requisitions to plot category supply distribution.'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pt-2">
                    {Object.entries(serviceCountMap).map(([serviceName, count]) => {
                      const pct = Math.round((count / totalServiceMentions) * 100);
                      return (
                        <div key={serviceName} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-300 font-medium">{serviceName}</span>
                            <span className="font-mono text-white font-bold" dir="ltr">
                              {count} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-amber-400 h-full rounded-full transition-all"
                              style={{ width: `${pct}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Row: Recent RFQs & Inbound Inquiries preview */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left: Recent RFQs */}
              <div className="lg:col-span-7 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'أحدث طلبات التسعير المسجلة' : 'Recent Vessel RFQs'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('rfqs')}
                    className="text-xs text-sky-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {quotes.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <Ship className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'لا توجد طلبات تسعير بعد' : 'No Quote Requests Yet'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isAr
                        ? 'عند قيام القادة أو الشركات الملاحية بتقديم طلب عبر استمارة طلب التسعير، ستظهر فوراً هنا.'
                        : 'When vessel masters or shipping lines submit a requisition, it will appear here in real time.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 text-xs">
                    {quotes.slice(0, 5).map((q) => (
                      <div key={q.id} className="py-3 flex items-center justify-between gap-3 hover:bg-white/5 px-2 rounded-lg transition-colors">
                        <div>
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Ship className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>{q.vesselName}</span>
                            <span className="text-[10px] text-slate-400 font-mono" dir="ltr">(IMO {q.imoNumber})</span>
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">
                            {q.portOfCall} • <span dir="ltr">{q.etaDate}</span> • {q.companyName}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              q.status === 'Quoted (60m)' || q.status === 'QUOTED'
                                ? 'bg-amber-400/20 text-amber-300'
                                : q.status === 'Order Confirmed' || q.status === 'APPROVED'
                                ? 'bg-emerald-400/20 text-emerald-300'
                                : 'bg-slate-700 text-slate-300'
                            }`}
                          >
                            {translateStatus(q.status)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setSelectedQuote(q)}
                            className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 px-2.5 py-1 rounded text-[11px] font-bold transition-colors"
                          >
                            {isAr ? 'إدارة' : 'Manage'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right: Inbound Inquiries */}
              <div className="lg:col-span-5 bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-sky-400" />
                    <h3 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'أحدث رسائل التواصل' : 'Inbound Messages'}
                    </h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('inquiries')}
                    className="text-xs text-sky-300 hover:text-white flex items-center gap-1 font-semibold"
                  >
                    <span>{isAr ? 'عرض الكل' : 'View All'}</span>
                    <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                  </button>
                </div>

                {inquiries.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-3">
                    <MessageSquare className="w-10 h-10 text-slate-500 mx-auto" />
                    <h4 className="text-sm font-bold text-white font-cinzel">
                      {isAr ? 'لا توجد رسائل واردة' : 'No Inbound Messages'}
                    </h4>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      {isAr
                        ? 'الرسائل المرسلة من صفحة تواصل معنا ستظهر هنا لتمكين الرد المباشر.'
                        : 'Messages submitted through the contact page will appear here for staff response.'}
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/5 text-xs">
                    {inquiries.slice(0, 5).map((inq) => (
                      <div key={inq.id} className="py-3 hover:bg-white/5 px-2 rounded-lg transition-colors cursor-pointer" onClick={() => setSelectedInquiry(inq)}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{inq.fullName}</span>
                          <span className="text-[10px] text-slate-400 font-mono" dir="ltr">
                            {new Date(inq.submittedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-[11px] text-sky-300 font-semibold truncate mt-0.5">
                          {inq.subject}
                        </div>
                        <div className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                          {inq.message}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================
            TAB 2: LIVE RFQs (FULL MANAGEMENT TABLE)
            ======================================================== */}
        {activeTab === 'rfqs' && (
          <div className="bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                  <Ship className="w-5 h-5 text-emerald-400" />
                  <span>{isAr ? 'طلبات عروض الأسعار الحية' : 'Live RFQ Management Desk'}</span>
                  <span className="text-xs font-mono text-slate-400">
                    (<span dir="ltr" className="unicode-isolate">{filteredQuotes.length}</span> / <span dir="ltr" className="unicode-isolate">{totalQuotesCount}</span>)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? 'إدارة ومراجعة وتسعير طلبات التموين والمؤن لكافة السفن العابرة لقناة السويس والموانئ المصرية'
                    : 'Manage, price, and dispatch provision requisitions for vessels transiting Suez & Egyptian ports.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => requestStore.exportQuotesToCSV()}
                  className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-2 rounded-xl border border-white/15 font-semibold transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isAr ? 'تصدير جدول RFQs' : 'Export CSV'}</span>
                </button>
                <Link
                  to="/get-a-quote"
                  className="inline-flex items-center gap-1.5 bg-[#C81D25] hover:bg-[#a8161d] text-white text-xs px-3 py-2 rounded-xl font-bold shadow-sm transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{isAr ? 'إدخال طلب جديد' : 'New Requisition'}</span>
                </Link>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1 max-w-md">
                <Search className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3' : 'left-3'} top-2.5`} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={isAr ? 'البحث باسم السفينة، رقم IMO، الشركة، أو الرمز...' : 'Search by vessel name, IMO, company, or Ref ID...'}
                  className={`w-full ${isAr ? 'pr-9 pl-3 text-right' : 'pl-9 pr-3'} py-2 bg-white/5 border border-white/15 rounded-xl text-xs text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400`}
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-[#0B2545] border border-white/15 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 font-semibold"
                >
                  <option value="ALL">{isAr ? 'كافة الحالات' : 'All Statuses'}</option>
                  <option value="New">{isAr ? 'جديد (New)' : 'New'}</option>
                  <option value="In Review">{isAr ? 'قيد المراجعة (In Review)' : 'In Review'}</option>
                  <option value="Quoted (60m)">{isAr ? 'تم التسعير (Quoted)' : 'Quoted (60m)'}</option>
                  <option value="Order Confirmed">{isAr ? 'طلب معتمد (Confirmed)' : 'Order Confirmed'}</option>
                  <option value="Dispatched">{isAr ? 'تم الإرسال (Dispatched)' : 'Dispatched'}</option>
                  <option value="Delivered">{isAr ? 'تم التسليم (Delivered)' : 'Delivered'}</option>
                </select>
              </div>
            </div>

            {/* Table or Empty State */}
            {filteredQuotes.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Ship className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {quotes.length === 0
                    ? (isAr ? 'لا توجد طلبات تسعير مسجلة في قاعدة البيانات' : 'No Requisitions in the Database Yet')
                    : (isAr ? 'لا توجد نتائج تطابق معايير البحث المحددة' : 'No Results Matching Your Filter')}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {quotes.length === 0
                    ? (isAr
                        ? 'عند قيام السفن والشركات الملاحية بتقديم طلب تسعير عبر الموقع، ستظهر بيانات الطلب ونطاق التوريد وملفات الإكسيل المرفقة هنا فوراً.'
                        : 'When vessels and shipping lines submit procurement requisitions, their supply scopes and attached provision manifests will appear here in real-time.')
                    : (isAr
                        ? 'يرجى تجربة كلمات بحث أخرى أو إعادة ضبط مرشح الحالة.'
                        : 'Try adjusting your search keywords or resetting the status filter.')}
                </p>
                {quotes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setStatusFilter('ALL'); }}
                    className="text-xs text-sky-400 hover:text-sky-300 font-bold underline mt-2"
                  >
                    {isAr ? 'إعادة ضبط البحث' : 'Reset Filters'}
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left rtl:text-right text-xs">
                  <thead className="text-[11px] uppercase font-bold text-slate-400 border-b border-white/10 bg-white/5">
                    <tr>
                      <th className="py-3 px-4">{isAr ? 'مرجع الطلب / السفينة' : 'Ref ID / Vessel'}</th>
                      <th className="py-3 px-4">{isAr ? 'الشركة والجهة الطالبة' : 'Company & Contact'}</th>
                      <th className="py-3 px-4">{isAr ? 'الميناء وموعد الوصول' : 'Port & ETA'}</th>
                      <th className="py-3 px-4">{isAr ? 'نطاق التوريد' : 'Supply Scope'}</th>
                      <th className="py-3 px-4">{isAr ? 'الحالة' : 'Status'}</th>
                      <th className="py-3 px-4">{isAr ? 'المبلغ (USD)' : 'Quoted (USD)'}</th>
                      <th className="py-3 px-4 text-right rtl:text-left">{isAr ? 'الإجراءات' : 'Actions'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <Ship className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            <span>{q.vesselName}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            <span dir="ltr" className="unicode-isolate">{q.id} • IMO {q.imoNumber}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-white font-semibold">{q.companyName}</div>
                          <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <span>{q.contactName}</span>
                            <span>•</span>
                            <span dir="ltr">{q.contactEmail}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="text-slate-200 font-medium">{q.portOfCall}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                            <span dir="ltr" className="unicode-isolate">{q.etaDate} {q.etaTime}</span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 max-w-xs">
                          <div className="flex flex-wrap gap-1">
                            {q.services.map((s, idx) => (
                              <span key={idx} className="bg-white/10 text-slate-200 px-1.5 py-0.5 rounded text-[9px] font-medium">
                                {s}
                              </span>
                            ))}
                            {q.fileName && (
                              <span className="bg-sky-950 text-sky-300 border border-sky-700/50 px-1.5 py-0.5 rounded text-[9px] font-mono">
                                📎 {q.fileName}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold ${
                              q.status === 'Quoted (60m)' || q.status === 'QUOTED'
                                ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                                : q.status === 'Order Confirmed' || q.status === 'APPROVED'
                                ? 'bg-emerald-400/20 text-emerald-300 border border-emerald-400/30'
                                : q.status === 'Dispatched'
                                ? 'bg-purple-400/20 text-purple-300 border border-purple-400/30'
                                : q.status === 'Delivered'
                                ? 'bg-blue-400/20 text-blue-300 border border-blue-400/30'
                                : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {translateStatus(q.status)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-bold text-white">
                          {q.quotedAmountUSD ? (
                            <span dir="ltr" className="text-emerald-400">${q.quotedAmountUSD.toLocaleString()}</span>
                          ) : (
                            <span className="text-slate-500 font-normal italic">{isAr ? 'لم يسعر' : 'Pending'}</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-right rtl:text-left">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedQuote(q)}
                              className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors"
                            >
                              {isAr ? 'تسعير / إدارة' : 'Manage'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteQuote(q.id, q.vesselName)}
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1 rounded transition-colors"
                              title={isAr ? 'حذف هذا الطلب' : 'Delete this quote request'}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: PRICING & QUOTATIONS ISSUED
            ======================================================== */}
        {activeTab === 'quotes' && (
          <div className="bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-amber-400" />
                  <span>{isAr ? 'عروض الأسعار والتسعير المعتمد' : 'Quotation & Pricing Desk'}</span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? 'متابعة العروض المسعرة، تسعير المنتجات، وتعيين قوارب الإمداد وضباط العمليات'
                    : 'Monitor priced quotations, manage vessel proforma amounts, and review profit margins.'}
                </p>
              </div>

              <div className="text-right rtl:text-left font-mono text-xs">
                <span className="text-slate-400 block">{isAr ? 'إجمالي قيمة العروض:' : 'Total Quoted Value:'}</span>
                <span className="text-lg font-bold text-emerald-400" dir="ltr">${estRevenueSum.toLocaleString()} USD</span>
              </div>
            </div>

            {quotes.filter((q) => q.quotedAmountUSD !== undefined || q.status === 'Quoted (60m)' || q.status === 'In Review').length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <DollarSign className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {isAr ? 'لا توجد عروض أسعار مسعرة بعد' : 'No Priced Quotations Yet'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isAr
                    ? 'انتقل إلى تبويب "طلبات التسعير الحية" واضغط على "تسعير / إدارة" لإصدار أول عرض سعر وتحديد القيمة بالدولار الأمريكي.'
                    : 'Navigate to "Live RFQs" and click "Manage" on any incoming request to assign pricing and issue a 60-minute quotation.'}
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('rfqs')}
                  className="bg-sky-500/20 hover:bg-sky-500/40 text-sky-300 px-4 py-2 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <Ship className="w-3.5 h-3.5" />
                  <span>{isAr ? 'الانتقال لطلبات التسعير' : 'Go to Live RFQs'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quotes
                  .filter((q) => q.quotedAmountUSD !== undefined || q.status === 'Quoted (60m)' || q.status === 'In Review')
                  .map((q) => (
                    <div key={q.id} className="p-4 bg-white/5 rounded-xl border border-white/10 space-y-3 hover:border-white/20 transition-all">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1 text-sm">
                          <Ship className="w-4 h-4 text-sky-400" />
                          <span>{q.vesselName}</span>
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400 font-bold" dir="ltr">
                          ${(q.quotedAmountUSD || 0).toLocaleString()}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 space-y-0.5">
                        <div>{q.companyName} • IMO {q.imoNumber}</div>
                        <div>{q.portOfCall} • <span dir="ltr">{q.etaDate}</span></div>
                        <div className="text-sky-300">{q.assignedOfficer || 'Capt. Tarek Mansour'}</div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/10">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/20 text-amber-300">
                          {translateStatus(q.status)}
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedQuote(q)}
                          className="text-xs text-sky-300 hover:text-white font-bold inline-flex items-center gap-1"
                        >
                          <span>{isAr ? 'تعديل السعر' : 'Update Price'}</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 4: ACTIVE ORDERS & DISPATCH
            ======================================================== */}
        {activeTab === 'orders' && (
          <div className="bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-400" />
                <span>{isAr ? 'أوامر التموين المؤكدة وجاهزية الإمداد' : 'Confirmed Orders & Launch Dispatch'}</span>
                <span className="text-xs font-mono text-slate-400">
                  (<span dir="ltr" className="unicode-isolate">{activeOrdersCount}</span>)
                </span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'متابعة الطلبات المعتمدة من الربان، التخليص الجمركي في بورتوفيق والأدبية، وجداول إبحار قوارب التموين'
                  : 'Track master-confirmed orders, Port Tawfik & Adabiya customs release, and launch boat transit schedules.'}
              </p>
            </div>

            {activeOrdersCount === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Briefcase className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {isAr ? 'لا توجد أوامر تموين مؤكدة حالياً' : 'No Confirmed Orders at This Moment'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'عندما يعتمد العميل عرض السعر أو يقوم ضابط العمليات بتغيير حالة الطلب إلى "تم تأكيد الطلب"، ستظهر هنا لمتابعة الإرسال والتسليم في منطقة الانتظار.'
                    : 'When a quotation status is changed to "Order Confirmed", it will be promoted here for dispatch tracking, launch boat assignment, and anchorage delivery.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeOrders.map((order) => (
                  <div key={order.id} className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-4 hover:border-white/20 transition-all">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                      <div>
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          <Ship className="w-4 h-4 text-purple-400" />
                          <span>{order.vesselName}</span>
                          <span className="text-xs font-mono text-slate-400" dir="ltr">({order.id} • IMO {order.imoNumber})</span>
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {order.companyName} • {order.portOfCall} • ETA: <span dir="ltr">{order.etaDate} {order.etaTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-base font-mono font-bold text-emerald-400" dir="ltr">
                          ${(order.quotedAmountUSD || 0).toLocaleString()}
                        </span>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-400/20 text-purple-300 border border-purple-400/30">
                          {translateStatus(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 bg-black/20 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isAr ? 'قارب الإمداد' : 'Assigned Launch Boat'}</span>
                        <span className="text-white font-bold mt-1 block">{order.dispatchLaunchBoat || 'Mentors Star I (Suez Anchorage)'}</span>
                      </div>
                      <div className="p-3 bg-black/20 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isAr ? 'ضابط العمليات' : 'Operations Officer'}</span>
                        <span className="text-white font-bold mt-1 block">{order.assignedOfficer || 'Capt. Tarek Mansour'}</span>
                      </div>
                      <div className="p-3 bg-black/20 rounded-lg">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">{isAr ? 'نطاق الخدمات' : 'Services Scope'}</span>
                        <span className="text-slate-200 mt-1 block truncate">{(order.services || []).join(', ') || 'Provisions'}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2">
                      {order.status !== 'Dispatched' && order.status !== 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'Dispatched')}
                          className="bg-purple-600 hover:bg-purple-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                          {isAr ? 'تأكيد الإرسال (قارب التموين)' : 'Mark Dispatched'}
                        </button>
                      )}
                      {order.status !== 'Delivered' && (
                        <button
                          type="button"
                          onClick={() => handleStatusChange(order.id, 'Delivered')}
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                        >
                          {isAr ? 'اكتمل التسليم على السفينة' : 'Mark Delivered'}
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setSelectedQuote(order)}
                        className="bg-white/10 hover:bg-white/20 text-white text-xs px-3 py-1.5 rounded-lg font-bold transition-colors"
                      >
                        {isAr ? 'تعديل التفاصيل' : 'Edit Details'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 5: TOP CUSTOMERS (DYNAMIC AGGREGATION)
            ======================================================== */}
        {activeTab === 'customers' && (
          <div className="bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-200">
            <div className="border-b border-white/10 pb-4">
              <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                <Users className="w-5 h-5 text-teal-400" />
                <span>{isAr ? 'دليل الشركات والعملاء الملاحيين' : 'Shipping Lines & Client Accounts'}</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {isAr
                  ? 'يتم تجميع وإحصاء حسابات العملاء الملاحيين والشركات المشغلة تلقائياً بناءً على طلبات التسعير المسجلة في قاعدة البيانات'
                  : 'Aggregated client profiles and transaction volumes dynamically calculated from real database orders.'}
              </p>
            </div>

            {dynamicCustomers.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <Building2 className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {isAr ? 'لا توجد حسابات عملاء مسجلة في قاعدة البيانات بعد' : 'No Client Records in Database Yet'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                  {isAr
                    ? 'عندما يسجل العملاء أو يرسلون طلبات تسعير لسفنهم، سيتم تجميع بياناتهم، إجمالي طلباتهم، وحجم أعمالهم بالدولار الأمريكي هنا.'
                    : 'When clients register accounts or submit vessel RFQs, their profiles, total order counts, and cumulative trade volumes will automatically aggregate here.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dynamicCustomers.map((cust, idx) => (
                  <div key={idx} className="p-5 bg-white/5 rounded-xl border border-white/10 space-y-3 hover:border-white/20 transition-all">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-teal-400" />
                        <h4 className="font-bold text-white text-sm">{cust.company}</h4>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 uppercase">
                        {cust.ordersCount > 2 ? 'VIP Client' : cust.ordersCount > 0 ? 'Verified Client' : 'Prospective'}
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 space-y-1">
                      <div><span className="text-slate-400">{isAr ? 'جهة الاتصال:' : 'Contact:'}</span> {cust.contactName}</div>
                      {cust.email && <div><span className="text-slate-400">{isAr ? 'البريد:' : 'Email:'}</span> <span dir="ltr">{cust.email}</span></div>}
                      {cust.phone && <div><span className="text-slate-400">{isAr ? 'الهاتف:' : 'Phone:'}</span> <span dir="ltr">{cust.phone}</span></div>}
                      <div><span className="text-slate-400">{isAr ? 'آخر سفينة مخدومة:' : 'Latest Vessel:'}</span> {cust.latestVessel}</div>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-slate-400 block text-[10px]">{isAr ? 'الطلبات' : 'RFQs / Orders'}</span>
                        <span className="font-bold text-white" dir="ltr">{cust.quotesCount} RFQs • {cust.ordersCount} Orders</span>
                      </div>
                      <div className="text-right rtl:text-left">
                        <span className="text-slate-400 block text-[10px]">{isAr ? 'حجم التعامل' : 'Total Volume'}</span>
                        <span className="font-bold text-emerald-400" dir="ltr">${cust.totalUSD.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 6: CONTACT INQUIRIES INBOX
            ======================================================== */}
        {activeTab === 'inquiries' && (
          <div className="bg-[#102C4E] border border-white/10 rounded-2xl p-6 shadow-md space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white font-cinzel flex items-center gap-2">
                  <Mail className="w-5 h-5 text-sky-400" />
                  <span>{isAr ? 'صندوق رسائل واستفسارات العملاء' : 'Client Inquiries & Dispatch Messages'}</span>
                  <span className="text-xs font-mono text-slate-400">
                    (<span dir="ltr" className="unicode-isolate">{filteredInquiries.length}</span> / <span dir="ltr" className="unicode-isolate">{inquiriesCount}</span>)
                  </span>
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isAr
                    ? 'الرسائل الواردة من صفحة تواصل معنا مع إمكانية الرد المباشر وتحديث حالة الاستفسار'
                    : 'Inbound inquiries from the contact form with direct mailto reply and status tracking.'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={inquiryStatusFilter}
                  onChange={(e) => setInquiryStatusFilter(e.target.value)}
                  className="bg-[#0B2545] border border-white/15 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:ring-2 focus:ring-sky-400 font-semibold"
                >
                  <option value="ALL">{isAr ? 'كافة الرسائل' : 'All Messages'}</option>
                  <option value="New">{isAr ? 'رسائل جديدة' : 'New'}</option>
                  <option value="In Progress">{isAr ? 'قيد المتابعة' : 'In Progress'}</option>
                  <option value="Replied">{isAr ? 'تم الرد' : 'Replied'}</option>
                </select>
              </div>
            </div>

            {filteredInquiries.length === 0 ? (
              <div className="py-16 text-center text-slate-400 space-y-3">
                <MessageSquare className="w-12 h-12 text-slate-500 mx-auto" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {isAr ? 'لا توجد رسائل واردة في قاعدة البيانات' : 'No Inquiries in the Database'}
                </h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  {isAr
                    ? 'عند قيام الزوار بملء استمارة الاتصال، ستظهر رسائلهم وتفاصيل سفنهم واستفساراتهم هنا فوراً.'
                    : 'When visitors submit messages on the Contact page, they will appear here with vessel and contact details.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-white/5 text-xs">
                {filteredInquiries.map((inq) => (
                  <div key={inq.id} className="py-4 hover:bg-white/5 px-3 rounded-xl transition-colors space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{inq.fullName}</span>
                        {inq.companyName && (
                          <span className="text-slate-400">({inq.companyName})</span>
                        )}
                        {inq.vesselName && (
                          <span className="text-sky-300 font-mono text-[11px] bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/50">
                            ⚓ {inq.vesselName}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 font-mono text-[10px]" dir="ltr">
                          {new Date(inq.submittedAt).toLocaleString()}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            inq.status === 'New'
                              ? 'bg-sky-500/20 text-sky-300'
                              : inq.status === 'Replied'
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}
                        >
                          {translateInquiryStatus(inq.status)}
                        </span>
                      </div>
                    </div>

                    <div className="text-sky-200 font-semibold text-xs">{inq.subject}</div>
                    <div className="text-slate-300 text-xs leading-relaxed whitespace-pre-line bg-black/20 p-3 rounded-lg border border-white/5">
                      {inq.message}
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
                        <span dir="ltr">✉ {inq.email}</span>
                        {inq.phone && <span dir="ltr">📞 {inq.phone}</span>}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`mailto:${inq.email}?subject=Re:%20${encodeURIComponent(inq.subject)}%20-%20Mentors%20Marine%20Suez%20Dispatch`}
                          onClick={() => handleInquiryStatusChange(inq.id, 'Replied')}
                          className="bg-sky-600 hover:bg-sky-500 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors inline-flex items-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>{isAr ? 'رد عبر البريد' : 'Reply by Email'}</span>
                        </a>

                        {inq.status !== 'Replied' && (
                          <button
                            type="button"
                            onClick={() => handleInquiryStatusChange(inq.id, 'Replied')}
                            className="bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors"
                          >
                            {isAr ? 'تعيين كـ "تم الرد"' : 'Mark Replied'}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteInquiry(inq.id, inq.fullName)}
                          className="text-red-400 hover:text-red-300 p-1.5 rounded transition-colors"
                          title={isAr ? 'حذف هذه الرسالة' : 'Delete this message'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================
          MODAL: QUOTE PRICING & DISPATCH DRAWER
          ======================================================== */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="bg-[#0B2545] border border-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Ship className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="text-lg font-bold text-white font-cinzel">
                    {isAr ? `إدارة وتسعير طلب السفينة: ${selectedQuote.vesselName}` : `Manage & Price RFQ: ${selectedQuote.vesselName}`}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    <span dir="ltr" className="unicode-isolate">Ref: {selectedQuote.id} • IMO: {selectedQuote.imoNumber}</span>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="bg-white/5 p-3 rounded-xl border border-white/10 text-xs space-y-1">
              <div className="grid grid-cols-2 gap-2">
                <div><strong className="text-slate-400">{isAr ? 'الشركة:' : 'Company:'}</strong> {selectedQuote.companyName}</div>
                <div><strong className="text-slate-400">{isAr ? 'الميناء:' : 'Port:'}</strong> {selectedQuote.portOfCall}</div>
                <div><strong className="text-slate-400">{isAr ? 'الوصول ETA:' : 'ETA:'}</strong> <span dir="ltr">{selectedQuote.etaDate} {selectedQuote.etaTime}</span></div>
                <div><strong className="text-slate-400">{isAr ? 'البريد:' : 'Email:'}</strong> <span dir="ltr">{selectedQuote.contactEmail}</span></div>
              </div>
              {selectedQuote.fileName && (
                <div className="pt-1 text-sky-300 font-mono">
                  📎 {isAr ? 'الملف المرفق:' : 'Attached Manifest:'} {selectedQuote.fileName}
                </div>
              )}
            </div>

            <form onSubmit={handleSaveQuoteDetails} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-300 mb-1">
                    {isAr ? 'إجمالي السعر المعروض (USD)' : 'Quoted Total Price (USD)'}
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
                    <option value="New">{isAr ? 'جديد (New)' : 'New'}</option>
                    <option value="In Review">{isAr ? 'قيد المراجعة (In Review)' : 'In Review'}</option>
                    <option value="Quoted (60m)">{isAr ? 'تم التسعير 60 دقيقة (Quoted 60m)' : 'Quoted (60m)'}</option>
                    <option value="Order Confirmed">{isAr ? 'تم تأكيد الطلب (Order Confirmed)' : 'Order Confirmed'}</option>
                    <option value="Dispatched">{isAr ? 'تم الإرسال عبر قارب التموين (Dispatched)' : 'Dispatched'}</option>
                    <option value="Delivered">{isAr ? 'تم التسليم بنجاح (Delivered)' : 'Delivered'}</option>
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
                    {isAr ? 'لنش التموين والإمداد' : 'Assigned Launch Boat'}
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
                  {isAr ? 'ملاحظات التخليص الجمركي والتوجيه التشغيلي' : 'Customs & Dispatch Notes'}
                </label>
                <textarea
                  rows={3}
                  value={editAdminNotes}
                  onChange={(e) => setEditAdminNotes(e.target.value)}
                  placeholder={
                    isAr
                      ? 'مرفق شهادة الجودة والسلامة الغذائية HACCP، تم تخليص البضائع المعفاة جمركياً مع جمارك بورتوفيق...'
                      : 'HACCP quality certificate approved, customs clearance in Port Tawfik completed...'
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

      {/* ========================================================
          MODAL: INQUIRY PREVIEW MODAL
          ======================================================== */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="bg-[#0B2545] border border-white/20 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-100 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <Mail className="w-5 h-5 text-sky-400" />
                <h3 className="text-base font-bold text-white font-cinzel">
                  {selectedInquiry.subject}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-white font-bold text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="text-xs space-y-1 bg-white/5 p-3 rounded-xl border border-white/10">
              <div><strong className="text-slate-400">{isAr ? 'المرسل:' : 'Sender:'}</strong> {selectedInquiry.fullName}</div>
              <div><strong className="text-slate-400">{isAr ? 'البريد الإلكتروني:' : 'Email:'}</strong> <span dir="ltr">{selectedInquiry.email}</span></div>
              {selectedInquiry.phone && <div><strong className="text-slate-400">{isAr ? 'الهاتف:' : 'Phone:'}</strong> <span dir="ltr">{selectedInquiry.phone}</span></div>}
              {selectedInquiry.companyName && <div><strong className="text-slate-400">{isAr ? 'الشركة:' : 'Company:'}</strong> {selectedInquiry.companyName}</div>}
              {selectedInquiry.vesselName && <div><strong className="text-slate-400">{isAr ? 'السفينة:' : 'Vessel:'}</strong> {selectedInquiry.vesselName}</div>}
              <div><strong className="text-slate-400">{isAr ? 'التاريخ:' : 'Date:'}</strong> <span dir="ltr">{new Date(selectedInquiry.submittedAt).toLocaleString()}</span></div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300">{isAr ? 'نص الرسالة:' : 'Message Content:'}</label>
              <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-xs text-slate-200 whitespace-pre-line leading-relaxed max-h-60 overflow-y-auto">
                {selectedInquiry.message}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => handleDeleteInquiry(selectedInquiry.id, selectedInquiry.fullName)}
                className="text-red-400 hover:text-red-300 text-xs font-semibold inline-flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isAr ? 'حذف الرسالة' : 'Delete Message'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInquiry(null)}
                  className="px-4 py-2 text-slate-300 hover:text-white font-bold text-xs"
                >
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
                <a
                  href={`mailto:${selectedInquiry.email}?subject=Re:%20${encodeURIComponent(selectedInquiry.subject)}%20-%20Mentors%20Marine%20Suez%20Dispatch`}
                  onClick={() => {
                    handleInquiryStatusChange(selectedInquiry.id, 'Replied');
                    setSelectedInquiry(null);
                  }}
                  className="bg-sky-600 hover:bg-sky-500 text-white px-4 py-2 rounded-xl font-bold text-xs inline-flex items-center gap-1.5 transition-colors shadow-md"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isAr ? 'فتح رد في البريد' : 'Reply via Email'}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
