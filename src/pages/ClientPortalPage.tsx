import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  Info,
  ArrowRight,
  Shield,
  Eye,
  EyeOff
} from 'lucide-react';

export const ClientPortalPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPilotToast, setShowPilotToast] = useState(false);
  const [showMockDashboard, setShowMockDashboard] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowPilotToast(true);
  };

  return (
    <div className="w-full bg-[#0B2545] min-h-screen py-16 flex items-center justify-center relative overflow-hidden">
      {/* Background ambient nautical graphics */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(14,165,233,0.12)_0%,transparent_60%)] pointer-events-none"></div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Toggle between Login Card and Preview Dashboard */}
        {!showMockDashboard ? (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 grid grid-cols-1 lg:grid-cols-12 max-w-4xl mx-auto">
            {/* LEFT COLUMN: Login Form (Blueprint Page 7) */}
            <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-sky-300 flex items-center justify-center">
                    <Lock className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Mentors Marine Client Access
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0B2545] font-cinzel">
                  Welcome Back
                </h1>
                <p className="text-slate-500 text-xs sm:text-sm mt-1.5 mb-8">
                  Access your requests, quotations, and vessel orders.
                </p>

                {/* Pilot notice toast */}
                {showPilotToast && (
                  <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs flex items-start gap-3 animate-in fade-in duration-200">
                    <Info className="w-5 h-5 text-sky-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-bold">Client Portal Launching Soon</strong>
                      <span>
                        The digital client portal is currently in private pilot for registered fleet managers. Contact{' '}
                        <a href="mailto:operations@mentors-marine.com" className="underline font-semibold">
                          operations@mentors-marine.com
                        </a>{' '}
                        to activate your account.
                      </span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        required
                        placeholder="superintendent@shipping.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowPilotToast(true)}
                        className="text-[11px] font-semibold text-sky-700 hover:underline"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        placeholder="••••••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-sm text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="flex items-center gap-2 text-xs text-slate-600 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-[#0B2545] focus:ring-0"
                      />
                      <span>Remember me on this browser</span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-[#0B2545] hover:bg-[#12345C] text-white font-bold text-sm tracking-wide shadow-lg transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2"
                  >
                    <span>Login</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>

              {/* Bottom Quick Switch to Preview */}
              <div className="pt-6 border-t border-slate-100 mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setShowMockDashboard(true)}
                  className="text-xs font-semibold text-sky-700 hover:text-[#0B2545] flex items-center justify-center gap-1.5 mx-auto"
                >
                  <span>Preview Client Portal Experience (Mock View) →</span>
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN: 4 Feature Bullets with Icons (Blueprint Page 7 right side) */}
            <div className="lg:col-span-5 bg-slate-900 text-white p-8 sm:p-12 flex flex-col justify-between border-t lg:border-t-0 lg:border-l border-white/10">
              <div className="space-y-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-sky-300 block mb-1">
                    Customer Experience
                  </span>
                  <h3 className="text-xl font-bold font-cinzel text-white">
                    Self-Service Fleet Portal
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Real-time oversight across every Egyptian port call.
                  </p>
                </div>

                {/* 4 Feature bullets with icons (Blueprint spec) */}
                <div className="space-y-5 pt-2">
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-sky-300 flex items-center justify-center shrink-0 border border-white/10">
                      <FileCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-white block">
                        Track Your Quotations
                      </strong>
                      <span className="text-xs text-slate-400">
                        View itemized pricing breakdowns and live quotation statuses.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-amber-300 flex items-center justify-center shrink-0 border border-white/10">
                      <History className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-white block">
                        View Order History
                      </strong>
                      <span className="text-xs text-slate-400">
                        Download stamped delivery receipts, receipts, and invoices.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-emerald-300 flex items-center justify-center shrink-0 border border-white/10">
                      <RotateCcw className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-white block">
                        Reorder Easily
                      </strong>
                      <span className="text-xs text-slate-400">
                        1-click reordering for recurring provisions and stores packages.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-red-300 flex items-center justify-center shrink-0 border border-white/10">
                      <Ship className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-white block">
                        Manage Your Vessels
                      </strong>
                      <span className="text-xs text-slate-400">
                        Sync your fleet ETA, IMO numbers, and preferred port delivery launches.
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-white/10 text-purple-300 flex items-center justify-center shrink-0 border border-white/10">
                      <Headphones className="w-5 h-5" />
                    </div>
                    <div>
                      <strong className="text-sm font-semibold text-white block">
                        Dedicated Support
                      </strong>
                      <span className="text-xs text-slate-400">
                        Direct communication line to your designated port chandler.
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 text-xs text-slate-400">
                <span>Need immediate quote without logging in? </span>
                <Link to="/get-a-quote" className="text-red-400 hover:text-red-300 font-bold ml-1">
                  Use Instant Quote Form →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* MOCK DASHBOARD VIEW */
          <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0B2545] text-white flex items-center justify-center">
                  <Ship className="w-6 h-6 text-sky-300" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#0B2545] font-cinzel">
                    Client Portal Demo Dashboard
                  </h3>
                  <span className="text-xs text-slate-500">Fleet Account: Apex Marine Services Ltd.</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowMockDashboard(false)}
                className="text-xs font-semibold px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                ← Back to Login
              </button>
            </div>

            {/* Active Requisitions */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Active Vessel Requisitions
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                <div className="p-4 bg-slate-50 flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-bold text-[#0B2545] block">
                      ANJI FORTUNE (IMO: 9281234)
                    </strong>
                    <span className="text-slate-500">RFQ: #MMP-89421 • Port of Suez Anchorage • ETA: 12 May 14:30</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Provisions Loaded & Confirmed
                  </span>
                </div>

                <div className="p-4 bg-white flex items-center justify-between">
                  <div>
                    <strong className="text-sm font-bold text-[#0B2545] block">
                      MSC ORION (IMO: 9857145)
                    </strong>
                    <span className="text-slate-500">RFQ: #MMP-89435 • Port Said Terminal • ETA: 12 May 18:00</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-800 font-bold">
                    60-Min Quotation Issued
                  </span>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Link
                to="/get-a-quote"
                className="bg-[#D0201E] hover:bg-[#b01716] text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow"
              >
                Create New Requisition
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
