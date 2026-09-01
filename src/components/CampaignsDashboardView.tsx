import React, { useState, useEffect, useCallback } from 'react';
import { 
  Layers, 
  Plus, 
  Sparkles, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Loader2, 
  ArrowLeft, 
  Database, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Mail, 
  Phone, 
  Building2, 
  Globe, 
  Search, 
  Send,
  Zap,
  Check,
  Eye,
  Terminal,
  Code,
  Edit2,
  Trash2,
  Pause,
  Play,
  UserPlus,
  Filter,
  CheckSquare,
  Square
} from 'lucide-react';
import { 
  SupabaseCampaign, 
  SupabaseLead, 
  SupabaseScrapeStatus, 
  SupabaseVerificationStatus 
} from '../types.js';
import { 
  getSupabase, 
  fetchSupabaseCampaigns,
  updateSupabaseCampaign,
  deleteSupabaseCampaign,
  fetchSupabaseCampaignLeads,
  insertSupabaseLeads,
  updateSupabaseLead,
  deleteSupabaseLead,
  enrichSupabaseLead,
  subscribeToCampaignLeads, 
  subscribeToCampaigns,
  exportSupabaseLeadsToCsv 
} from '../lib/supabase.js';

interface CampaignsDashboardViewProps {
  onOpenCreateCampaign: () => void;
  onOpenAuth: () => void;
  currentUser: any;
}

export const CampaignsDashboardView: React.FC<CampaignsDashboardViewProps> = ({
  onOpenCreateCampaign,
  onOpenAuth,
  currentUser,
}) => {
  const [campaigns, setCampaigns] = useState<SupabaseCampaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<SupabaseCampaign | null>(null);
  const [leads, setLeads] = useState<SupabaseLead[]>([]);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [isLoadingLeads, setIsLoadingLeads] = useState(false);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'pending' | 'failed'>('all');
  const [enrichingLeadId, setEnrichingLeadId] = useState<string | null>(null);
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [activeLeadDetail, setActiveLeadDetail] = useState<SupabaseLead | null>(null);
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [sqlSchema, setSqlSchema] = useState<string>('');
  
  // Modals for CRUD operations
  const [editingCampaign, setEditingCampaign] = useState<SupabaseCampaign | null>(null);
  const [campaignNameInput, setCampaignNameInput] = useState('');
  const [isAddLeadsModalOpen, setIsAddLeadsModalOpen] = useState(false);
  const [newLeadsText, setNewLeadsText] = useState('');
  const [isInsertingLeads, setIsInsertingLeads] = useState(false);
  const [editingLead, setEditingLead] = useState<SupabaseLead | null>(null);
  const [editLeadForm, setEditLeadForm] = useState<{
    verified_email: string;
    detected_company: string;
    detected_domain: string;
    phone: string;
    verification_status: SupabaseVerificationStatus;
    scrape_status: SupabaseScrapeStatus;
  }>({
    verified_email: '',
    detected_company: '',
    detected_domain: '',
    phone: '',
    verification_status: 'none',
    scrape_status: 'pending',
  });
  const [isUpdatingLead, setIsUpdatingLead] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(null), 3000);
  };

  // 1. READ: Fetch Campaigns from Supabase
  const loadCampaigns = useCallback(async () => {
    setIsLoadingCampaigns(true);
    try {
      const { data, error } = await fetchSupabaseCampaigns(currentUser?.id);
      if (!error && data) {
        setCampaigns(data);
        if (data.length > 0) {
          setSelectedCampaign(prev => {
            if (!prev) return data[0];
            const updated = data.find(c => c.id === prev.id);
            return updated || data[0];
          });
        } else {
          setSelectedCampaign(null);
        }
      }
    } catch (err) {
      console.error('Failed to load campaigns:', err);
    } finally {
      setIsLoadingCampaigns(false);
    }
  }, [currentUser?.id]);

  // 2. READ: Fetch Leads for Selected Campaign
  const loadLeadsForCampaign = useCallback(async (campaignId: string) => {
    setIsLoadingLeads(true);
    try {
      const { data, error } = await fetchSupabaseCampaignLeads(campaignId);
      if (!error && data) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Failed to load campaign leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  }, []);

  // 3. Initial Load
  useEffect(() => {
    loadCampaigns();
  }, [loadCampaigns]);

  // 4. Realtime subscription for Campaigns table
  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) return;

    const unsubscribe = subscribeToCampaigns(supabase, ({ eventType, newCampaign, oldCampaign }) => {
      if (eventType === 'INSERT' && newCampaign) {
        setCampaigns(prev => [newCampaign, ...prev.filter(c => c.id !== newCampaign.id)]);
      } else if (eventType === 'UPDATE' && newCampaign) {
        setCampaigns(prev => prev.map(c => c.id === newCampaign.id ? newCampaign : c));
        setSelectedCampaign(prev => (prev?.id === newCampaign.id ? newCampaign : prev));
      } else if (eventType === 'DELETE' && oldCampaign) {
        setCampaigns(prev => prev.filter(c => c.id !== oldCampaign.id));
        setSelectedCampaign(prev => (prev?.id === oldCampaign.id ? null : prev));
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  // 5. When Selected Campaign Changes, fetch leads and setup Realtime Subscription on Leads table
  useEffect(() => {
    if (!selectedCampaign) {
      setLeads([]);
      return;
    }

    loadLeadsForCampaign(selectedCampaign.id);

    const supabase = getSupabase();
    if (!supabase) return;

    // Realtime subscription on leads table for this campaign
    const unsubscribe = subscribeToCampaignLeads(supabase, selectedCampaign.id, ({ eventType, newLead, oldLead }) => {
      if (eventType === 'INSERT' && newLead) {
        setLeads(prev => [newLead, ...prev.filter(l => l.id !== newLead.id)]);
      } else if (eventType === 'UPDATE' && newLead) {
        setLeads(prev => prev.map(l => l.id === newLead.id ? newLead : l));
        // Also update selected campaign progress counters
        setCampaigns(prevCamps => prevCamps.map(c => {
          if (c.id === selectedCampaign.id) {
            const isFinished = newLead.scrape_status === 'success' || newLead.scrape_status === 'failed';
            return {
              ...c,
              completed_count: newLead.scrape_status === 'success' ? c.completed_count + 1 : c.completed_count,
              failed_count: newLead.scrape_status === 'failed' ? c.failed_count + 1 : c.failed_count,
            };
          }
          return c;
        }));
      } else if (eventType === 'DELETE' && oldLead) {
        setLeads(prev => prev.filter(l => l.id !== oldLead.id));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedCampaign?.id, loadLeadsForCampaign]);

  // Load SQL schema text for setup inspector
  const loadSqlSchema = async () => {
    try {
      const res = await fetch('/api/supabase/schema');
      const data = await res.json();
      if (data.sql) {
        setSqlSchema(data.sql);
      }
    } catch (err) {
      console.warn('Failed to load SQL schema:', err);
    }
    setShowSqlModal(true);
  };

  // UPDATE: Update Campaign Name or Status
  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCampaign || !campaignNameInput.trim()) return;

    try {
      const { data, error } = await updateSupabaseCampaign(editingCampaign.id, {
        name: campaignNameInput.trim(),
      });

      if (!error && data) {
        setCampaigns(prev => prev.map(c => c.id === data.id ? data : c));
        if (selectedCampaign?.id === data.id) {
          setSelectedCampaign(data);
        }
        showToast('Campaign updated successfully in Supabase.');
      }
    } catch (err) {
      console.error('Error updating campaign:', err);
    } finally {
      setEditingCampaign(null);
    }
  };

  const handleToggleCampaignStatus = async (camp: SupabaseCampaign) => {
    const nextStatus = camp.status === 'running' ? 'queued' : 'running';
    try {
      const { data, error } = await updateSupabaseCampaign(camp.id, { status: nextStatus });
      if (!error && data) {
        setCampaigns(prev => prev.map(c => c.id === data.id ? data : c));
        if (selectedCampaign?.id === data.id) {
          setSelectedCampaign(data);
        }
        showToast(`Campaign status changed to ${nextStatus}.`);
      }
    } catch (err) {
      console.error('Error toggling campaign status:', err);
    }
  };

  // DELETE: Delete Campaign from Supabase
  const handleDeleteCampaign = async (campaignId: string) => {
    if (!confirm('Are you sure you want to delete this campaign? All associated leads will also be deleted from Supabase.')) {
      return;
    }

    try {
      const { success, error } = await deleteSupabaseCampaign(campaignId);
      if (success) {
        setCampaigns(prev => prev.filter(c => c.id !== campaignId));
        if (selectedCampaign?.id === campaignId) {
          const remaining = campaigns.filter(c => c.id !== campaignId);
          setSelectedCampaign(remaining.length > 0 ? remaining[0] : null);
        }
        showToast('Campaign and its leads deleted from Supabase.');
      } else {
        alert(error || 'Failed to delete campaign');
      }
    } catch (err) {
      console.error('Error deleting campaign:', err);
    }
  };

  // CREATE: Add new leads directly to selected campaign in Supabase
  const handleInsertLeads = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCampaign || !newLeadsText.trim()) return;

    const items = newLeadsText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('#'));

    if (items.length === 0) return;

    setIsInsertingLeads(true);
    try {
      const primaryPlatform = selectedCampaign.platforms[0] || 'LinkedIn';
      const recordsToInsert = items.map(id => {
        let inferredPlatform = primaryPlatform;
        if (id.includes('linkedin.com')) inferredPlatform = 'LinkedIn';
        else if (id.includes('twitter.com') || id.includes('x.com')) inferredPlatform = 'Twitter / X';
        else if (id.includes('github.com')) inferredPlatform = 'GitHub';
        else if (id.includes('.') && !id.includes(' ')) inferredPlatform = 'Company Website';

        return {
          platform: inferredPlatform,
          source_identifier: id,
          scrape_status: 'pending' as SupabaseScrapeStatus,
          verification_status: 'none' as SupabaseVerificationStatus,
          raw_profile: { source: id, added_manually: true },
        };
      });

      const { data, error } = await insertSupabaseLeads(selectedCampaign.id, recordsToInsert);
      if (!error && data) {
        setLeads(prev => [...data, ...prev]);
        // Update campaign total profile count
        await updateSupabaseCampaign(selectedCampaign.id, {
          total_profiles: selectedCampaign.total_profiles + items.length,
        });
        setNewLeadsText('');
        setIsAddLeadsModalOpen(false);
        showToast(`Inserted ${data.length} leads into Supabase campaign.`);
      }
    } catch (err) {
      console.error('Error inserting leads:', err);
    } finally {
      setIsInsertingLeads(false);
    }
  };

  // UPDATE: Edit Single Lead details in Supabase
  const handleOpenEditLead = (lead: SupabaseLead) => {
    setEditingLead(lead);
    setEditLeadForm({
      verified_email: lead.verified_email || '',
      detected_company: lead.detected_company || '',
      detected_domain: lead.detected_domain || '',
      phone: lead.phone || '',
      verification_status: lead.verification_status || 'none',
      scrape_status: lead.scrape_status || 'pending',
    });
  };

  const handleSaveLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLead) return;

    setIsUpdatingLead(true);
    try {
      const { data, error } = await updateSupabaseLead(editingLead.id, {
        verified_email: editLeadForm.verified_email.trim() || null,
        detected_company: editLeadForm.detected_company.trim() || null,
        detected_domain: editLeadForm.detected_domain.trim() || null,
        phone: editLeadForm.phone.trim() || null,
        verification_status: editLeadForm.verification_status,
        scrape_status: editLeadForm.scrape_status,
      });

      if (!error && data) {
        setLeads(prev => prev.map(l => l.id === data.id ? data : l));
        setEditingLead(null);
        showToast('Lead updated in Supabase leads table.');
      } else {
        alert(error || 'Failed to update lead');
      }
    } catch (err) {
      console.error('Error saving lead:', err);
    } finally {
      setIsUpdatingLead(false);
    }
  };

  // DELETE: Delete single lead from Supabase
  const handleDeleteLead = async (leadId: string) => {
    if (!confirm('Are you sure you want to delete this lead from Supabase?')) return;

    try {
      const { success, error } = await deleteSupabaseLead(leadId);
      if (success) {
        setLeads(prev => prev.filter(l => l.id !== leadId));
        showToast('Lead deleted from Supabase.');
      } else {
        alert(error || 'Failed to delete lead');
      }
    } catch (err) {
      console.error('Error deleting lead:', err);
    }
  };

  // ENRICH: Re-enrich a specific lead in Supabase via Hunter.io + Gemini AI
  const handleEnrichLead = async (leadId: string) => {
    setEnrichingLeadId(leadId);
    try {
      const { data, error } = await enrichSupabaseLead(leadId);
      if (!error && data) {
        setLeads(prev => prev.map(l => l.id === leadId ? data : l));
        showToast('Lead enriched and updated in Supabase.');
      } else {
        alert(error || 'Enrichment failed');
      }
    } catch (err) {
      console.error('Enrichment error:', err);
    } finally {
      setEnrichingLeadId(null);
    }
  };

  // ENRICH ALL: Enrich all pending leads in the campaign
  const handleEnrichAllPending = async () => {
    const pending = leads.filter(l => l.scrape_status === 'pending');
    if (pending.length === 0) {
      showToast('No pending leads to enrich.');
      return;
    }

    setIsEnrichingAll(true);
    for (const lead of pending) {
      try {
        const { data } = await enrichSupabaseLead(lead.id);
        if (data) {
          setLeads(prev => prev.map(l => l.id === lead.id ? data : l));
        }
      } catch (e) {
        console.warn('Batch lead enrichment notice:', e);
      }
    }
    setIsEnrichingAll(false);
    showToast('Enrichment completed for all pending leads.');
  };

  // Export Leads to CSV
  const handleExportCsv = () => {
    if (!selectedCampaign) return;
    exportSupabaseLeadsToCsv(selectedCampaign.name, filteredLeads);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const filteredLeads = leads.filter(l => {
    // Status filter
    if (statusFilter === 'verified' && l.verification_status !== 'verified') return false;
    if (statusFilter === 'pending' && l.scrape_status !== 'pending') return false;
    if (statusFilter === 'failed' && l.scrape_status !== 'failed') return false;

    if (!searchLeadQuery) return true;
    const q = searchLeadQuery.toLowerCase();
    return (
      (l.source_identifier || '').toLowerCase().includes(q) ||
      (l.detected_company || '').toLowerCase().includes(q) ||
      (l.detected_domain || '').toLowerCase().includes(q) ||
      (l.verified_email || '').toLowerCase().includes(q) ||
      (l.platform || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex flex-col h-full space-y-5">
      {/* Toast Notification */}
      {actionSuccessMsg && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 border border-slate-700 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner / Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div>
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Supabase Persistent Campaigns & Leads</span>
            </h2>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Realtime Postgres Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Postgres database tables with Row Level Security (RLS) and Hunter.io + Gemini AI live extraction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadSqlSchema}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-xs transition-all cursor-pointer"
          >
            <Code className="w-3.5 h-3.5 text-slate-500" />
            <span>View SQL Schema</span>
          </button>

          <button
            onClick={onOpenCreateCampaign}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-all active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Campaign list (4 cols) & Right Campaign Detail + Leads (8 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1 overflow-hidden">
        {/* Left Column: Campaigns List */}
        <div className="lg:col-span-4 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span className="text-xs font-bold text-slate-900">Campaigns ({campaigns.length})</span>
            </div>
            <button
              onClick={loadCampaigns}
              title="Refresh Campaigns from Supabase"
              className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingCampaigns ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {isLoadingCampaigns ? (
              <div className="py-12 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span>Loading Supabase campaigns...</span>
              </div>
            ) : campaigns.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-3">
                  <Layers className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-slate-800">No Campaigns in Supabase</h4>
                <p className="text-[11px] text-slate-500 mt-1 mb-4">
                  Create your first multi-platform campaign to scrape and persist leads in Postgres.
                </p>
                <button
                  onClick={onOpenCreateCampaign}
                  className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold hover:bg-indigo-700 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Create Campaign</span>
                </button>
              </div>
            ) : (
              campaigns.map((camp) => {
                const isSelected = selectedCampaign?.id === camp.id;
                const completedPct = camp.total_profiles > 0 
                  ? Math.round(((camp.completed_count + camp.failed_count) / camp.total_profiles) * 100) 
                  : 0;

                return (
                  <div
                    key={camp.id}
                    onClick={() => setSelectedCampaign(camp)}
                    className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-50/70 border-indigo-300 ring-1 ring-indigo-200 shadow-xs'
                        : 'bg-white border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{camp.name}</h4>
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[10px] text-slate-400">
                            {new Date(camp.created_at).toLocaleDateString()}
                          </span>
                          <span className="text-slate-300">•</span>
                          <span className="text-[10px] font-mono text-slate-600">
                            {camp.total_profiles} profiles
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase shrink-0 ${
                            camp.status === 'completed'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : camp.status === 'running'
                              ? 'bg-amber-50 text-amber-700 border border-amber-200'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {camp.status}
                        </span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingCampaign(camp);
                            setCampaignNameInput(camp.name);
                          }}
                          title="Rename Campaign"
                          className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-200/60"
                        >
                          <Edit2 className="w-3 h-3" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCampaign(camp.id);
                          }}
                          title="Delete Campaign from Supabase"
                          className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1 font-mono">
                        <span>Progress</span>
                        <span>{camp.completed_count}/{camp.total_profiles} completed</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            camp.status === 'completed' ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${Math.min(100, completedPct)}%` }}
                        />
                      </div>
                    </div>

                    {/* Platform Tags */}
                    <div className="flex flex-wrap gap-1 mt-2.5">
                      {(camp.platforms || []).map((p, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-100 text-[9px] font-medium text-slate-600"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Campaign Detail & Live Leads Table */}
        <div className="lg:col-span-8 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          {selectedCampaign ? (
            <>
              {/* Campaign Header */}
              <div className="p-4 border-b border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm">{selectedCampaign.name}</h3>
                      <button
                        onClick={() => handleToggleCampaignStatus(selectedCampaign)}
                        title="Toggle Status (Running / Queued)"
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase flex items-center gap-1 transition-colors cursor-pointer ${
                          selectedCampaign.status === 'completed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : selectedCampaign.status === 'running'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {selectedCampaign.status === 'running' ? (
                          <>
                            <Pause className="w-2.5 h-2.5" />
                            <span>Running</span>
                          </>
                        ) : (
                          <>
                            <Play className="w-2.5 h-2.5" />
                            <span>{selectedCampaign.status}</span>
                          </>
                        )}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      UUID: <code className="font-mono text-[10px] text-indigo-600">{selectedCampaign.id}</code>
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsAddLeadsModalOpen(true)}
                      className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>Add Leads</span>
                    </button>

                    <button
                      onClick={handleEnrichAllPending}
                      disabled={isEnrichingAll || leads.filter(l => l.scrape_status === 'pending').length === 0}
                      className="px-2.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-40 cursor-pointer"
                      title="Enrich all pending leads in this campaign"
                    >
                      {isEnrichingAll ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      )}
                      <span>Enrich All Pending</span>
                    </button>

                    <button
                      onClick={() => loadLeadsForCampaign(selectedCampaign.id)}
                      className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-600 shadow-xs transition-colors text-xs flex items-center gap-1 cursor-pointer"
                      title="Refresh Leads from Supabase"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isLoadingLeads ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                      onClick={handleExportCsv}
                      className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 shadow-xs transition-colors text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Export CSV ({filteredLeads.length})</span>
                    </button>
                  </div>
                </div>

                {/* Filter and stats row */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-200/60">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                      <input
                        type="text"
                        value={searchLeadQuery}
                        onChange={(e) => setSearchLeadQuery(e.target.value)}
                        placeholder="Filter by company, domain, email..."
                        className="w-full pl-8 pr-3 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                      />
                    </div>

                    {/* Status Tabs */}
                    <div className="flex items-center rounded-lg bg-slate-100 p-0.5 text-[11px] font-medium text-slate-600">
                      <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'hover:text-slate-900'}`}
                      >
                        All
                      </button>
                      <button
                        onClick={() => setStatusFilter('verified')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${statusFilter === 'verified' ? 'bg-white shadow-xs text-emerald-700 font-bold' : 'hover:text-slate-900'}`}
                      >
                        Verified
                      </button>
                      <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${statusFilter === 'pending' ? 'bg-white shadow-xs text-amber-700 font-bold' : 'hover:text-slate-900'}`}
                      >
                        Pending
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-slate-500 self-end sm:self-center">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <strong>{leads.filter(l => l.verification_status === 'verified').length}</strong> Verified
                    </span>
                    <span className="text-slate-300">•</span>
                    <span><strong>{leads.length}</strong> Total in Campaign</span>
                  </div>
                </div>
              </div>

              {/* Leads Table */}
              <div className="flex-1 overflow-auto">
                {isLoadingLeads ? (
                  <div className="py-16 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span>Loading leads from Supabase database...</span>
                  </div>
                ) : filteredLeads.length === 0 ? (
                  <div className="py-16 text-center text-slate-400 text-xs">
                    <p className="font-semibold text-slate-600">No leads match your filter</p>
                    <p className="text-[11px] mt-1">Leads populate and enrich automatically via Supabase client calls.</p>
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="sticky top-0 bg-slate-50/90 backdrop-blur-xs border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-2.5 px-3">Target Profile</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Company & Domain</th>
                        <th className="py-2.5 px-3">Verified Email</th>
                        <th className="py-2.5 px-3">Lead Score</th>
                        <th className="py-2.5 px-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredLeads.map((lead) => {
                        const isEnriching = enrichingLeadId === lead.id;

                        return (
                          <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                            {/* Target Profile */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-600 font-medium">
                                  {lead.platform}
                                </span>
                                <span className="truncate max-w-[160px] font-mono text-xs">
                                  {lead.source_identifier}
                                </span>
                              </div>
                              {lead.phone && (
                                <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{lead.phone}</span>
                                </p>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3">
                              {lead.scrape_status === 'pending' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                  <span>Pending</span>
                                </span>
                              ) : lead.scrape_status === 'success' ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  <span>Enriched</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200" title={lead.scrape_error || 'Error'}>
                                  <AlertCircle className="w-3 h-3 text-red-500" />
                                  <span>Failed</span>
                                </span>
                              )}
                            </td>

                            {/* Company & Domain */}
                            <td className="py-3 px-3">
                              <div className="font-semibold text-slate-800">
                                {lead.detected_company || '—'}
                              </div>
                              {lead.detected_domain && (
                                <a
                                  href={`https://${lead.detected_domain}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[11px] text-indigo-600 hover:underline flex items-center gap-1"
                                >
                                  <span>{lead.detected_domain}</span>
                                  <ExternalLink className="w-2.5 h-2.5 text-slate-400" />
                                </a>
                              )}
                            </td>

                            {/* Verified Email */}
                            <td className="py-3 px-3">
                              {lead.verified_email ? (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-mono text-xs text-slate-900 font-medium">
                                      {lead.verified_email}
                                    </span>
                                    <button
                                      onClick={() => copyToClipboard(lead.verified_email!, lead.id)}
                                      title="Copy Email"
                                      className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                                    >
                                      {copiedText === lead.id ? (
                                        <Check className="w-3 h-3 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3 h-3" />
                                      )}
                                    </button>
                                  </div>

                                  <div>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${
                                        lead.verification_status === 'verified'
                                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                          : lead.verification_status === 'risky'
                                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                          : 'bg-slate-100 text-slate-600'
                                      }`}
                                    >
                                      {lead.verification_status}
                                    </span>
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400 italic text-[11px]">No email extracted</span>
                              )}
                            </td>

                            {/* Lead Score */}
                            <td className="py-3 px-3">
                              {lead.lead_score != null ? (
                                <div className="flex items-center gap-2">
                                  <div className="w-7 h-7 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold font-mono text-xs flex items-center justify-center">
                                    {lead.lead_score}
                                  </div>
                                  <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-indigo-600"
                                      style={{ width: `${lead.lead_score}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-3 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleEnrichLead(lead.id)}
                                  disabled={isEnriching}
                                  title="Re-enrich with Hunter.io and Gemini AI"
                                  className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-indigo-600 rounded text-[11px] font-semibold flex items-center gap-1 shadow-2xs transition-all disabled:opacity-50 cursor-pointer"
                                >
                                  {isEnriching ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                  )}
                                  <span>Enrich</span>
                                </button>

                                <button
                                  onClick={() => handleOpenEditLead(lead)}
                                  title="Edit Lead in Supabase"
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => setActiveLeadDetail(lead)}
                                  title="View Full JSON / Profile"
                                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition-colors cursor-pointer"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>

                                <button
                                  onClick={() => handleDeleteLead(lead.id)}
                                  title="Delete Lead from Supabase"
                                  className="p-1 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            </>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-slate-400 text-xs">
              <Layers className="w-10 h-10 text-slate-300 mb-2" />
              <p className="font-semibold text-slate-700">Select a Campaign from the left</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Or create a new campaign to begin scraping.</p>
            </div>
          )}
        </div>
      </div>

      {/* Edit Campaign Modal */}
      {editingCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-indigo-600" />
              <span>Edit Campaign Name</span>
            </h3>
            <form onSubmit={handleUpdateCampaign} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Campaign Name</label>
                <input
                  type="text"
                  required
                  value={campaignNameInput}
                  onChange={(e) => setCampaignNameInput(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingCampaign(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Leads to Campaign Modal */}
      {isAddLeadsModalOpen && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-indigo-600" />
                <span>Add Leads to "{selectedCampaign.name}"</span>
              </h3>
              <button onClick={() => setIsAddLeadsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleInsertLeads} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Profiles or Domain URLs (one per line)
                </label>
                <textarea
                  rows={5}
                  required
                  value={newLeadsText}
                  onChange={(e) => setNewLeadsText(e.target.value)}
                  placeholder="stripe.com&#10;https://linkedin.com/in/satyanadella&#10;openai.com"
                  className="w-full p-3 font-mono text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddLeadsModalOpen(false)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isInsertingLeads}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isInsertingLeads ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>Insert into Supabase</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Lead Modal */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-slate-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Edit2 className="w-4 h-4 text-indigo-600" />
                <span>Edit Lead in Supabase</span>
              </h3>
              <button onClick={() => setEditingLead(null)} className="text-slate-400 hover:text-slate-700">
                <XIcon className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveLead} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detected Company</label>
                  <input
                    type="text"
                    value={editLeadForm.detected_company}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, detected_company: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Detected Domain</label>
                  <input
                    type="text"
                    value={editLeadForm.detected_domain}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, detected_domain: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Verified Email</label>
                <input
                  type="email"
                  value={editLeadForm.verified_email}
                  onChange={(e) => setEditLeadForm({ ...editLeadForm, verified_email: e.target.value })}
                  placeholder="name@company.com"
                  className="w-full px-3 py-1.5 font-mono border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phone</label>
                  <input
                    type="text"
                    value={editLeadForm.phone}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, phone: e.target.value })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Verification Status</label>
                  <select
                    value={editLeadForm.verification_status}
                    onChange={(e) => setEditLeadForm({ ...editLeadForm, verification_status: e.target.value as SupabaseVerificationStatus })}
                    className="w-full px-3 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
                  >
                    <option value="verified">Verified</option>
                    <option value="risky">Risky</option>
                    <option value="unverified">Unverified</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatingLead}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingLead && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Save Lead</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SQL Schema Inspector Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-amber-400 flex items-center justify-center">
                  <Terminal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Supabase Postgres Migration Schema</h3>
                  <p className="text-xs text-slate-500">Includes campaigns, leads, RLS policies, and Realtime publications</p>
                </div>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 font-mono text-xs bg-slate-950 text-slate-200 leading-relaxed">
              <pre className="whitespace-pre-wrap">{sqlSchema || '-- SQL Schema is available in /schema.sql'}</pre>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ready to run in Supabase SQL Editor</span>
              </span>
              <button
                onClick={() => copyToClipboard(sqlSchema, 'schema_copied')}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-2 cursor-pointer"
              >
                {copiedText === 'schema_copied' ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied to Clipboard!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy SQL Schema</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Raw Lead JSON Detail Modal */}
      {activeLeadDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  {activeLeadDetail.detected_company || activeLeadDetail.source_identifier}
                </h3>
                <p className="text-xs text-slate-500">Lead ID: {activeLeadDetail.id}</p>
              </div>
              <button
                onClick={() => setActiveLeadDetail(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Platform</span>
                  <p className="font-semibold text-slate-800 mt-0.5">{activeLeadDetail.platform}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Scrape Status</span>
                  <p className="font-semibold text-slate-800 mt-0.5 capitalize">{activeLeadDetail.scrape_status}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Verified Email</span>
                  <p className="font-mono text-indigo-600 font-semibold mt-0.5">{activeLeadDetail.verified_email || '—'}</p>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold">Verification Status</span>
                  <p className="font-semibold text-slate-800 mt-0.5 capitalize">{activeLeadDetail.verification_status}</p>
                </div>
              </div>

              {activeLeadDetail.score_breakdown && (
                <div className="bg-indigo-50/60 p-4 rounded-xl border border-indigo-100 space-y-2">
                  <h4 className="font-bold text-indigo-950 text-xs">AI Lead Score Breakdown</h4>
                  <pre className="font-mono text-[11px] text-indigo-900 whitespace-pre-wrap">
                    {JSON.stringify(activeLeadDetail.score_breakdown, null, 2)}
                  </pre>
                </div>
              )}

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Raw Scraped Profile Object (JSONB)</h4>
                <div className="p-4 bg-slate-950 text-slate-200 rounded-xl font-mono text-[11px] overflow-auto max-h-60">
                  <pre className="whitespace-pre-wrap">{JSON.stringify(activeLeadDetail.raw_profile, null, 2)}</pre>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setActiveLeadDetail(null)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
