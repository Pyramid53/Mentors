import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Lock,
  Mail,
  KeyRound,
  FileCheck,
  History,
  RotateCcw,
  Ship,
  Headphones,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Shield,
  Eye,
  EyeOff,
  User,
  Building2,
  Phone,
  LogOut,
  Plus,
  ExternalLink,
  Clock,
  Download,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Anchor,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { authStore } from '../services/authStore';
import { requestStore } from '../services/requestStore';
import { AppUser, AdminQuoteRequest, UserRole } from '../types';

export const ClientPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());

  // Form tab & toggles
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up form state
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupRole, setSignupRole] = useState<UserRole>('client');
  const [signupTitle, setSignupTitle] = useState('Fleet Procurement Superintendent');
  const [signupPassword, setSignupPassword] = useState('');

  // Client requests
  const [clientQuotes, setClientQuotes] = useState<AdminQuoteRequest[]>([]);
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState<AdminQuoteRequest | null>(null);

  useEffect(() => {
    const unsub = authStore.subscribe((user) => {
      setCurrentUser(user);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const loadQuotes = () => {
      const all = requestStore.getQuoteRequests();
      if (currentUser) {
        const userCompany = currentUser.company.toLowerCase();
        const matched = all.filter(
          (q) =>
            q.companyName.toLowerCase().includes(userCompany) ||
            q.contactEmail.toLowerCase() === currentUser.email.toLowerCase()
        );
        setClientQuotes(matched.length > 0 ? matched : all.slice(0, 4));
      } else {
        setClientQuotes(all.slice(0, 4));
      }
    };

    loadQuotes();
    const unsubReq = requestStore.subscribe(loadQuotes);
    return () => unsubReq();
  }, [currentUser]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await authStore.login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Login failed. Please verify credentials.');
    } else {
      setSuccessMsg(`Welcome back, ${res.user?.name}!`);
      if (res.user?.role === 'admin') {
        setTimeout(() => navigate('/admin'), 600);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsSubmitting(true);

    const res = await authStore.signup({
      name: signupName,
      email: signupEmail,
      company: signupCompany,
      phone: signupPhone,
      password: signupPassword,
      role: 'client'
    });
    setIsSubmitting(false);

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed.');
    } else {
      setSuccessMsg(`Account created successfully for ${res.user?.name}!`);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setSuccessMsg('You have been logged out securely.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDemoClient = () => {
    setErrorMsg(null);
    const user = authStore.loginAsDemoClient();
    setSuccessMsg(`Signed in as ${user.name} (${user.company})`);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-10 sm:py-16" id="client-portal-container">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SUCCESS / ERROR TOASTS */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
            <button
              onClick={() => setSuccessMsg(null)}
              className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-300 text-red-900 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button
              onClick={() => setErrorMsg(null)}
              className="text-red-700 hover:text-red-900 font-bold ml-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* LOGGED IN CLIENT VIEW */}
        {currentUser ? (
          <div className="space-y-8">
            {/* Top User Welcome Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#0B2545] text-amber-400 font-extrabold text-xl flex items-center justify-center shadow-md">
                  {currentUser.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2.5">
                    <h1 className="text-2xl font-extrabold text-[#0B2545] font-cinzel">
                      {currentUser.name}
                    </h1>
                    <span
                      className={`text-[11px] font-bold uppercase px-2.5 py-0.5 rounded-full border ${
                        currentUser.role === 'admin'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : 'bg-sky-50 text-sky-700 border-sky-200'
                      }`}
                    >
                      {currentUser.role === 'admin' ? 'Operations Dispatch Officer' : 'Verified Client'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{currentUser.company}</span>
                    <span>•</span>
                    <span className="text-slate-500">{currentUser.title}</span>
                    <span>•</span>
                    <span className="text-slate-500">{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  to="/get-a-quote"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#C81D25] hover:bg-[#a8161d] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>New 60-Min Requisition</span>
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Admin Desk</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Active Requisitions</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-[#0B2545] mt-2 font-cinzel">
                  {clientQuotes.filter((q) => q.status === 'QUOTED' || q.status === 'RECEIVED').length}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Guaranteed 60-min SLA</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Approved & In Clearance</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mt-2 font-cinzel">
                  {clientQuotes.filter((q) => q.status === 'APPROVED' || q.status === 'IN_CLEARANCE').length || 1}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Customs cleared in Port Tawfik</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>Assigned Launch Boats</span>
                  <Ship className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-2xl font-bold text-[#0B2545] mt-2 font-cinzel">
                  Mentors Star I & II
                </div>
                <div className="text-[11px] text-slate-500 mt-1">Suez Anchorage delivery</div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>24/7 Operations Desk</span>
                  <Phone className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-base font-bold text-slate-900 mt-2 font-mono">
                  +20 100 892 4477
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">VHF Marine Ch 16/73 Live</div>
              </div>
            </div>

            {/* Requisitions List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545] font-cinzel">
                    Your Vessel Requisitions & Quotations
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Live updates direct from the Mentors Marine Suez Dispatch Room
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/get-a-quote"
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Upload Provision List</span>
                  </Link>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                    <tr>
                      <th className="py-3.5 px-6">Quote Ref / Vessel</th>
                      <th className="py-3.5 px-6">Port & ETA</th>
                      <th className="py-3.5 px-6">Supply Scope</th>
                      <th className="py-3.5 px-6">Status</th>
                      <th className="py-3.5 px-6">Amount (USD)</th>
                      <th className="py-3.5 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {clientQuotes.map((q) => (
                      <tr key={q.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="py-4 px-6">
                          <div className="font-bold text-[#0B2545] text-sm flex items-center gap-2">
                            <Ship className="w-4 h-4 text-sky-700 shrink-0" />
                            <span>{q.vesselName}</span>
                          </div>
                          <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                            {q.id} • IMO {q.imoNumber}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="font-medium text-slate-800">{q.portOfCall}</div>
                          <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span>{q.etaDate} {q.etaTime}</span>
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {q.services.map((s, idx) => (
                              <span
                                key={idx}
                                className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              q.status === 'QUOTED'
                                ? 'bg-amber-100 text-amber-800'
                                : q.status === 'APPROVED'
                                ? 'bg-emerald-100 text-emerald-800'
                                : q.status === 'DELIVERED'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-slate-100 text-slate-800'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {q.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 font-mono font-bold text-slate-900 text-sm">
                          {q.quotedAmount ? `$${q.quotedAmount.toLocaleString()}` : <span className="text-slate-400 font-normal italic">Calculating...</span>}
                        </td>

                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedQuoteForModal(q)}
                            className="inline-flex items-center gap-1 bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs"
                          >
                            <span>View Details</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* AUTHENTICATION SCREEN: BLUEPRINT PANEL 7 EXACT MATCH */
          <div>
            {/* Page Heading & Blueprint Subtitle */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-[#0B2545]" />
                <span>Client & Fleet Superintendent Portal</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
                Welcome Back
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                Access your requests, quotations and vessel orders
              </p>
            </div>

            {/* 2-Column Blueprint Grid: Left Form, Right Feature Pillars */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* LEFT CARD: AUTH FORM (Sign In / Register / Google OAuth) */}
              <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8">
                {/* Tab Switcher: Sign In vs Register */}
                <div className="flex border-b border-slate-200 mb-6">
                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                      authMode === 'login'
                        ? 'text-[#0B2545]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Sign In to Portal
                    {authMode === 'login' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2545]"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('signup')}
                    className={`flex-1 pb-3 text-sm font-bold transition-all relative ${
                      authMode === 'signup'
                        ? 'text-[#0B2545]'
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    Register New Account
                    {authMode === 'signup' && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0B2545]"></span>
                    )}
                  </button>
                </div>

                {/* SIGN IN FORM */}
                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="e.g. superintendent@shipping.com"
                          className="w-full pl-10 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-900"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Remember me & Forgot Password */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-600 select-none">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="rounded text-[#0B2545] focus:ring-0"
                        />
                        <span>Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() =>
                          alert('Password reset link sent to registered vessel superintendent email address.')
                        }
                        className="text-sky-700 hover:text-sky-900 font-semibold"
                      >
                        Forgot password?
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>{isSubmitting ? 'Verifying Credentials...' : 'Login'}</span>
                    </button>

                    {/* Quick Demo Client Credentials */}
                    <div className="pt-4 border-t border-slate-100">
                      <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider mb-2 text-center">
                        Need quick preview access?
                      </p>
                      <button
                        type="button"
                        onClick={handleDemoClient}
                        className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold py-2 rounded-lg transition-colors text-center border border-sky-100"
                      >
                        Sample Client Account: Capt. Rossi (MSC Geneva)
                      </button>
                    </div>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder="e.g. Capt. Marco Rossi"
                            className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Company / Shipowner <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            required
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            placeholder="e.g. Mediterranean Shipping Co."
                            className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Corporate / Vessel Email <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="email"
                            required
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="superintendent@company.com"
                            className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Phone / WhatsApp
                        </label>
                        <div className="relative">
                          <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                          <input
                            type="text"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="+39 340 551 2894"
                            className="w-full pl-10 pr-3 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        Select Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          className="w-full pl-10 pr-10 py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Create Free Client Account</span>
                    </button>
                  </form>
                )}
              </div>

              {/* RIGHT CARD: EXACT BLUEPRINT PANEL 7 CHECKLIST */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-[#0B2545] font-cinzel">
                    Client Portal Advantages
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Integrated directly with the Suez Canal vessel supply network
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Track your quotations</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Real-time SLA clock tracking for your 60-minute itemized proforma quotes.
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">View order history</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Instant access to all historical invoices, customs receipts, and deck delivery notes.
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Reorder easily</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Clone previous provision lists for recurring Suez transit calls with 1-click.
                      </p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Manage your vessels</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Save fleet IMO numbers, crew complements, and dietary specs for rapid ordering.
                      </p>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Dedicated support</h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        Direct access to your designated Suez port superintendent on VHF Ch 16 and phone.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-sky-700 shrink-0" />
                  <span>
                    Enterprise maritime-grade data security with encrypted communications and verified delivery logs.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: VIEW QUOTE DETAIL */}
        {selectedQuoteForModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ship className="w-5 h-5 text-[#0B2545]" />
                  <h3 className="text-lg font-bold text-[#0B2545] font-cinzel">
                    {selectedQuoteForModal.vesselName} (IMO {selectedQuoteForModal.imoNumber})
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedQuoteForModal(null)}
                  className="text-slate-400 hover:text-slate-700 font-bold"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Reference Code</span>
                  <strong className="text-slate-800 font-mono">{selectedQuoteForModal.id}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Port of Delivery</span>
                  <strong className="text-slate-800">{selectedQuoteForModal.portOfCall}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Vessel ETA</span>
                  <strong className="text-slate-800">{selectedQuoteForModal.etaDate} {selectedQuoteForModal.etaTime}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">Official Quoted Value</span>
                  <strong className="text-emerald-700 font-bold font-mono">
                    {selectedQuoteForModal.quotedAmountUSD ? `$${selectedQuoteForModal.quotedAmountUSD.toLocaleString()} USD` : 'In Review'}
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">Requisition Scope</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuoteForModal.services.map((s, idx) => (
                    <span key={idx} className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {selectedQuoteForModal.selectedItems && selectedQuoteForModal.selectedItems.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">Requested Key Items</span>
                  <ul className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl list-disc list-inside space-y-1">
                    {selectedQuoteForModal.selectedItems.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedQuoteForModal(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
                >
                  Close
                </button>
                <Link
                  to={`/get-a-quote?vessel=${encodeURIComponent(selectedQuoteForModal.vesselName)}&imo=${selectedQuoteForModal.imoNumber}`}
                  className="px-4 py-2 bg-[#0B2545] text-white text-xs font-bold rounded-xl hover:bg-[#13315C] transition-colors"
                >
                  Reorder Requisition
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
