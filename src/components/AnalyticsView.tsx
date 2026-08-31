import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Mail, 
  DollarSign, 
  Flame, 
  Briefcase, 
  CheckCircle2,
  PieChart
} from 'lucide-react';
import { Lead } from '../types.js';

interface AnalyticsViewProps {
  leads: Lead[];
  totalCompaniesCount: number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads,
  totalCompaniesCount,
}) => {
  const totalLeads = leads.length;
  const verifiedLeads = leads.filter(l => l.emailStatus === 'verified').length;
  const highIntentLeads = leads.filter(l => l.intentScore === 'High').length;
  const inPipelineLeads = leads.filter(l => l.leadStatus !== 'new').length;
  const closedWonLeads = leads.filter(l => l.leadStatus === 'closed_won').length;

  const avgFitScore = totalLeads > 0 
    ? Math.round(leads.reduce((a, b) => a + b.leadScore, 0) / totalLeads) 
    : 0;

  // Group by Industry
  const industryCounts: Record<string, number> = {};
  leads.forEach(l => {
    industryCounts[l.industry] = (industryCounts[l.industry] || 0) + 1;
  });

  const sortedIndustries = Object.entries(industryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6);

  // Group by Pipeline Stage
  const stageCounts = {
    new: leads.filter(l => l.leadStatus === 'new').length,
    contacted: leads.filter(l => l.leadStatus === 'contacted').length,
    meeting_scheduled: leads.filter(l => l.leadStatus === 'meeting_scheduled').length,
    qualified: leads.filter(l => l.leadStatus === 'qualified').length,
    in_negotiation: leads.filter(l => l.leadStatus === 'in_negotiation').length,
    closed_won: leads.filter(l => l.leadStatus === 'closed_won').length,
  };

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pb-8">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-600" />
            <span>Lead Generation Pipeline & Intelligence Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Conversion funnel, industry penetration, email deliverability metrics, and buying intent distribution
          </p>
        </div>
      </div>

      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Leads */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Enriched Prospects</span>
            <Users className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-slate-900">{totalLeads}</span>
            <span className="text-xs text-indigo-600 font-semibold">{totalCompaniesCount} Accounts</span>
          </div>
        </div>

        {/* Email Deliverability */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Verified 99% Deliverable</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-emerald-600">{verifiedLeads}</span>
            <span className="text-xs text-slate-500 font-mono">
              {totalLeads > 0 ? Math.round((verifiedLeads / totalLeads) * 100) : 0}% rate
            </span>
          </div>
        </div>

        {/* High Buying Intent */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>High Buying Intent</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-rose-600">{highIntentLeads}</span>
            <span className="text-xs text-slate-500 font-mono">Hot Signals</span>
          </div>
        </div>

        {/* Average Fit Score */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Average ICP Fit Score</span>
            <TrendingUp className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-bold font-mono text-amber-600">{avgFitScore} / 100</span>
            <span className="text-xs text-emerald-600 font-semibold">{closedWonLeads} Closed Won</span>
          </div>
        </div>
      </div>

      {/* Main Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Industry Penetration (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Prospect Distribution by Industry</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Top Verticals</span>
          </div>

          <div className="space-y-3">
            {sortedIndustries.map(([ind, count]) => {
              const pct = totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0;

              return (
                <div key={ind} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-slate-700">{ind}</span>
                    <span className="font-mono text-indigo-600 font-semibold">{count} ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* LeadsPilot CRM Funnel Velocity (6 cols) */}
        <div className="lg:col-span-6 bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-xs flex items-center gap-2">
              <PieChart className="w-4 h-4 text-purple-600" />
              <span>LeadsPilot CRM Opportunity Conversion Funnel</span>
            </h3>
            <span className="text-[11px] text-slate-400 font-mono">Pipeline Velocity</span>
          </div>

          <div className="space-y-2.5">
            {[
              { label: '1. Scraped / New Leads', count: stageCounts.new, color: 'bg-slate-400' },
              { label: '2. Contacted via AI Sequences', count: stageCounts.contacted, color: 'bg-sky-500' },
              { label: '3. Meeting Booked', count: stageCounts.meeting_scheduled, color: 'bg-purple-500' },
              { label: '4. Sales Qualified Opportunity', count: stageCounts.qualified, color: 'bg-indigo-500' },
              { label: '5. In Contract Negotiation', count: stageCounts.in_negotiation, color: 'bg-amber-500' },
              { label: '6. Closed Won Customer', count: stageCounts.closed_won, color: 'bg-emerald-500' },
            ].map((st) => (
              <div key={st.label} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${st.color}`} />
                  <span className="text-slate-700 font-medium">{st.label}</span>
                </div>
                <span className="font-mono font-bold text-slate-900">{st.count} prospects</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
