import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Zap, 
  ShieldCheck, 
  Sparkles,
  Database,
  Mail
} from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    id: 'f1',
    category: 'Verification & Scraping',
    question: 'How does LeadsPilot find and verify business emails?',
    answer: 'LeadsPilot utilizes a dual-engine architecture: (1) Real-time platform profile scrapers (LinkedIn, Twitter/X, GitHub, AngelList, and Company Domains) to extract name, company, and title, and (2) Hunter.io API combined with DNS MX/SMTP handshake validators to check corporate email patterns (e.g. first.last@domain.com, f.last@domain.com). Emails are marked "verified", "risky", or "invalid" based on deliverability confidence.'
  },
  {
    id: 'f2',
    category: 'Supabase & Realtime',
    question: 'How does Supabase persistence and Realtime work in LeadsPilot?',
    answer: 'Every campaign and its extracted lead records are stored in your Supabase PostgreSQL database tables (campaigns and leads). When new leads are parsed or statuses change during live scraping, Supabase Realtime channels broadcast updates directly to your dashboard without requiring manual page reloads.'
  },
  {
    id: 'f3',
    category: 'AI Enrichment',
    question: 'How does Gemini AI personalize outbound email sequences?',
    answer: 'When you click "Generate AI Email" or trigger outbound sequences, Google Gemini AI analyzes the prospect\'s recent achievements, company announcements, tech stack, and pain points to craft tailored, high-converting cold email copy, icebreakers, and subject lines with near-zero spam probability.'
  },
  {
    id: 'f4',
    category: 'Credits & Export',
    question: 'Do unused search and verification credits roll over?',
    answer: 'Yes! On the Growth Pro and Enterprise tiers, all unused monthly verification credits roll over for up to 90 days. You can also export full campaigns and filtered prospect lists to CSV, HubSpot, or Salesforce at any time with no export fee.'
  },
  {
    id: 'f5',
    category: 'Compliance',
    question: 'Is LeadsPilot GDPR, CCPA, and CAN-SPAM compliant?',
    answer: 'Yes. LeadsPilot only processes publicly available B2B contact records and corporate email addresses. We provide one-click opt-out and suppress personal email addresses (@gmail, @yahoo) from commercial outreach by default.'
  }
];

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [openFaqId, setOpenFaqId] = useState<string>('f1');
  const [faqSearch, setFaqSearch] = useState('');

  if (!isOpen) return null;

  const filteredFaqs = FAQS.filter(f => 
    f.question.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.answer.toLowerCase().includes(faqSearch.toLowerCase()) ||
    f.category.toLowerCase().includes(faqSearch.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-[#0f1422] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131a2c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Frequently Asked Questions</h3>
              <p className="text-[11px] text-slate-400">Everything you need to know about LeadsPilot and B2B enrichment</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-[#0c101c]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={faqSearch}
              onChange={(e) => setFaqSearch(e.target.value)}
              placeholder="Search FAQ by keyword (e.g. Supabase, Hunter.io, credits, GDPR)..."
              className="w-full pl-9 pr-3 py-2 bg-[#121827] border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 text-xs">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div 
                key={faq.id} 
                className="rounded-xl border border-slate-800 bg-[#121827] overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqId(isOpen ? '' : faq.id)}
                  className="w-full px-4 py-3.5 flex items-center justify-between text-left hover:bg-[#161f33] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5 pr-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <span className="font-bold text-slate-100 text-xs sm:text-sm">{faq.question}</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-slate-300 leading-relaxed border-t border-slate-800/60 bg-[#0e1320] text-xs">
                    <p>{faq.answer}</p>
                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 font-mono">
                        Category: {faq.category}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0c101c] flex items-center justify-between text-slate-400 text-[11px]">
          <span>Still have questions? Contact support anytime.</span>
          <button onClick={onClose} className="text-amber-400 hover:underline font-bold cursor-pointer">
            Close FAQ
          </button>
        </div>
      </div>
    </div>
  );
};
