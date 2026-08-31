import { Lead, Company, LeadList, CampaignSequence, ScrapeJob, DashboardStats, LeadPipelineStage, EmailVerificationStatus, BuyingIntentScore, LeadSource } from '../src/types.js';
import { INITIAL_LEADS, INITIAL_COMPANIES, INITIAL_LISTS, INITIAL_CAMPAIGNS } from './data.js';

class InMemoryLeadDatabase {
  private leads: Lead[] = [...INITIAL_LEADS];
  private companies: Company[] = [...INITIAL_COMPANIES];
  private lists: LeadList[] = [...INITIAL_LISTS];
  private campaigns: CampaignSequence[] = [...INITIAL_CAMPAIGNS];
  private scrapeJobs: ScrapeJob[] = [
    {
      id: 'job_init_1',
      type: 'keyword_industry_search',
      target: 'Software & SaaS Decision Makers (CTO, VP Eng)',
      industryFilter: 'Software & SaaS',
      locationFilter: 'San Francisco, CA',
      seniorityFilter: ['Founder / C-Level', 'VP / Head of'],
      status: 'completed',
      totalFound: 4,
      logs: [
        { id: 'log_1', time: '10:30:00', message: 'Initializing distributed headless crawler node #1...', type: 'info' },
        { id: 'log_2', time: '10:30:01', message: 'Parsing company directories, crunchbase signals, and LinkedIn patterns', type: 'info' },
        { id: 'log_3', time: '10:30:03', message: 'Extracted 4 decision-makers with corporate email patterns', type: 'success' },
        { id: 'log_4', time: '10:30:04', message: 'DNS & SMTP handshake verification passed (100% deliverability)', type: 'success' },
      ],
      extractedLeads: [...INITIAL_LEADS.slice(0, 4)],
      createdAt: '2026-08-30T10:30:00Z',
      completedAt: '2026-08-30T10:30:05Z',
    }
  ];

  // LEADS
  public getAllLeads(query?: {
    search?: string;
    industry?: string;
    seniority?: string;
    companySize?: string;
    emailStatus?: string;
    leadStatus?: string;
    intentScore?: string;
    source?: string;
    listId?: string;
    minScore?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  }): Lead[] {
    let result = [...this.leads];

    if (query) {
      if (query.search) {
        const s = query.search.toLowerCase();
        result = result.filter(l => 
          l.fullName.toLowerCase().includes(s) ||
          l.company.toLowerCase().includes(s) ||
          l.email.toLowerCase().includes(s) ||
          l.title.toLowerCase().includes(s) ||
          l.location.toLowerCase().includes(s) ||
          l.industry.toLowerCase().includes(s) ||
          (l.techStack && l.techStack.some(t => t.toLowerCase().includes(s)))
        );
      }

      if (query.industry && query.industry !== 'All') {
        const indArr = query.industry.split(',').map(i => i.trim().toLowerCase());
        result = result.filter(l => indArr.includes(l.industry.toLowerCase()));
      }

      if (query.seniority && query.seniority !== 'All') {
        const senArr = query.seniority.split(',').map(s => s.trim().toLowerCase());
        result = result.filter(l => senArr.includes(l.seniority.toLowerCase()));
      }

      if (query.companySize && query.companySize !== 'All') {
        const sizes = query.companySize.split(',').map(s => s.trim());
        result = result.filter(l => sizes.includes(l.companySize));
      }

      if (query.emailStatus && query.emailStatus !== 'All') {
        const statuses = query.emailStatus.split(',').map(s => s.trim().toLowerCase());
        result = result.filter(l => statuses.includes(l.emailStatus.toLowerCase()));
      }

      if (query.leadStatus && query.leadStatus !== 'All') {
        const stages = query.leadStatus.split(',').map(s => s.trim().toLowerCase());
        result = result.filter(l => stages.includes(l.leadStatus.toLowerCase()));
      }

      if (query.intentScore && query.intentScore !== 'All') {
        const intents = query.intentScore.split(',').map(s => s.trim().toLowerCase());
        result = result.filter(l => intents.includes(l.intentScore.toLowerCase()));
      }

      if (query.source && query.source !== 'All') {
        const sources = query.source.split(',').map(s => s.trim().toLowerCase());
        result = result.filter(l => sources.includes(l.source.toLowerCase()));
      }

      if (query.listId) {
        const list = this.lists.find(li => li.id === query.listId);
        if (list) {
          result = result.filter(l => list.leadIds.includes(l.id));
        }
      }

      if (query.minScore !== undefined && !isNaN(Number(query.minScore))) {
        result = result.filter(l => l.leadScore >= Number(query.minScore));
      }

      if (query.sortBy) {
        const order = query.sortOrder === 'asc' ? 1 : -1;
        result.sort((a, b) => {
          if (query.sortBy === 'leadScore') {
            return (a.leadScore - b.leadScore) * order;
          }
          if (query.sortBy === 'name') {
            return a.fullName.localeCompare(b.fullName) * order;
          }
          if (query.sortBy === 'company') {
            return a.company.localeCompare(b.company) * order;
          }
          if (query.sortBy === 'createdAt') {
            return (new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()) * order;
          }
          return 0;
        });
      } else {
        // Default sort by created at desc
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      }
    }

    return result;
  }

  public getLeadById(id: string): Lead | undefined {
    return this.leads.find(l => l.id === id);
  }

  public createLead(leadData: Partial<Lead>): Lead {
    const now = new Date().toISOString();
    const id = leadData.id || `lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fName = leadData.firstName || 'Unknown';
    const lName = leadData.lastName || 'Lead';
    
    const newLead: Lead = {
      id,
      firstName: fName,
      lastName: lName,
      fullName: leadData.fullName || `${fName} ${lName}`,
      email: leadData.email || `lead@${leadData.companyDomain || 'example.com'}`,
      personalEmail: leadData.personalEmail,
      phone: leadData.phone || '+1 (555) 000-0000',
      title: leadData.title || 'Decision Maker',
      seniority: leadData.seniority || 'Director',
      department: leadData.department || 'Operations',
      company: leadData.company || 'Enterprise Corp',
      companyDomain: leadData.companyDomain || 'enterprise.com',
      companyLogo: leadData.companyLogo,
      companySize: leadData.companySize || '51-200',
      annualRevenue: leadData.annualRevenue || '$10M - $25M',
      industry: leadData.industry || 'Software & SaaS',
      subIndustry: leadData.subIndustry,
      location: leadData.location || 'United States',
      city: leadData.city,
      state: leadData.state,
      country: leadData.country || 'United States',
      linkedin: leadData.linkedin || `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}`,
      twitter: leadData.twitter,
      website: leadData.website || `https://${leadData.companyDomain || 'example.com'}`,
      leadScore: leadData.leadScore !== undefined ? leadData.leadScore : 80,
      emailStatus: leadData.emailStatus || 'verified',
      leadStatus: leadData.leadStatus || 'new',
      source: leadData.source || 'manual_entry',
      tags: leadData.tags || ['Direct Input'],
      notes: leadData.notes || '',
      techStack: leadData.techStack || ['Modern Stack'],
      intentScore: leadData.intentScore || 'Medium',
      revealed: leadData.revealed !== undefined ? leadData.revealed : true,
      createdAt: leadData.createdAt || now,
      lastContactedAt: leadData.lastContactedAt,
      listIds: leadData.listIds || [],
    };

    this.leads.unshift(newLead);
    this.syncCompanyForLead(newLead);
    return newLead;
  }

  public addLeadsBulk(leadsToAdd: Lead[]): Lead[] {
    for (const lead of leadsToAdd) {
      // Avoid duplicate emails
      const existingIdx = this.leads.findIndex(l => l.email.toLowerCase() === lead.email.toLowerCase());
      if (existingIdx >= 0) {
        this.leads[existingIdx] = { ...this.leads[existingIdx], ...lead };
      } else {
        this.leads.unshift(lead);
        this.syncCompanyForLead(lead);
      }
    }
    return leadsToAdd;
  }

  public updateLead(id: string, updates: Partial<Lead>): Lead | null {
    const idx = this.leads.findIndex(l => l.id === id);
    if (idx === -1) return null;

    if (updates.firstName || updates.lastName) {
      const fName = updates.firstName ?? this.leads[idx].firstName;
      const lName = updates.lastName ?? this.leads[idx].lastName;
      updates.fullName = `${fName} ${lName}`;
    }

    this.leads[idx] = {
      ...this.leads[idx],
      ...updates,
    };
    return this.leads[idx];
  }

  public deleteLead(id: string): boolean {
    const initialLen = this.leads.length;
    this.leads = this.leads.filter(l => l.id !== id);
    // Remove from lists
    this.lists.forEach(list => {
      list.leadIds = list.leadIds.filter(lid => lid !== id);
    });
    return this.leads.length < initialLen;
  }

  public bulkDelete(ids: string[]): number {
    const idSet = new Set(ids);
    const initialLen = this.leads.length;
    this.leads = this.leads.filter(l => !idSet.has(l.id));
    this.lists.forEach(list => {
      list.leadIds = list.leadIds.filter(lid => !idSet.has(lid));
    });
    return initialLen - this.leads.length;
  }

  public bulkUpdateStatus(ids: string[], status: LeadPipelineStage): number {
    const idSet = new Set(ids);
    let count = 0;
    this.leads.forEach(l => {
      if (idSet.has(l.id)) {
        l.leadStatus = status;
        count++;
      }
    });
    return count;
  }

  public bulkVerify(ids: string[]): number {
    const idSet = new Set(ids);
    let count = 0;
    this.leads.forEach(l => {
      if (idSet.has(l.id)) {
        l.emailStatus = 'verified';
        l.leadScore = Math.min(99, l.leadScore + 5);
        count++;
      }
    });
    return count;
  }

  // COMPANIES
  public getAllCompanies(): Company[] {
    // Dynamically update lead counts
    return this.companies.map(c => {
      const leadsForComp = this.leads.filter(l => l.companyDomain.toLowerCase() === c.domain.toLowerCase() || l.company.toLowerCase() === c.name.toLowerCase());
      return {
        ...c,
        leadsCount: Math.max(c.leadsCount, leadsForComp.length),
      };
    });
  }

  public getCompanyById(id: string): { company: Company; leads: Lead[] } | null {
    const comp = this.companies.find(c => c.id === id);
    if (!comp) return null;
    const leads = this.leads.filter(l => l.companyDomain.toLowerCase() === comp.domain.toLowerCase() || l.company.toLowerCase() === comp.name.toLowerCase());
    return { company: comp, leads };
  }

  public createOrUpdateCompany(comp: Company): Company {
    const idx = this.companies.findIndex(c => c.domain.toLowerCase() === comp.domain.toLowerCase());
    if (idx >= 0) {
      this.companies[idx] = { ...this.companies[idx], ...comp };
      return this.companies[idx];
    } else {
      this.companies.unshift(comp);
      return comp;
    }
  }

  private syncCompanyForLead(lead: Lead) {
    const existing = this.companies.find(c => c.domain.toLowerCase() === lead.companyDomain.toLowerCase());
    if (!existing) {
      this.companies.push({
        id: `comp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        name: lead.company,
        domain: lead.companyDomain,
        logo: lead.companyLogo,
        industry: lead.industry,
        subIndustry: lead.subIndustry,
        employeeCount: lead.companySize,
        revenueRange: lead.annualRevenue || '$10M - $50M',
        headquarters: lead.location,
        phone: lead.phone,
        techStack: lead.techStack,
        website: lead.website,
        linkedinUrl: `https://linkedin.com/company/${lead.companyDomain.split('.')[0]}`,
        description: `Verified enterprise organization in ${lead.industry}.`,
        intentScore: lead.intentScore,
        leadsCount: 1,
      });
    }
  }

  // LISTS
  public getAllLists(): LeadList[] {
    return this.lists.map(list => ({
      ...list,
      leadIds: list.leadIds.filter(id => this.leads.some(l => l.id === id)),
    }));
  }

  public createList(name: string, description: string, color = '#06b6d4', leadIds: string[] = []): LeadList {
    const newList: LeadList = {
      id: `list_${Date.now()}`,
      name,
      description,
      color,
      leadIds,
      createdAt: new Date().toISOString(),
    };
    this.lists.push(newList);
    return newList;
  }

  public deleteList(id: string): boolean {
    const initLen = this.lists.length;
    this.lists = this.lists.filter(l => l.id !== id);
    return this.lists.length < initLen;
  }

  public addLeadsToList(listId: string, leadIds: string[]): LeadList | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;
    const set = new Set([...list.leadIds, ...leadIds]);
    list.leadIds = Array.from(set);
    return list;
  }

  public removeLeadsFromList(listId: string, leadIds: string[]): LeadList | null {
    const list = this.lists.find(l => l.id === listId);
    if (!list) return null;
    const removeSet = new Set(leadIds);
    list.leadIds = list.leadIds.filter(id => !removeSet.has(id));
    return list;
  }

  // CAMPAIGNS
  public getAllCampaigns(): CampaignSequence[] {
    return this.campaigns;
  }

  public createCampaign(data: Partial<CampaignSequence>): CampaignSequence {
    const newCamp: CampaignSequence = {
      id: `camp_${Date.now()}`,
      name: data.name || 'New Outreach Campaign',
      status: data.status || 'draft',
      targetIndustry: data.targetIndustry || 'All Tech',
      enrolledLeadIds: data.enrolledLeadIds || [],
      steps: data.steps || [
        {
          stepNumber: 1,
          delayDays: 0,
          subject: 'Quick question for {{company}}',
          bodyTemplate: 'Hi {{firstName}},\n\nSaw your role leading {{department}} at {{company}}.\n\nBest,\nAlex',
          isAiPersonalized: true,
        }
      ],
      stats: {
        sent: 0,
        opened: 0,
        clicked: 0,
        replied: 0,
        bounced: 0,
      },
      createdAt: new Date().toISOString(),
    };
    this.campaigns.push(newCamp);
    return newCamp;
  }

  public updateCampaign(id: string, updates: Partial<CampaignSequence>): CampaignSequence | null {
    const idx = this.campaigns.findIndex(c => c.id === id);
    if (idx === -1) return null;
    this.campaigns[idx] = { ...this.campaigns[idx], ...updates };
    return this.campaigns[idx];
  }

  public deleteCampaign(id: string): boolean {
    const initLen = this.campaigns.length;
    this.campaigns = this.campaigns.filter(c => c.id !== id);
    return this.campaigns.length < initLen;
  }

  // SCRAPE JOBS
  public getAllScrapeJobs(): ScrapeJob[] {
    return this.scrapeJobs;
  }

  public addScrapeJob(job: ScrapeJob): ScrapeJob {
    this.scrapeJobs.unshift(job);
    return job;
  }

  public updateScrapeJob(id: string, updates: Partial<ScrapeJob>): ScrapeJob | null {
    const idx = this.scrapeJobs.findIndex(j => j.id === id);
    if (idx === -1) return null;
    this.scrapeJobs[idx] = { ...this.scrapeJobs[idx], ...updates };
    return this.scrapeJobs[idx];
  }

  // STATS
  public getDashboardStats(): DashboardStats {
    const totalLeads = this.leads.length;
    const verifiedEmails = this.leads.filter(l => l.emailStatus === 'verified').length;
    const activeAccounts = this.companies.length;
    const inPipeline = this.leads.filter(l => l.leadStatus !== 'new' && l.leadStatus !== 'closed_lost').length;
    const highIntentLeads = this.leads.filter(l => l.intentScore === 'High').length;
    const totalScore = this.leads.reduce((acc, curr) => acc + curr.leadScore, 0);
    const avgLeadScore = totalLeads > 0 ? Math.round(totalScore / totalLeads) : 0;

    // Industry breakdown
    const industryCounts: Record<string, number> = {};
    this.leads.forEach(l => {
      industryCounts[l.industry] = (industryCounts[l.industry] || 0) + 1;
    });

    const industryBreakdown = Object.entries(industryCounts).map(([industry, count]) => ({
      industry,
      count,
      percentage: totalLeads > 0 ? Math.round((count / totalLeads) * 100) : 0,
    })).sort((a, b) => b.count - a.count);

    // Stage breakdown
    const stageLabels: Record<LeadPipelineStage, string> = {
      new: 'New Leads',
      contacted: 'Contacted',
      meeting_scheduled: 'Meeting Scheduled',
      qualified: 'Sales Qualified',
      in_negotiation: 'In Negotiation',
      closed_won: 'Closed Won',
      closed_lost: 'Closed Lost',
      unresponsive: 'Unresponsive',
    };

    const stageOrder: LeadPipelineStage[] = [
      'new',
      'contacted',
      'meeting_scheduled',
      'qualified',
      'in_negotiation',
      'closed_won',
      'closed_lost',
    ];

    const stageBreakdown = stageOrder.map(stage => ({
      stage,
      label: stageLabels[stage],
      count: this.leads.filter(l => l.leadStatus === stage).length,
    }));

    // Seniority breakdown
    const seniorityCounts: Record<string, number> = {};
    this.leads.forEach(l => {
      seniorityCounts[l.seniority] = (seniorityCounts[l.seniority] || 0) + 1;
    });

    const seniorityBreakdown = Object.entries(seniorityCounts).map(([seniority, count]) => ({
      seniority,
      count,
    })).sort((a, b) => b.count - a.count);

    return {
      totalLeads,
      verifiedEmails,
      activeAccounts,
      inPipeline,
      highIntentLeads,
      avgLeadScore,
      industryBreakdown,
      stageBreakdown,
      seniorityBreakdown,
    };
  }
}

export const db = new InMemoryLeadDatabase();
