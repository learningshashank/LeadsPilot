import React from 'react';
import { 
  X, 
  RotateCcw, 
  Briefcase, 
  Award, 
  Users2, 
  ShieldCheck, 
  Flame, 
  Sliders, 
  Check, 
  Building 
} from 'lucide-react';
import { LeadFilterState, EmailVerificationStatus, BuyingIntentScore, LeadPipelineStage } from '../types.js';
import { INDUSTRIES_LIST, SENIORITY_LIST, COMPANY_SIZE_LIST } from '../utils.js';

interface FilterDrawerProps {
  filters: LeadFilterState;
  onFilterChange: (newFilters: LeadFilterState) => void;
  onReset: () => void;
  isOpen: boolean;
  onClose: () => void;
  totalResultsCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  filters,
  onFilterChange,
  onReset,
  isOpen,
  onClose,
  totalResultsCount,
}) => {
  if (!isOpen) return null;

  const toggleIndustry = (ind: string) => {
    const exists = filters.industries.includes(ind);
    const updated = exists 
      ? filters.industries.filter(i => i !== ind) 
      : [...filters.industries, ind];
    onFilterChange({ ...filters, industries: updated });
  };

  const toggleSeniority = (sen: string) => {
    const exists = filters.seniorities.includes(sen);
    const updated = exists 
      ? filters.seniorities.filter(s => s !== sen) 
      : [...filters.seniorities, sen];
    onFilterChange({ ...filters, seniorities: updated });
  };

  const toggleCompanySize = (size: string) => {
    const exists = filters.companySizes.includes(size);
    const updated = exists 
      ? filters.companySizes.filter(s => s !== size) 
      : [...filters.companySizes, size];
    onFilterChange({ ...filters, companySizes: updated });
  };

  const toggleEmailStatus = (status: EmailVerificationStatus) => {
    const exists = filters.emailStatuses.includes(status);
    const updated = exists 
      ? filters.emailStatuses.filter(s => s !== status) 
      : [...filters.emailStatuses, status];
    onFilterChange({ ...filters, emailStatuses: updated });
  };

  const toggleIntent = (intent: BuyingIntentScore) => {
    const exists = filters.intentScores.includes(intent);
    const updated = exists 
      ? filters.intentScores.filter(i => i !== intent) 
      : [...filters.intentScores, intent];
    onFilterChange({ ...filters, intentScores: updated });
  };

  const activeFiltersCount = 
    filters.industries.length + 
    filters.seniorities.length + 
    filters.companySizes.length + 
    filters.emailStatuses.length + 
    filters.intentScores.length + 
    (filters.minScore > 0 ? 1 : 0);

  return (
    <div className="w-80 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 h-full overflow-y-auto z-20 shadow-lg">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-white z-10">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          <h3 className="font-semibold text-sm text-slate-900">Prospect Filters</h3>
          {activeFiltersCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset filters"
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter Sections */}
      <div className="p-4 space-y-6 text-xs text-slate-700 flex-1">
        {/* Minimum Lead Score */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" /> Minimum Lead Score
            </span>
            <span className="font-mono text-indigo-600 font-bold">{filters.minScore}+</span>
          </div>
          <input
            type="range"
            min="0"
            max="95"
            step="5"
            value={filters.minScore}
            onChange={(e) => onFilterChange({ ...filters, minScore: Number(e.target.value) })}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 font-mono">
            <span>Any (0)</span>
            <span>High Quality (80+)</span>
            <span>Elite (90+)</span>
          </div>
        </div>

        {/* Target Industries */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <Briefcase className="w-3.5 h-3.5 text-indigo-600" /> Target Industry
            </span>
            {filters.industries.length > 0 && (
              <span className="text-[10px] text-indigo-600 font-mono">({filters.industries.length})</span>
            )}
          </div>
          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {INDUSTRIES_LIST.map((ind) => {
              const isSelected = filters.industries.includes(ind);
              return (
                <label
                  key={ind}
                  onClick={() => toggleIndustry(ind)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-indigo-50 text-indigo-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className="truncate">{ind}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Seniority Level */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-purple-600" /> Seniority Level
            </span>
            {filters.seniorities.length > 0 && (
              <span className="text-[10px] text-purple-600 font-mono">({filters.seniorities.length})</span>
            )}
          </div>
          <div className="space-y-1">
            {SENIORITY_LIST.map((sen) => {
              const isSelected = filters.seniorities.includes(sen);
              return (
                <label
                  key={sen}
                  onClick={() => toggleSeniority(sen)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-purple-50 text-purple-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span>{sen}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Company Size */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <Users2 className="w-3.5 h-3.5 text-emerald-600" /> Company Size (Headcount)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {COMPANY_SIZE_LIST.map((size) => {
              const isSelected = filters.companySizes.includes(size);
              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleCompanySize(size)}
                  className={`px-2.5 py-1.5 rounded-lg border text-left text-[11px] font-medium transition-all ${
                    isSelected
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-semibold'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Deliverability Status */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Email Verification
            </span>
          </div>
          <div className="space-y-1">
            {[
              { id: 'verified' as EmailVerificationStatus, label: 'Verified (99% Deliverable)', color: 'text-emerald-700 font-medium' },
              { id: 'guessed' as EmailVerificationStatus, label: 'Guessed Pattern', color: 'text-amber-700' },
              { id: 'catch-all' as EmailVerificationStatus, label: 'Catch-all Server', color: 'text-blue-700' },
            ].map((st) => {
              const isSelected = filters.emailStatuses.includes(st.id);
              return (
                <label
                  key={st.id}
                  onClick={() => toggleEmailStatus(st.id)}
                  className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                    isSelected ? 'bg-slate-100 text-slate-900 font-medium' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <span className={st.color}>{st.label}</span>
                  <div
                    className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        {/* Buying Intent */}
        <div className="space-y-2">
          <div className="flex items-center justify-between font-medium text-slate-800">
            <span className="flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" /> Buying Intent Signal
            </span>
          </div>
          <div className="flex gap-2">
            {(['High', 'Medium', 'Low'] as BuyingIntentScore[]).map((intent) => {
              const isSelected = filters.intentScores.includes(intent);
              return (
                <button
                  key={intent}
                  type="button"
                  onClick={() => toggleIntent(intent)}
                  className={`flex-1 py-1.5 text-center rounded-lg border text-xs font-semibold transition-all ${
                    isSelected
                      ? intent === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-300'
                        : intent === 'Medium'
                        ? 'bg-amber-50 text-amber-700 border-amber-300'
                        : 'bg-slate-100 text-slate-800 border-slate-300'
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {intent}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer result indicator */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 sticky bottom-0">
        <div className="flex items-center justify-between">
          <span className="text-xs text-slate-600">
            Matching: <strong className="text-slate-900 font-mono">{totalResultsCount}</strong>
          </span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
};
