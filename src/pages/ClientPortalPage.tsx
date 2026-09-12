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
  ChevronRight
} from 'lucide-react';
import { authStore } from '../services/authStore';
import { requestStore } from '../services/requestStore';
import { AppUser, AdminQuoteRequest } from '../types';

export const ClientPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());

  // Form states
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Sign up inputs
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupCompany, setSignupCompany] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

  // Client requests
  const [clientQuotes, setClientQuotes] = useState<AdminQuoteRequest[]>([]);

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
        // If client, match by company or contact email, or show all if match is empty
        const userCompany = currentUser.company.toLowerCase();
        const matched = all.filter(
          (q) =>
            q.companyName.toLowerCase().includes(userCompany) ||
            q.contactEmail.toLowerCase() === currentUser.email.toLowerCase()
        );
        setClientQuotes(matched.length > 0 ? matched : all.slice(0, 3));
      } else {
        setClientQuotes(all.slice(0, 3));
      }
    };

    loadQuotes();
    const unsubReq = requestStore.subscribe(loadQuotes);
    return () => unsubReq();
  }, [currentUser]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = authStore.login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.error || 'Login failed');
    } else {
      setSuccessMsg(`Welcome back, ${res.user?.name}!`);
      if (res.user?.role === 'admin') {
        setTimeout(() => navigate('/admin'), 600);
      }
    }
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = authStore.signup({
      name: signupName,
      email: signupEmail,
      company: signupCompany,
      phone: signupPhone,
      password: signupPassword,
      role: 'client'
    });

    if (!res.success) {
      setErrorMsg(res.error || 'Registration failed');
    } else {
      setSuccessMsg(`Account created successfully for ${res.user?.name}!`);
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setSuccessMsg('You have been logged out securely.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDemoClientLogin = () => {
    setErrorMsg(null);
    const user = authStore.loginAsDemoClient();
    setSuccessMsg(`Signed in as ${user.name} (${user.company})`);
  };

  return (
    <div className="w-full bg-slate-900 text-slate-100 min-h-screen py-10 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* SUCCESS / ERROR TOASTS */}
        {successMsg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-semibold">{successMsg}</span>
            </div>
            <button onClick={() => setSuccessMsg(null)} className="text-emerald-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-6 p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs sm:text-sm flex items-center justify-between shadow-lg animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
            <button onClick={() => setErrorMsg(null)} className="text-red-400 hover:text-white text-xs">
              Dismiss
            </button>
          </div>
        )}

        {/* LOGGED IN VIEW */}
        {currentUser ? (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top User Welcome Banner */}
            <div className="bg-[#0B2545] border border-sky-500/20 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
              <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-sky-500/5 rounded-full pointer-events-none"></div>

              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-sky-600/80 text-white font-black text-xl flex items-center justify-center shadow-lg shrink-0 border border-white/20 font-cinzel">
                    {currentUser.avatarInitials || 'MM'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                        {currentUser.company}
                      </span>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          currentUser.role === 'admin'
                            ? 'bg-amber-400 text-slate-950'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-400/40'
                        }`}
                      >
                        {currentUser.role === 'admin' ? 'Operations Staff' : 'Registered Client'}
                      </span>
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-cinzel mt-1">
                      Welcome, {currentUser.name}
                    </h1>

                    <p className="text-xs sm:text-sm text-slate-300 mt-1 flex items-center gap-4 flex-wrap">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span>{currentUser.email}</span>
                      </span>
                      {currentUser.phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          <span>{currentUser.phone}</span>
                        </span>
                      )}
                      <span className="flex items-center gap-1.5 text-slate-400">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Suez 24/7 Operations Desk</span>
                      </span>
                    </p>
                  </div>
                </div>

                {/* Quick actions for logged-in user */}
                <div className="flex items-center gap-2.5 flex-wrap">
                  {currentUser.role === 'admin' && (
                    <Link
                      to="/admin"
                      className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Open Staff Admin Desk →</span>
                    </Link>
                  )}

                  <Link
                    to="/get-a-quote"
                    className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all active:scale-95"
                  >
                    <Plus className="w-4 h-4" />
                    <span>New Vessel Requisition</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold px-3.5 py-2.5 rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-red-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                  Active Fleet Requisitions
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-white font-mono">{clientQuotes.length}</span>
                  <span className="text-xs text-sky-400">Suez & Port Said</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Live tracking alongside launches</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                  Quotation Response Guarantee
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-amber-300 font-mono">60 Min</span>
                  <span className="text-xs text-emerald-400">Guaranteed</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">Direct itemized IMPA/ISSA pricing</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/60 rounded-2xl p-5 shadow-sm">
                <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider block">
                  Designated Duty Officer
                </span>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-white">Capt. Tarek Mansour</span>
                </div>
                <a
                  href="https://wa.me/201004892210?text=Hello%20Capt.%20Tarek,%20following%20up%20from%20Mentors%20Marine%20client%20portal"
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-emerald-400 hover:underline mt-1 flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Direct: +20 100 489 2210</span>
                </a>
              </div>
            </div>

            {/* Requisitions List */}
            <div className="bg-slate-800/90 border border-slate-700/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-700/80 pb-4">
                <div>
                  <h2 className="text-lg font-bold font-cinzel text-white">
                    Your Vessel Orders & Quotations
                  </h2>
                  <p className="text-xs text-slate-400">
                    Live status of requisitions submitted for your vessels calling at Egyptian ports.
                  </p>
                </div>

                <Link
                  to="/track-vessel"
                  className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1"
                >
                  <span>Live AIS Tracker</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>

              {clientQuotes.length === 0 ? (
                <div className="py-12 text-center text-slate-400 space-y-3">
                  <Ship className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-slate-300">No Requisitions Submitted Yet</h4>
                  <p className="text-xs max-w-md mx-auto">
                    Ready to requisition fresh provisions, technical stores, or deck spares for your next Suez transit?
                  </p>
                  <Link
                    to="/get-a-quote"
                    className="inline-flex items-center gap-2 bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Submit Your First Request</span>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {clientQuotes.map((req) => (
                    <div
                      key={req.id}
                      className="bg-slate-900/80 border border-slate-700/70 hover:border-sky-500/40 rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800/40">
                            {req.id}
                          </span>
                          <span
                            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              req.status === 'New'
                                ? 'bg-amber-500 text-slate-950'
                                : req.status === 'Quoted (60m)'
                                ? 'bg-sky-500 text-white'
                                : req.status === 'Dispatched'
                                ? 'bg-emerald-500 text-slate-950 font-extrabold'
                                : 'bg-slate-700 text-slate-200'
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">{req.portOfCall}</span>
                          <span className="text-slate-500 text-xs">•</span>
                          <span className="text-xs text-slate-400">ETA: {req.etaDate} @ {req.etaTime}</span>
                        </div>

                        <div className="flex items-baseline gap-2">
                          <h3 className="text-base sm:text-lg font-bold text-white font-cinzel">
                            {req.vesselName}
                          </h3>
                          <span className="text-xs text-slate-400 font-mono">IMO: {req.imoNumber}</span>
                        </div>

                        <div className="text-xs text-slate-300 flex items-center gap-3 flex-wrap">
                          <span>Services: {req.services?.join(', ') || 'Provisions'}</span>
                          {req.fileName && (
                            <span className="text-sky-300 font-medium">📎 {req.fileName}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:justify-end gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-800">
                        {req.quotedAmountUSD && (
                          <div className="text-left md:text-right">
                            <span className="text-[10px] text-slate-400 uppercase font-bold block">Quotation</span>
                            <span className="text-base font-mono font-bold text-emerald-400">
                              ${req.quotedAmountUSD.toLocaleString()} USD
                            </span>
                          </div>
                        )}

                        <a
                          href={`https://wa.me/201004892210?text=Hello%20Mentors%20Marine,%20inquiring%20about%20my%20RFQ%20${req.id}%20for%20${encodeURIComponent(req.vesselName)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat with Dispatch</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* AUTHENTICATION FORM: SIGN IN & SIGN UP (Eye-friendly, soothing slate/navy) */
          <div className="bg-slate-800/90 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 max-w-5xl mx-auto">
            {/* LEFT COLUMN: Clean Form */}
            <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between">
              <div>
                {/* Mode Selector Tabs */}
                <div className="flex items-center justify-between mb-6 pb-2 border-b border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-sky-400 flex items-center justify-center border border-white/10 shadow-sm">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white font-cinzel">
                        {authMode === 'login' ? 'Fleet Portal Sign In' : 'Create Customer Account'}
                      </h2>
                      <span className="text-xs text-slate-400">
                        {authMode === 'login'
                          ? 'Access your vessel quotations and Suez deliveries'
                          : 'Register your shipping line or management fleet'}
                      </span>
                    </div>
                  </div>

                  <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-700">
                    <button
                      type="button"
                      onClick={() => setAuthMode('login')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        authMode === 'login' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        authMode === 'signup' ? 'bg-sky-600 text-white shadow' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Sign Up
                    </button>
                  </div>
                </div>

                {/* SIGN IN FORM */}
                {authMode === 'login' ? (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                        Email Address
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="superintendent@msc-operations.com"
                          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                          Password
                        </label>
                        <span className="text-[11px] text-slate-400">
                          Demo client pass: <strong className="text-sky-300">client123</strong>
                        </span>
                      </div>
                      <div className="relative">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-3 text-slate-400 hover:text-white"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-sm tracking-wide shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Sign In to Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  /* SIGN UP FORM */
                  <form onSubmit={handleSignup} className="space-y-3.5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          required
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          placeholder="Capt. Ahmed Soliman"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Shipping Company / Fleet
                        </label>
                        <input
                          type="text"
                          required
                          value={signupCompany}
                          onChange={(e) => setSignupCompany(e.target.value)}
                          placeholder="Mediterranean Shipping Co."
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Business Email
                        </label>
                        <input
                          type="email"
                          required
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          placeholder="a.soliman@shipping.com"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                          Phone / WhatsApp
                        </label>
                        <input
                          type="tel"
                          value={signupPhone}
                          onChange={(e) => setSignupPhone(e.target.value)}
                          placeholder="+20 100 123 4567"
                          className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                        />
                      </div>
                    </div>

                    {/* Client account notification */}
                    <div className="bg-sky-950/40 border border-sky-800/40 p-3 rounded-xl text-xs text-sky-200">
                      <span>Registration creates an authorized <strong>Shipping Client Account</strong> for vessel superintendents, ship masters, and fleet logistics managers.</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold uppercase text-slate-300 mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        required
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-400"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs tracking-wide shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                    >
                      <span>Complete Registration</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </form>
                )}
              </div>

              {/* 1-Click Fast Testing Logins */}
              <div className="pt-6 border-t border-slate-700/60 mt-6 space-y-2.5">
                <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400 block text-center">
                  Quick 1-Click Demo Account (Client Testing)
                </span>

                <div>
                  <button
                    type="button"
                    onClick={handleDemoClientLogin}
                    className="w-full py-2.5 px-3 rounded-xl bg-sky-950 hover:bg-sky-900 text-sky-200 border border-sky-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-sky-400" />
                    <span>Quick Client Sign In (Capt. Marco Rossi - Blue Sea Bulk Lines)</span>
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Feature Highlights */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-10 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-slate-700/60">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sky-400 block mb-1">
                    Customer Experience
                  </span>
                  <h3 className="text-xl font-bold font-cinzel text-white">
                    Self-Service Fleet Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time oversight across every Egyptian port call.
                  </p>
                </div>

                <div className="space-y-4 pt-1">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-sky-950 text-sky-400 flex items-center justify-center shrink-0 border border-sky-800/60">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Track Quotations & SLAs</strong>
                      <span className="text-[11px] text-slate-400">
                        Itemized IMPA pricing dispatched within 60 minutes.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 flex items-center justify-center shrink-0 border border-amber-800/60">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Digital Delivery Receipts</strong>
                      <span className="text-[11px] text-slate-400">
                        Stamped master receipts, weight certificates, and invoices.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-800/60">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <strong className="text-xs font-bold text-white block">Alongside Launch Coordination</strong>
                      <span className="text-[11px] text-slate-400">
                        Direct connection to harbor supply launches in Suez & Port Said.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 text-xs text-slate-400">
                <span>Need an immediate quote without creating an account?</span>
                <Link to="/get-a-quote" className="text-red-400 hover:text-red-300 font-bold block mt-1">
                  Open 60-Minute Rapid Quote Form →
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
