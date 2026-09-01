import React, { useState } from 'react';
import { 
  X, 
  LifeBuoy, 
  Mail, 
  MessageSquare, 
  BookOpen, 
  ExternalLink, 
  Terminal, 
  ShieldCheck, 
  Send,
  CheckCircle2,
  Copy,
  Check
} from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [supportMessage, setSupportMessage] = useState('');
  const [ticketSent, setTicketSent] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  if (!isOpen) return null;

  const handleSubmitTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    setTicketSent(true);
    setTimeout(() => {
      setTicketSent(false);
      setSupportMessage('');
      onClose();
    }, 1500);
  };

  const handleCopySupport = () => {
    navigator.clipboard.writeText('support@leadspilot.ai');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-2xl bg-[#0f1422] text-slate-100 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#131a2c]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <LifeBuoy className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Help & Technical Support</h3>
              <p className="text-[11px] text-slate-400">Documentation, live support ticket dispatch, and diagnostics</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Quick Support Channels */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-[#121827] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <Mail className="w-4 h-4" />
                  <span>Direct Priority Email</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  24/7 dedicated support engineering for enterprise scraping and API rate-limit inquiries.
                </p>
              </div>
              <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800">
                <code className="text-white font-mono text-[11px]">support@leadspilot.ai</code>
                <button
                  onClick={handleCopySupport}
                  className="text-slate-400 hover:text-white p-1 cursor-pointer"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#121827] border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-amber-400 font-bold mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span>Developer Docs & API</span>
                </div>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Integration guides for Hunter.io, Gemini AI prompts, Supabase PostgreSQL schemas, and webhooks.
                </p>
              </div>
              <div className="mt-3 pt-2 border-t border-slate-800">
                <span className="text-amber-400 font-semibold flex items-center gap-1 hover:underline cursor-pointer">
                  <span>Open API Reference</span>
                  <ExternalLink className="w-3 h-3" />
                </span>
              </div>
            </div>
          </div>

          {/* Quick Support Ticket Form */}
          <div className="p-4 rounded-xl bg-[#141c30] border border-slate-800 space-y-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
              <span>Submit a Help Request</span>
            </h4>

            {ticketSent ? (
              <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Ticket #LP-9082 received! Our engineering team will follow up at {currentUser?.email || 'your email'}.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmitTicket} className="space-y-3">
                <textarea
                  rows={3}
                  required
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Describe your question or issue (e.g., CSV export issue, Hunter.io key setup)..."
                  className="w-full p-3 bg-[#101524] border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-xs"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95 text-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Support Ticket</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-[#0c101c] flex items-center justify-between text-slate-400 text-[11px]">
          <span>LeadsPilot v2.4 • System Status: All Engines Operational</span>
          <button onClick={onClose} className="hover:text-white font-semibold cursor-pointer">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
