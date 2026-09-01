import React, { useState } from 'react';
import { 
  Globe, 
  Search, 
  Terminal, 
  Sparkles, 
  X, 
  Layers, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight, 
  Database,
  SlidersHorizontal,
  Link as LinkIcon,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { INDUSTRIES_LIST, SENIORITY_LIST } from '../utils.js';
import { Lead } from '../types.js';

interface ScraperConsoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScrapeSuccess: (leads: Lead[]) => void;
}

export const ScraperConsoleModal: React.FC<ScraperConsoleModalProps> = ({
  isOpen,
  onClose,
  onScrapeSuccess,
}) => {
  const [activeMode, setActiveMode] = useState<'search' | 'url'>('search');

  // Search scraper form
  const [query, setQuery] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('Software & SaaS');
  const [location, setLocation] = useState('San Francisco, CA, USA');
  const [selectedSeniority, setSelectedSeniority] = useState<string[]>(['Founder / C-Level', 'VP / Head of']);
  const [count, setCount] = useState(6);
  const [techStack, setTechStack] = useState('AWS, React, Stripe');

  // URL Scraper form
  const [targetUrl, setTargetUrl] = useState('https://stripe.com');

  // Running State
  const [isLoading, setIsLoading] = useState(false);
  const [logs, setLogs] = useState<Array<{ id: string; time: string; msg: string; type: 'info' | 'success' | 'warn' }>>([]);
  const [extractedResults, setExtractedResults] = useState<Lead[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleSeniorityOption = (sen: string) => {
    if (selectedSeniority.includes(sen)) {
      setSelectedSeniority(selectedSeniority.filter(s => s !== sen));
    } else {
      setSelectedSeniority([...selectedSeniority, sen]);
    }
  };

  const runSearchScraper = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    setExtractedResults([]);
    const now = () => new Date().toLocaleTimeString();

    setLogs([
      { id: '1', time: now(), msg: `Connecting to autonomous B2B Lead Generator node...`, type: 'info' },
      { id: '2', time: now(), msg: `Query: "${query || selectedIndustry}" | Target: ${selectedSeniority.join(', ')}`, type: 'info' },
      { id: '3', time: now(), msg: `Querying Google Search Grounded intelligence and live company directories...`, type: 'info' },
    ]);

    try {
      const res = await fetch('/api/scrape/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: query || undefined,
          industry: selectedIndustry,
          location,
          seniority: selectedSeniority,
          techStack,
          count,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Scraping failed');
      }

      setLogs(prev => [
        ...prev,
        { id: '4', time: now(), msg: `Crawling completed. Extracted ${data.extractedCount} verified prospects!`, type: 'success' },
        { id: '5', time: now(), msg: `Performing DNS/MX syntax validation on generated corporate emails...`, type: 'info' },
        { id: '6', time: now(), msg: `Synchronized with Master Lead Database.`, type: 'success' },
      ]);

      setExtractedResults(data.leads || []);
      onScrapeSuccess(data.leads || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'Scraper encountered an error');
      setLogs(prev => [
        ...prev,
        { id: 'err', time: now(), msg: `Error: ${err.message}`, type: 'warn' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const runUrlScraper = async () => {
    if (!targetUrl) return;
    setIsLoading(true);
    setErrorMsg(null);
    setExtractedResults([]);
    const now = () => new Date().toLocaleTimeString();

    setLogs([
      { id: 'u1', time: now(), msg: `Initiating deep URL spider on ${targetUrl}...`, type: 'info' },
      { id: 'u2', time: now(), msg: `Inspecting domain SSL, DNS records, and executive team biometrics...`, type: 'info' },
      { id: 'u3', time: now(), msg: `Parsing tech stack, employee count, and corporate email structures...`, type: 'info' },
    ]);

    try {
      const res = await fetch('/api/scrape/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'URL scraping failed');
      }

      setLogs(prev => [
        ...prev,
        { id: 'u4', time: now(), msg: `Identified Company: ${data.company?.name} (${data.company?.employeeCount} employees)`, type: 'success' },
        { id: 'u5', time: now(), msg: `Scraped ${data.leads?.length || 0} executive contacts with corporate email verification.`, type: 'success' },
      ]);

      setExtractedResults(data.leads || []);
      onScrapeSuccess(data.leads || []);
    } catch (err: any) {
      setErrorMsg(err.message || 'URL scraper failed');
      setLogs(prev => [
        ...prev,
        { id: 'err_u', time: now(), msg: `Error: ${err.message}`, type: 'warn' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">
                  Autonomous B2B Lead Generator & Web Scraper
                </h2>
                <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  LeadsPilot Live
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Extract high-intent decision makers, verified corporate emails, and company tech stacks
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

        {/* Mode Selector Tabs */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-3">
          <button
            onClick={() => setActiveMode('search')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeMode === 'search'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>Search & Industry Lead Generator</span>
          </button>
          <button
            onClick={() => setActiveMode('url')}
            className={`flex items-center gap-2 pb-3 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeMode === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <LinkIcon className="w-4 h-4" />
            <span>Company Website / URL Extractor</span>
          </button>
        </div>

        {/* Body (Form + Terminal Output) */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left: Input Form Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {activeMode === 'search' ? (
              <>
                {/* Keyword / Role Query */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Search Keyword / Target Titles
                  </label>
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="e.g. Chief Technology Officer, VP Sales, Cloud Migration"
                    className="w-full px-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                {/* Industry Selector */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Industry
                    </label>
                    <select
                      value={selectedIndustry}
                      onChange={(e) => setSelectedIndustry(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      {INDUSTRIES_LIST.map((ind) => (
                        <option key={ind} value={ind}>
                          {ind}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Location / Region
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g. San Francisco, CA or London, UK"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                {/* Seniority Badges */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Target Seniority Levels
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {SENIORITY_LIST.map((sen) => {
                      const isSelected = selectedSeniority.includes(sen);
                      return (
                        <button
                          key={sen}
                          type="button"
                          onClick={() => toggleSeniorityOption(sen)}
                          className={`px-2.5 py-1 text-[11px] font-medium rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-indigo-50 text-indigo-700 border-indigo-300 font-semibold'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {sen}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tech Stack & Count */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tech Stack Keywords
                    </label>
                    <input
                      type="text"
                      value={techStack}
                      onChange={(e) => setTechStack(e.target.value)}
                      placeholder="e.g. AWS, Kubernetes, Salesforce, React"
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Extract Count
                    </label>
                    <select
                      value={count}
                      onChange={(e) => setCount(Number(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    >
                      <option value={4}>4 Leads</option>
                      <option value={6}>6 Leads</option>
                      <option value={10}>10 Leads</option>
                      <option value={15}>15 Leads</option>
                    </select>
                  </div>
                </div>

                {/* Submit Action */}
                <button
                  type="button"
                  onClick={runSearchScraper}
                  disabled={isLoading || selectedSeniority.length === 0}
                  className="w-full mt-2 py-3 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Crawling Web Intelligence & Extracting...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-white" />
                      <span>Execute Live Prospect Scraper</span>
                    </>
                  )}
                </button>
              </>
            ) : (
              <>
                {/* URL Scraper Mode */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Target Company Domain or Website URL
                    </label>
                    <div className="relative">
                      <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="url"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="https://company.com"
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                      />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Examples: <button type="button" onClick={() => setTargetUrl('https://stripe.com')} className="text-indigo-600 hover:underline">stripe.com</button>, <button type="button" onClick={() => setTargetUrl('https://linear.app')} className="text-indigo-600 hover:underline">linear.app</button>, <button type="button" onClick={() => setTargetUrl('https://notion.so')} className="text-indigo-600 hover:underline">notion.so</button>, <button type="button" onClick={() => setTargetUrl('https://snowflake.com')} className="text-indigo-600 hover:underline">snowflake.com</button>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2 text-slate-800 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>What will be extracted:</span>
                    </div>
                    <ul className="list-disc list-inside space-y-1 text-[11px]">
                      <li>Leadership & Executive team profiles (CEO, CTO, VP Sales)</li>
                      <li>Domain email syntax pattern (e.g. &#123;first&#125;.&#123;last&#125;@domain.com)</li>
                      <li>Headcount tier, Annual Revenue bracket, and Technology stack</li>
                      <li>Direct phone line and verified corporate emails</li>
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={runUrlScraper}
                    disabled={isLoading || !targetUrl}
                    className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-white bg-indigo-600 hover:bg-indigo-700 shadow-xs disabled:opacity-50 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                        <span>Scraping Company Org Chart & Biometrics...</span>
                      </>
                    ) : (
                      <>
                        <Globe className="w-4 h-4 text-white" />
                        <span>Extract Leads from Website</span>
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Right: Live Terminal & Results Stream (5 cols) */}
          <div className="lg:col-span-5 flex flex-col rounded-xl bg-slate-900 border border-slate-800 overflow-hidden font-mono text-xs shadow-inner text-slate-100">
            {/* Terminal Header */}
            <div className="px-3.5 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="font-semibold text-slate-300">crawler.stdout</span>
              </div>
              {isLoading && (
                <span className="text-[10px] text-indigo-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-ping" />
                  LIVE
                </span>
              )}
            </div>

            {/* Terminal Console Logs */}
            <div className="p-3.5 space-y-2 flex-1 overflow-y-auto max-h-72 text-[11px] leading-relaxed">
              {logs.length === 0 ? (
                <div className="text-slate-500 h-full flex flex-col items-center justify-center py-12 text-center">
                  <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
                  <p>Crawler standby. Set criteria and click Execute.</p>
                </div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-2">
                    <span className="text-slate-500 shrink-0">[{log.time}]</span>
                    <span
                      className={
                        log.type === 'success'
                          ? 'text-emerald-400'
                          : log.type === 'warn'
                          ? 'text-rose-400'
                          : 'text-slate-300'
                      }
                    >
                      {log.type === 'success' && '✓ '}
                      {log.msg}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Live Extracted Preview Count */}
            {extractedResults.length > 0 && (
              <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
                  {extractedResults.length} Prospects Saved to CRM
                </span>
                <button
                  onClick={onClose}
                  className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors"
                >
                  View in Table
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
