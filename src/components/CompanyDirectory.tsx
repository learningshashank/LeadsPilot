import React, { useState } from 'react';
import { 
  Building2, 
  Globe, 
  Users, 
  DollarSign, 
  MapPin, 
  ExternalLink, 
  Search, 
  Layers, 
  Briefcase, 
  UserCheck, 
  Flame,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Company, Lead } from '../types.js';

interface CompanyDirectoryProps {
  companies: Company[];
  leads: Lead[];
  onViewLeadDetail: (lead: Lead) => void;
  onScrapeDomain: (domain: string) => void;
}

export const CompanyDirectory: React.FC<CompanyDirectoryProps> = ({
  companies,
  leads,
  onViewLeadDetail,
  onScrapeDomain,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredCompanies = companies.filter(comp => {
    const matchesSearch = 
      comp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comp.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comp.technologies && comp.technologies.some(t => t.toLowerCase().includes(searchTerm.toLowerCase())));
    const matchesIndustry = selectedIndustry === 'All' || comp.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = ['All', ...Array.from(new Set(companies.map(c => c.industry)))];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <span>Target Account Intelligence Directory</span>
          </h2>
          <p className="text-xs text-slate-500">
            Account-level firmographics, technology stacks, and grouped decision-makers
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* Industry filter */}
          <select
            value={selectedIndustry}
            onChange={(e) => setSelectedIndustry(e.target.value)}
            className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
          >
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search companies or tech..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
            />
          </div>
        </div>
      </div>

      {/* Grid of Company Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto flex-1 pb-6">
        {filteredCompanies.map((comp) => {
          const compLeads = leads.filter(
            l => l.company.toLowerCase() === comp.name.toLowerCase() || (l.companyDomain && l.companyDomain.toLowerCase() === comp.domain.toLowerCase())
          );

          return (
            <div
              key={comp.id}
              className="bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-md rounded-xl p-4 flex flex-col justify-between transition-all space-y-4 shadow-xs"
            >
              {/* Top info */}
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-700 text-sm overflow-hidden shadow-xs">
                      {comp.logoUrl ? (
                        <img src={comp.logoUrl} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      ) : (
                        comp.name.slice(0, 2).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{comp.name}</h3>
                      <a
                        href={`https://${comp.domain}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-mono"
                      >
                        {comp.domain} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <button
                    onClick={() => onScrapeDomain(`https://${comp.domain}`)}
                    title="Scrape more leads from this company"
                    className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border border-indigo-200 transition-colors shadow-xs"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Firmographics Matrix */}
                <div className="grid grid-cols-2 gap-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Industry</span>
                    <span className="font-semibold text-slate-800 truncate block">{comp.industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Headcount</span>
                    <span className="font-semibold text-slate-800">{comp.employeeCount} employees</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Headquarters</span>
                    <span className="font-semibold text-slate-800">{comp.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Revenue</span>
                    <span className="font-semibold text-emerald-600">{comp.annualRevenue || '$10M - $50M'}</span>
                  </div>
                </div>

                {/* Detected Tech Stack */}
                {comp.technologies && comp.technologies.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">Tech Stack</span>
                    <div className="flex flex-wrap gap-1">
                      {comp.technologies.map(tech => (
                        <span key={tech} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Grouped Decision Makers */}
              <div className="pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Discovered Contacts ({compLeads.length})</span>
                  </span>
                </div>

                {compLeads.length > 0 ? (
                  <div className="space-y-1.5">
                    {compLeads.slice(0, 3).map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => onViewLeadDetail(lead)}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-xs truncate">{lead.fullName}</p>
                          <p className="text-[10px] text-slate-500 truncate">{lead.title}</p>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-indigo-600">
                          {lead.leadScore} pts
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-400 italic py-1">
                    No leads scraped yet for this company. Click the sparkle button to crawl!
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
