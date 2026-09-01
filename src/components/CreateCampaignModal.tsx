import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Layers, 
  Globe, 
  SlidersHorizontal, 
  Loader2, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Database,
  ShieldCheck,
  Zap,
  Building2,
  FileText
} from 'lucide-react';
import { SupabaseCampaign } from '../types.js';
import { getSupabase, createSupabaseCampaignClient } from '../lib/supabase.js';

interface CreateCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCampaignCreated: (campaign: SupabaseCampaign) => void;
}

const PLATFORM_OPTIONS = [
  { id: 'LinkedIn', label: 'LinkedIn', icon: '💼', desc: 'Profiles & executive titles' },
  { id: 'Company Website', label: 'Company Domain', icon: '🌐', desc: 'Domain email search & DNS' },
  { id: 'Twitter / X', label: 'Twitter / X', icon: '🐦', desc: 'Social bios & handles' },
  { id: 'GitHub', label: 'GitHub', icon: '🐙', desc: 'Engineering & tech stacks' },
];

export const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({
  isOpen,
  onClose,
  onCampaignCreated,
}) => {
  const [name, setName] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn', 'Company Website']);
  const [profilesText, setProfilesText] = useState(
    'stripe.com\nhttps://linkedin.com/in/satyanadella\nopenai.com\nhttps://twitter.com/sama\nfigma.com'
  );
  
  // Scrape Config
  const [delayMs, setDelayMs] = useState<number>(1500);
  const [proxyRegion, setProxyRegion] = useState('US-East');
  const [depth, setDepth] = useState<'standard' | 'deep'>('deep');
  const [useHunter, setUseHunter] = useState(true);

  // State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const togglePlatform = (pId: string) => {
    if (selectedPlatforms.includes(pId)) {
      if (selectedPlatforms.length > 1) {
        setSelectedPlatforms(selectedPlatforms.filter(p => p !== pId));
      }
    } else {
      setSelectedPlatforms([...selectedPlatforms, pId]);
    }
  };

  const handleLoadSample = (type: 'tech' | 'executives') => {
    if (type === 'tech') {
      setProfilesText(
        'stripe.com\nopenai.com\nsnowflake.com\nlinear.app\nscale.com\ndatadoghq.com'
      );
      setName('Tech Infrastructure Leaders Q4');
    } else {
      setProfilesText(
        'https://linkedin.com/in/satyanadella\nhttps://linkedin.com/in/sundarpichai\nhttps://linkedin.com/in/tim-cook\nhttps://linkedin.com/in/brianchesky'
      );
      setName('Fortune 500 Executive Outreach');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const profiles = profilesText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && !line.startsWith('#'));

    if (profiles.length === 0) {
      setErrorMsg('Please enter at least one target profile, handle, or domain URL.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createSupabaseCampaignClient({
        name: name.trim() || `Campaign #${new Date().toLocaleDateString()}`,
        platforms: selectedPlatforms,
        profiles,
        scrapeConfig: {
          delayMs,
          proxyRegion,
          depth,
          useHunter,
        },
      });

      onCampaignCreated(result.campaign);
      onClose();
    } catch (err: any) {
      console.error('Error creating campaign:', err);
      setErrorMsg(err.message || 'Failed to create campaign in Supabase database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const profileCount = profilesText
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('#')).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Create Persistent Supabase Campaign</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 uppercase">
                  Postgres + RLS
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Multi-platform automated lead extraction and verified email enrichment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Creation Error</p>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Campaign Name */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Campaign Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Enterprise SaaS CTOs & AI Decision Makers"
              className="w-full px-3.5 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>

          {/* Platform Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              Target Platforms
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PLATFORM_OPTIONS.map((p) => {
                const isSelected = selectedPlatforms.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => togglePlatform(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-indigo-50/80 border-indigo-300 ring-1 ring-indigo-200 text-slate-900'
                        : 'bg-white border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg">{p.icon}</span>
                      <div
                        className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 border-indigo-600 text-white'
                            : 'border-slate-300'
                        }`}
                      >
                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                      </div>
                    </div>
                    <p className="text-xs font-bold">{p.label}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{p.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Profiles / Domain list */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-2">
                <span>Target Profiles / URLs List</span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono font-semibold">
                  {profileCount} {profileCount === 1 ? 'target' : 'targets'}
                </span>
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="text-slate-400">Load presets:</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('tech')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
                >
                  Tech Domains
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => handleLoadSample('executives')}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold underline underline-offset-2"
                >
                  Executive Profiles
                </button>
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={5}
                required
                value={profilesText}
                onChange={(e) => setProfilesText(e.target.value)}
                placeholder="Enter domain URLs, company names, or LinkedIn/Twitter profile URLs (one per line)..."
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all leading-relaxed"
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Supports full URLs (<code className="text-indigo-600">https://linkedin.com/in/username</code>), company domains (<code className="text-indigo-600">stripe.com</code>), or social handles.
            </p>
          </div>

          {/* Scrape Config Drawer */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
              <span>Scrape & Enrichment Configuration (Saved to Supabase jsonb)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Request Delay (Throttle)
                </label>
                <select
                  value={delayMs}
                  onChange={(e) => setDelayMs(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value={1000}>1.0s (Fast)</option>
                  <option value={1500}>1.5s (Recommended)</option>
                  <option value={3000}>3.0s (Stealth)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Proxy Routing Region
                </label>
                <select
                  value={proxyRegion}
                  onChange={(e) => setProxyRegion(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="US-East">US-East (Virginia)</option>
                  <option value="US-West">US-West (California)</option>
                  <option value="EU-Central">EU-Central (Frankfurt)</option>
                  <option value="Global">Global High-Speed</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Extraction Depth
                </label>
                <select
                  value={depth}
                  onChange={(e) => setDepth(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                >
                  <option value="deep">Deep + Hunter.io + AI</option>
                  <option value="standard">Standard Pattern Match</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
              <input
                type="checkbox"
                id="hunterCheck"
                checked={useHunter}
                onChange={(e) => setUseHunter(e.target.checked)}
                className="w-3.5 h-3.5 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="hunterCheck" className="text-xs text-slate-700 cursor-pointer">
                Query <strong>Hunter.io live domain API</strong> for verified corporate email delivery
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Privileged service role write with RLS protection</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating in Supabase...</span>
                </>
              ) : (
                <>
                  <span>Launch Campaign</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
