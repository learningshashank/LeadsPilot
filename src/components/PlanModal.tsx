import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Check, 
  Zap, 
  Sparkles, 
  ShieldCheck, 
  ArrowRight,
  TrendingUp,
  Download
} from 'lucide-react';

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  creditsRemaining: number;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  isOpen,
  onClose,
  creditsRemaining,
}) => {
  const [selectedBilling, setSelectedBilling] = useState<'monthly' | 'annual'>('annual');
  const [upgradedPlan, setUpgradedPlan] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgrade = (tier: string) => {
    setUpgradedPlan(tier);
    setTimeout(() => {
      alert(`Upgraded to ${tier} Plan! 10,000 additional Hunter.io & AI scraping credits added.`);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-3xl bg-[#0f1422] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131a2c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Subscription & Scraping Credits</h3>
              <p className="text-[11px] text-slate-400">Manage plan limits, Hunter.io enrichment quota, and billing</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Current Quota Status Box */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#141d33] to-[#1c1830] border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold uppercase tracking-wider text-[10px]">
                  Current: Growth Pro Tier
                </span>
                <span className="text-slate-400 text-xs">• Renews Oct 1, 2026</span>
              </div>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-black text-white font-mono">{creditsRemaining.toLocaleString()}</span>
                <span className="text-slate-400">/ 5,000 Verified Credits remaining this cycle</span>
              </div>
            </div>

            <div className="w-full sm:w-48 bg-slate-800/80 rounded-full h-2.5 overflow-hidden">
              <div 
                className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(100, (creditsRemaining / 5000) * 100)}%` }}
              />
            </div>
          </div>

          {/* Billing Switcher */}
          <div className="flex justify-center">
            <div className="inline-flex p-1 bg-[#121827] rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                onClick={() => setSelectedBilling('monthly')}
                className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                  selectedBilling === 'monthly' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setSelectedBilling('annual')}
                className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                  selectedBilling === 'annual' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-white'
                }`}
              >
                <span>Annual Billing</span>
                <span className="px-1.5 py-0.2 rounded bg-amber-200 text-slate-900 text-[9px] font-black uppercase">
                  20% OFF
                </span>
              </button>
            </div>
          </div>

          {/* Tier Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Starter */}
            <div className="p-4 rounded-xl bg-[#121827] border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">Starter Pilot</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">For individual prospecting & SDRs</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">{selectedBilling === 'annual' ? '$39' : '$49'}</span>
                  <span className="text-slate-400 text-[10px]">/ month</span>
                </div>
                <ul className="mt-3 space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>1,500 Verified Credits / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Hunter.io Deliverability check</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Multi-Platform Scraper</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleUpgrade('Starter')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold transition-colors cursor-pointer"
              >
                Select Starter
              </button>
            </div>

            {/* Growth (Active) */}
            <div className="p-4 rounded-xl bg-[#172036] border-2 border-amber-500 flex flex-col justify-between space-y-4 relative shadow-lg shadow-amber-950/20">
              <span className="absolute -top-2.5 right-4 px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                Current Plan
              </span>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                  <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>Growth Pro</span>
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">High velocity revenue & outbound teams</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">{selectedBilling === 'annual' ? '$99' : '$129'}</span>
                  <span className="text-slate-400 text-[10px]">/ month</span>
                </div>
                <ul className="mt-3 space-y-2 text-[11px] text-slate-200">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span><strong>5,000 Verified Credits</strong> / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Gemini AI Hyper-Personalized Emails</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Supabase Realtime Cloud Sync</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Unlimited CSV & CRM Exports</span>
                  </li>
                </ul>
              </div>
              <button
                disabled
                className="w-full py-2 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-lg font-bold cursor-default"
              >
                Active Subscription
              </button>
            </div>

            {/* Enterprise Scale */}
            <div className="p-4 rounded-xl bg-[#121827] border border-slate-800 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="font-bold text-white text-sm">Scale Enterprise</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">For agencies & high-volume outbound</p>
                <div className="mt-3 flex items-baseline gap-1">
                  <span className="text-xl font-black text-white font-mono">{selectedBilling === 'annual' ? '$249' : '$299'}</span>
                  <span className="text-slate-400 text-[10px]">/ month</span>
                </div>
                <ul className="mt-3 space-y-2 text-[11px] text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>25,000 Verified Credits / mo</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Dedicated Proxy Pool & SLAs</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-400" />
                    <span>Custom Webhooks & CRM Sync</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => handleUpgrade('Enterprise')}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg font-bold transition-all cursor-pointer"
              >
                Upgrade to Scale
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0c101c] flex items-center justify-between text-slate-400 text-[11px]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-bit Stripe Secure Invoicing • Cancel anytime</span>
          </div>
          <button onClick={onClose} className="hover:text-white font-semibold cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
