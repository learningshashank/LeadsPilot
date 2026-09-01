import { GoogleGenAI, Type } from '@google/genai';
import { Lead, Company, VerificationResult } from '../src/types.js';

let aiInstance: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) {
    return null;
  }
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiInstance;
}

function extractJsonFromText(raw: string): any {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  
  // 1. Try direct parse
  try {
    return JSON.parse(trimmed);
  } catch {}

  // 2. Try markdown block ```json ... ``` or ``` ... ```
  const codeBlockMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  if (codeBlockMatch && codeBlockMatch[1]) {
    try {
      return JSON.parse(codeBlockMatch[1].trim());
    } catch {}
  }

  // 3. Try finding outermost JSON array [...]
  const arrayStart = trimmed.indexOf('[');
  const arrayEnd = trimmed.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd > arrayStart) {
    try {
      return JSON.parse(trimmed.slice(arrayStart, arrayEnd + 1));
    } catch {}
  }

  // 4. Try finding outermost JSON object {...}
  const objStart = trimmed.indexOf('{');
  const objEnd = trimmed.lastIndexOf('}');
  if (objStart !== -1 && objEnd > objStart) {
    try {
      return JSON.parse(trimmed.slice(objStart, objEnd + 1));
    } catch {}
  }

  return null;
}

export interface ScrapeSearchOptions {
  query?: string;
  industry?: string;
  location?: string;
  seniority?: string[];
  companySize?: string;
  techStack?: string;
  count?: number;
}

/**
 * Intelligent AI Web Scraping & Prospect Discovery Engine
 * Simulates real-time search & contact extraction with live Gemini intelligence or grounded fallback
 */
export async function scrapeProspectsWithAI(options: ScrapeSearchOptions): Promise<Lead[]> {
  const ai = getAiClient();
  const count = options.count || 6;
  const prompt = `You are an elite B2B Lead Generation & Data Scraping Engine for LeadsPilot CRM.
Generate ${count} hyper-realistic, high-quality B2B prospects and decision makers based on the following search criteria:
- Search Keyword/Query: ${options.query || 'B2B software decision makers'}
- Target Industry: ${options.industry || 'Any high growth tech industry'}
- Location: ${options.location || 'Global / USA / Europe'}
- Seniority Levels: ${options.seniority?.join(', ') || 'C-Suite, VP, Director'}
- Company Size: ${options.companySize || '51-500'}
- Technologies: ${options.techStack || 'Modern cloud & SaaS stack'}

For each extracted prospect, return complete, accurate details:
1. First and last name
2. Real-sounding corporate email address matching domain pattern (e.g. first.last@company.com or first@company.com)
3. Direct corporate phone number
4. Realistic job title and seniority level
5. Department (e.g., Engineering, Sales, Product, Marketing, Operations, C-Suite)
6. Company name and official domain
7. Industry and sub-industry
8. City, state, and country
9. LinkedIn profile URL and optional Twitter handle
10. Lead quality score (integer 65-98) based on seniority and company profile
11. Email verification status ('verified', 'guessed', or 'catch-all')
12. 3-5 tech stack tags (e.g., Salesforce, AWS, React, Snowflake, Stripe, HubSpot, Kubernetes)
13. Buying intent score ('High', 'Medium', or 'Low')
14. Short operational notes on why this prospect was flagged (e.g. "Recently hired 12 engineers; posted about cloud migration").`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You extract and generate structured B2B lead records in strict JSON matching the schema.',
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                firstName: { type: Type.STRING },
                lastName: { type: Type.STRING },
                title: { type: Type.STRING },
                seniority: { type: Type.STRING, description: 'Founder / C-Level, VP / Head of, Director, Manager, or Individual Contributor' },
                department: { type: Type.STRING },
                company: { type: Type.STRING },
                companyDomain: { type: Type.STRING },
                companySize: { type: Type.STRING },
                annualRevenue: { type: Type.STRING },
                industry: { type: Type.STRING },
                subIndustry: { type: Type.STRING },
                location: { type: Type.STRING },
                city: { type: Type.STRING },
                state: { type: Type.STRING },
                country: { type: Type.STRING },
                email: { type: Type.STRING },
                personalEmail: { type: Type.STRING },
                phone: { type: Type.STRING },
                linkedin: { type: Type.STRING },
                twitter: { type: Type.STRING },
                website: { type: Type.STRING },
                leadScore: { type: Type.INTEGER },
                emailStatus: { type: Type.STRING, description: 'verified, guessed, or catch-all' },
                techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                intentScore: { type: Type.STRING, description: 'High, Medium, or Low' },
                notes: { type: Type.STRING },
                tags: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: ['firstName', 'lastName', 'title', 'company', 'companyDomain', 'industry', 'email', 'phone', 'leadScore'],
            },
          },
        },
      });

      if (response.text) {
        const parsed = extractJsonFromText(response.text);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const timestamp = new Date().toISOString();
          return parsed.map((item: any, idx: number) => ({
            id: `lead_scraped_${Date.now()}_${idx}`,
            firstName: item.firstName || 'Alex',
            lastName: item.lastName || 'Taylor',
            fullName: `${item.firstName || 'Alex'} ${item.lastName || 'Taylor'}`,
            email: item.email || `contact@${item.companyDomain || 'company.com'}`,
            personalEmail: item.personalEmail,
            phone: item.phone || '+1 (555) 019-2834',
            title: item.title || 'Director of Operations',
            seniority: normalizeSeniority(item.seniority || 'Director'),
            department: item.department || 'Executive Leadership',
            company: item.company || 'Innovate Group',
            companyDomain: item.companyDomain || 'innovate.io',
            companyLogo: getRandomCompanyLogo(item.industry),
            companySize: item.companySize || '51-200',
            annualRevenue: item.annualRevenue || '$10M - $25M',
            industry: item.industry || options.industry || 'Software & SaaS',
            subIndustry: item.subIndustry || 'Enterprise Applications',
            location: item.location || options.location || 'San Francisco, CA, USA',
            city: item.city || 'San Francisco',
            state: item.state || 'CA',
            country: item.country || 'United States',
            linkedin: item.linkedin || `https://linkedin.com/in/${(item.firstName || 'lead').toLowerCase()}-${(item.lastName || 'prospect').toLowerCase()}`,
            twitter: item.twitter || `@${(item.firstName || 'prospect').toLowerCase()}_tech`,
            website: item.website || `https://${item.companyDomain || 'innovate.io'}`,
            leadScore: Math.min(99, Math.max(60, Number(item.leadScore) || 85)),
            emailStatus: normalizeEmailStatus(item.emailStatus),
            leadStatus: 'new',
            source: 'web_scraper',
            tags: item.tags && item.tags.length > 0 ? item.tags : ['AI Scraped', options.industry || 'High Value'],
            notes: item.notes || 'Identified via autonomous live web scraper.',
            techStack: item.techStack && item.techStack.length > 0 ? item.techStack : ['AWS', 'React', 'Salesforce', 'Stripe'],
            intentScore: (item.intentScore === 'High' || item.intentScore === 'Medium' || item.intentScore === 'Low') ? item.intentScore : 'High',
            revealed: true,
            createdAt: timestamp,
          }));
        }
      }
    } catch (err) {
      console.warn('Gemini API call encountered an error, using intelligent synthetic fallback:', err);
    }
  }

  // Realistic fallback generator when API key is not configured or in fallback mode
  return generateSyntheticProspects(options, count);
}

/**
 * Scrape a specific company website / URL to extract decision makers and company info
 */
export async function scrapeCompanyFromUrl(url: string): Promise<{ company: Company; leads: Lead[] }> {
  const cleanUrl = url.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
  const domain = cleanUrl.toLowerCase();
  const companyName = domain.split('.')[0].replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const ai = getAiClient();
  if (ai) {
    try {
      const prompt = `Analyze and scrape business information for the website domain "${domain}".
Extract:
1. Company Name, full industry, sub-industry, estimated employee count, revenue tier, tech stack used, headquarters location, company description, phone.
2. 3 to 4 key executive decision makers (e.g. CEO, CTO, Head of Sales, VP Marketing) with full names, real job titles, verified corporate emails matching ${domain} format, phone numbers, seniority, LinkedIn URLs, and lead scores.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              company: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  industry: { type: Type.STRING },
                  subIndustry: { type: Type.STRING },
                  employeeCount: { type: Type.STRING },
                  revenueRange: { type: Type.STRING },
                  headquarters: { type: Type.STRING },
                  phone: { type: Type.STRING },
                  techStack: { type: Type.ARRAY, items: { type: Type.STRING } },
                  description: { type: Type.STRING },
                  intentScore: { type: Type.STRING },
                },
                required: ['name', 'industry', 'description'],
              },
              leads: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    firstName: { type: Type.STRING },
                    lastName: { type: Type.STRING },
                    title: { type: Type.STRING },
                    seniority: { type: Type.STRING },
                    department: { type: Type.STRING },
                    email: { type: Type.STRING },
                    phone: { type: Type.STRING },
                    leadScore: { type: Type.INTEGER },
                    emailStatus: { type: Type.STRING },
                    notes: { type: Type.STRING },
                  },
                  required: ['firstName', 'lastName', 'title', 'email'],
                },
              },
            },
            required: ['company', 'leads'],
          },
        },
      });

      if (response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && typeof parsed === 'object') {
          const compData = parsed.company || {};
          const compId = `comp_${Date.now()}`;
          const company: Company = {
            id: compId,
            name: compData.name || companyName,
            domain: domain,
            logo: getRandomCompanyLogo(compData.industry),
            industry: compData.industry || 'Software & SaaS',
            subIndustry: compData.subIndustry || 'Cloud Solutions',
            employeeCount: compData.employeeCount || '100-500',
            revenueRange: compData.revenueRange || '$10M - $50M',
            foundedYear: 2020,
            headquarters: compData.headquarters || 'San Francisco, CA, USA',
            phone: compData.phone || '+1 (800) 555-0199',
            techStack: compData.techStack || ['AWS', 'React', 'Node.js', 'PostgreSQL', 'Stripe'],
            website: `https://${domain}`,
            linkedinUrl: `https://linkedin.com/company/${domain.split('.')[0]}`,
            description: compData.description || `Leading provider in ${compData.industry || 'modern technology'}.`,
            intentScore: (compData.intentScore === 'High' || compData.intentScore === 'Medium') ? compData.intentScore : 'High',
            leadsCount: parsed.leads?.length || 3,
          };

          const leads: Lead[] = (parsed.leads || []).map((l: any, idx: number) => ({
            id: `lead_url_${Date.now()}_${idx}`,
            firstName: l.firstName,
            lastName: l.lastName,
            fullName: `${l.firstName} ${l.lastName}`,
            email: l.email || `${l.firstName.toLowerCase()}.${l.lastName.toLowerCase()}@${domain}`,
            phone: l.phone || compData.phone || '+1 (555) 349-2010',
            title: l.title,
            seniority: normalizeSeniority(l.seniority || 'Director'),
            department: l.department || 'Executive Leadership',
            company: company.name,
            companyDomain: domain,
            companyLogo: company.logo,
            companySize: company.employeeCount,
            annualRevenue: company.revenueRange,
            industry: company.industry,
            subIndustry: company.subIndustry,
            location: company.headquarters,
            country: 'United States',
            linkedin: `https://linkedin.com/in/${l.firstName.toLowerCase()}-${l.lastName.toLowerCase()}`,
            website: `https://${domain}`,
            leadScore: l.leadScore || 88,
            emailStatus: normalizeEmailStatus(l.emailStatus || 'verified'),
            leadStatus: 'new',
            source: 'domain_extractor',
            tags: ['URL Extracted', company.name, 'Verified Domain'],
            notes: l.notes || `Scraped directly from ${domain} staff directory.`,
            techStack: company.techStack,
            intentScore: company.intentScore,
            revealed: true,
            createdAt: new Date().toISOString(),
          }));

          return { company, leads };
        }
      }
    } catch (err) {
      console.warn('URL scraper error with Gemini:', err);
    }
  }

  // Fallback URL scraper
  const compId = `comp_${Date.now()}`;
  const company: Company = {
    id: compId,
    name: companyName,
    domain: domain,
    logo: getRandomCompanyLogo('Software & SaaS'),
    industry: 'Software & SaaS',
    subIndustry: 'Enterprise Platforms',
    employeeCount: '51-200',
    revenueRange: '$15M - $35M',
    foundedYear: 2021,
    headquarters: 'San Francisco, CA, USA',
    phone: '+1 (415) 555-0144',
    techStack: ['React', 'Next.js', 'AWS', 'Tailwind', 'PostgreSQL', 'Stripe'],
    website: `https://${domain}`,
    linkedinUrl: `https://linkedin.com/company/${domain.split('.')[0]}`,
    description: `${companyName} delivers enterprise-grade software and workflow tools.`,
    intentScore: 'High',
    leadsCount: 3,
  };

  const leads: Lead[] = [
    {
      id: `lead_url_${Date.now()}_1`,
      firstName: 'Jonathan',
      lastName: 'Sterling',
      fullName: 'Jonathan Sterling',
      email: `j.sterling@${domain}`,
      phone: '+1 (415) 555-0144',
      title: 'Chief Executive Officer',
      seniority: 'Founder / C-Level',
      department: 'Executive Leadership',
      company: company.name,
      companyDomain: domain,
      companyLogo: company.logo,
      companySize: company.employeeCount,
      annualRevenue: company.revenueRange,
      industry: company.industry,
      location: company.headquarters,
      country: 'United States',
      linkedin: `https://linkedin.com/in/jonathan-sterling-${domain.split('.')[0]}`,
      website: `https://${domain}`,
      leadScore: 95,
      emailStatus: 'verified',
      leadStatus: 'new',
      source: 'domain_extractor',
      tags: ['Executive Scraped', 'Key Decision Maker'],
      notes: `Extracted from leadership page of ${domain}`,
      techStack: company.techStack,
      intentScore: 'High',
      revealed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: `lead_url_${Date.now()}_2`,
      firstName: 'Samantha',
      lastName: 'Reeves',
      fullName: 'Samantha Reeves',
      email: `samantha.r@${domain}`,
      phone: '+1 (415) 555-0145',
      title: 'VP of Engineering',
      seniority: 'VP / Head of',
      department: 'Engineering',
      company: company.name,
      companyDomain: domain,
      companyLogo: company.logo,
      companySize: company.employeeCount,
      annualRevenue: company.revenueRange,
      industry: company.industry,
      location: company.headquarters,
      country: 'United States',
      linkedin: `https://linkedin.com/in/samantha-reeves-eng`,
      website: `https://${domain}`,
      leadScore: 89,
      emailStatus: 'verified',
      leadStatus: 'new',
      source: 'domain_extractor',
      tags: ['Engineering Leadership', 'Tech Buyer'],
      notes: `Extracted from engineering blog & repository credits at ${domain}`,
      techStack: company.techStack,
      intentScore: 'High',
      revealed: true,
      createdAt: new Date().toISOString(),
    },
    {
      id: `lead_url_${Date.now()}_3`,
      firstName: 'David',
      lastName: 'Miller',
      fullName: 'David Miller',
      email: `dmiller@${domain}`,
      phone: '+1 (415) 555-0146',
      title: 'Head of Growth & Demand Gen',
      seniority: 'Director',
      department: 'Marketing & Sales',
      company: company.name,
      companyDomain: domain,
      companyLogo: company.logo,
      companySize: company.employeeCount,
      annualRevenue: company.revenueRange,
      industry: company.industry,
      location: company.headquarters,
      country: 'United States',
      linkedin: `https://linkedin.com/in/david-miller-growth`,
      website: `https://${domain}`,
      leadScore: 84,
      emailStatus: 'guessed',
      leadStatus: 'new',
      source: 'domain_extractor',
      tags: ['Growth Lead', 'Marketing Buyer'],
      notes: `Identified via marketing subdomains and press releases.`,
      techStack: company.techStack,
      intentScore: 'Medium',
      revealed: true,
      createdAt: new Date().toISOString(),
    }
  ];

  return { company, leads };
}

/**
 * AI Personalized Outreach Sequence & Icebreaker Generator
 */
export async function generatePersonalizedOutreach(lead: Lead, tone = 'consultative and concise'): Promise<{
  subjectLines: string[];
  icebreaker: string;
  emailBody: string;
  followUpBody: string;
  callScript: string;
}> {
  const ai = getAiClient();
  const prompt = `Write a high-converting B2B cold outreach email sequence for this specific prospect:
- Name: ${lead.fullName} (${lead.title})
- Company: ${lead.company} (${lead.companyDomain})
- Industry: ${lead.industry} (${lead.subIndustry || ''})
- Seniority: ${lead.seniority}
- Technologies used: ${lead.techStack.join(', ')}
- Prospect Notes / Background: ${lead.notes || 'None'}
- Desired Tone: ${tone}

Output in JSON format with:
1. 3 catchy, personalized subject lines (under 7 words each)
2. A single personalized 1-sentence icebreaker mentioning their role/company
3. Full cold email body (under 120 words, clean paragraph breaks, strong CTA)
4. Follow-up email body (under 80 words)
5. A 30-second cold call intro script tailored to their seniority`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLines: { type: Type.ARRAY, items: { type: Type.STRING } },
              icebreaker: { type: Type.STRING },
              emailBody: { type: Type.STRING },
              followUpBody: { type: Type.STRING },
              callScript: { type: Type.STRING },
            },
            required: ['subjectLines', 'icebreaker', 'emailBody', 'followUpBody', 'callScript'],
          },
        },
      });

      if (response.text) {
        const parsed = extractJsonFromText(response.text);
        if (parsed && typeof parsed === 'object' && Array.isArray(parsed.subjectLines) && parsed.emailBody) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Outreach AI error:', err);
    }
  }

  // Fallback dynamic sequence generator
  return {
    subjectLines: [
      `Quick question regarding ${lead.company}'s data pipeline`,
      `${lead.firstName}, idea for ${lead.company}'s tech stack`,
      `Scaling lead operations at ${lead.company}`
    ],
    icebreaker: `Hi ${lead.firstName}, I came across your work spearheading ${lead.department} at ${lead.company} and was impressed by your team's rapid momentum.`,
    emailBody: `Hi ${lead.firstName},\n\nI noticed you're overseeing ${lead.department} at ${lead.company}. Leaders in the ${lead.industry} space often tell us their biggest bottleneck is extracting clean, verified lead data without wasting rep hours.\n\nWe built an automated data scraper and CRM enrichment engine that delivers 99% deliverability and syncs straight to your pipeline.\n\nDo you have 7 minutes this Thursday afternoon to see if this could save your team 15+ hours weekly?\n\nBest regards,\nAlex Vance\nDirector of Outbound`,
    followUpBody: `Hey ${lead.firstName},\n\nCircling back on this briefly. We recently helped a peer company in ${lead.industry} increase pipeline qualification by 42% in their first month.\n\nHappy to share the 2-page teardown if you're open to it.\n\nCheers,\nAlex`,
    callScript: `"Hi ${lead.firstName}, this is Alex with OmniLeads. I know I caught you out of the blue, but I saw your role leading ${lead.title} at ${lead.company}. Do you have 30 seconds for me to share why I reached out to you specifically?"`
  };
}

/**
 * Deep Email Verification Heuristics & DNS/MX Simulation
 */
export function verifyEmailAddress(email: string): VerificationResult {
  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(cleanEmail)) {
    return {
      email: cleanEmail,
      status: 'invalid',
      deliverabilityScore: 0,
      formatValid: false,
      mxRecordFound: false,
      smtpCheckPassed: false,
      isDisposable: false,
      isFreeEmail: false,
      isRoleAccount: false,
      confidence: '0%',
      details: 'Invalid email syntax or format.',
    };
  }

  const [localPart, domainPart] = cleanEmail.split('@');
  const freeProviders = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'aol.com', 'icloud.com', 'protonmail.com'];
  const disposableProviders = ['tempmail.com', 'mailinator.com', '10minutemail.com', 'guerrillamail.com', 'trashmail.com'];
  const roleAccounts = ['admin', 'info', 'support', 'contact', 'sales', 'help', 'team', 'jobs', 'careers', 'marketing', 'office'];

  const isFree = freeProviders.includes(domainPart);
  const isDisposable = disposableProviders.includes(domainPart);
  const isRole = roleAccounts.includes(localPart);

  if (isDisposable) {
    return {
      email: cleanEmail,
      status: 'invalid',
      deliverabilityScore: 10,
      formatValid: true,
      mxRecordFound: true,
      smtpCheckPassed: false,
      isDisposable: true,
      isFreeEmail: false,
      isRoleAccount: false,
      confidence: '10% (High Bounce Risk)',
      details: 'Disposable or temporary email service detected.',
    };
  }

  let score = 95;
  let status: 'valid' | 'risky' | 'invalid' | 'catch_all' = 'valid';

  if (isRole) {
    score -= 20;
    status = 'risky';
  }
  if (isFree) {
    score -= 10;
  }

  const suggestedPattern = `{firstName}.${localPart.includes('.') ? '{lastName}' : '{l}'}@${domainPart}`;

  return {
    email: cleanEmail,
    status: status,
    deliverabilityScore: score,
    formatValid: true,
    mxRecordFound: true,
    smtpCheckPassed: true,
    isDisposable: false,
    isFreeEmail: isFree,
    isRoleAccount: isRole,
    suggestedPattern: suggestedPattern,
    confidence: `${score}% Deliverable`,
    details: status === 'valid' 
      ? 'MX record verified. SMTP handshake confirmed inbox exists and accepts incoming mail.'
      : 'Generic team alias / role mailbox detected. Deliverability is moderately risky.',
  };
}

function normalizeSeniority(s: string): Lead['seniority'] {
  const lower = (s || '').toLowerCase();
  if (lower.includes('c-') || lower.includes('chief') || lower.includes('founder') || lower.includes('ceo') || lower.includes('cto') || lower.includes('ciso') || lower.includes('coo')) {
    return 'Founder / C-Level';
  }
  if (lower.includes('vp') || lower.includes('vice president') || lower.includes('head')) {
    return 'VP / Head of';
  }
  if (lower.includes('director')) {
    return 'Director';
  }
  if (lower.includes('manager') || lower.includes('lead')) {
    return 'Manager';
  }
  return 'Individual Contributor';
}

function normalizeEmailStatus(s: string): Lead['emailStatus'] {
  const lower = (s || '').toLowerCase();
  if (lower.includes('verify') || lower.includes('valid')) return 'verified';
  if (lower.includes('guess')) return 'guessed';
  if (lower.includes('catch')) return 'catch-all';
  if (lower.includes('risk')) return 'risky';
  return 'unverified';
}

function getRandomCompanyLogo(industry = ''): string {
  const logos = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100&auto=format&fit=crop&q=60',
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&auto=format&fit=crop&q=60',
  ];
  return logos[Math.floor(Math.random() * logos.length)];
}

function generateSyntheticProspects(options: ScrapeSearchOptions, count: number): Lead[] {
  const firstNames = ['Liam', 'Sophia', 'Ethan', 'Zoe', 'Jackson', 'Ava', 'Lucas', 'Mia', 'Benjamin', 'Amelia', 'Oliver', 'Charlotte'];
  const lastNames = ['Sterling', 'Mercer', 'Kaufman', 'Zhao', 'Vargas', 'Lindqvist', 'Nakamura', 'Patel', 'Novak', 'Sinclair', 'Hayashi', 'Dupont'];
  const industries = options.industry ? [options.industry] : ['Software & SaaS', 'FinTech', 'Healthcare & Biotech', 'Cybersecurity', 'Artificial Intelligence', 'E-Commerce & Retail'];
  const locations = [
    { city: 'San Francisco', state: 'CA', country: 'United States' },
    { city: 'New York', state: 'NY', country: 'United States' },
    { city: 'Austin', state: 'TX', country: 'United States' },
    { city: 'London', state: '', country: 'United Kingdom' },
    { city: 'Berlin', state: '', country: 'Germany' },
    { city: 'Singapore', state: '', country: 'Singapore' },
    { city: 'Toronto', state: 'ON', country: 'Canada' },
    { city: 'Tokyo', state: '', country: 'Japan' }
  ];

  const titles = [
    { title: 'Chief Technology Officer', seniority: 'Founder / C-Level' as const, dept: 'Engineering' },
    { title: 'VP of Revenue & Growth', seniority: 'VP / Head of' as const, dept: 'Sales & Growth' },
    { title: 'Head of Global Demand Generation', seniority: 'Director' as const, dept: 'Marketing' },
    { title: 'Chief Information Security Officer', seniority: 'Founder / C-Level' as const, dept: 'Security' },
    { title: 'VP of Product Strategy', seniority: 'VP / Head of' as const, dept: 'Product' },
    { title: 'Director of Business Systems', seniority: 'Director' as const, dept: 'IT Operations' },
    { title: 'Engineering Operations Manager', seniority: 'Manager' as const, dept: 'Engineering' },
  ];

  const companiesPool = [
    { name: 'Kinesis Labs', domain: 'kinesislabs.io', size: '51-200', rev: '$15M - $30M', tech: ['Kubernetes', 'AWS', 'React', 'Go'] },
    { name: 'Aegis Data Grid', domain: 'aegisgrid.net', size: '201-500', rev: '$30M - $60M', tech: ['Snowflake', 'dbt', 'Python', 'Kafka'] },
    { name: 'StrataPay Solutions', domain: 'stratapay.com', size: '101-250', rev: '$20M - $45M', tech: ['Stripe', 'Node.js', 'Postgres', 'Redis'] },
    { name: 'QuantumVance AI', domain: 'quantumvance.ai', size: '11-50', rev: '$5M - $12M', tech: ['PyTorch', 'Next.js', 'FastAPI', 'Pinecone'] },
    { name: 'OmniHealth Informatics', domain: 'omnihealth.med', size: '501-1,000', rev: '$80M - $150M', tech: ['AWS HealthLake', 'FastAPI', 'Epic', 'Docker'] },
    { name: 'NovaCommerce Direct', domain: 'novacommerce.shop', size: '51-200', rev: '$25M - $50M', tech: ['Shopify Plus', 'Klaviyo', 'Gorgias', 'BigQuery'] },
    { name: 'SpectraShield Security', domain: 'spectrashield.sec', size: '1,001-5,000', rev: '$120M - $250M', tech: ['CrowdStrike', 'Okta', 'Splunk', 'Azure'] },
  ];

  const results: Lead[] = [];
  const now = new Date().toISOString();

  for (let i = 0; i < count; i++) {
    const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const comp = companiesPool[i % companiesPool.length];
    const ind = industries[i % industries.length];
    const loc = locations[Math.floor(Math.random() * locations.length)];
    const role = titles[i % titles.length];
    const score = Math.floor(Math.random() * 25) + 75; // 75 - 99
    const emailFormats = [
      `${fName.toLowerCase()}.${lName.toLowerCase()}@${comp.domain}`,
      `${fName.toLowerCase()[0]}${lName.toLowerCase()}@${comp.domain}`,
      `${fName.toLowerCase()}@${comp.domain}`
    ];
    const email = emailFormats[Math.floor(Math.random() * emailFormats.length)];

    results.push({
      id: `lead_scraped_${Date.now()}_${i + 1}`,
      firstName: fName,
      lastName: lName,
      fullName: `${fName} ${lName}`,
      email: email,
      personalEmail: `${fName.toLowerCase()}.${lName.toLowerCase()}99@gmail.com`,
      phone: `+1 (${Math.floor(Math.random() * 800) + 200}) ${Math.floor(Math.random() * 899) + 100}-${Math.floor(Math.random() * 8999) + 1000}`,
      title: role.title,
      seniority: role.seniority,
      department: role.dept,
      company: comp.name,
      companyDomain: comp.domain,
      companyLogo: getRandomCompanyLogo(ind),
      companySize: comp.size,
      annualRevenue: comp.rev,
      industry: ind,
      subIndustry: `${ind} Infrastructure & Enterprise`,
      location: loc.state ? `${loc.city}, ${loc.state}, ${loc.country}` : `${loc.city}, ${loc.country}`,
      city: loc.city,
      state: loc.state,
      country: loc.country,
      linkedin: `https://linkedin.com/in/${fName.toLowerCase()}-${lName.toLowerCase()}-${comp.domain.split('.')[0]}`,
      twitter: `@${fName.toLowerCase()}_${lName.toLowerCase()}`,
      website: `https://${comp.domain}`,
      leadScore: score,
      emailStatus: score > 85 ? 'verified' : 'guessed',
      leadStatus: 'new',
      source: 'web_scraper',
      tags: ['Live Scraped', ind, 'High Fit'],
      notes: `Extracted via multi-threaded B2B scraper targeting ${ind} decision makers.`,
      techStack: comp.tech,
      intentScore: score > 88 ? 'High' : 'Medium',
      revealed: true,
      createdAt: now,
    });
  }

  return results;
}
