import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar.js';
import { Sidebar, NavTab } from './components/Sidebar.js';
import { FilterDrawer } from './components/FilterDrawer.js';
import { LeadTable } from './components/LeadTable.js';
import { ScraperConsoleModal } from './components/ScraperConsoleModal.js';
import { LeadDetailModal } from './components/LeadDetailModal.js';
import { CompanyDirectory } from './components/CompanyDirectory.js';
import { CrmPipelineView } from './components/CrmPipelineView.js';
import { EmailVerifierView } from './components/EmailVerifierView.js';
import { OutreachCampaignsView } from './components/OutreachCampaignsView.js';
import { ScraperJobsView } from './components/ScraperJobsView.js';
import { AnalyticsView } from './components/AnalyticsView.js';
import { NewLeadModal } from './components/NewLeadModal.js';
import { ListsModal } from './components/ListsModal.js';
import { LeadsPilotLandingPage } from './components/LeadsPilotLandingPage.js';
import { AuthLoginPage } from './components/AuthLoginPage.js';
import { SettingsModal } from './components/SettingsModal.js';
import { PlanModal } from './components/PlanModal.js';
import { FaqModal } from './components/FaqModal.js';
import { HelpModal } from './components/HelpModal.js';
import { AuthModal } from './components/AuthModal.js';
import { CreateCampaignModal } from './components/CreateCampaignModal.js';
import { CampaignsDashboardView } from './components/CampaignsDashboardView.js';
import { initSupabase, getSupabase } from './lib/supabase.js';
import { 
  Lead, 
  Company, 
  LeadList, 
  CampaignSequence, 
  ScrapeJob, 
  LeadFilterState, 
  LeadPipelineStage,
  SupabaseCampaign 
} from './types.js';
import { fetchApi } from './utils.js';
import { 
  Sparkles, 
  Globe, 
  Zap, 
  Users, 
  Building2, 
  Trello, 
  Send, 
  ShieldCheck, 
  Search, 
  SlidersHorizontal,
  Flame,
  CheckCircle2,
  Database
} from 'lucide-react';

export function App() {
  // Application View: 'landing' (Main Landing Page), 'login' (Sign In Page), or 'app' (Main Leads & Campaign Engine)
  const [viewMode, setViewMode] = useState<'landing' | 'login' | 'app'>('landing');

  // Navigation & View State
  const [activeTab, setActiveTab] = useState<NavTab>('supabase_campaigns');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedListId, setSelectedListId] = useState<string | undefined>(undefined);

  // Supabase Auth & Current User
  const [currentUser, setCurrentUser] = useState<any>({
    id: 'usr_shashank_leadspilot',
    email: 'learnings.shashank@gmail.com',
    user_metadata: {
      full_name: 'Shashank',
      avatar_initials: 'LS',
    },
  });

  // Modal Controllers
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCreateCampaignModalOpen, setIsCreateCampaignModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [isScraperModalOpen, setIsScraperModalOpen] = useState(false);
  const [isNewLeadModalOpen, setIsNewLeadModalOpen] = useState(false);
  const [isListsModalOpen, setIsListsModalOpen] = useState(false);
  const [activeDetailLead, setActiveDetailLead] = useState<Lead | null>(null);

  // Data Store
  const [leads, setLeads] = useState<Lead[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [lists, setLists] = useState<LeadList[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignSequence[]>([]);
  const [jobs, setJobs] = useState<ScrapeJob[]>([]);
  const [creditsRemaining, setCreditsRemaining] = useState<number>(2450);
  const [loading, setLoading] = useState(true);

  // Table Selection & Sorting
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('leadScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Filter State
  const [filters, setFilters] = useState<LeadFilterState>({
    industries: [],
    seniorities: [],
    companySizes: [],
    emailStatuses: [],
    intentScores: [],
    leadStatuses: [],
    minScore: 0,
  });

  // 1. Fetch Master Data
  const loadLeads = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filters.industries.length > 0) params.append('industry', filters.industries[0]);
      if (filters.seniorities.length > 0) params.append('seniority', filters.seniorities[0]);
      if (filters.minScore > 0) params.append('minScore', filters.minScore.toString());
      if (selectedListId) params.append('listId', selectedListId);
      params.append('sortBy', sortBy);
      params.append('sortOrder', sortOrder);

      const res = await fetchApi<{ success: boolean; data: Lead[] }>(`/api/leads?${params.toString()}`);
      if (res.success) {
        setLeads(res.data);
      }
    } catch (err) {
      console.error('Failed to load leads:', err);
    }
  }, [searchQuery, filters, selectedListId, sortBy, sortOrder]);

  const loadCompanies = async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: Company[] }>('/api/companies');
      if (res.success) setCompanies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadLists = async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: LeadList[] }>('/api/lists');
      if (res.success) setLists(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadCampaigns = async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: CampaignSequence[] }>('/api/campaigns');
      if (res.success) setCampaigns(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadJobs = async () => {
    try {
      const res = await fetchApi<{ success: boolean; data: ScrapeJob[] }>('/api/scrape/jobs');
      if (res.success) setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    async function init() {
      setLoading(true);
      await Promise.all([loadLeads(), loadCompanies(), loadLists(), loadCampaigns(), loadJobs()]);
      setLoading(false);
    }
    init();

    async function initSupabaseClient() {
      try {
        const res = await fetch('/api/config');
        const config = await res.json();
        if (config.supabaseUrl && config.supabaseAnonKey) {
          const client = await initSupabase(config.supabaseUrl, config.supabaseAnonKey);
          if (client) {
            const { data: { session } } = await client.auth.getSession();
            if (session?.user) {
              setCurrentUser(session.user);
            }

            client.auth.onAuthStateChange((_event, session) => {
              if (session?.user) {
                setCurrentUser(session.user);
              }
            });
          }
        }
      } catch (err) {
        console.warn('Supabase config initialization:', err);
      }
    }
    initSupabaseClient();
  }, []);

  const handleSignOut = async () => {
    try {
      const supabase = getSupabase();
      if (supabase) {
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out notice:', e);
    }
    setCurrentUser(null);
    setViewMode('landing'); // Route back to Main Landing Page as shown in screenshot!
  };

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  // Handle Sort Toggle
  const handleSortChange = (field: string) => {
    if (sortBy === field) {
      setSortOrder(o => (o === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Selection handlers
  const handleToggleSelectAll = () => {
    if (selectedLeadIds.length === leads.length) {
      setSelectedLeadIds([]);
    } else {
      setSelectedLeadIds(leads.map(l => l.id));
    }
  };

  const handleToggleSelectLead = (id: string) => {
    if (selectedLeadIds.includes(id)) {
      setSelectedLeadIds(selectedLeadIds.filter(i => i !== id));
    } else {
      setSelectedLeadIds([...selectedLeadIds, id]);
    }
  };

  // Reveal Contact details (Unmask email & phone)
  const handleRevealContact = async (id: string) => {
    try {
      const res = await fetchApi<{ success: boolean; data: Lead }>(`/api/leads/reveal/${id}`, {
        method: 'POST',
      });
      if (res.success) {
        setLeads(prev => prev.map(l => (l.id === id ? res.data : l)));
        setCreditsRemaining(c => Math.max(0, c - 1));
      }
    } catch (err) {
      console.error('Failed to reveal contact:', err);
    }
  };

  // Update Lead inline
  const handleUpdateLead = async (id: string, updates: Partial<Lead>) => {
    try {
      const res = await fetchApi<{ success: boolean; data: Lead }>(`/api/leads/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      if (res.success) {
        setLeads(prev => prev.map(l => (l.id === id ? res.data : l)));
        if (activeDetailLead && activeDetailLead.id === id) {
          setActiveDetailLead(res.data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete single lead
  const handleDeleteLead = async (id: string) => {
    try {
      await fetchApi(`/api/leads/${id}`, { method: 'DELETE' });
      setLeads(prev => prev.filter(l => l.id !== id));
      setSelectedLeadIds(prev => prev.filter(i => i !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Delete
  const handleBulkDelete = async () => {
    if (selectedLeadIds.length === 0) return;
    try {
      await fetchApi('/api/leads/bulk-delete', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedLeadIds }),
      });
      setLeads(prev => prev.filter(l => !selectedLeadIds.includes(l.id)));
      setSelectedLeadIds([]);
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Stage Change
  const handleBulkStageChange = async (stage: LeadPipelineStage) => {
    if (selectedLeadIds.length === 0) return;
    try {
      await fetchApi('/api/leads/bulk-status', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedLeadIds, status: stage }),
      });
      setLeads(prev =>
        prev.map(l => (selectedLeadIds.includes(l.id) ? { ...l, leadStatus: stage } : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Bulk Verify
  const handleBulkVerify = async () => {
    if (selectedLeadIds.length === 0) return;
    try {
      await fetchApi('/api/leads/bulk-verify', {
        method: 'POST',
        body: JSON.stringify({ ids: selectedLeadIds }),
      });
      setLeads(prev =>
        prev.map(l => (selectedLeadIds.includes(l.id) ? { ...l, emailStatus: 'verified' } : l))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Add Lead manually
  const handleAddManualLead = async (leadData: Partial<Lead>) => {
    try {
      const res = await fetchApi<{ success: boolean; data: Lead }>('/api/leads', {
        method: 'POST',
        body: JSON.stringify(leadData),
      });
      if (res.success) {
        setLeads(prev => [res.data, ...prev]);
        loadCompanies();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Create List
  const handleCreateList = async (name: string, description: string, color: string) => {
    try {
      const res = await fetchApi<{ success: boolean; data: LeadList }>('/api/lists', {
        method: 'POST',
        body: JSON.stringify({ name, description, color, leadIds: selectedLeadIds }),
      });
      if (res.success) {
        setLists(prev => [...prev, res.data]);
        setSelectedLeadIds([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Add Leads to List
  const handleAddLeadsToList = async (listId: string, leadIds: string[]) => {
    try {
      const res = await fetchApi<{ success: boolean; data: LeadList }>(`/api/lists/${listId}/add-leads`, {
        method: 'POST',
        body: JSON.stringify({ leadIds }),
      });
      if (res.success) {
        setLists(prev => prev.map(l => (l.id === listId ? res.data : l)));
        setSelectedLeadIds([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete List
  const handleDeleteList = async (id: string) => {
    try {
      await fetchApi(`/api/lists/${id}`, { method: 'DELETE' });
      setLists(prev => prev.filter(l => l.id !== id));
      if (selectedListId === id) setSelectedListId(undefined);
    } catch (err) {
      console.error(err);
    }
  };

  // Dispatch Campaign
  const handleSendCampaignOutreach = async (campaignId: string, leadIds: string[]) => {
    await fetchApi(`/api/campaigns/${campaignId}/send-outreach`, {
      method: 'POST',
      body: JSON.stringify({ leadIds }),
    });
    loadLeads();
    loadCampaigns();
  };

  // Export CSV
  const handleExportCsv = () => {
    window.location.href = `/api/export/csv?search=${encodeURIComponent(searchQuery)}`;
  };

  const verifiedCount = leads.filter(l => l.emailStatus === 'verified').length;
  const inPipelineCount = leads.filter(l => l.leadStatus !== 'new').length;

  // View 1: Main Landing Page
  if (viewMode === 'landing') {
    return (
      <LeadsPilotLandingPage 
        onEnterApp={() => setViewMode('app')} 
        onOpenLogin={() => setViewMode('login')}
      />
    );
  }

  // View 2: Split Screen Sign In Page (Screenshot 1 & 2)
  if (viewMode === 'login') {
    return (
      <AuthLoginPage
        onLoginSuccess={(user) => {
          if (user) setCurrentUser(user);
          setViewMode('app');
        }}
        onBackToLanding={() => setViewMode('landing')}
      />
    );
  }

  // View 3: Main Application Workspace
  return (
    <div className="flex flex-col h-screen w-screen bg-[#f8fafc] text-slate-900 overflow-hidden font-sans">
      {/* Top Navbar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenScraper={() => setIsScraperModalOpen(true)}
        onOpenNewLead={() => setIsNewLeadModalOpen(true)}
        onExportCsv={handleExportCsv}
        totalLeadsCount={leads.length}
        verifiedCount={verifiedCount}
        creditsRemaining={creditsRemaining}
        activeTab={activeTab}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(o => !o)}
        onGoToLanding={() => setViewMode('landing')}
        currentUser={currentUser}
        onOpenAuth={() => setViewMode('login')}
        onSignOut={handleSignOut}
        onOpenCreateCampaign={() => setIsCreateCampaignModalOpen(true)}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenPlan={() => setIsPlanModalOpen(true)}
        onOpenFaq={() => setIsFaqModalOpen(true)}
        onOpenHelp={() => setIsHelpModalOpen(true)}
      />

      {/* Main App Canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={setActiveTab}
          totalLeads={leads.length}
          totalCompanies={companies.length}
          inPipelineCount={inPipelineCount}
          lists={lists}
          selectedListId={selectedListId}
          onSelectList={setSelectedListId}
          onOpenCreateList={() => setIsListsModalOpen(true)}
          scrapingActive={jobs.some(j => j.status === 'scraping')}
        />

        {/* Filter Drawer (when active in Leads/Prospects view) */}
        <FilterDrawer
          filters={filters}
          onFilterChange={setFilters}
          onReset={() =>
            setFilters({
              industries: [],
              seniorities: [],
              companySizes: [],
              emailStatuses: [],
              intentScores: [],
              leadStatuses: [],
              minScore: 0,
            })
          }
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />

        {/* Central Workspace Content Views */}
        <main className="flex-1 flex flex-col min-w-0 bg-[#f8fafc] overflow-y-auto p-4 lg:p-6">
          {/* TAB 1: Prospects Search & Filters View */}
          {activeTab === 'prospects' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span>Live Prospect Discovery</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Verified B2B contacts extracted and enriched across web domains and professional networks
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <LeadTable
                  leads={leads}
                  selectedIds={selectedLeadIds}
                  onToggleSelectAll={handleToggleSelectAll}
                  onToggleSelectLead={handleToggleSelectLead}
                  onRevealContact={handleRevealContact}
                  onViewLeadDetail={lead => setActiveDetailLead(lead)}
                  onOpenOutreachModal={lead => setActiveDetailLead(lead)}
                  onDeleteLead={handleDeleteLead}
                  onQuickVerifyLead={lead => {
                    handleUpdateLead(lead.id, { emailStatus: 'verified' });
                  }}
                  onBulkDelete={handleBulkDelete}
                  onBulkVerify={handleBulkVerify}
                  onBulkStageChange={handleBulkStageChange}
                  onOpenAddToListModal={() => setIsListsModalOpen(true)}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          )}

          {/* TAB 2: All Leads Master Table */}
          {activeTab === 'leads' && (
            <div className="flex flex-col h-full space-y-4">
              <div className="flex items-center justify-between px-1">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-amber-600" />
                    <span>Master Lead Database</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Complete repository of scraped, enriched, and CRM-synced prospect accounts
                  </p>
                </div>
              </div>

              <div className="flex-1 min-h-0">
                <LeadTable
                  leads={leads}
                  selectedIds={selectedLeadIds}
                  onToggleSelectAll={handleToggleSelectAll}
                  onToggleSelectLead={handleToggleSelectLead}
                  onRevealContact={handleRevealContact}
                  onViewLeadDetail={lead => setActiveDetailLead(lead)}
                  onOpenOutreachModal={lead => setActiveDetailLead(lead)}
                  onDeleteLead={handleDeleteLead}
                  onQuickVerifyLead={lead => handleUpdateLead(lead.id, { emailStatus: 'verified' })}
                  onBulkDelete={handleBulkDelete}
                  onBulkVerify={handleBulkVerify}
                  onBulkStageChange={handleBulkStageChange}
                  onOpenAddToListModal={() => setIsListsModalOpen(true)}
                  sortBy={sortBy}
                  sortOrder={sortOrder}
                  onSortChange={handleSortChange}
                />
              </div>
            </div>
          )}

          {/* TAB: Supabase Postgres Persistent Campaigns & Leads */}
          {activeTab === 'supabase_campaigns' && (
            <CampaignsDashboardView
              onOpenCreateCampaign={() => setIsCreateCampaignModalOpen(true)}
              onOpenAuth={() => setViewMode('login')}
              currentUser={currentUser}
            />
          )}

          {/* TAB 3: Companies & Accounts Directory */}
          {activeTab === 'companies' && (
            <CompanyDirectory
              companies={companies}
              leads={leads}
              onViewLeadDetail={lead => setActiveDetailLead(lead)}
              onScrapeDomain={domain => {
                setIsScraperModalOpen(true);
              }}
            />
          )}

          {/* TAB 4: LeadsPilot CRM Opportunity Pipeline */}
          {activeTab === 'pipeline' && (
            <CrmPipelineView
              leads={leads}
              onUpdateLeadStage={(id, stage) => handleUpdateLead(id, { leadStatus: stage })}
              onViewLeadDetail={lead => setActiveDetailLead(lead)}
              onOpenOutreach={lead => setActiveDetailLead(lead)}
            />
          )}

          {/* TAB 5: AI Outreach Sequences */}
          {activeTab === 'campaigns' && (
            <OutreachCampaignsView
              campaigns={campaigns}
              leads={leads}
              onTriggerSendOutreach={handleSendCampaignOutreach}
              onOpenOutreachDetail={lead => setActiveDetailLead(lead)}
            />
          )}

          {/* TAB 6: Email Deliverability Verifier */}
          {activeTab === 'verifier' && <EmailVerifierView />}

          {/* TAB 7: Scraper Tasks & Terminal Output */}
          {activeTab === 'jobs' && (
            <ScraperJobsView
              jobs={jobs}
              onOpenScraperModal={() => setIsScraperModalOpen(true)}
              onRefreshJobs={loadJobs}
            />
          )}

          {/* TAB 8: Pipeline & ROI Analytics */}
          {activeTab === 'analytics' && (
            <AnalyticsView leads={leads} totalCompaniesCount={companies.length} />
          )}
        </main>
      </div>

      {/* MODALS */}
      {/* 1. Scraper Console Modal */}
      <ScraperConsoleModal
        isOpen={isScraperModalOpen}
        onClose={() => setIsScraperModalOpen(false)}
        onScrapeSuccess={extracted => {
          loadLeads();
          loadCompanies();
          loadJobs();
        }}
      />

      {/* 2. Prospect 360 & AI Outreach Modal */}
      <LeadDetailModal
        lead={activeDetailLead}
        isOpen={!!activeDetailLead}
        onClose={() => setActiveDetailLead(null)}
        onUpdateLead={handleUpdateLead}
      />

      {/* 3. Add Lead Manually Modal */}
      <NewLeadModal
        isOpen={isNewLeadModalOpen}
        onClose={() => setIsNewLeadModalOpen(false)}
        onAddLead={handleAddManualLead}
      />

      {/* 4. Lists & Segments Modal */}
      <ListsModal
        isOpen={isListsModalOpen}
        onClose={() => setIsListsModalOpen(false)}
        lists={lists}
        onCreateList={handleCreateList}
        onDeleteList={handleDeleteList}
        selectedLeadIdsForList={selectedLeadIds}
        onAddLeadsToList={handleAddLeadsToList}
      />

      {/* 5. Supabase Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={async () => {
          const supabase = getSupabase();
          if (supabase) {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
          }
        }}
      />

      {/* 6. Create Supabase Persistent Campaign Modal */}
      <CreateCampaignModal
        isOpen={isCreateCampaignModalOpen}
        onClose={() => setIsCreateCampaignModalOpen(false)}
        onCampaignCreated={(campaign) => {
          setActiveTab('supabase_campaigns');
        }}
      />

      {/* 7. Settings Modal (Screenshot 3) */}
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => setCurrentUser(updated)}
      />

      {/* 8. Plan & Credits Modal (Screenshot 3) */}
      <PlanModal
        isOpen={isPlanModalOpen}
        onClose={() => setIsPlanModalOpen(false)}
        creditsRemaining={creditsRemaining}
      />

      {/* 9. FAQ Modal (Screenshot 3) */}
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />

      {/* 10. Help & Support Modal (Screenshot 3) */}
      <HelpModal
        isOpen={isHelpModalOpen}
        onClose={() => setIsHelpModalOpen(false)}
        currentUser={currentUser}
      />
    </div>
  );
}
export default App;
