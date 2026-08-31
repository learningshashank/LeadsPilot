import React, { useState } from 'react';
import { 
  Trello, 
  Plus, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Linkedin, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { Lead, LeadPipelineStage } from '../types.js';
import { getVerificationBadgeStyle, getIntentBadgeStyle, getStageLabel } from '../utils.js';

interface CrmPipelineViewProps {
  leads: Lead[];
  onUpdateLeadStage: (id: string, stage: LeadPipelineStage) => void;
  onViewLeadDetail: (lead: Lead) => void;
  onOpenOutreach: (lead: Lead) => void;
}

interface StageColumn {
  id: LeadPipelineStage;
  label: string;
  color: string;
  borderColor: string;
  badgeBg: string;
}

const STAGES: StageColumn[] = [
  {
    id: 'new',
    label: 'New Leads',
    color: 'text-slate-700',
    borderColor: 'border-slate-200',
    badgeBg: 'bg-slate-200 text-slate-700',
  },
  {
    id: 'contacted',
    label: 'Cold Outreach',
    color: 'text-sky-700',
    borderColor: 'border-sky-200',
    badgeBg: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'meeting_scheduled',
    label: 'Meeting Booked',
    color: 'text-purple-700',
    borderColor: 'border-purple-200',
    badgeBg: 'bg-purple-100 text-purple-700',
  },
  {
    id: 'qualified',
    label: 'Sales Qualified',
    color: 'text-indigo-700',
    borderColor: 'border-indigo-200',
    badgeBg: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'in_negotiation',
    label: 'Negotiation',
    color: 'text-amber-700',
    borderColor: 'border-amber-200',
    badgeBg: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'closed_won',
    label: 'Closed / Won',
    color: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    badgeBg: 'bg-emerald-100 text-emerald-700',
  },
];

export const CrmPipelineView: React.FC<CrmPipelineViewProps> = ({
  leads,
  onUpdateLeadStage,
  onViewLeadDetail,
  onOpenOutreach,
}) => {
  const getNextStage = (current: LeadPipelineStage): LeadPipelineStage | null => {
    const order: LeadPipelineStage[] = ['new', 'contacted', 'meeting_scheduled', 'qualified', 'in_negotiation', 'closed_won'];
    const idx = order.indexOf(current);
    if (idx >= 0 && idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStage = (current: LeadPipelineStage): LeadPipelineStage | null => {
    const order: LeadPipelineStage[] = ['new', 'contacted', 'meeting_scheduled', 'qualified', 'in_negotiation', 'closed_won'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Trello className="w-5 h-5 text-indigo-600" />
            <span>LeadsPilot CRM Opportunity Pipeline</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track deal stages, outreach response velocity, and qualification milestones
          </p>
        </div>
      </div>

      {/* Kanban Stage Grid */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {STAGES.map((col) => {
          const colLeads = leads.filter(l => l.leadStatus === col.id);
          const totalScore = colLeads.reduce((acc, curr) => acc + curr.leadScore, 0);
          const avgScore = colLeads.length > 0 ? Math.round(totalScore / colLeads.length) : 0;

          return (
            <div
              key={col.id}
              className="flex flex-col bg-slate-100/90 border border-slate-200 rounded-xl overflow-hidden min-w-[240px]"
            >
              {/* Column Header */}
              <div className={`p-3 border-b ${col.borderColor} bg-white flex items-center justify-between`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold ${col.color}`}>{col.label}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${col.badgeBg}`}>
                    {colLeads.length}
                  </span>
                </div>
                {avgScore > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono" title="Average Lead Score">
                    Fit: {avgScore}
                  </span>
                )}
              </div>

              {/* Lead Cards List */}
              <div className="p-2 space-y-2.5 flex-1 overflow-y-auto max-h-[calc(100vh-230px)]">
                {colLeads.length === 0 ? (
                  <div className="py-8 text-center text-slate-400 text-xs italic">
                    No prospects in this stage
                  </div>
                ) : (
                  colLeads.map((lead) => {
                    const badge = getVerificationBadgeStyle(lead.emailStatus);
                    const next = getNextStage(lead.leadStatus);
                    const prev = getPrevStage(lead.leadStatus);

                    return (
                      <div
                        key={lead.id}
                        onClick={() => onViewLeadDetail(lead)}
                        className="p-3 bg-white hover:bg-slate-50/90 border border-slate-200 hover:border-indigo-300 rounded-xl transition-all cursor-pointer shadow-xs space-y-2.5 group"
                      >
                        {/* Prospect Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-semibold text-slate-900 text-xs group-hover:text-indigo-600 transition-colors">
                              {lead.fullName}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate">{lead.title}</p>
                          </div>
                          <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200">
                            {lead.leadScore}
                          </span>
                        </div>

                        {/* Company & Location */}
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate font-medium text-slate-800">{lead.company}</span>
                        </div>

                        {/* Badges */}
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] px-1.5 py-0.5 rounded font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                            {lead.emailStatus}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-slate-600 font-medium">
                            {lead.seniority.split('/')[0]}
                          </span>
                        </div>

                        {/* Stage Controls Footer */}
                        <div
                          className="pt-2 border-t border-slate-100 flex items-center justify-between"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-center gap-1">
                            {prev && (
                              <button
                                onClick={() => onUpdateLeadStage(lead.id, prev)}
                                title={`Move back to ${getStageLabel(prev)}`}
                                className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100"
                              >
                                <ChevronLeft className="w-3.5 h-3.5" />
                              </button>
                            )}
                            {next && (
                              <button
                                onClick={() => onUpdateLeadStage(lead.id, next)}
                                title={`Advance to ${getStageLabel(next)}`}
                                className="p-1 rounded text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 flex items-center gap-0.5 text-[10px] font-semibold"
                              >
                                <span>Advance</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>

                          <button
                            onClick={() => onOpenOutreach(lead)}
                            title="Generate AI Outreach"
                            className="text-purple-600 hover:text-purple-700 p-1 hover:bg-purple-50 rounded"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
