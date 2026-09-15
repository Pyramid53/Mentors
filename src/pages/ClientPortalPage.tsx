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
  Check,
  RefreshCw,
  X,
  ShieldCheck,
  Send
} from 'lucide-react';
import { authStore } from '../services/authStore';
import { requestStore } from '../services/requestStore';
import { languageStore, Language } from '../services/languageStore';
import { AppUser, AdminQuoteRequest, UserRole } from '../types';

export const ClientPortalPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<AppUser | null>(authStore.getCurrentUser());
  const [currentLang, setCurrentLang] = useState<Language>(languageStore.getLanguage());

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

  // Email Confirmation & Resend state
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  // Forgot Password Modal state
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotFeedback, setForgotFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password Recovery Mode state (when arriving via reset link)
  const [isRecoveryMode, setIsRecoveryMode] = useState<boolean>(authStore.isPasswordRecoveryMode());
  const [newRecoveryPassword, setNewRecoveryPassword] = useState('');
  const [confirmRecoveryPassword, setConfirmRecoveryPassword] = useState('');
  const [showRecoveryPassword, setShowRecoveryPassword] = useState(false);
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryFeedback, setRecoveryFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Client requests
  const [clientQuotes, setClientQuotes] = useState<AdminQuoteRequest[]>([]);
  const [selectedQuoteForModal, setSelectedQuoteForModal] = useState<AdminQuoteRequest | null>(null);

  useEffect(() => {
    const unsubAuth = authStore.subscribe((user) => {
      setCurrentUser(user);
    });
    const unsubLang = languageStore.subscribe((lang) => {
      setCurrentLang(lang);
    });
    const unsubRecovery = authStore.subscribeRecovery((isRec) => {
      setIsRecoveryMode(isRec);
    });
    return () => {
      unsubAuth();
      unsubLang();
      unsubRecovery();
    };
  }, []);

  const isAr = currentLang === 'ar';

  const translateService = (s: string) => {
    if (!isAr) return s;
    const map: Record<string, string> = {
      'Fresh Provisions': 'مؤن طازجة',
      'Bonded Stores': 'بضائع معفاة جمركياً (بوندد)',
      'Deck & Engine Stores': 'مهمات السطح والمحرك',
      'Safety & Pyrotechnics': 'معدات السلامة والألعاب النارية',
      'Cabin & Cleaning Supplies': 'مستلزمات الإعاشة والنظافة',
      'Medical Supplies': 'أدوية ومستلزمات طبية',
      'Technical Logistics': 'لوجستيات فنية وملاحة',
      'Underwater Inspection': 'فحص تحت الماء'
    };
    return map[s] || s;
  };

  const translateStatus = (status: string) => {
    if (!isAr) return status;
    const map: Record<string, string> = {
      'QUOTED': 'تم التسعير',
      'APPROVED': 'معتمد',
      'DELIVERED': 'تم التسليم',
      'RECEIVED': 'مستلم',
      'IN_CLEARANCE': 'قيد التخليص',
      'New': 'جديد',
      'In Review': 'قيد المراجعة',
      'Quoted (60m)': 'تم التسعير (60 دقيقة)',
      'Order Confirmed': 'تم تأكيد الطلب',
      'Dispatched': 'تم الإرسال'
    };
    return map[status] || status;
  };

  useEffect(() => {
    const loadQuotes = () => {
      const all = requestStore.getQuoteRequests();
      if (currentUser) {
        const userEmail = (currentUser.email || '').trim().toLowerCase();
        const userCompany = (currentUser.company || '').trim().toLowerCase();
        const matched = all.filter((q) => {
          const qEmail = (q.contactEmail || '').trim().toLowerCase();
          const qCompany = (q.companyName || '').trim().toLowerCase();
          const emailMatch = qEmail.length > 0 && qEmail === userEmail;
          // Exact company match only if both have a specific company name and emails are not conflicting
          const companyMatch =
            userCompany.length >= 3 &&
            qCompany.length >= 3 &&
            qCompany === userCompany &&
            (qEmail === '' || qEmail === userEmail);
          return emailMatch || companyMatch;
        });
        setClientQuotes(matched);
      } else {
        setClientQuotes([]);
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
    setResendNotice(null);
    setIsSubmitting(true);

    const res = await authStore.login(loginEmail, loginPassword);
    setIsSubmitting(false);

    if (!res.success) {
      if (res.emailNotConfirmed) {
        setUnconfirmedEmail(res.email || loginEmail);
        setErrorMsg(
          isAr
            ? 'لم يتم تفعيل هذا الحساب عبر البريد الإلكتروني بعد. يرجى الضغط على رابط التفعيل المرسل إلى بريدك الإلكتروني لتأكيد الحساب.'
            : 'This account has not been activated via email yet. Please check your inbox or click below to resend the confirmation link.'
        );
      } else {
        setErrorMsg(
          isAr
            ? 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.'
            : (res.error || 'Login failed. Please verify credentials.')
        );
      }
    } else {
      setUnconfirmedEmail(null);
      setSuccessMsg(isAr ? `مرحباً بعودتك، ${res.user?.name}!` : `Welcome back, ${res.user?.name}!`);
      if (res.user?.role === 'admin') {
        setTimeout(() => navigate('/admin'), 600);
      }
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setResendNotice(null);
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
      setErrorMsg(
        isAr
          ? 'فشل التسجيل. يرجى مراجعة البيانات والمحاولة مجدداً.'
          : (res.error || 'Registration failed.')
      );
    } else if (res.needsEmailConfirmation) {
      setUnconfirmedEmail(res.email || signupEmail);
      setSuccessMsg(
        isAr
          ? `تم إرسال رابط تأكيد وتفعيل الحساب إلى: ${res.email || signupEmail}. يرجى مراجعة صندوق الوارد والضغط على الرابط لتفعيل حسابك.`
          : `Activation link sent to ${res.email || signupEmail}! Please check your email inbox and click the link to activate your vessel portal.`
      );
    } else {
      setUnconfirmedEmail(null);
      setSuccessMsg(
        isAr
          ? `تم إنشاء الحساب بنجاح للقبطان ${res.user?.name}!`
          : `Account created successfully for ${res.user?.name}!`
      );
    }
  };

  const handleResendConfirmation = async (targetEmail: string) => {
    if (!targetEmail) return;
    setResendLoading(true);
    setResendNotice(null);
    const res = await authStore.resendConfirmationEmail(targetEmail);
    setResendLoading(false);

    if (res.success) {
      setResendNotice(
        isAr
          ? 'تمت إعادة إرسال رابط تفعيل الحساب بنجاح! يرجى فحص صندوق الوارد ومجلد الرسائل غير المرغوب فيها (Spam).'
          : (res.message || 'Verification link resent successfully! Check your inbox and spam folder.')
      );
    } else {
      setErrorMsg(
        isAr
          ? 'فشل في إعادة إرسال الرابط. يرجى المحاولة لاحقاً.'
          : (res.error || 'Failed to resend confirmation email.')
      );
    }
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) return;
    setForgotLoading(true);
    setForgotFeedback(null);

    const res = await authStore.sendPasswordResetEmail(forgotEmail.trim());
    setForgotLoading(false);

    if (res.success) {
      setForgotFeedback({
        type: 'success',
        message: isAr
          ? `تم إرسال رابط إعادة تعيين كلمة المرور إلى ${forgotEmail}. يرجى مراجعة صندوق الوارد (Spam / Junk) لإتمام التعيين.`
          : (res.message || `Password reset link sent to ${forgotEmail}. Please check your inbox.`)
      });
    } else {
      setForgotFeedback({
        type: 'error',
        message: isAr
          ? 'تعذر إرسال رابط الاستعادة. يرجى التأكد من كتابة البريد الإلكتروني بشكل صحيح والمحاولة مجدداً.'
          : (res.error || 'Failed to dispatch reset email. Please verify address.')
      });
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryFeedback(null);

    if (newRecoveryPassword.length < 6) {
      setRecoveryFeedback({
        type: 'error',
        message: isAr
          ? 'يجب ألا تقل كلمة المرور عن 6 أحرف.'
          : 'Password must be at least 6 characters.'
      });
      return;
    }

    if (newRecoveryPassword !== confirmRecoveryPassword) {
      setRecoveryFeedback({
        type: 'error',
        message: isAr
          ? 'كلمتا المرور غير متطابقتين.'
          : 'Passwords do not match. Please verify and retype.'
      });
      return;
    }

    setRecoveryLoading(true);
    const res = await authStore.updatePassword(newRecoveryPassword);
    setRecoveryLoading(false);

    if (res.success) {
      setRecoveryFeedback({
        type: 'success',
        message: isAr
          ? 'تم تحديث كلمة المرور بنجاح! تم تسجيل دخولك بأمان.'
          : 'Password updated successfully! You are now logged in.'
      });
      setTimeout(() => {
        setIsRecoveryMode(false);
        authStore.setPasswordRecoveryMode(false);
      }, 2000);
    } else {
      setRecoveryFeedback({
        type: 'error',
        message: isAr
          ? 'فشل تحديث كلمة المرور. قد تكون صلاحية الرابط قد انتهت.'
          : (res.error || 'Failed to update password.')
      });
    }
  };

  const handleLogout = () => {
    authStore.logout();
    setSuccessMsg(isAr ? 'تم تسجيل الخروج بأمان.' : 'You have been logged out securely.');
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleDemoClient = () => {
    setErrorMsg(null);
    const user = authStore.loginAsDemoClient();
    setSuccessMsg(isAr ? `تم الدخول بحساب العميل: ${user.name} (${user.company})` : `Signed in as ${user.name} (${user.company})`);
  };

  return (
    <div className="w-full bg-[#F8FAFC] min-h-screen py-10 sm:py-16" id="client-portal-container" dir={isAr ? 'rtl' : 'ltr'}>
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
              className="text-emerald-700 hover:text-emerald-900 font-bold mx-2 text-xs"
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
              className="text-red-700 hover:text-red-900 font-bold mx-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Resend confirmation notification */}
        {resendNotice && (
          <div className="mb-6 p-4 rounded-xl bg-sky-50 border border-sky-300 text-sky-950 text-xs sm:text-sm flex items-center justify-between shadow-sm animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-sky-600 shrink-0" />
              <span className="font-medium">{resendNotice}</span>
            </div>
            <button
              onClick={() => setResendNotice(null)}
              className="text-sky-700 hover:text-sky-900 font-bold mx-2 text-xs"
            >
              ✕
            </button>
          </div>
        )}

        {/* Unconfirmed Email Activation Prompt & Resend Button */}
        {unconfirmedEmail && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-amber-50/90 border-2 border-amber-300 text-amber-950 shadow-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-[#0B2545]">
                    {isAr ? 'تأكيد الحساب عبر البريد الإلكتروني مطلوب' : 'Email Confirmation Required'}
                  </h4>
                  <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                    {isAr
                      ? `تم إرسال رابط التفعيل إلى: `
                      : `A verification link has been dispatched to: `}
                    <strong className="font-mono text-[#0B2545] underline">{unconfirmedEmail}</strong>.
                    {isAr
                      ? ' يرجى فتح صندوق الوارد (أو البريد المزعج Spam) والضغط على الرابط لتفعيل الحساب.'
                      : ' Please click the link to confirm and activate your vessel procurement account.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleResendConfirmation(unconfirmedEmail)}
                disabled={resendLoading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0B2545] hover:bg-[#13315C] text-amber-300 rounded-xl text-xs font-bold transition-all shadow-sm shrink-0 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resendLoading ? 'animate-spin text-amber-400' : ''}`} />
                <span>
                  {resendLoading
                    ? (isAr ? 'جارٍ إعادة الإرسال...' : 'Resending Link...')
                    : (isAr ? 'إعادة إرسال رابط التفعيل' : 'Resend Activation Link')}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* PASSWORD RECOVERY INLINE BOX (When returning via email link) */}
        {isRecoveryMode && (
          <div className="mb-8 p-6 sm:p-8 rounded-2xl bg-[#0B2545] text-white border-2 border-amber-400 shadow-xl animate-in zoom-in-95">
            <div className="max-w-md mx-auto text-center mb-5">
              <div className="w-12 h-12 rounded-full bg-amber-400/20 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-cinzel text-white">
                {isAr ? 'تعيين كلمة مرور جديدة' : 'Reset Your Password'}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {isAr
                  ? 'تم التحقق من رابط الاستعادة. يرجى إدخال كلمة مرور جديدة لحسابك.'
                  : 'Recovery link verified. Enter a new password for your vessel portal account.'}
              </p>
            </div>

            {recoveryFeedback && (
              <div
                className={`max-w-md mx-auto mb-4 p-3 rounded-xl text-xs flex items-center gap-2 ${
                  recoveryFeedback.type === 'success'
                    ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-200'
                    : 'bg-red-500/20 border border-red-400 text-red-200'
                }`}
              >
                {recoveryFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 shrink-0" />
                )}
                <span>{recoveryFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleRecoverySubmit} className="max-w-md mx-auto space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <Lock className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3' : 'left-3'} top-3`} />
                  <input
                    type={showRecoveryPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={newRecoveryPassword}
                    onChange={(e) => setNewRecoveryPassword(e.target.value)}
                    placeholder={isAr ? '6 أحرف على الأقل' : 'At least 6 characters'}
                    className={`w-full ${isAr ? 'pr-9 pl-9 text-right' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRecoveryPassword(!showRecoveryPassword)}
                    className={`absolute ${isAr ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-200`}
                  >
                    {showRecoveryPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-200 mb-1">
                  {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
                </label>
                <div className="relative">
                  <ShieldCheck className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3' : 'left-3'} top-3`} />
                  <input
                    type={showRecoveryPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    value={confirmRecoveryPassword}
                    onChange={(e) => setConfirmRecoveryPassword(e.target.value)}
                    placeholder={isAr ? 'أعد إدخال كلمة المرور' : 'Confirm password'}
                    className={`w-full ${isAr ? 'pr-9 pl-9 text-right' : 'pl-9 pr-9'} py-2.5 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white`}
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="flex-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md disabled:opacity-50"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>
                    {recoveryLoading
                      ? (isAr ? 'جارٍ الحفظ...' : 'Saving...')
                      : (isAr ? 'حفظ كلمة المرور الجديدة' : 'Update Password')}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsRecoveryMode(false);
                    authStore.setPasswordRecoveryMode(false);
                  }}
                  className="px-3 py-2.5 text-xs text-slate-400 hover:text-white"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </form>
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
                      {currentUser.role === 'admin'
                        ? (isAr ? 'ضابط عمليات وإرسال' : 'Operations Dispatch Officer')
                        : (isAr ? 'عميل موثق' : 'Verified Client')}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mt-0.5 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-800">{currentUser.company}</span>
                    <span>•</span>
                    <span className="text-slate-500">{currentUser.title}</span>
                    <span>•</span>
                    <span className="text-slate-500" dir="ltr">{currentUser.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto">
                <Link
                  to="/get-a-quote"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 bg-[#C81D25] hover:bg-[#a8161d] text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <Plus className="w-4 h-4" />
                  <span>{isAr ? 'طلب تسعير جديد (60 دقيقة)' : 'New 60-Min Requisition'}</span>
                </Link>

                {currentUser.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all"
                  >
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>{isAr ? 'لوحة الإدارة' : 'Admin Desk'}</span>
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{isAr ? 'تسجيل الخروج' : 'Sign Out'}</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isAr ? 'الطلبات النشطة' : 'Active Requisitions'}</span>
                  <Clock className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-bold text-[#0B2545] mt-2 font-cinzel">
                  <span dir="ltr" className="unicode-isolate">
                    {clientQuotes.filter((q) => q.status === 'QUOTED' || q.status === 'RECEIVED').length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isAr ? 'اتفاقية خدمة مضمونة 60 دقيقة' : 'Guaranteed 60-min SLA'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isAr ? 'معتمدة وقيد التخليص' : 'Approved & In Clearance'}</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-bold text-emerald-600 mt-2 font-cinzel">
                  <span dir="ltr" className="unicode-isolate">
                    {clientQuotes.filter((q) => q.status === 'APPROVED' || q.status === 'IN_CLEARANCE' || q.status === 'Order Confirmed').length}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isAr ? 'تم التخليص الجمركي في بورتوفيق' : 'Customs cleared in Port Tawfik'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isAr ? 'قوارب الإمداد المعينة' : 'Assigned Launch Boats'}</span>
                  <Ship className="w-4 h-4 text-sky-500" />
                </div>
                <div className="text-2xl font-bold text-[#0B2545] mt-2 font-cinzel">
                  {isAr ? 'مينتورز ستار 1 و 2' : 'Mentors Star I & II'}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  {isAr ? 'تسليم بمنطقة انتظار السويس' : 'Suez Anchorage delivery'}
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
                  <span>{isAr ? 'مكتب العمليات 24/7' : '24/7 Operations Desk'}</span>
                  <Phone className="w-4 h-4 text-rose-500" />
                </div>
                <div className="text-base font-bold text-slate-900 mt-2 font-mono">
                  <span dir="ltr" className="unicode-isolate">+20 100 892 4477</span>
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold mt-1">
                  {isAr ? 'راديو بحري VHF قناة 16/73 مباشر' : 'VHF Marine Ch 16/73 Live'}
                </div>
              </div>
            </div>

            {/* Requisitions List Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0B2545] font-cinzel">
                    {isAr ? 'طلبات وعروض أسعار سفنكم' : 'Your Vessel Requisitions & Quotations'}
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {isAr
                      ? 'تحديثات حية ومباشرة من غرفة إرسال مينتورز مارين في السويس'
                      : 'Live updates direct from the Mentors Marine Suez Dispatch Room'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    to="/get-a-quote"
                    className="text-xs font-bold text-sky-700 hover:text-sky-900 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAr ? 'رفع قائمة مؤن' : 'Upload Provision List'}</span>
                  </Link>
                </div>
              </div>

              {clientQuotes.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
                    <Ship className="w-8 h-8 text-sky-700" />
                  </div>
                  <h3 className="text-base font-bold text-[#0B2545] font-cinzel">
                    {isAr ? 'لا توجد طلبات تسعير مسجلة بعد' : 'No Requisitions Submitted Yet'}
                  </h3>
                  <p className="text-slate-500 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
                    {isAr
                      ? 'لم تقم بتقديم طلبات تسعير تموين سفن بعد. عند إرسال طلب جديد لتموين سفينتكم في السويس أو بورسعيد أو السخنة، ستظهر تفاصيل العرض وحالة قارب الإمداد والتخليص الجمركي هنا.'
                      : 'You have not submitted any vessel procurement requests yet. When you request a quote for Suez transit provisions, technical stores, or bonded goods, your quotation breakdown and delivery timeline will appear here.'}
                  </p>
                  <div className="mt-6">
                    <Link
                      to="/get-a-quote"
                      className="inline-flex items-center gap-2 bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAr ? 'تقديم طلب تسعير لسفينتكم الآن' : 'Request Vessel Quotation Now'}</span>
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto scrollbar-none">
                  <table className="w-full text-left rtl:text-right text-sm min-w-[680px]">
                    <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider font-semibold border-b border-slate-200">
                      <tr>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6">{isAr ? 'مرجع الطلب / السفينة' : 'Quote Ref / Vessel'}</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6">{isAr ? 'الميناء وموعد الوصول' : 'Port & ETA'}</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6">{isAr ? 'نطاق التوريد' : 'Supply Scope'}</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6">{isAr ? 'الحالة' : 'Status'}</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6">{isAr ? 'المبلغ (دولار أمريكي)' : 'Amount (USD)'}</th>
                        <th className="py-3 sm:py-3.5 px-4 sm:px-6 text-right rtl:text-left">{isAr ? 'الإجراءات' : 'Actions'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {clientQuotes.map((q) => (
                        <tr key={q.id} className="hover:bg-slate-50/75 transition-colors">
                          <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                            <div className="font-bold text-[#0B2545] text-sm flex items-center gap-2">
                              <Ship className="w-4 h-4 text-sky-700 shrink-0" />
                              <span>{q.vesselName}</span>
                            </div>
                            <div className="text-slate-500 font-mono text-[11px] mt-0.5">
                              <span dir="ltr" className="unicode-isolate">{q.id} • IMO {q.imoNumber}</span>
                            </div>
                          </td>

                          <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                            <div className="font-medium text-slate-800">{q.portOfCall}</div>
                            <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span dir="ltr" className="unicode-isolate">{q.etaDate} {q.etaTime}</span>
                            </div>
                          </td>

                          <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {q.services.map((s, idx) => (
                                <span
                                  key={idx}
                                  className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[10px] font-medium"
                                >
                                  {translateService(s)}
                                </span>
                              ))}
                            </div>
                          </td>

                          <td className="py-3.5 sm:py-4 px-4 sm:px-6">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                                q.status === 'QUOTED' || q.status === 'Quoted (60m)'
                                  ? 'bg-amber-100 text-amber-800'
                                  : q.status === 'APPROVED' || q.status === 'Order Confirmed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : q.status === 'DELIVERED' || q.status === 'Delivered'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                              {translateStatus(q.status)}
                            </span>
                          </td>

                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                            {q.quotedAmount || q.quotedAmountUSD ? (
                              <span dir="ltr" className="unicode-isolate">
                                ${(q.quotedAmount || q.quotedAmountUSD || 0).toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-slate-400 font-normal italic">
                                {isAr ? 'جارٍ الاحتساب...' : 'Calculating...'}
                              </span>
                            )}
                          </td>

                          <td className="py-3.5 sm:py-4 px-4 sm:px-6 text-right rtl:text-left whitespace-nowrap">
                            <button
                              type="button"
                              onClick={() => setSelectedQuoteForModal(q)}
                              className="inline-flex items-center gap-1 bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-xs px-3 py-1.5 rounded-lg transition-colors shadow-xs cursor-pointer"
                            >
                              <span>{isAr ? 'عرض التفاصيل' : 'View Details'}</span>
                              <ChevronRight className={`w-3.5 h-3.5 ${isAr ? 'rotate-180' : ''}`} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* AUTHENTICATION SCREEN: BLUEPRINT PANEL 7 EXACT MATCH */
          <div>
            {/* Page Heading & Blueprint Subtitle */}
            <div className="text-center max-w-2xl mx-auto mb-10">
              <div className="inline-flex items-center gap-2 bg-sky-100 text-sky-900 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
                <Lock className="w-3.5 h-3.5 text-[#0B2545]" />
                <span>{isAr ? 'تسجيل الدخول' : 'Login'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0B2545] font-cinzel tracking-tight">
                {isAr ? 'مرحباً بعودتك' : 'Welcome Back'}
              </h1>
              <p className="text-slate-600 text-sm sm:text-base mt-2">
                {isAr
                  ? 'الوصول إلى طلباتك، عروض الأسعار، وأوامر تموين السفن'
                  : 'Access your requests, quotations and vessel orders'}
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
                    {isAr ? 'تسجيل الدخول' : 'Sign In'}
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
                    {isAr ? 'تسجيل حساب جديد' : 'Register New Account'}
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
                        {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                        <input
                          type="email"
                          required
                          dir="ltr"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="superintendent@shipping.com"
                          className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-900`}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1.5">
                        {isAr ? 'كلمة المرور' : 'Password'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          dir="ltr"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
                          className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-2.5 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-900`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute ${isAr ? 'left-3' : 'right-3'} top-3 text-slate-400 hover:text-slate-600`}
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
                        <span>{isAr ? 'تذكرني' : 'Remember me'}</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPasswordModal(true);
                          setForgotEmail(loginEmail || '');
                          setForgotFeedback(null);
                        }}
                        className="text-sky-700 hover:text-sky-900 font-semibold"
                      >
                        {isAr ? 'نسيت كلمة المرور؟' : 'Forgot password?'}
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0B2545] hover:bg-[#13315C] text-white font-bold text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 mt-2 disabled:opacity-60"
                    >
                      <KeyRound className="w-4 h-4" />
                      <span>
                        {isSubmitting
                          ? (isAr ? 'جارٍ التحقق من البيانات...' : 'Verifying Credentials...')
                          : (isAr ? 'تسجيل الدخول' : 'Login')}
                      </span>
                    </button>
                  </form>
                ) : (
                  /* REGISTER FORM */
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'الاسم بالكامل' : 'Full Name'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <User className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                          <input
                            type="text"
                            required
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            placeholder={isAr ? 'مثال: القبطان ماركو روسي' : 'e.g. Capt. Marco Rossi'}
                            className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'الشركة الملاحية' : 'Shipping Company'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Building2 className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                          <input
                            type="text"
                            required
                            value={signupCompany}
                            onChange={(e) => setSignupCompany(e.target.value)}
                            placeholder={isAr ? 'مثال: شركة البحر الأبيض المتوسط للملاحة (MSC)' : 'e.g. Mediterranean Shipping Co. (MSC)'}
                            className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'البريد الإلكتروني' : 'Email'} <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <Mail className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                          <input
                            type="email"
                            required
                            dir="ltr"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            placeholder="superintendent@company.com"
                            className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]`}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          {isAr ? 'رقم الهاتف' : 'Phone Number'}
                        </label>
                        <div className="relative">
                          <Phone className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                          <input
                            type="text"
                            dir="ltr"
                            value={signupPhone}
                            onChange={(e) => setSignupPhone(e.target.value)}
                            placeholder="+39 340 551 2894"
                            className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]`}
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">
                        {isAr ? 'كلمة المرور' : 'Password'} <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Lock className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          dir="ltr"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          placeholder={isAr ? 'أدخل كلمة المرور' : 'Enter your password'}
                          className={`w-full ${isAr ? 'pr-10 pl-10 text-right' : 'pl-10 pr-10'} py-2 text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545]`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className={`absolute ${isAr ? 'left-3' : 'right-3'} top-2.5 text-slate-400 hover:text-slate-600`}
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
                      <span>{isAr ? 'إنشاء حساب جديد' : 'Create Account'}</span>
                    </button>
                  </form>
                )}
              </div>

              {/* RIGHT CARD: EXACT BLUEPRINT PANEL 7 CHECKLIST */}
              <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-md p-6 sm:p-8 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <h3 className="text-xl font-bold text-[#0B2545] font-cinzel">
                    {isAr ? 'مزايا الحساب' : 'Account Advantages'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr
                      ? 'متصلة مباشرة بشبكة تزويد السفن في قناة السويس'
                      : 'Integrated directly with the Suez Canal vessel supply network'}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Item 1 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? 'متابعة عروض الأسعار' : 'Track your quotations'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'متابعة دقيقة لاتفاقية مستوى الخدمة لعروض الأسعار التفصيلية خلال 60 دقيقة.'
                          : 'Real-time SLA clock tracking for your 60-minute itemized proforma quotes.'}
                      </p>
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <History className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? 'عرض سجل الطلبات' : 'View order history'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'وصول فوري لجميع الفواتير السابقة وإيصالات الجمارك ومذكرات التسليم على ظهر السفينة.'
                          : 'Instant access to all historical invoices, customs receipts, and deck delivery notes.'}
                      </p>
                    </div>
                  </div>

                  {/* Item 3 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <RotateCcw className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? 'إعادة الطلب بسهولة' : 'Reorder easily'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'نسخ قوائم المؤن السابقة لرحلات عبور السويس المتكررة بنقرة واحدة.'
                          : 'Clone previous provision lists for recurring Suez transit calls with 1-click.'}
                      </p>
                    </div>
                  </div>

                  {/* Item 4 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Ship className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? 'إدارة أسطول سفنك' : 'Manage your vessels'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'حفظ أرقام IMO للأسطول وبيانات الطاقم والمواصفات الغذائية للطلب السريع.'
                          : 'Save fleet IMO numbers, crew complements, and dietary specs for rapid ordering.'}
                      </p>
                    </div>
                  </div>

                  {/* Item 5 */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 shadow-2xs">
                      <Headphones className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        {isAr ? 'دعم بحري مخصص' : 'Dedicated support'}
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                        {isAr
                          ? 'تواصل مباشر مع مشرف ميناء السويس المخصص عبر لاسلكي القناة 16 والهاتف.'
                          : 'Direct access to your designated Suez port superintendent on VHF Ch 16 and phone.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 flex items-center gap-3">
                  <Shield className="w-5 h-5 text-sky-700 shrink-0" />
                  <span>
                    {isAr
                      ? 'أمان بيانات بحري بمستوى المؤسسات مع اتصالات مشفرة وسجلات تسليم موثقة.'
                      : 'Enterprise maritime-grade data security with encrypted communications and verified delivery logs.'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODAL: VIEW QUOTE DETAIL */}
        {selectedQuoteForModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4" dir={isAr ? 'rtl' : 'ltr'}>
            <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 animate-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Ship className="w-5 h-5 text-[#0B2545]" />
                  <h3 className="text-lg font-bold text-[#0B2545] font-cinzel">
                    {selectedQuoteForModal.vesselName} (IMO <span dir="ltr" className="font-mono unicode-isolate">{selectedQuoteForModal.imoNumber}</span>)
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
                  <span className="text-slate-400 block font-medium">{isAr ? 'كود المرجع' : 'Reference Code'}</span>
                  <strong className="text-slate-800 font-mono" dir="ltr">{selectedQuoteForModal.id}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">{isAr ? 'ميناء التسليم' : 'Port of Delivery'}</span>
                  <strong className="text-slate-800">{selectedQuoteForModal.portOfCall}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">{isAr ? 'موعد وصول السفينة' : 'Vessel ETA'}</span>
                  <strong className="text-slate-800" dir="ltr">{selectedQuoteForModal.etaDate} {selectedQuoteForModal.etaTime}</strong>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block font-medium">{isAr ? 'قيمة العرض الرسمية' : 'Official Quoted Value'}</span>
                  <strong className="text-emerald-700 font-bold font-mono">
                    {selectedQuoteForModal.quotedAmountUSD ? (
                      <span dir="ltr" className="unicode-isolate">${selectedQuoteForModal.quotedAmountUSD.toLocaleString()} USD</span>
                    ) : (
                      isAr ? 'قيد المراجعة' : 'In Review'
                    )}
                  </strong>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">{isAr ? 'نطاق الطلب' : 'Requisition Scope'}</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedQuoteForModal.services.map((s, idx) => (
                    <span key={idx} className="bg-sky-50 text-sky-800 px-2.5 py-1 rounded-md text-xs font-semibold">
                      {translateService(s)}
                    </span>
                  ))}
                </div>
              </div>

              {selectedQuoteForModal.selectedItems && selectedQuoteForModal.selectedItems.length > 0 && (
                <div>
                  <span className="text-xs font-bold text-slate-700 block mb-1">{isAr ? 'البنود الرئيسية المطلوبة' : 'Requested Key Items'}</span>
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
                  {isAr ? 'إغلاق' : 'Close'}
                </button>
                <Link
                  to={`/get-a-quote?vessel=${encodeURIComponent(selectedQuoteForModal.vesselName)}&imo=${selectedQuoteForModal.imoNumber}`}
                  className="px-4 py-2 bg-[#0B2545] text-white text-xs font-bold rounded-xl hover:bg-[#13315C] transition-colors"
                >
                  {isAr ? 'إعادة تكرار الطلب' : 'Reorder Requisition'}
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* FORGOT PASSWORD MODAL */}
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in zoom-in-95">
              <button
                type="button"
                onClick={() => {
                  setShowForgotPasswordModal(false);
                  setForgotFeedback(null);
                }}
                className={`absolute ${isAr ? 'left-5' : 'right-5'} top-5 text-slate-400 hover:text-slate-600 p-1`}
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 text-[#0B2545] flex items-center justify-center mx-auto mb-3 border border-sky-100 shadow-sm">
                  <KeyRound className="w-6 h-6 text-amber-500" />
                </div>
                <h3 className="text-xl font-bold font-cinzel text-[#0B2545]">
                  {isAr ? 'استعادة كلمة المرور' : 'Reset Vessel Portal Password'}
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  {isAr
                    ? 'أدخل بريدك الإلكتروني المسجل وسنرسل لك رابطاً مشفراً لإعادة تعيين كلمة المرور فوراً.'
                    : 'Enter your registered email address and we will dispatch an encrypted reset link immediately.'}
                </p>
              </div>

              {forgotFeedback && (
                <div
                  className={`mb-4 p-3.5 rounded-xl text-xs flex items-start gap-2 ${
                    forgotFeedback.type === 'success'
                      ? 'bg-emerald-50 border border-emerald-300 text-emerald-900'
                      : 'bg-red-50 border border-red-300 text-red-900'
                  }`}
                >
                  {forgotFeedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span className="leading-relaxed">{forgotFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleForgotPasswordSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    {isAr ? 'البريد الإلكتروني' : 'Registered Email'} <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className={`w-4 h-4 text-slate-400 absolute ${isAr ? 'right-3.5' : 'left-3.5'} top-3`} />
                    <input
                      type="email"
                      required
                      dir="ltr"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="superintendent@shipping.com"
                      className={`w-full ${isAr ? 'pr-10 pl-3 text-right' : 'pl-10 pr-3'} py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0B2545] text-slate-900`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={forgotLoading}
                  className="w-full bg-[#0B2545] hover:bg-[#13315C] text-amber-400 font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition-all active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  <Send className={`w-4 h-4 ${forgotLoading ? 'animate-pulse' : ''}`} />
                  <span>
                    {forgotLoading
                      ? (isAr ? 'جارٍ إرسال الرابط...' : 'Dispatching Link...')
                      : (isAr ? 'إرسال رابط استعادة كلمة المرور' : 'Send Recovery Link')}
                  </span>
                </button>
              </form>

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPasswordModal(false);
                    setForgotFeedback(null);
                  }}
                  className="text-xs text-slate-500 hover:text-slate-800 font-medium"
                >
                  {isAr ? 'العودة لتسجيل الدخول' : 'Back to Login'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

