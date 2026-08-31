import { Lead, EmailVerificationStatus, BuyingIntentScore, LeadPipelineStage } from './types.js';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(endpoint, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function formatCurrency(num: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(dateString?: string): string {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}

export function getVerificationBadgeStyle(status: EmailVerificationStatus): { bg: string; text: string; border: string; label: string } {
  switch (status) {
    case 'verified':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        label: 'Verified (99%)',
      };
    case 'guessed':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        label: 'Pattern Guessed',
      };
    case 'catch-all':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
        label: 'Catch-all Server',
      };
    case 'risky':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        label: 'Risky Deliverability',
      };
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
        label: 'Unverified',
      };
  }
}

export function getIntentBadgeStyle(intent: BuyingIntentScore): { bg: string; text: string; border: string } {
  switch (intent) {
    case 'High':
      return {
        bg: 'bg-indigo-50',
        text: 'text-indigo-700',
        border: 'border-indigo-200',
      };
    case 'Medium':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
      };
    case 'Low':
    default:
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-600',
        border: 'border-slate-200',
      };
  }
}

export function getStageLabel(stage: LeadPipelineStage): string {
  const map: Record<LeadPipelineStage, string> = {
    new: 'New Lead',
    contacted: 'Contacted',
    meeting_scheduled: 'Meeting Scheduled',
    qualified: 'Sales Qualified',
    in_negotiation: 'In Negotiation',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost',
    unresponsive: 'Unresponsive',
  };
  return map[stage] || stage;
}

export function getStageColor(stage: LeadPipelineStage): string {
  const map: Record<LeadPipelineStage, string> = {
    new: 'bg-slate-100 text-slate-700 border-slate-200',
    contacted: 'bg-sky-50 text-sky-700 border-sky-200',
    meeting_scheduled: 'bg-purple-50 text-purple-700 border-purple-200',
    qualified: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    in_negotiation: 'bg-amber-50 text-amber-700 border-amber-200',
    closed_won: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    closed_lost: 'bg-rose-50 text-rose-700 border-rose-200',
    unresponsive: 'bg-slate-100 text-slate-500 border-slate-200',
  };
  return map[stage] || 'bg-slate-100 text-slate-700 border-slate-200';
}

export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email;
  const [local, domain] = email.split('@');
  if (local.length <= 2) return `${local.charAt(0)}***@${domain}`;
  return `${local.slice(0, 2)}***${local.charAt(local.length - 1)}@${domain}`;
}

export function maskPhone(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  return `${phone.slice(0, 6)} ***-****`;
}

export const INDUSTRIES_LIST = [
  'Software & SaaS',
  'FinTech',
  'Healthcare & Biotech',
  'Cybersecurity',
  'Artificial Intelligence',
  'E-Commerce & Retail',
  'Logistics & Supply Chain',
  'CleanTech & Energy',
  'Real Estate & PropTech',
  'Manufacturing & Robotics',
  'EdTech & Learning',
  'Media & Advertising',
];

export const SENIORITY_LIST = [
  'Founder / C-Level',
  'VP / Head of',
  'Director',
  'Manager',
  'Individual Contributor',
];

export const COMPANY_SIZE_LIST = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1,000',
  '1,001-5,000',
  '5,000+',
];
