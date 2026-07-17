import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  Check, 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  User, 
  Briefcase, 
  Users, 
  ArrowLeft, 
  Loader2,
  AlertCircle,
  Database,
  Zap,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { supabase, getUseSandbox, setUseSandbox, isRealSupabase } from '../lib/supabase';
import { Language, t } from '../utils/translations';

interface AuthPageProps {
  onSuccess: (user: any) => void;
  onBackToLanding: () => void;
  language: Language;
}

type AuthMode = 'signin' | 'signup' | 'forgot';

export default function AuthPage({ onSuccess, onBackToLanding, language }: AuthPageProps) {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Feedback Messages
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign In / Forgot Password Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // Sign Up Fields
  const [fullName, setFullName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Handle Instant Demo/Guest Login
  const handleInstantDemoLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    // Switch to sandbox mode for guest access
    if (isRealSupabase && !getUseSandbox()) {
      localStorage.setItem('analytixai_use_sandbox', 'true');
    }

    try {
      const demoEmail = `demo.user.${Math.floor(1000 + Math.random() * 9000)}@analytixai.com`;
      const demoPass = "demo123456";
      
      const { data, error } = await supabase.auth.signUp({
        email: demoEmail,
        password: demoPass,
        options: {
          data: {
            full_name: "Demo Executive",
            business_name: "Acme Analytics Corp",
            business_type: "Technology",
            company_size: "11-50",
            is_onboarded: true, // Auto-onboard so they go straight to dashboard
          }
        }
      });

      if (error) {
        // Fallback directly to simulated login
        const fakeUser = {
          id: 'user_dev_demo_guest',
          email: demoEmail,
          user_metadata: {
            full_name: 'Demo Executive',
            business_name: 'Acme Analytics Corp',
            business_type: 'Technology',
            company_size: '11-50',
            is_onboarded: true,
          }
        };
        setSuccessMessage('Welcome! Logged in with dynamic Guest sandbox profile.');
        setTimeout(() => onSuccess(fakeUser), 1000);
      } else if (data?.user) {
        setSuccessMessage('Demo workspace provisioned successfully! Redirecting...');
        setTimeout(() => {
          onSuccess(data.user);
        }, 1000);
      }
    } catch (err: any) {
      const fakeUser = {
        id: 'user_dev_demo_guest',
        email: `demo.user@analytixai.com`,
        user_metadata: {
          full_name: 'Demo Executive',
          business_name: 'Acme Analytics Corp',
          business_type: 'Technology',
          company_size: '11-50',
          is_onboarded: true,
        }
      };
      setSuccessMessage('Welcome! Logged in with dynamic Guest sandbox profile.');
      setTimeout(() => onSuccess(fakeUser), 1000);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign In submission
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email || !password) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMessage(`${error.message}. Tip: Switch to "Local Sandbox" mode at the top or click "Instant Guest Access" to bypass authentication instantly.`);
      } else if (data?.user) {
        setSuccessMessage('Logged in successfully!');
        setTimeout(() => {
          onSuccess(data.user);
        }, 800);
      }
    } catch (err: any) {
      setErrorMessage(`${err.message || 'An unexpected error occurred.'} Tip: Try switching to "Local Sandbox" mode at the top.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Sign Up submission
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!fullName || !businessName || !email || !password || !confirmPassword) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('You must agree to the Terms & Privacy Policy.');
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            business_name: businessName,
            business_type: businessType,
            company_size: companySize,
            is_onboarded: false,
          }
        }
      });

      if (error) {
        setErrorMessage(`${error.message}. Tip: Switch to "Local Sandbox" mode at the top to bypass database signup limits.`);
      } else if (data?.user) {
        setSuccessMessage('Account created successfully! Welcome onboarding sequence initiated.');
        setTimeout(() => {
          onSuccess(data.user);
        }, 1200);
      }
    } catch (err: any) {
      setErrorMessage(`${err.message || 'An unexpected error occurred.'} Tip: Try switching to "Local Sandbox" mode at the top.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Password Reset submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        setErrorMessage(error.message);
      } else {
        setSuccessMessage('Password reset link has been dispatched to your business email!');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="flex-1 min-h-screen bg-[#050816] text-white flex flex-col md:flex-row relative overflow-y-auto">
      {/* Absolute Header Controls */}
      <div className="absolute top-6 left-6 z-30">
        <button 
          onClick={onBackToLanding}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-xs text-gray-400 hover:text-white transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* LEFT SECTION - BRAND SHOWCASE */}
      <div className="w-full md:w-1/2 p-8 md:p-16 flex flex-col justify-center bg-gradient-to-br from-[#060a23] via-[#050816] to-[#040612] relative overflow-hidden border-b md:border-b-0 md:border-r border-white/5 min-h-[350px] md:min-h-screen">
        {/* Background ambient radial circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-600/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-md mx-auto space-y-8 relative z-10">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.3)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-xl font-extrabold font-display tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                AnalytixAI
              </span>
              <span className="text-[10px] font-mono block text-cyan-400 font-bold uppercase tracking-widest mt-0.5">
                Enterprise Suite
              </span>
            </div>
          </div>

          {/* Titles */}
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white leading-tight">
              Welcome to AnalytixAI
            </h1>
            <p className="text-sm md:text-base text-gray-400 leading-relaxed font-sans">
              Sign in to securely analyze your business and unlock AI-powered insights.
            </p>
          </div>

          {/* Premium Feature Bullet List */}
          <div className="space-y-3.5 pt-4">
            {[
              { title: 'Secure Business Workspace', desc: 'Enterprise-grade end-to-end data encryption' },
              { title: 'AI Decision Intelligence', desc: 'Autonomous reasoning over balance & KPI indicators' },
              { title: 'Business Health Monitoring', desc: 'Real-time proactive anomaly checking & warnings' },
              { title: 'Real-Time Analytics', desc: 'Interactive area, bar, and line dynamic visualizations' }
            ].map((feat, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-200">{feat.title}</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5 font-sans leading-snug">{feat.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom attribution/standard note */}
          <p className="text-[10px] text-gray-600 font-mono pt-4">
            Secured by SSL. Connected securely to real-time micro-inference nodes.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION - AUTHENTICATION FORM */}
      <div className="w-full md:w-1/2 p-6 md:p-12 lg:p-16 flex items-center justify-center relative min-h-[550px] md:min-h-screen">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px] pointer-events-none" />
        
        <div className="w-full max-w-md relative z-10">
          <AnimatePresence mode="wait">
            {/* 1. SIGN IN SCREEN */}
            {mode === 'signin' && (
              <motion.div
                key="signin"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel-accent border border-white/5 bg-[#0B1220]/60 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl"
              >
                <div className="space-y-1.5 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">Sign In</h2>
                  <p className="text-xs text-gray-400">Unlock your AI-driven financial optimization models.</p>
                </div>

                {/* Toast alerts */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
                    <Check className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                      Business Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. CEO@acme.com"
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none transition duration-200 font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between pl-1">
                      <label className="text-[11px] font-mono tracking-wider uppercase text-gray-400 block">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setMode('forgot')}
                        className="text-[11px] font-semibold text-cyan-400 hover:text-cyan-300 transition"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-11 text-xs text-white focus:outline-none transition duration-200 font-sans"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember me row */}
                  <div className="flex items-center justify-between pt-1">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-white/10 bg-[#030611] text-cyan-500 focus:ring-0 w-3.5 h-3.5 cursor-pointer accent-cyan-500"
                      />
                      <span className="text-[11px] text-gray-400">Remember Me</span>
                    </label>
                  </div>

                  {/* Submit / Create account side-by-side row */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/40 disabled:opacity-50 disabled:scale-100"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin text-white" />
                          <span>Wait...</span>
                        </>
                      ) : (
                        <span>Sign In</span>
                      )}
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => setMode('signup')}
                      className="py-3 bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl transition duration-200 cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <UserPlus className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Create User</span>
                    </button>
                  </div>

                  {/* Instant Guest Mode Bypass */}
                  <div className="pt-2 border-t border-white/5 space-y-1.5 text-center">
                    <button
                      type="button"
                      onClick={handleInstantDemoLogin}
                      disabled={isLoading}
                      className="w-full py-2.5 bg-gradient-to-r from-cyan-500/10 to-emerald-500/10 hover:from-cyan-500/20 hover:to-emerald-500/20 text-emerald-300 hover:text-emerald-200 border border-emerald-500/25 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition duration-200 cursor-pointer shadow-sm"
                    >
                      <Zap className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>🔑 Instant Guest Access (1-Click)</span>
                    </button>
                    <p className="text-[10px] text-gray-500 font-sans leading-tight">
                      Instantly provision an onboarded demo workspace to evaluate all AI models.
                    </p>
                  </div>
                </form>



                {/* Redirect to Sign Up */}
                <div className="text-center pt-2">
                  <p className="text-xs text-gray-500 font-sans">
                    Don't have an account?{' '}
                    <button
                      onClick={() => setMode('signup')}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Create Account
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* 2. SIGN UP SCREEN */}
            {mode === 'signup' && (
              <motion.div
                key="signup"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel-accent border border-white/5 bg-[#0B1220]/60 p-6 md:p-8 rounded-3xl space-y-5 shadow-2xl overflow-y-auto max-h-[85vh] scrollbar-none"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <h2 className="text-xl font-extrabold font-display tracking-tight text-white">Create Account</h2>
                  <p className="text-[11px] text-gray-400">Join AnalytixAI to begin processing large datasets with zero friction.</p>
                </div>

                {/* Toast alerts */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <form onSubmit={handleSignUp} className="space-y-3.5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Warren Buffett"
                          className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none transition duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Business Name *
                      </label>
                      <div className="relative">
                        <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type="text"
                          required
                          value={businessName}
                          onChange={(e) => setBusinessName(e.target.value)}
                          placeholder="Berkshire Hathaway"
                          className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none transition duration-200"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                      Business Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="invest@berkshire.com"
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 pl-9 pr-3 text-xs text-white focus:outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 pl-9 pr-9 text-xs text-white focus:outline-none transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Confirm Password *
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 pl-9 pr-9 text-xs text-white focus:outline-none transition duration-200"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition"
                        >
                          {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Optional Metadata Fields */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 border-t border-white/5 pt-3.5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Business Type (Optional)
                      </label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none transition duration-200 cursor-pointer"
                      >
                        <option value="">Select Sector</option>
                        <option value="Retail">Retail</option>
                        <option value="Manufacturing">Manufacturing</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Education">Education</option>
                        <option value="Technology">Technology</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                        Company Size (Optional)
                      </label>
                      <select
                        value={companySize}
                        onChange={(e) => setCompanySize(e.target.value)}
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-2.5 px-3 text-xs text-gray-300 focus:outline-none transition duration-200 cursor-pointer"
                      >
                        <option value="">Select Range</option>
                        <option value="1-10">1-10 employees</option>
                        <option value="11-50">11-50 employees</option>
                        <option value="51-200">51-200 employees</option>
                        <option value="200+">200+ employees</option>
                      </select>
                    </div>
                  </div>

                  {/* Agree checkbox */}
                  <label className="flex items-start gap-2.5 cursor-pointer select-none py-1.5">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      required
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="rounded border-white/10 bg-[#030611] text-cyan-500 focus:ring-0 w-4 h-4 cursor-pointer accent-cyan-500 mt-0.5 shrink-0"
                    />
                    <span className="text-[11px] text-gray-400 leading-normal">
                      I agree to the <span className="text-cyan-400 hover:underline">Terms of Service</span> & <span className="text-cyan-400 hover:underline">Privacy Policy</span>.
                    </span>
                  </label>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Provisioning Account...</span>
                      </>
                    ) : (
                      <span>Create Account</span>
                    )}
                  </button>
                </form>

                {/* Redirect back to Sign In */}
                <div className="text-center pt-1 border-t border-white/5">
                  <p className="text-xs text-gray-500 font-sans">
                    Already have an account?{' '}
                    <button
                      onClick={() => setMode('signin')}
                      className="text-cyan-400 font-bold hover:underline cursor-pointer"
                    >
                      Sign In
                    </button>
                  </p>
                </div>
              </motion.div>
            )}

            {/* 3. FORGOT PASSWORD SCREEN */}
            {mode === 'forgot' && (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="glass-panel-accent border border-white/5 bg-[#0B1220]/60 p-6 md:p-8 rounded-3xl space-y-6 shadow-2xl"
              >
                <div className="space-y-1.5 text-center sm:text-left">
                  <h2 className="text-2xl font-extrabold font-display tracking-tight text-white">Reset Password</h2>
                  <p className="text-xs text-gray-400">Request a magic security recovery token link.</p>
                </div>

                {/* Toast alerts */}
                {errorMessage && (
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {successMessage && (
                  <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-start gap-2.5">
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[11px] font-mono tracking-wider uppercase text-gray-400 block pl-1">
                      Business Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="CEO@acme.com"
                        className="w-full bg-[#030611] border border-white/5 focus:border-cyan-500/40 rounded-xl py-3 pl-11 pr-4 text-xs text-white focus:outline-none transition duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-500 text-white font-extrabold text-xs tracking-wider uppercase rounded-xl hover:opacity-95 transform hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50 disabled:scale-100"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Sending reset token...</span>
                      </>
                    ) : (
                      <span>Continue</span>
                    )}
                  </button>
                </form>

                {/* Redirect back to Sign In */}
                <div className="text-center pt-2 border-t border-white/5">
                  <button
                    onClick={() => setMode('signin')}
                    className="text-xs text-gray-400 hover:text-white font-semibold transition flex items-center justify-center gap-1.5 mx-auto"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Login</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
