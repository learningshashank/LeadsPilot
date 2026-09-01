import React, { useState } from 'react';
import { 
  Zap, 
  ArrowLeft, 
  Lock, 
  Mail, 
  Check, 
  ShieldCheck, 
  Sparkles, 
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface AuthLoginPageProps {
  onLoginSuccess: (user?: any) => void;
  onBackToLanding: () => void;
  defaultEmail?: string;
}

export const AuthLoginPage: React.FC<AuthLoginPageProps> = ({
  onLoginSuccess,
  onBackToLanding,
  defaultEmail = 'learnings.shashank@gmail.com',
}) => {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('••••••••••••');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }
    if (!email) {
      setErrorMessage('Please enter your email address.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: 'usr_leadspilot_shashank',
        email: email.trim(),
        user_metadata: {
          full_name: email.split('@')[0] || 'Shashank',
          avatar_initials: 'LS',
          provider: 'email',
        },
      });
    }, 400);
  };

  const handleOAuthLogin = (provider: 'Google' | 'Apple') => {
    if (!agreeTerms) {
      setErrorMessage('Please accept the Terms of Service and Privacy Policy to continue.');
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);

    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        id: `usr_${provider.toLowerCase()}_shashank`,
        email: defaultEmail,
        user_metadata: {
          full_name: 'Shashank',
          avatar_initials: 'LS',
          provider: provider.toLowerCase(),
        },
      });
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#080b11] text-white flex flex-col justify-between selection:bg-amber-400 selection:text-slate-950 font-sans">
      {/* Top Bar with Back link */}
      <div className="w-full px-6 py-5 flex items-center justify-between z-10">
        <button
          onClick={onBackToLanding}
          className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to LeadsPilot Home</span>
        </button>
      </div>

      {/* Main Split Content Container */}
      <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center my-auto py-8">
        
        {/* Left Column: Branding & Value Proposition */}
        <div className="lg:col-span-7 flex flex-col justify-center space-y-8">
          {/* Logo matching Screenshot 2 */}
          <div 
            onClick={onBackToLanding}
            className="flex items-center gap-3 cursor-pointer group w-fit"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#0e131f] border border-slate-800/80 flex items-center justify-center text-amber-400 shadow-lg group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <div className="flex items-baseline">
              <span className="font-extrabold text-2xl tracking-tight text-white flex items-center">
                Leads<span className="text-amber-500 font-black">Pilot</span>
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 ml-0.5 mb-1" />
            </div>
          </div>

          {/* Hero Heading matching Screenshot 1 */}
          <div className="space-y-4 pt-4 max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              One brand profile in. <br />
              <span className="text-amber-400">A month of content out.</span>
            </h1>
            <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg font-normal">
              Blogs, infographics and video packages generated daily and scheduled across every channel you run.
            </p>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>275M+ Verified B2B Records</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Scraping & Hunter.io Engine</span>
            </div>
          </div>
        </div>

        {/* Right Column: Sign In Form Box matching Screenshot 1 */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto bg-[#0d121d]/80 lg:bg-transparent backdrop-blur-xs lg:backdrop-blur-none p-6 sm:p-8 lg:p-0 rounded-2xl border border-slate-800/60 lg:border-none">
            
            {/* Header */}
            <div className="space-y-1.5 mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                Sign in
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Continue with Google, Apple, or your email.
              </p>
            </div>

            {/* Error Message if any */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Terms of Service Checkbox */}
            <div className="mb-6 flex items-start gap-2.5">
              <input
                id="terms-checkbox"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-slate-700 bg-[#121826] text-amber-500 focus:ring-amber-500/30 cursor-pointer accent-amber-500"
              />
              <label htmlFor="terms-checkbox" className="text-xs text-slate-400 leading-snug cursor-pointer select-none">
                I have read and agree to the{' '}
                <span className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Terms of Service</span>
                {' '}and{' '}
                <span className="text-amber-400 hover:text-amber-300 transition-colors font-medium">Privacy Policy</span>.
              </label>
            </div>

            {/* Social Logins (Google & Apple) */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                type="button"
                onClick={() => handleOAuthLogin('Google')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111726] hover:bg-[#161f33] border border-slate-800 text-xs font-semibold text-white transition-all active:scale-98 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Google</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthLogin('Apple')}
                className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#111726] hover:bg-[#161f33] border border-slate-800 text-xs font-semibold text-white transition-all active:scale-98 cursor-pointer shadow-xs"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
                  <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.74 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.81-11.96-14.34-6.42-9.78-11.53-20.98-15.34-33.61-3.81-12.63-5.72-24.69-5.72-36.19 0-14.35 3.69-26.09 11.07-35.22 7.39-9.13 16.53-13.81 27.42-14.04 4.89 0 10.11 1.25 15.66 3.75 5.54 2.5 9.24 3.81 11.1 3.93 1.42 0 5.43-1.42 12.04-4.25 6.61-2.83 12.28-4.02 17.02-3.57 12.61.98 22.84 5.99 30.68 15.04-11.09 6.74-16.53 16.09-16.31 28.05.22 9.35 3.81 17.18 10.77 23.49 6.96 6.31 15.11 9.89 24.46 10.76-2.28 6.96-5.01 14.13-8.18 21.52zM119.22 31.02c0-7.39 2.61-14.35 7.83-20.87 5.22-6.52 11.74-10.15 19.57-10.89.22 1.09.33 2.18.33 3.26 0 7.39-2.72 14.46-8.15 21.2-5.44 6.74-12.07 10.43-19.9 11.09-.22-1.3-.33-2.6-.33-3.79z" />
                </svg>
                <span>Apple</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center mb-6">
              <div className="w-full border-t border-slate-800" />
              <span className="absolute px-3 bg-[#080b11] text-[11px] text-slate-500 uppercase tracking-wider font-medium">
                or continue with email
              </span>
            </div>

            {/* Email / Password Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 bg-[#101624] border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/60 transition-all font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => alert('Password reset link has been dispatched to ' + email)}
                    className="text-xs text-amber-500 hover:text-amber-400 transition-colors font-medium cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-3.5 py-2.5 bg-[#101624] border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-400/20 focus:border-amber-400/60 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Sign In Button matching the amber/yellow color in Screenshot 1 */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3 px-4 bg-[#b45309] hover:bg-[#d97706] active:bg-[#92400e] text-amber-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-amber-950/40 transition-all duration-150 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-amber-200 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Sign in</span>
                )}
              </button>
            </form>

            {/* Quick Demo Access Note */}
            <div className="mt-6 pt-4 border-t border-slate-800/60 text-center">
              <p className="text-[11px] text-slate-500">
                Authorized Lead Intelligence Workspace • Instant B2B prospecting
              </p>
            </div>

          </div>
        </div>

      </div>

      {/* Subtle Footer */}
      <div className="w-full px-6 py-4 border-t border-slate-900/80 text-center text-[11px] text-slate-600">
        © {new Date().getFullYear()} LeadsPilot Inc. All rights reserved.
      </div>
    </div>
  );
};
