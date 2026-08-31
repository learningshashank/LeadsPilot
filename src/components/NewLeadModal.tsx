import React, { useState } from 'react';
import { 
  X, 
  Plus, 
  Upload, 
  CheckCircle2, 
  Building2, 
  Mail, 
  Phone, 
  Briefcase, 
  MapPin, 
  Sparkles,
  FileText
} from 'lucide-react';
import { Lead } from '../types.js';
import { INDUSTRIES_LIST, SENIORITY_LIST } from '../utils.js';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (leadData: Partial<Lead>) => void;
}

export const NewLeadModal: React.FC<NewLeadModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [company, setCompany] = useState('');
  const [companyDomain, setCompanyDomain] = useState('');
  const [industry, setIndustry] = useState('Software & SaaS');
  const [seniority, setSeniority] = useState('VP / Head of');
  const [location, setLocation] = useState('San Francisco, CA');
  const [companySize, setCompanySize] = useState('51-200');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !email || !company) return;

    onAddLead({
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`.trim(),
      email,
      phone,
      title: title || 'Executive',
      company,
      companyDomain: companyDomain || `${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      industry,
      seniority,
      location,
      country: 'USA',
      companySize,
      leadScore: 85,
      emailStatus: 'verified',
      leadStatus: 'new',
      intentScore: 'High',
      revealed: true,
      source: 'manual',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-xl rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Add New Prospect Contact</h3>
              <p className="text-[11px] text-slate-500">Directly insert a verified B2B lead to your CRM</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="e.g. Sarah"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Last Name</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="e.g. Connor"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Work Email *</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sarah@company.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (555) 019-2834"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chief Technology Officer"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Company Name *</label>
              <input
                type="text"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Corp"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              >
                {INDUSTRIES_LIST.map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Seniority</label>
              <select
                value={seniority}
                onChange={(e) => setSeniority(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none"
              >
                {SENIORITY_LIST.map((sen) => (
                  <option key={sen} value={sen}>{sen}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-xs"
            >
              Add Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
