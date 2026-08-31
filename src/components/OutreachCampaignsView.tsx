import React, { useState } from 'react';
import { 
  Send, 
  Plus, 
  Sparkles, 
  Users, 
  Play, 
  Pause, 
  CheckCircle2, 
  Mail, 
  Clock, 
  Eye, 
  MessageSquare, 
  ChevronRight, 
  Sliders,
  Copy,
  Layers
} from 'lucide-react';
import { CampaignSequence, Lead } from '../types.js';

interface OutreachCampaignsViewProps {
  campaigns: CampaignSequence[];
  leads: Lead[];
  onTriggerSendOutreach: (campaignId: string, leadIds: string[]) => void;
  onOpenOutreachDetail: (lead: Lead) => void;
}

export const OutreachCampaignsView: React.FC<OutreachCampaignsViewProps> = ({
  campaigns,
  leads,
  onTriggerSendOutreach,
  onOpenOutreachDetail,
}) => {
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(campaigns[0]?.id || '');
  const [isSending, setIsSending] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const selectedCampaign = campaigns.find(c => c.id === selectedCampaignId) || campaigns[0];

  const handleLaunchOutreach = async () => {
    if (!selectedCampaign) return;
    setIsSending(true);
    try {
      await onTriggerSendOutreach(selectedCampaign.id, selectedCampaign.enrolledLeadIds);
      setSuccessToast(`Outreach sequence dispatched to ${selectedCampaign.enrolledLeadIds.length} prospects!`);
      setTimeout(() => setSuccessToast(null), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Send className="w-5 h-5 text-indigo-600" />
            <span>Automated AI Cold Outreach & Cadences</span>
          </h2>
          <p className="text-xs text-slate-500">
            Multi-step email cadences with AI personalization tokens (&#123;&#123;firstName&#125;&#125;, &#123;&#123;company&#125;&#125;, &#123;&#123;techStack&#125;&#125;)
          </p>
        </div>

        {successToast && (
          <div className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-in fade-in shadow-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successToast}</span>
          </div>
        )}
      </div>

      {/* Main Campaign Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto">
        {/* Left: Campaign List selector (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            <span>Active Campaigns ({campaigns.length})</span>
          </div>

          <div className="space-y-2">
            {campaigns.map((camp) => {
              const isSelected = camp.id === selectedCampaign?.id;
              const openRate = camp.stats.sent > 0 ? Math.round((camp.stats.opened / camp.stats.sent) * 100) : 0;
              const replyRate = camp.stats.sent > 0 ? Math.round((camp.stats.replied / camp.stats.sent) * 100) : 0;

              return (
                <div
                  key={camp.id}
                  onClick={() => setSelectedCampaignId(camp.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all shadow-xs ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-semibold text-slate-900 text-xs">{camp.name}</h4>
                      <p className="text-[11px] text-slate-500">{camp.steps.length} Automated Steps</p>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        camp.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {camp.status}
                    </span>
                  </div>

                  {/* Quick stats */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-[11px] text-center font-mono">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Sent</span>
                      <span className="font-bold text-slate-800">{camp.stats.sent}</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Open %</span>
                      <span className="font-bold text-indigo-600">{openRate}%</span>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-100">
                      <span className="text-slate-500 block text-[10px]">Reply %</span>
                      <span className="font-bold text-emerald-600">{replyRate}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Sequence Details & Cadence Steps (8 cols) */}
        {selectedCampaign && (
          <div className="lg:col-span-8 flex flex-col bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
            {/* Sequence Top Bar */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-slate-900">{selectedCampaign.name}</h3>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[10px] font-bold">
                    AI Auto-Personalized
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Enrolled Leads: <strong className="text-slate-800">{selectedCampaign.enrolledLeadIds.length} prospects</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleLaunchOutreach}
                  disabled={isSending || selectedCampaign.enrolledLeadIds.length === 0}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'Dispatching...' : 'Dispatch Cadence Now'}</span>
                </button>
              </div>
            </div>

            {/* Sequence Steps Timeline */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                <span>Multi-Touch Email Cadence Timeline</span>
              </h4>

              <div className="space-y-3">
                {selectedCampaign.steps.map((step, idx) => (
                  <div
                    key={step.id}
                    className="p-4 bg-slate-50/80 border border-slate-200 rounded-xl space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center font-mono">
                          {idx + 1}
                        </span>
                        <span className="font-semibold text-slate-800 text-xs">{step.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {step.delayDays === 0 ? 'Day 0 (Immediate)' : `Day ${step.delayDays} Follow-up`}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 font-mono bg-white p-2.5 rounded-lg border border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-bold">Subject</span>
                      <p className="text-slate-900 font-medium">{step.subject}</p>
                    </div>

                    <div className="text-xs text-slate-700 font-sans whitespace-pre-wrap bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                      {step.body}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
