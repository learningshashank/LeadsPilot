import React from 'react';
import { 
  Users, 
  Building2, 
  Trello, 
  MailCheck, 
  Send, 
  Terminal, 
  BarChart3, 
  ListFilter, 
  FolderPlus,
  ShieldCheck,
  Search,
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';
import { LeadList } from '../types.js';

export type NavTab = 
  | 'prospects' 
  | 'leads' 
  | 'companies' 
  | 'pipeline' 
  | 'campaigns' 
  | 'verifier' 
  | 'jobs' 
  | 'analytics';

interface SidebarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  totalLeads: number;
  totalCompanies: number;
  inPipelineCount: number;
  lists: LeadList[];
  selectedListId?: string;
  onSelectList: (listId?: string) => void;
  onOpenCreateList: () => void;
  scrapingActive: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  totalLeads,
  totalCompanies,
  inPipelineCount,
  lists,
  selectedListId,
  onSelectList,
  onOpenCreateList,
  scrapingActive,
}) => {
  const mainNavItems = [
    {
      id: 'prospects' as NavTab,
      label: 'Prospect Search & Scraper',
      icon: Search,
      badge: 'Live',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
      description: 'LeadsPilot lead discovery',
    },
    {
      id: 'leads' as NavTab,
      label: 'All Leads Database',
      icon: Users,
      count: totalLeads,
      description: 'Master contact table & enrichment',
    },
    {
      id: 'companies' as NavTab,
      label: 'Account Directory',
      icon: Building2,
      count: totalCompanies,
      description: 'Company intelligence & tech stacks',
    },
    {
      id: 'pipeline' as NavTab,
      label: 'LeadsPilot CRM Pipeline',
      icon: Trello,
      count: inPipelineCount,
      description: 'Deal stages & qualification board',
    },
    {
      id: 'campaigns' as NavTab,
      label: 'AI Outreach Sequences',
      icon: Send,
      badge: 'AI Gen',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      description: 'Cold email generator & cadences',
    },
    {
      id: 'verifier' as NavTab,
      label: 'Email Verifier (DNS/MX)',
      icon: ShieldCheck,
      description: '99% deliverability & catch-all tests',
    },
    {
      id: 'jobs' as NavTab,
      label: 'Scraper Tasks & Logs',
      icon: Terminal,
      activePulse: scrapingActive,
      description: 'Live crawler terminal output',
    },
    {
      id: 'analytics' as NavTab,
      label: 'Pipeline Analytics',
      icon: BarChart3,
      description: 'Lead generation ROI & conversion',
    },
  ];

  return (
    <aside className="w-72 bg-[#0f172a] border-r border-slate-800 flex flex-col justify-between shrink-0 select-none overflow-y-auto">
      {/* Navigation Section */}
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500">
            Core Modules
          </p>
          <nav className="space-y-1 pt-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !selectedListId;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectList(undefined);
                    onSelectTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-left transition-all ${
                    isActive
                      ? 'bg-slate-800 text-white font-semibold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`p-1.5 rounded-md ${
                        isActive
                          ? 'bg-indigo-500/20 text-indigo-400'
                          : 'bg-slate-800/80 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-medium block truncate">
                        {item.label}
                      </span>
                    </div>
                  </div>

                  {/* Badges / Counts */}
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold border uppercase tracking-wider ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
                      {item.count}
                    </span>
                  )}
                  {item.activePulse && (
                    <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Prospect Lists & Segments */}
        <div className="space-y-2 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between px-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Saved Lists & Segments
            </p>
            <button
              onClick={onOpenCreateList}
              title="Create new list"
              className="text-slate-400 hover:text-indigo-400 p-1 rounded hover:bg-slate-800/60 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-1">
            {lists.map((list) => {
              const isSelected = selectedListId === list.id;

              return (
                <button
                  key={list.id}
                  onClick={() => {
                    onSelectList(list.id);
                    onSelectTab('leads');
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-all ${
                    isSelected
                      ? 'bg-slate-800 text-white font-medium'
                      : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: list.color }}
                    />
                    <span className="truncate">{list.name}</span>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-400 font-mono">
                    {list.leadIds.length}
                  </span>
                </button>
              );
            })}

            {lists.length === 0 && (
              <p className="px-3 py-2 text-xs text-slate-500 italic">
                No lists created yet.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="p-4 border-t border-slate-800 bg-[#0b1120]">
        <div className="p-3.5 rounded-xl bg-[#1e293b] border border-slate-700/60 space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 text-indigo-400 font-bold">
              <Sparkles className="w-3.5 h-3.5" /> Live Scraper Engine
            </span>
            <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> ONLINE
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Crawling 12M+ company domains with real-time email deliverability validation.
          </p>
        </div>
      </div>
    </aside>
  );
};
