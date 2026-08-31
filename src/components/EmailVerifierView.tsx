import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Search, 
  Server, 
  Mail, 
  Globe, 
  RefreshCw, 
  Loader2,
  Sparkles,
  Zap,
  HelpCircle
} from 'lucide-react';
import { VerificationResult } from '../types.js';

export const EmailVerifierView: React.FC = () => {
  const [emailInput, setEmailInput] = useState('satya.nadella@microsoft.com');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<VerificationResult | null>({
    email: 'satya.nadella@microsoft.com',
    status: 'valid',
    deliverabilityScore: 98,
    formatValid: true,
    mxRecordFound: true,
    smtpCheckPassed: true,
    isDisposable: false,
    isFreeEmail: false,
    isRoleAccount: false,
    suggestedPattern: '{first}.{last}@microsoft.com',
    confidence: '98% Deliverable',
    details: 'Valid corporate mailbox with active Microsoft Exchange MX records and verified SMTP handshake.',
  });

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) return;

    setIsLoading(true);
    try {
      const res = await fetch('/api/verify/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      }
    } catch (err) {
      console.error('Verification error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleEmails = [
    'marc.benioff@salesforce.com',
    'brian.chesky@airbnb.com',
    'support@temp-mail.org',
    'jensen.huang@nvidia.com',
  ];

  const isDeliverable = result ? result.status === 'valid' || result.deliverabilityScore >= 75 : false;

  return (
    <div className="flex flex-col h-full space-y-6 max-w-4xl mx-auto w-full">
      {/* Header */}
      <div className="text-center space-y-2 pt-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-indigo-600" /> 99.4% Deliverability Engine
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Real-Time B2B Email Deliverability & MX Verifier
        </h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          Prevent spam traps, verify DNS MX routing, detect disposable inboxes, and validate catch-all mail servers before launching campaigns.
        </p>
      </div>

      {/* Interactive Input Form */}
      <form onSubmit={handleVerify} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter corporate email to verify (e.g. alex@company.com)"
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !emailInput}
            className="px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2 shadow-xs active:scale-95 transition-all"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : <ShieldCheck className="w-4 h-4 text-white" />}
            <span>Validate Email</span>
          </button>
        </div>

        {/* Quick Sample Chips */}
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1 flex-wrap">
          <span>Quick test:</span>
          {sampleEmails.map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setEmailInput(sample);
              }}
              className="text-indigo-600 hover:text-indigo-800 hover:underline font-mono text-[11px]"
            >
              {sample}
            </button>
          ))}
        </div>
      </form>

      {/* Verification Result Dossier */}
      {result && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6 animate-in fade-in">
          {/* Top Score Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-xl shadow-xs font-mono ${
                  result.deliverabilityScore >= 90
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : result.deliverabilityScore >= 60
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-rose-50 text-rose-700 border border-rose-200'
                }`}
              >
                {result.deliverabilityScore}%
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm font-mono">{result.email}</h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      result.status === 'valid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : result.status === 'invalid' || result.status === 'risky'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {result.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">{result.details}</p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <span className="text-[11px] text-slate-400 block font-medium">Deliverability Recommendation</span>
              <span
                className={`text-xs font-bold ${
                  isDeliverable ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isDeliverable ? '✓ Safe for Cold Sequences' : '⚠️ Do Not Send (High Bounce Risk)'}
              </span>
            </div>
          </div>

          {/* Diagnostic Checks Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* MX Records */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">DNS MX Record</span>
                {result.mxRecordFound ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-600" />
                )}
              </div>
              <span className="font-semibold text-slate-800 text-xs">
                {result.mxRecordFound ? 'Active & Healthy' : 'No MX Found'}
              </span>
            </div>

            {/* SMTP Handshake */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">SMTP Handshake</span>
                {result.smtpCheckPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <span className="font-semibold text-slate-800 text-xs">
                {result.smtpCheckPassed ? 'Mailbox Responds' : 'Unreachable'}
              </span>
            </div>

            {/* Disposable */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Disposable Box</span>
                <span className={`text-[10px] font-bold ${result.isDisposable ? 'text-rose-700' : 'text-emerald-700'}`}>
                  {result.isDisposable ? 'YES (Fake)' : 'NO (Legit)'}
                </span>
              </div>
              <span className="font-semibold text-slate-800 text-xs">
                {result.isDisposable ? 'Temp Mail Domain' : 'Persistent Domain'}
              </span>
            </div>

            {/* Corporate vs Free */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Corporate Domain</span>
                {!result.isFreeEmail ? (
                  <CheckCircle2 className="w-4 h-4 text-indigo-600" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <span className="font-semibold text-slate-800 text-xs">
                {!result.isFreeEmail ? 'B2B Corporate' : 'Free Webmail'}
              </span>
            </div>
          </div>

          {/* Domain Naming Pattern Suggestion */}
          {result.suggestedPattern && (
            <div className="p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-indigo-900 font-medium">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>Predicted Corporate Email Pattern for this Domain:</span>
              </div>
              <code className="px-2 py-0.5 rounded bg-white border border-indigo-200 text-indigo-700 font-mono font-bold">
                {result.suggestedPattern}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
