import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Building2, 
  Linkedin, 
  Globe, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Copy, 
  Send, 
  Flame, 
  Edit3, 
  Save, 
  TrendingUp, 
  Calendar,
  Layers,
  Award,
  Loader2,
  FileText
} from 'lucide-react';
import { Lead, LeadPipelineStage } from '../types.js';
import { getVerificationBadgeStyle, getIntentBadgeStyle, getStageColor, getStageLabel, formatDate } from '../utils.js';

interface LeadDetailModalProps {
  lead: Lead | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateLead: (id: string, updates: Partial<Lead>) => void;
}

export const LeadDetailModal: React.FC<LeadDetailModalProps> = ({
  lead,
  isOpen,
  onClose,
  onUpdateLead,
}) => {
  if (!isOpen || !lead) return null;

  const [activeTab, setActiveTab] = useState<'profile' | 'ai_outreach' | 'notes'>('profile');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  
  // Editable fields
  const [notes, setNotes] = useState(lead.notes || '');
  const [stage, setStage] = useState<LeadPipelineStage>(lead.leadStatus);
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // AI Outreach Generator State
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [outreachTone, setOutreachTone] = useState('concise, value-focused, and consultative');
  const [aiData, setAiData] = useState<{
    subjectLines: string[];
    icebreaker: string;
    emailBody: string;
    followUpBody: string;
    callScript: string;
  } | null>(null);

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveNotesAndStage = async () => {
    setIsSavingNotes(true);
    await onUpdateLead(lead.id, {
      notes,
      leadStatus: stage,
    });
    setIsSavingNotes(false);
  };

  const generateAiOutreach = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/ai/generate-sequence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ leadId: lead.id, lead, tone: outreachTone }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiData(data.data);
      }
    } catch (err) {
      console.error('AI outreach generation failed:', err);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const badge = getVerificationBadgeStyle(lead.emailStatus);
  const intentStyle = getIntentBadgeStyle(lead.intentScore);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-base shadow-xs">
              {lead.firstName.charAt(0)}{lead.lastName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{lead.fullName}</h2>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}>
                  {badge.label}
                </span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${intentStyle.bg} ${intentStyle.text} ${intentStyle.border}`}>
                  {lead.intentScore} Intent
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {lead.title} at <strong className="text-slate-800">{lead.company}</strong> ({lead.industry})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Prospect 360 & Intel</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('ai_outreach');
              if (!aiData) generateAiOutreach();
            }}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'ai_outreach'
                ? 'border-purple-600 text-purple-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-600" />
            <span>AI Outreach Sequences</span>
          </button>

          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-2 pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'notes'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>CRM Notes & Stage</span>
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs text-slate-700">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Top Contact Matrix Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Work Email */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-600" /> Verified Work Email
                    </span>
                    <button
                      onClick={() => copyText(lead.email, 'email')}
                      className="text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                    >
                      {copiedKey === 'email' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs select-all truncate">{lead.email}</p>
                </div>

                {/* Corporate Phone */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 font-mono">
                  <div className="flex items-center justify-between text-slate-500 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-600" /> Direct Phone Number
                    </span>
                    <button
                      onClick={() => copyText(lead.phone, 'phone')}
                      className="text-slate-400 hover:text-indigo-600 flex items-center gap-1"
                    >
                      {copiedKey === 'phone' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                  <p className="font-semibold text-slate-900 text-xs select-all truncate">{lead.phone || 'N/A'}</p>
                </div>
              </div>

              {/* Company & Profile Details */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="font-semibold text-slate-900 text-xs flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-indigo-600" /> Company Intelligence
                </h4>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Company Name</span>
                    <span className="font-semibold text-slate-800">{lead.company}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Domain</span>
                    <a
                      href={`https://${lead.companyDomain}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:underline flex items-center gap-1"
                    >
                      {lead.companyDomain} <Globe className="w-3 h-3" />
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Headcount</span>
                    <span className="font-semibold text-slate-800">{lead.companySize} employees</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Annual Revenue</span>
                    <span className="font-semibold text-slate-800">{lead.annualRevenue || '$10M - $50M'}</span>
                  </div>
                </div>

                {/* Tech Stack */}
                {lead.techStack && lead.techStack.length > 0 && (
                  <div className="pt-2 border-t border-slate-200 space-y-1.5">
                    <span className="text-slate-600 font-medium block">Detected Technologies:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {lead.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[10px] font-mono shadow-2xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Lead Scoring Breakdown */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                    <Flame className="w-4 h-4 text-amber-500" /> Overall Fit & Engagement Score
                  </span>
                  <p className="text-[11px] text-slate-500">
                    Calculated from seniority authority, company revenue scale, tech stack alignment, and verified email.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-black font-mono text-indigo-600">{lead.leadScore}</span>
                  <span className="text-xs text-slate-400 font-mono"> / 100</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai_outreach' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-slate-900 text-xs">AI Cold Email & Icebreaker Generator</h4>
                  <p className="text-[11px] text-slate-500">Personalized sequence crafted specifically for {lead.fullName}</p>
                </div>
                <button
                  onClick={generateAiOutreach}
                  disabled={isGeneratingAi}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs transition-all shadow-xs disabled:opacity-50"
                >
                  {isGeneratingAi ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  <span>Regenerate Sequence</span>
                </button>
              </div>

              {isGeneratingAi ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-2 text-purple-600">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <p className="text-xs font-medium">Crafting hyper-personalized value proposition...</p>
                </div>
              ) : aiData ? (
                <div className="space-y-4 animate-in fade-in">
                  {/* Subject lines */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="text-slate-600 font-semibold text-[11px] block">Suggested Subject Lines:</span>
                    <div className="space-y-1">
                      {aiData.subjectLines.map((subj, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded bg-white border border-slate-200 text-slate-800 shadow-2xs">
                          <span className="font-medium">{subj}</span>
                          <button
                            onClick={() => copyText(subj, `subj_${i}`)}
                            className="text-slate-400 hover:text-indigo-600 p-1"
                          >
                            {copiedKey === `subj_${i}` ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Icebreaker */}
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 space-y-1.5">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-semibold text-purple-900">Personalized Opening Icebreaker</span>
                      <button
                        onClick={() => copyText(aiData.icebreaker, 'icebreaker')}
                        className="text-slate-400 hover:text-purple-700"
                      >
                        {copiedKey === 'icebreaker' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                    <p className="text-purple-950 italic">{aiData.icebreaker}</p>
                  </div>

                  {/* Cold Email Body */}
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-slate-500 text-[11px]">
                      <span className="font-semibold text-slate-800">Full Cold Outreach Draft (Step 1)</span>
                      <button
                        onClick={() => copyText(aiData.emailBody, 'emailBody')}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold"
                      >
                        {copiedKey === 'emailBody' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>Copy Email</span>
                      </button>
                    </div>
                    <pre className="whitespace-pre-wrap font-sans text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200 shadow-2xs">
                      {aiData.emailBody}
                    </pre>
                  </div>

                  {/* Cold Call Intro Script */}
                  {aiData.callScript && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="font-semibold text-emerald-700">30-Second Cold Call Script</span>
                        <button
                          onClick={() => copyText(aiData.callScript, 'callScript')}
                          className="text-slate-400 hover:text-emerald-700"
                        >
                          {copiedKey === 'callScript' ? <CheckCircle2 className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <p className="text-slate-800 font-mono text-[11px]">{aiData.callScript}</p>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}

          {activeTab === 'notes' && (
            <div className="space-y-4">
              {/* Pipeline Stage Updater */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  CRM Pipeline Stage
                </label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as LeadPipelineStage)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                >
                  <option value="new">New Lead</option>
                  <option value="contacted">Contacted</option>
                  <option value="meeting_scheduled">Meeting Scheduled</option>
                  <option value="qualified">Sales Qualified</option>
                  <option value="in_negotiation">In Negotiation</option>
                  <option value="closed_won">Closed Won</option>
                  <option value="closed_lost">Closed Lost</option>
                </select>
              </div>

              {/* Notes text area */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Prospect Notes & Interaction History
                </label>
                <textarea
                  rows={5}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about discovery call, qualification answers, or pricing discussions..."
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveNotesAndStage}
                disabled={isSavingNotes}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors shadow-xs disabled:opacity-50"
              >
                {isSavingNotes ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                <span>Save CRM Updates</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
