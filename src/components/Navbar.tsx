import React, { useState } from 'react';
import { 
  Search, 
  Sparkles, 
  Download, 
  Plus, 
  Database, 
  Globe, 
  Zap, 
  Filter,
  CheckCircle2,
  LogOut,
  User,
  Settings,
  CreditCard,
  HelpCircle,
  LifeBuoy
} from 'lucide-react';

interface NavbarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenScraper: () => void;
  onOpenNewLead: () => void;
  onExportCsv: () => void;
  totalLeadsCount: number;
  verifiedCount: number;
  creditsRemaining: number;
  activeTab: string;
  isFilterOpen: boolean;
  onToggleFilter: () => void;
  onGoToLanding?: () => void;
  currentUser?: any;
  onOpenAuth?: () => void;
  onSignOut?: () => void;
  onOpenCreateCampaign?: () => void;
  onOpenSettings?: () => void;
  onOpenPlan?: () => void;
  onOpenFaq?: () => void;
  onOpenHelp?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  searchQuery,
  onSearchChange,
  onOpenScraper,
  onOpenNewLead,
  onExportCsv,
  totalLeadsCount,
  verifiedCount,
  creditsRemaining,
  activeTab,
  isFilterOpen,
  onToggleFilter,
  onGoToLanding,
  currentUser,
  onOpenAuth,
  onSignOut,
  onOpenCreateCampaign,
  onOpenSettings,
  onOpenPlan,
  onOpenFaq,
  onOpenHelp,
}) => {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const displayEmail = currentUser?.email || 'learnings.shashank@gmail.com';
  const truncatedEmail = displayEmail.length > 18 ? displayEmail.substring(0, 18) + '...' : displayEmail;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 text-slate-800 shadow-xs">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div 
          onClick={onGoToLanding}
          title="Return to LeadsPilot Landing Page"
          className="flex items-center gap-2.5 min-w-max cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shadow-xs text-amber-400 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center">
                Leads<span className="text-amber-500 font-black">Pilot</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500">Sales Intelligence & CRM</p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prospects by name, company, title, industry..."
            className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 hover:text-slate-800 bg-slate-200/80 px-1.5 py-0.5 rounded font-medium"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Center/Right Status & Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Credits / Health Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-600 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>{verifiedCount} Verified</span>
          </div>
          <div className="w-px h-3 bg-slate-200" />
          <div className="flex items-center gap-1.5 text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>{creditsRemaining} Credits</span>
          </div>
        </div>

        {/* Filter Toggle (for Leads / Search Views) */}
        {(activeTab === 'prospects' || activeTab === 'leads') && (
          <button
            onClick={onToggleFilter}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isFilterOpen
                ? 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Filters</span>
          </button>
        )}

        {/* Export Button */}
        <button
          onClick={onExportCsv}
          title="Export Filtered Leads to CSV"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all shadow-2xs active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Add Lead Manually */}
        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all active:scale-95 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-slate-700" />
          <span className="hidden sm:inline">Add Lead</span>
        </button>

        {/* Supabase New Campaign Button */}
        {onOpenCreateCampaign && (
          <button
            onClick={onOpenCreateCampaign}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">New Campaign</span>
          </button>
        )}

        {/* UserProfile Pill and Dropdown matching Screenshot 3 */}
        {currentUser ? (
          <div className="relative">
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 pl-1 pr-3 py-1 bg-[#0b0e14] hover:bg-[#131924] border border-slate-800 rounded-full text-xs text-slate-200 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              <div className="w-7 h-7 rounded-full bg-[#eab308] text-slate-950 font-bold text-xs flex items-center justify-center shrink-0 shadow-xs">
                LS
              </div>
              <span className="max-w-[140px] truncate font-medium text-slate-200 text-xs font-mono">
                {truncatedEmail}
              </span>
            </button>

            {/* Dark Dropdown Menu matching Screenshot 3 */}
            {isProfileDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setIsProfileDropdownOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#0b0e14] border border-slate-800/90 rounded-2xl shadow-2xl z-50 py-2 text-xs text-slate-300 animate-in fade-in slide-in-from-top-2">
                  {/* Email Header */}
                  <div className="px-4 py-2.5 text-slate-100 font-bold text-xs truncate border-b border-slate-800/80 mb-1 font-mono">
                    {displayEmail}
                  </div>

                  {/* Settings */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenSettings?.();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">Settings</span>
                  </button>

                  {/* Plan */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenPlan?.();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">Plan</span>
                  </button>

                  {/* FAQ */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenFaq?.();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">FAQ</span>
                  </button>

                  {/* Help */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onOpenHelp?.();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-white hover:bg-slate-800/70 transition-colors text-left cursor-pointer"
                  >
                    <LifeBuoy className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">Help</span>
                  </button>

                  <div className="border-t border-slate-800/80 my-1" />

                  {/* Logout (Routes to Landing Page!) */}
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      onSignOut?.();
                    }}
                    className="w-full px-4 py-2.5 flex items-center gap-3 text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
                  >
                    <LogOut className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-medium">Logout</span>
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-amber-400" />
            <span>Sign In</span>
          </button>
        )}

        {/* Primary Action: Run Live AI Scraper */}
        <button
          onClick={onOpenScraper}
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          <Globe className="w-3.5 h-3.5 text-slate-950" />
          <span className="hidden sm:inline">Launch AI Scraper</span>
        </button>
      </div>
    </header>
  );
};
