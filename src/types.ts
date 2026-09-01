export type SeniorityLevel = 'Founder / C-Level' | 'VP / Head of' | 'Director' | 'Manager' | 'Individual Contributor';

export type EmailVerificationStatus = 'verified' | 'guessed' | 'catch-all' | 'risky' | 'unverified';

export type LeadPipelineStage = 
  | 'new' 
  | 'contacted' 
  | 'meeting_scheduled' 
  | 'qualified' 
  | 'in_negotiation' 
  | 'closed_won' 
  | 'closed_lost' 
  | 'unresponsive';

export type LeadSource = 'web_scraper' | 'ai_discovery' | 'domain_extractor' | 'manual_entry' | 'csv_import';

export type BuyingIntentScore = 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  personalEmail?: string;
  phone: string;
  title: string;
  seniority: SeniorityLevel;
  department: string;
  company: string;
  companyDomain: string;
  companyLogo?: string;
  companySize: string; // e.g. "51-200", "1,001-5,000"
  annualRevenue?: string; // e.g. "$10M - $50M"
  industry: string;
  subIndustry?: string;
  location: string;
  city?: string;
  state?: string;
  country: string;
  linkedin: string;
  twitter?: string;
  website: string;
  leadScore: number; // 0 to 100
  emailStatus: EmailVerificationStatus;
  leadStatus: LeadPipelineStage;
  source: LeadSource;
  tags: string[];
  notes?: string;
  techStack: string[];
  intentScore: BuyingIntentScore;
  revealed: boolean;
  createdAt: string;
  lastContactedAt?: string;
  listIds?: string[];
  campaignId?: string;
  customFields?: Record<string, string>;
}

export interface Company {
  id: string;
  name: string;
  domain: string;
  logo?: string;
  industry: string;
  subIndustry?: string;
  employeeCount: string;
  revenueRange: string;
  foundedYear?: number;
  headquarters: string;
  phone: string;
  techStack: string[];
  linkedinUrl?: string;
  website: string;
  description: string;
  intentScore: BuyingIntentScore;
  leadsCount: number;
}

export interface ScrapeJobLog {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'success' | 'warn' | 'error';
}

export interface ScrapeJob {
  id: string;
  type: 'url_scrape' | 'keyword_industry_search' | 'domain_intel' | 'leadspilot_directory_extract';
  target: string;
  industryFilter?: string;
  locationFilter?: string;
  seniorityFilter?: string[];
  techFilter?: string;
  status: 'pending' | 'scraping' | 'completed' | 'failed';
  totalFound: number;
  logs: ScrapeJobLog[];
  extractedLeads: Lead[];
  createdAt: string;
  completedAt?: string;
}

export interface LeadList {
  id: string;
  name: string;
  description: string;
  color: string;
  leadIds: string[];
  createdAt: string;
}

export interface SequenceStep {
  stepNumber: number;
  delayDays: number;
  subject: string;
  bodyTemplate: string;
  isAiPersonalized: boolean;
}

export interface CampaignSequence {
  id: string;
  name: string;
  status: 'active' | 'draft' | 'paused';
  targetIndustry: string;
  steps: SequenceStep[];
  enrolledLeadIds: string[];
  stats: {
    sent: number;
    opened: number;
    clicked: number;
    replied: number;
    bounced: number;
  };
  createdAt: string;
}

export interface VerificationResult {
  email: string;
  status: 'valid' | 'risky' | 'invalid' | 'catch_all';
  deliverabilityScore: number;
  formatValid: boolean;
  mxRecordFound: boolean;
  smtpCheckPassed: boolean;
  isDisposable: boolean;
  isFreeEmail: boolean;
  isRoleAccount: boolean;
  suggestedPattern?: string;
  confidence: string;
  details: string;
}

export interface LeadFilterState {
  search: string;
  industries: string[];
  seniorities: string[];
  companySizes: string[];
  locations: string[];
  emailStatuses: EmailVerificationStatus[];
  pipelineStages: LeadPipelineStage[];
  intentScores: BuyingIntentScore[];
  sources: LeadSource[];
  techStack: string[];
  minScore: number;
  listId?: string;
}

export interface DashboardStats {
  totalLeads: number;
  verifiedEmails: number;
  activeAccounts: number;
  inPipeline: number;
  highIntentLeads: number;
  avgLeadScore: number;
  industryBreakdown: { industry: string; count: number; percentage: number }[];
  stageBreakdown: { stage: LeadPipelineStage; count: number; label: string }[];
  seniorityBreakdown: { seniority: string; count: number }[];
}

export type SupabaseCampaignStatus = 'queued' | 'running' | 'completed' | 'failed';
export type SupabaseScrapeStatus = 'pending' | 'success' | 'failed';
export type SupabaseVerificationStatus = 'verified' | 'risky' | 'unverified' | 'none';

export interface SupabaseCampaign {
  id: string;
  owner_user_id?: string;
  name: string;
  created_at: string;
  status: SupabaseCampaignStatus;
  platforms: string[];
  total_profiles: number;
  completed_count: number;
  failed_count: number;
  scrape_config: {
    delayMs?: number;
    proxyRegion?: string;
    depth?: 'standard' | 'deep';
    useHunter?: boolean;
    [key: string]: any;
  };
}

export interface SupabaseLead {
  id: string;
  campaign_id: string;
  platform: string;
  source_identifier: string;
  raw_profile: Record<string, any>;
  scrape_status: SupabaseScrapeStatus;
  scrape_error?: string | null;
  detected_company?: string | null;
  detected_domain?: string | null;
  candidate_emails?: string[] | null;
  verified_email?: string | null;
  verification_status: SupabaseVerificationStatus;
  phone?: string | null;
  lead_score?: number | null;
  score_breakdown?: {
    companyFit?: number;
    emailDeliverability?: number;
    seniorityWeight?: number;
    intentSignal?: number;
    reasoning?: string;
    [key: string]: any;
  } | null;
  created_at: string;
}
