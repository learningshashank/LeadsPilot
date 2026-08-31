import React, { useState } from 'react';
import { 
  Terminal, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Globe, 
  Sparkles, 
  ChevronRight, 
  Search,
  Zap,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { ScrapeJob } from '../types.js';
import { formatDate } from '../utils.js';

interface ScraperJobsViewProps {
  jobs: ScrapeJob[];
  onOpenScraperModal: () => void;
  onRefreshJobs: () => void;
}

export const ScraperJobsView: React.FC<ScraperJobsViewProps> = ({
  jobs,
  onOpenScraperModal,
  onRefreshJobs,
}) => {
  const [selectedJobId, setSelectedJobId] = useState<string>(jobs[0]?.id || '');
  const selectedJob = jobs.find(j => j.id === selectedJobId) || jobs[0];

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-600" />
            <span>Autonomous Scraper Logs & Execution Console</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time crawler telemetry, domain extraction jobs, and verified prospect counts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRefreshJobs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
          <button
            onClick={onOpenScraperModal}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>New Scrape Task</span>
          </button>
        </div>
      </div>

      {/* Grid: Jobs on Left, Terminal on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-y-auto">
        {/* Left: Jobs List (5 cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 px-1">
            Execution History ({jobs.length})
          </div>

          <div className="space-y-2">
            {jobs.map((job) => {
              const isSelected = job.id === selectedJob?.id;

              return (
                <div
                  key={job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all space-y-2 shadow-xs ${
                    isSelected
                      ? 'bg-indigo-50/70 border-indigo-300 shadow-sm ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-xs truncate max-w-[200px]">
                      {job.target}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono ${
                        job.status === 'completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : job.status === 'scraping'
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 animate-pulse'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}
                    >
                      {job.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                    <span>Extracted: <strong className="text-indigo-600 font-bold">{job.totalFound}</strong> prospects</span>
                    <span>{formatDate(job.createdAt)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Active Job Terminal Logs (7 cols) */}
        {selectedJob ? (
          <div className="lg:col-span-7 flex flex-col bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden font-mono text-xs shadow-md text-slate-100">
            {/* Terminal Header */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-semibold text-slate-300 text-xs">
                  crawler_task::{selectedJob.id}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                Found: {selectedJob.totalFound} contacts
              </span>
            </div>

            {/* Terminal Body */}
            <div className="p-4 space-y-2.5 flex-1 overflow-y-auto max-h-[500px] text-[11px] leading-relaxed">
              <div className="text-slate-500 pb-2 border-b border-slate-800/80">
                [SYSTEM] Initialized web crawler spider session on target: &quot;{selectedJob.target}&quot;
              </div>

              {selectedJob.logs.map((log) => (
                <div key={log.id} className="flex items-start gap-2">
                  <span className="text-slate-500 shrink-0">[{log.time}]</span>
                  <span
                    className={
                      log.type === 'success'
                        ? 'text-emerald-400 font-semibold'
                        : log.type === 'warn'
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }
                  >
                    {log.type === 'success' && '✓ '}
                    {log.message}
                  </span>
                </div>
              ))}
            </div>

            {/* Extracted Leads Quick Table */}
            {selectedJob.extractedLeads && selectedJob.extractedLeads.length > 0 && (
              <div className="p-4 bg-slate-950 border-t border-slate-800 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Scraped Prospects Snapshot
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto">
                  {selectedJob.extractedLeads.map((l) => (
                    <div key={l.id} className="flex items-center justify-between p-2 rounded bg-slate-900 border border-slate-800 text-xs">
                      <div>
                        <span className="font-semibold text-slate-200">{l.fullName}</span>
                        <span className="text-slate-400 text-[11px] ml-2">({l.title} @ {l.company})</span>
                      </div>
                      <span className="font-mono text-indigo-400 text-[11px]">{l.email}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};
