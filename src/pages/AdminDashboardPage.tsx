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
  Radio,
  Plus,
  RefreshCw,
  Eye,
  Check,
  Building2,
  Calendar,
  Layers,
  Sparkles,
  X,
  Compass,
  AlertCircle,
  Lock,
  LogOut,
  User,
  Shield,
  Printer,
  Globe
} from 'lucide-react';
import { requestStore } from '../services/requestStore';
import { authStore } from '../services/authStore';
import { languageStore, Language } from '../services/languageStore';
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

  // Operational State
  const [quotes, setQuotes] = useState<AdminQuoteRequest[]>([]);
  const [inquiries, setInquiries] = useState<AdminContactInquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'quotes' | 'inquiries' | 'fleet'>('quotes');

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [portFilter, setPortFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Selected quote for drawer
  const [selectedQuote, setSelectedQuote] = useState<AdminQuoteRequest | null>(null);

  // Drawer form state
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
      }
    } catch {
      setDbStatus({ configured: false, message: 'Local Cache Mode', count: 0 });
    }
  };

  useEffect(() => {
    checkDbHealth();
    const interval = setInterval(checkDbHealth, 25000);
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await requestStore.refreshFromBackend();
    await checkDbHealth();
    setIsSyncing(false);
    showToast('PostgreSQL Database synchronized with Suez Cloud Dispatch repository.');
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
          second: '2-digit'
        })
      );
      setZuluTime(
        now.toLocaleTimeString('en-GB', {
          timeZone: 'UTC',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const loadData = () => {
      setQuotes(requestStore.getQuoteRequests());
      setInquiries(requestStore.getContactInquiries());
    };
    loadData();
    const unsub = requestStore.subscribe(loadData);
    return () => unsub();
  }, []);

  useEffect(() => {
    if (selectedQuote) {
      setEditQuotedAmount(selectedQuote.quotedAmountUSD ? String(selectedQuote.quotedAmountUSD) : '');
      setEditOfficer(selectedQuote.assignedOfficer || 'Capt. Tarek Mansour (Suez Duty)');
      setEditLaunchBoat(selectedQuote.dispatchLaunchBoat || 'Mentors Launch 02 (Cold Chain)');
      setEditAdminNotes(selectedQuote.adminNotes || '');
    }
  }, [selectedQuote]);

  // Handle Staff Authentication
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStaffError(null);
    setIsAuthorizing(true);

    setTimeout(() => {
      const res = authStore.login(staffEmail, staffPassword);
      setIsAuthorizing(false);

      if (!res.success) {
        setStaffError(res.error || 'Invalid staff credentials');
      } else if (res.user?.role !== 'admin') {
        setStaffError(
          `Security Clearance Denied: Account "${res.user?.name}" is registered as a Client Account. Operations Admin access is restricted to Duty Officers with Administrator clearance.`
        );
      } else {
        showToast(`Clearance Granted: Welcome Capt. ${res.user.name.split(' ')[0]}`);
      }
    }, 400);
  };

  const handleQuickStaffDemo = () => {
    setStaffError(null);
    const user = authStore.loginAsDemoAdmin();
    showToast(`Officer Clearance Granted: ${user.name}`);
  };

  const handleSignOut = () => {
    authStore.logout();
    navigate('/');
  };

  // Status Progression
  const handleStatusChange = (newStatus: RFQStatus) => {
    if (!selectedQuote) return;
    const updated = requestStore.updateQuoteStatus(selectedQuote.id, newStatus, {
      quotedAmountUSD: editQuotedAmount ? parseFloat(editQuotedAmount) : undefined,
      assignedOfficer: editOfficer,
      dispatchLaunchBoat: editLaunchBoat,
      adminNotes: editAdminNotes
    });
    if (updated) {
      setSelectedQuote(updated);
      showToast(`Vessel ${updated.vesselName} status updated to: ${newStatus}`);
    }
  };

  const handleSaveDetails = () => {
    if (!selectedQuote) return;
    const updated = requestStore.updateQuoteStatus(selectedQuote.id, selectedQuote.status, {
      quotedAmountUSD: editQuotedAmount ? parseFloat(editQuotedAmount) : undefined,
      assignedOfficer: editOfficer,
      dispatchLaunchBoat: editLaunchBoat,
      adminNotes: editAdminNotes
    });
    if (updated) {
      setSelectedQuote(updated);
      showToast(`Operational details saved for RFQ ${updated.id}`);
    }
  };

  const generateWhatsAppLink = (quote: AdminQuoteRequest) => {
    const text = `*Mentors Marine Egypt - 24/7 Operations Desk*%0A%0A*Vessel:* ${quote.vesselName} (IMO: ${quote.imoNumber})%0A*Port:* ${quote.portOfCall}%0A*Status:* ${quote.status}%0A*Quote Ref:* ${quote.id}%0A%0AHello ${quote.contactName}, this is ${editOfficer || 'Capt. Tarek'} from Mentors Marine Suez duty station. We have received your requisition indent for ${quote.services?.join(', ') || 'Provisions'}.%0A%0AWe are standing by for your ETA at ${quote.portOfCall}.`;
    const cleanPhone = quote.contactPhone.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanPhone}?text=${text}`;
  };

  const handleExportCSV = () => {
    if (quotes.length === 0) return;
    const headers = ['Quote_ID', 'Vessel_Name', 'IMO', 'Port', 'ETA', 'Priority', 'Services', 'Status', 'Quoted_USD', 'Contact', 'Email'];
    const rows = quotes.map((q) => [
      q.id,
      `"${q.vesselName.replace(/"/g, '""')}"`,
      q.imoNumber,
      `"${q.portOfCall.replace(/"/g, '""')}"`,
      `${q.etaDate} ${q.etaTime}`,
      q.priority,
      `"${q.services.join('; ')}"`,
      q.status,
      q.quotedAmountUSD || 0,
      `"${q.contactName}"`,
      q.contactEmail
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `Mentors_Marine_Quotes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Requisition registry exported as CSV.');
  };

  const isAr = currentLang === 'ar';

  // =========================================================================
  // SECURITY GATE SCREEN: IF NOT AUTHENTICATED AS ADMIN
  // =========================================================================
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="w-full min-h-[85vh] bg-[#071322] flex items-center justify-center p-4" id="staff-auth-gate">
        <div className="w-full max-w-md bg-[#0B1E36] border border-slate-700/80 rounded-2xl shadow-2xl p-6 sm:p-8 text-white relative overflow-hidden">
          {/* Subtle Top Accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-[#C81D25] to-amber-500"></div>

          {/* Header */}
          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A192F] to-[#0B2545] border border-amber-400/40 flex items-center justify-center mx-auto shadow-inner text-amber-400">
              <Shield className="w-7 h-7 stroke-[2.2]" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Staff Clearance Required
              </span>
              <h1 className="text-xl font-bold font-cinzel tracking-wider text-white mt-2">
                Suez Dispatch Command
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                Restricted access for Mentors Marine Operations & Duty Officers.
              </p>
            </div>
          </div>

          {/* Client Notice if client is logged in */}
          {currentUser && currentUser.role === 'client' && (
            <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300">
                <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Client Session Active</span>
              </div>
              <p>
                You are currently signed in as <strong>{currentUser.name}</strong> ({currentUser.company}).
                This terminal is reserved for Suez Port Dispatch Staff.
              </p>
              <div className="pt-1">
                <Link
                  to="/client-portal"
                  className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 font-bold underline"
                >
                  Return to your Client Portal & Orders →
                </Link>
              </div>
            </div>
          )}

          {/* Error Message */}
          {staffError && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-950/80 border border-red-500/50 text-xs text-red-200 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{staffError}</span>
            </div>
          )}

          {/* Staff Login Form */}
          <form onSubmit={handleStaffLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Staff Official Email / Callsign
              </label>
              <input
                type="email"
                required
                value={staffEmail}
                onChange={(e) => setStaffEmail(e.target.value)}
                placeholder="admin@mentors-marine.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Passphrase
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={staffPassword}
                  onChange={(e) => setStaffPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isAuthorizing}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAuthorizing ? 'Verifying Clearance...' : 'Verify Staff Clearance'}</span>
            </button>
          </form>

          {/* Demo Staff Shortcut for Evaluation */}
          <div className="mt-6 pt-5 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleQuickStaffDemo}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>1-Click Duty Officer Access (Capt. Tarek Mansour)</span>
            </button>

            <div className="text-center">
              <Link to="/" className="text-xs text-slate-400 hover:text-white transition-colors">
                ← Return to Public Homepage
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED STAFF COMMAND DESK VIEW
  // =========================================================================
  const filteredQuotes = quotes.filter((q) => {
    if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
    if (portFilter !== 'ALL' && !q.portOfCall.includes(portFilter)) return false;
    if (priorityFilter !== 'ALL' && !q.priority.includes(priorityFilter)) return false;
    if (searchQuery) {
      const qText = searchQuery.toLowerCase();
      const matchVessel = q.vesselName.toLowerCase().includes(qText);
      const matchIMO = q.imoNumber.toLowerCase().includes(qText);
      const matchCompany = q.companyName.toLowerCase().includes(qText);
      const matchId = q.id.toLowerCase().includes(qText);
      if (!matchVessel && !matchIMO && !matchCompany && !matchId) return false;
    }
    return true;
  });

  const countPending = quotes.filter((q) => q.status === 'New' || q.status === 'In Review').length;
  const countQuoted = quotes.filter((q) => q.status === 'Quoted (60m)').length;
  const countDispatched = quotes.filter((q) => q.status === 'Dispatched').length;
  const totalValueUSD = quotes.reduce((acc, curr) => acc + (curr.quotedAmountUSD || 0), 0);

  return (
    <div className="w-full min-h-screen bg-[#071322] text-slate-200 pb-20 font-sans" id="admin-operations-desk">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#0B2545] border border-amber-400 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span className="text-xs font-semibold">{toastMessage}</span>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white ml-2">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1. TOP MARITIME COMMAND BAR */}
      <div className="bg-[#0A192F] border-b border-slate-800 px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Station Identity & Officer */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center font-cinzel shadow-sm">
              {currentUser.avatarInitials || 'TM'}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <strong className="text-white text-sm tracking-wide">
                  {currentUser.name}
                </strong>
                <span className="bg-amber-400/20 text-amber-300 border border-amber-400/40 text-[10px] font-black uppercase px-2 py-0.5 rounded-full">
                  Duty Officer
                </span>
                <span className="text-slate-400 text-xs hidden sm:inline-block">
                  • Port Tawfik HQ & Suez Anchorage Dispatch
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                <span className="flex items-center gap-1 text-emerald-400 font-mono">
                  <Radio className="w-3 h-3 animate-pulse" />
                  <span>Suez Station: {suezTime} (UTC+2)</span>
                </span>
                <span className="text-slate-600">|</span>
                <span className="font-mono text-slate-300">ZULU: {zuluTime}</span>
              </div>
            </div>
          </div>

          {/* System Status, Sync & Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Supabase Status Indicator */}
            <button
              onClick={handleManualSync}
              disabled={isSyncing}
              type="button"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                dbStatus?.configured
                  ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                  : 'bg-amber-950/70 border-amber-500/40 text-amber-300 hover:bg-amber-900/60'
              }`}
              title="PostgreSQL Cloud Synchronization Status"
            >
              <span className={`w-2 h-2 rounded-full ${dbStatus?.configured ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
              <span>{isSyncing ? 'Syncing...' : (dbStatus?.configured ? `Supabase Live (${dbStatus.count})` : 'Offline')}</span>
              <RefreshCw className={`w-3 h-3 text-emerald-400 ml-0.5 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* Language Switcher in Admin */}
            <button
              type="button"
              onClick={() => languageStore.setLanguage(currentLang === 'en' ? 'ar' : 'en')}
              className="px-2.5 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 hover:text-white flex items-center gap-1"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLang === 'en' ? 'العربية' : 'EN'}</span>
            </button>

            <button
              onClick={handleExportCSV}
              type="button"
              className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white font-medium px-3 py-1.5 rounded-xl text-xs border border-slate-700 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-sky-400" />
              <span>Export Registry</span>
            </button>

            <button
              onClick={handleSignOut}
              type="button"
              className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-950/70 border border-red-800/40 font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE METRIC KPI CARDS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-[#0B1E36] border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Active Requisitions
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-white">{quotes.length}</span>
              <span className="text-xs text-slate-400">Total Indents</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Suez Canal & Major Ports</div>
          </div>

          <div className="bg-[#0B1E36] border border-amber-500/40 p-4 rounded-2xl shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                Pending Quotations
              </span>
              <Clock className="w-4 h-4 text-amber-400 animate-pulse" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-amber-300">{countPending}</span>
              <span className="text-xs text-amber-400 font-bold">&lt; 60m SLA</span>
            </div>
            <div className="mt-2 text-[11px] text-amber-200/80">Requires Pricing Dispatch</div>
          </div>

          <div className="bg-[#0B1E36] border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400">
                Quoted & Dispatched
              </span>
              <Ship className="w-4 h-4 text-sky-400" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-sky-300">{countQuoted + countDispatched}</span>
              <span className="text-xs text-slate-400">In Pipeline</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Harbor Launch Coordination</div>
          </div>

          <div className="bg-[#0B1E36] border border-slate-800 p-4 rounded-2xl shadow-sm flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Quoted Pipeline Volume
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                ${Math.round(totalValueUSD).toLocaleString()}
              </span>
              <span className="text-xs text-slate-400">USD</span>
            </div>
            <div className="mt-2 text-[11px] text-slate-400">Verified Indent Volume</div>
          </div>
        </div>

        {/* 3. TABS NAVIGATION */}
        <div className="mt-6 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('quotes')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'quotes'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Ship className="w-4 h-4" />
              <span>Vessel Requisitions & Indents ({quotes.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('inquiries')}
              className={`px-4 py-3 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'inquiries'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Port & General Inquiries ({inquiries.length})</span>
            </button>
          </div>
        </div>

        {/* 4. REQUISITIONS TABLE VIEW */}
        {activeTab === 'quotes' && (
          <div className="mt-5 space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-[#0B1E36] border border-slate-800 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by vessel, IMO, or port..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {['ALL', 'New', 'In Review', 'Quoted (60m)', 'Dispatched', 'Delivered'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="bg-[#0B1E36] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#08172A] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Vessel & IMO</th>
                      <th className="py-3.5 px-4">Port / ETA</th>
                      <th className="py-3.5 px-4">Services / Items</th>
                      <th className="py-3.5 px-4">Priority</th>
                      <th className="py-3.5 px-4">Quoted (USD)</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-200">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No requisitions matching current filters.
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <tr
                          key={quote.id}
                          className="hover:bg-slate-800/50 transition-colors cursor-pointer group"
                          onClick={() => setSelectedQuote(quote)}
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-white group-hover:text-amber-300 transition-colors flex items-center gap-1.5">
                              <Ship className="w-3.5 h-3.5 text-amber-400" />
                              <span>{quote.vesselName}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                              IMO {quote.imoNumber} • {quote.vesselType || 'Vessel'}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate max-w-[180px]">
                              {quote.companyName}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-medium text-slate-200">{quote.portOfCall}</div>
                            <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mt-0.5">
                              <Calendar className="w-3 h-3 text-slate-400" />
                              <span>{quote.etaDate} @ {quote.etaTime}</span>
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1 flex-wrap max-w-xs">
                              {quote.services?.slice(0, 2).map((s, idx) => (
                                <span
                                  key={idx}
                                  className="bg-slate-800 border border-slate-700 text-slate-300 text-[10px] px-2 py-0.5 rounded"
                                >
                                  {s}
                                </span>
                              ))}
                              {quote.fileName && (
                                <span className="bg-sky-950/70 text-sky-300 border border-sky-800/60 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1">
                                  <FileText className="w-3 h-3" />
                                  <span>{quote.fileName}</span>
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                                quote.priority.includes('Urgent') || quote.priority.includes('< 30')
                                  ? 'bg-red-500/20 text-red-300 border-red-500/40'
                                  : 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                              }`}
                            >
                              {quote.priority}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 font-mono font-bold text-emerald-300">
                            {quote.quotedAmountUSD ? `$${quote.quotedAmountUSD.toLocaleString()}` : (
                              <span className="text-slate-500 font-normal italic">Awaiting Pricing</span>
                            )}
                          </td>

                          <td className="py-3.5 px-4">
                            <span
                              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                                quote.status === 'DELIVERED'
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                  : quote.status === 'QUOTED'
                                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                  : quote.status === 'DISPATCHED'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {quote.status.replace('_', ' ')}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => setSelectedQuote(quote)}
                              className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors"
                            >
                              Inspect / Price
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 5. GENERAL INQUIRIES TAB */}
        {activeTab === 'inquiries' && (
          <div className="mt-5 bg-[#0B1E36] border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#08172A] text-slate-400 uppercase tracking-wider font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3.5 px-4">Ref</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Company</th>
                  <th className="py-3.5 px-4">Subject</th>
                  <th className="py-3.5 px-4">Received</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-200">
                {inquiries.map((inq) => (
                  <tr key={inq.id} className="hover:bg-slate-800/50">
                    <td className="py-3.5 px-4 font-mono text-slate-400">{inq.id}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white">{inq.name}</div>
                      <div className="text-[11px] text-slate-400">{inq.email}</div>
                    </td>
                    <td className="py-3.5 px-4">{inq.company || 'Direct Contact'}</td>
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-semibold text-slate-200">{inq.subject}</div>
                      <div className="text-[11px] text-slate-400 truncate">{inq.message}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-400">{inq.createdAt.slice(0, 10)}</td>
                    <td className="py-3.5 px-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        {inq.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 6. INSPECTION & OPERATIONAL PRICING DRAWER */}
      {selectedQuote && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#0B1E36] border-l border-slate-700 h-full overflow-y-auto p-6 text-slate-200 flex flex-col justify-between shadow-2xl">
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Ship className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-cinzel">
                      {selectedQuote.vesselName}
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Ref: {selectedQuote.id} • IMO: {selectedQuote.imoNumber}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedQuote(null)}
                  className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status Progression Pipeline */}
              <div className="mt-5 bg-[#08172A] p-4 rounded-xl border border-slate-800">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2.5">
                  Operational Progression Pipeline
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {(['New', 'In Review', 'Quoted (60m)', 'Dispatched', 'Delivered'] as RFQStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => handleStatusChange(st)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold text-center border transition-all ${
                        selectedQuote.status === st
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vessel Indent Details */}
              <div className="mt-5 space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                  <div>
                    <span className="text-slate-400">Port of Call:</span>
                    <strong className="block text-white text-sm mt-0.5">{selectedQuote.portOfCall}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Expected Arrival (ETA):</span>
                    <strong className="block text-white text-sm mt-0.5">{selectedQuote.etaDate} @ {selectedQuote.etaTime}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Superintendent / Contact:</span>
                    <strong className="block text-white text-sm mt-0.5">{selectedQuote.contactName} ({selectedQuote.companyName})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Official Contact:</span>
                    <strong className="block text-white text-sm mt-0.5">{selectedQuote.contactPhone}</strong>
                  </div>
                </div>

                {/* Pricing & Harbor Launch Dispatch Form */}
                <div className="bg-[#08172A] p-4 rounded-xl border border-slate-800 space-y-3">
                  <h3 className="font-bold text-amber-300 text-xs uppercase tracking-wider">
                    Officer Pricing & Launch Dispatch
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Quoted Total (USD $)
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 14250"
                        value={editQuotedAmount}
                        onChange={(e) => setEditQuotedAmount(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-emerald-300 font-mono font-bold focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">
                        Assigned Harbor Launch
                      </label>
                      <select
                        value={editLaunchBoat}
                        onChange={(e) => setEditLaunchBoat(e.target.value)}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                      >
                        <option value="Mentors Launch 01 (Port Tawfik)">Mentors Launch 01 (Port Tawfik)</option>
                        <option value="Mentors Launch 02 (Cold Chain)">Mentors Launch 02 (Cold Chain)</option>
                        <option value="Mentors Launch 03 (Technical Deck/Engine)">Mentors Launch 03 (Technical Spares)</option>
                        <option value="Mentors Tug 04 (Outer Anchorage)">Mentors Tug 04 (Outer Anchorage)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">
                      Duty Officer Notes
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Enter internal vessel clearance instructions, gangway coordinates, or dietary confirmations..."
                      value={editAdminNotes}
                      onChange={(e) => setEditAdminNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleSaveDetails}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-xs transition-colors shadow"
                    >
                      Save Pricing & Notes to Supabase
                    </button>

                    <a
                      href={generateWhatsAppLink(selectedQuote)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded-lg font-bold text-xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Send WhatsApp Dispatch</span>
                    </a>
                  </div>
                </div>

                {/* Items & Manifest */}
                <div>
                  <h4 className="font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Selected Requisition Indent Items ({selectedQuote.selectedItems?.length || 0})
                  </h4>
                  <div className="max-h-40 overflow-y-auto space-y-1.5 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {selectedQuote.selectedItems && selectedQuote.selectedItems.length > 0 ? (
                      selectedQuote.selectedItems.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-800/50">
                          <span>{item}</span>
                          <span className="text-[10px] text-emerald-400 font-bold font-mono">CONFIRMED</span>
                        </div>
                      ))
                    ) : (
                      <span className="text-slate-500 italic">No specific pre-selected checklist items.</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-2 rounded-lg bg-slate-800"
              >
                <Printer className="w-4 h-4" />
                <span>Print Indent Voucher</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedQuote(null)}
                className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-bold text-xs"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
