import React, { useState } from 'react';
import { 
  Check, 
  ExternalLink, 
  Mail, 
  Phone, 
  Linkedin, 
  Sparkles, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  MoreHorizontal, 
  Trash2, 
  FolderPlus, 
  ArrowUpDown, 
  Copy, 
  CheckCircle2, 
  Flame,
  Globe,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import { Lead, EmailVerificationStatus, BuyingIntentScore, LeadPipelineStage } from '../types.js';
import { 
  getVerificationBadgeStyle, 
  getIntentBadgeStyle, 
  getStageColor, 
  getStageLabel, 
  maskEmail, 
  maskPhone,
  formatDate 
} from '../utils.js';

interface LeadTableProps {
  leads: Lead[];
  selectedIds: string[];
  onToggleSelectAll: () => void;
  onToggleSelectLead: (id: string) => void;
  onRevealContact: (id: string) => void;
  onViewLeadDetail: (lead: Lead) => void;
  onOpenOutreachModal: (lead: Lead) => void;
  onDeleteLead: (id: string) => void;
  onQuickVerifyLead: (lead: Lead) => void;
  onBulkDelete: () => void;
  onBulkVerify: () => void;
  onBulkStageChange: (stage: LeadPipelineStage) => void;
  onOpenAddToListModal: () => void;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  onSortChange: (field: string) => void;
}

export const LeadTable: React.FC<LeadTableProps> = ({
  leads,
  selectedIds,
  onToggleSelectAll,
  onToggleSelectLead,
  onRevealContact,
  onViewLeadDetail,
  onOpenOutreachModal,
  onDeleteLead,
  onQuickVerifyLead,
  onBulkDelete,
  onBulkVerify,
  onBulkStageChange,
  onOpenAddToListModal,
  sortBy,
  sortOrder,
  onSortChange,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(leads.length / itemsPerPage) || 1;
  const paginatedLeads = leads.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const isAllSelected = leads.length > 0 && selectedIds.length === leads.length;
  const isSomeSelected = selectedIds.length > 0 && selectedIds.length < leads.length;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      {/* Bulk Actions Header (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="px-4 py-2.5 bg-indigo-50/90 border-b border-indigo-100 flex items-center justify-between text-xs animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-indigo-900">
              {selectedIds.length} {selectedIds.length === 1 ? 'prospect' : 'prospects'} selected
            </span>
            <div className="h-4 w-px bg-indigo-200" />
            
            {/* Stage Quick Changer */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-600">Move to:</span>
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    onBulkStageChange(e.target.value as LeadPipelineStage);
                    e.target.value = '';
                  }
                }}
                className="bg-white text-slate-800 border border-slate-200 px-2 py-1 rounded text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="">Select Stage...</option>
                <option value="new">New Lead</option>
                <option value="contacted">Contacted</option>
                <option value="meeting_scheduled">Meeting Scheduled</option>
                <option value="qualified">Sales Qualified</option>
                <option value="in_negotiation">In Negotiation</option>
                <option value="closed_won">Closed Won</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onBulkVerify}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 font-medium transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Verify Emails</span>
            </button>
            <button
              onClick={onOpenAddToListModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-medium transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Add to List</span>
            </button>
            <button
              onClick={onBulkDelete}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-left text-xs border-collapse">
          {/* Table Header */}
          <thead className="bg-slate-50 sticky top-0 z-10 text-slate-500 border-b border-slate-200 font-bold uppercase text-[10px] tracking-wider select-none">
            <tr>
              <th className="w-10 px-3 py-3 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = isSomeSelected;
                  }}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
                />
              </th>
              
              <th 
                onClick={() => onSortChange('name')}
                className="px-4 py-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <span>Prospect & Title</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th 
                onClick={() => onSortChange('company')}
                className="px-4 py-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <span>Company & Industry</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="px-4 py-3">Direct Contact Info</th>

              <th 
                onClick={() => onSortChange('leadScore')}
                className="px-4 py-3 cursor-pointer hover:text-slate-800"
              >
                <div className="flex items-center gap-1.5">
                  <span>Fit Score</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>

              <th className="px-4 py-3">Deliverability</th>

              <th className="px-4 py-3">CRM Pipeline Stage</th>

              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          {/* Table Rows */}
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedLeads.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <Flame className="w-8 h-8 opacity-30 text-slate-400" />
                    <p className="text-sm font-semibold text-slate-700">No prospects match the selected filters</p>
                    <p className="text-xs text-slate-400">Try loosening your industry or score filters, or launch the Live AI Scraper.</p>
                  </div>
                </td>
              </tr>
            ) : (
              paginatedLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);
                const badge = getVerificationBadgeStyle(lead.emailStatus);
                const intentStyle = getIntentBadgeStyle(lead.intentScore);
                const stageColor = getStageColor(lead.leadStatus);

                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-50/80 transition-colors group ${
                      isSelected ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="w-10 px-3 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelectLead(lead.id)}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/50 cursor-pointer"
                      />
                    </td>

                    {/* Prospect Info */}
                    <td className="px-4 py-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200/60 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                          {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <button
                            onClick={() => onViewLeadDetail(lead)}
                            className="font-semibold text-slate-900 hover:text-indigo-600 transition-colors text-left flex items-center gap-1.5"
                          >
                            <span className="truncate">{lead.fullName}</span>
                            {lead.linkedin && (
                              <a
                                href={lead.linkedin}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-400 hover:text-indigo-600"
                              >
                                <Linkedin className="w-3 h-3" />
                              </a>
                            )}
                          </button>
                          <p className="text-[11px] text-slate-500 truncate">{lead.title}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-medium">
                              {lead.seniority}
                            </span>
                            <span className="text-[10px] text-slate-400 truncate">
                              {lead.location}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Company & Industry */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          {lead.companyLogo && (
                            <img
                              src={lead.companyLogo}
                              alt=""
                              className="w-4 h-4 rounded object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="font-semibold text-slate-900 truncate">{lead.company}</span>
                        </div>
                        <p className="text-[11px] text-indigo-600 font-medium truncate">{lead.industry}</p>
                        <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                          <span>{lead.companySize} emp</span>
                          {lead.annualRevenue && (
                            <>
                              <span>•</span>
                              <span>{lead.annualRevenue}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info (Revealed or Masked) */}
                    <td className="px-4 py-3">
                      {lead.revealed ? (
                        <div className="space-y-1.5 font-mono">
                          {/* Email */}
                          <div className="flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span className="text-[11px] text-slate-800 font-medium truncate select-all">{lead.email}</span>
                            <button
                              onClick={() => copyToClipboard(lead.email, `email_${lead.id}`)}
                              title="Copy Email"
                              className="text-slate-400 hover:text-indigo-600 p-0.5"
                            >
                              {copiedId === `email_${lead.id}` ? (
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          {/* Phone */}
                          {lead.phone && (
                            <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              <span className="truncate select-all">{lead.phone}</span>
                              <button
                                onClick={() => copyToClipboard(lead.phone, `phone_${lead.id}`)}
                                title="Copy Phone"
                                className="text-slate-400 hover:text-indigo-600 p-0.5"
                              >
                                {copiedId === `phone_${lead.id}` ? (
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                            <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{maskEmail(lead.email)}</span>
                          </div>
                          <button
                            onClick={() => onRevealContact(lead.id)}
                            className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-200 rounded transition-all active:scale-95"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Reveal Direct Info</span>
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Fit Score */}
                    <td className="px-4 py-3">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between font-mono text-[11px]">
                          <span className="font-bold text-slate-900">{lead.leadScore}</span>
                          <span className="text-[10px] text-slate-400">/ 100</span>
                        </div>
                        <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              lead.leadScore >= 90
                                ? 'bg-indigo-600'
                                : lead.leadScore >= 75
                                ? 'bg-indigo-500'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${lead.leadScore}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Email Deliverability Status */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        <ShieldCheck className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                    </td>

                    {/* CRM Stage */}
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium border ${stageColor}`}>
                        {getStageLabel(lead.leadStatus)}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {/* Quick AI Outreach */}
                        <button
                          onClick={() => onOpenOutreachModal(lead)}
                          title="Generate AI Outreach Email"
                          className="p-1.5 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg border border-purple-200 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                        </button>

                        {/* View 360 Detail */}
                        <button
                          onClick={() => onViewLeadDetail(lead)}
                          title="View Full Profile & Notes"
                          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Single Lead */}
                        <button
                          onClick={() => onDeleteLead(lead.id)}
                          title="Delete Prospect"
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-800">{Math.min(leads.length, (currentPage - 1) * itemsPerPage + 1)}</span> to{' '}
          <span className="font-semibold text-slate-800">{Math.min(leads.length, currentPage * itemsPerPage)}</span> of{' '}
          <span className="font-semibold text-slate-800 font-mono">{leads.length}</span> prospects
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono text-slate-700">
            {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-xs"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
