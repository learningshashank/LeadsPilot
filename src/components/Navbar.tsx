import React from 'react';
import { 
  Search, 
  Sparkles, 
  Download, 
  Plus, 
  Database, 
  Globe, 
  Zap, 
  Filter,
  CheckCircle2
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
}) => {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 text-slate-800 shadow-sm">
      {/* Left: Brand & Search */}
      <div className="flex items-center gap-6 flex-1 max-w-2xl">
        <div 
          onClick={onGoToLanding}
          title="Return to LeadsPilot Landing Page"
          className="flex items-center gap-2.5 min-w-max cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-lg bg-slate-950 flex items-center justify-center shadow-sm text-amber-400 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base tracking-tight text-slate-900 flex items-center">
                Leads<span className="text-amber-500 font-black">Pilot</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-amber-50 text-amber-800 border border-amber-200">
                PRO
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
            className="w-full pl-9 pr-14 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
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
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Credits: <strong className="font-semibold text-slate-900">{creditsRemaining}</strong></span>
          </div>
        </div>

        {/* Filter Toggle (for Leads / Search Views) */}
        {(activeTab === 'prospects' || activeTab === 'leads') && (
          <button
            onClick={onToggleFilter}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              isFilterOpen
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-xs'
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
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all shadow-xs active:scale-95"
        >
          <Download className="w-3.5 h-3.5 text-slate-500" />
          <span className="hidden sm:inline">Export CSV</span>
        </button>

        {/* Add Lead Manually */}
        <button
          onClick={onOpenNewLead}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-lg transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden sm:inline">Add Lead</span>
        </button>

        {/* Return to Landing Page Button */}
        {onGoToLanding && (
          <button
            onClick={onGoToLanding}
            title="Return to Landing Page"
            className="hidden md:flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300/80 rounded-lg transition-all active:scale-95 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Landing Page</span>
          </button>
        )}

        {/* Primary Action: Run Live AI Scraper */}
        <button
          onClick={onOpenScraper}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-500/20 transition-all active:scale-95"
        >
          <Globe className="w-3.5 h-3.5 text-white" />
          <span>Launch AI Scraper</span>
        </button>
      </div>
    </header>
  );
};
