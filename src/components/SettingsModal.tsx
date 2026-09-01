import React, { useState } from 'react';
import { 
  X, 
  Settings as SettingsIcon, 
  User, 
  Key, 
  Bell, 
  Shield, 
  Globe, 
  Check, 
  Database,
  Save,
  CheckCircle2
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onUpdateUser?: (updated: any) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'api_keys' | 'notifications' | 'workspace'>('profile');
  const [fullName, setFullName] = useState(currentUser?.user_metadata?.full_name || 'Shashank');
  const [email, setEmail] = useState(currentUser?.email || 'learnings.shashank@gmail.com');
  const [workspaceName, setWorkspaceName] = useState('Growth Ops & Lead Engine');
  const [hunterApiKey, setHunterApiKey] = useState('ht_live_94827103891820491823');
  const [geminiApiKey, setGeminiApiKey] = useState('gm_live_83910481029481920491');
  const [proxyRegion, setProxyRegion] = useState('us-east');
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [webhookUrl, setWebhookUrl] = useState('https://api.leadspilot.ai/webhooks/v1/enrich');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    if (onUpdateUser) {
      onUpdateUser({
        ...currentUser,
        email,
        user_metadata: {
          ...currentUser?.user_metadata,
          full_name: fullName,
        },
      });
    }
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f1422] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131a2c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <SettingsIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Account & Workspace Settings</h3>
              <p className="text-[11px] text-slate-400">Configure profile, Hunter.io integrations, and outbound preferences</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-slate-800 bg-[#0d121e] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'profile'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Profile & Account</span>
          </button>

          <button
            onClick={() => setActiveTab('api_keys')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'api_keys'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>API Keys & Engines</span>
          </button>

          <button
            onClick={() => setActiveTab('workspace')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'workspace'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Proxy & Webhooks</span>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-3.5 py-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeTab === 'notifications'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Alerts</span>
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#141b2e] border border-slate-800">
                <div className="w-12 h-12 rounded-full bg-amber-500 text-slate-950 font-black text-sm flex items-center justify-center shrink-0">
                  LS
                </div>
                <div>
                  <h4 className="font-bold text-white text-sm">{fullName}</h4>
                  <p className="text-slate-400 text-[11px] font-mono">{email}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold">
                    Pro Verified Member
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-300 mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Workspace Organization</label>
                <input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          )}

          {activeTab === 'api_keys' && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Hunter.io Live API Key</label>
                <input
                  type="password"
                  value={hunterApiKey}
                  onChange={(e) => setHunterApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Used for B2B domain email pattern detection & deliverability score checking.</p>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">Gemini AI Engine Key</label>
                <input
                  type="password"
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Powers unstructured social biography parsing & outreach email drafting.</p>
              </div>
            </div>
          )}

          {activeTab === 'workspace' && (
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-slate-300 mb-1">Scraper Proxy Network Region</label>
                <select
                  value={proxyRegion}
                  onChange={(e) => setProxyRegion(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="us-east">US East (Virginia - High Residential Concurrency)</option>
                  <option value="us-west">US West (Oregon)</option>
                  <option value="eu-central">EU Central (Frankfurt - GDPR Compliant)</option>
                  <option value="ap-southeast">Asia Pacific (Singapore)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-300 mb-1">CRM Webhook Endpoint</label>
                <input
                  type="url"
                  value={webhookUrl}
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-[#121827] border border-slate-700 rounded-lg text-white focus:outline-none focus:border-amber-400 font-mono"
                />
                <p className="text-[10px] text-slate-400 mt-1">Newly verified leads automatically dispatch to this webhook.</p>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 rounded-xl bg-[#141b2e] border border-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500"
                />
                <div>
                  <p className="font-semibold text-white">Campaign Batch Completion Emails</p>
                  <p className="text-[11px] text-slate-400">Receive a summary CSV export when a scraping batch completes.</p>
                </div>
              </label>
            </div>
          )}

          {/* Footer Save */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            {savedSuccess ? (
              <span className="text-emerald-400 flex items-center gap-1.5 font-bold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Settings saved successfully!</span>
              </span>
            ) : <span />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold flex items-center gap-1.5 shadow-md cursor-pointer transition-all active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
