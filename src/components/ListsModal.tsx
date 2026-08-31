import React, { useState } from 'react';
import { 
  X, 
  FolderPlus, 
  Check, 
  Trash2, 
  Folder, 
  Layers 
} from 'lucide-react';
import { LeadList } from '../types.js';

interface ListsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: LeadList[];
  onCreateList: (name: string, description: string, color: string) => void;
  onDeleteList: (id: string) => void;
  selectedLeadIdsForList?: string[];
  onAddLeadsToList?: (listId: string, leadIds: string[]) => void;
}

const COLOR_OPTIONS = [
  '#4f46e5', // indigo
  '#06b6d4', // cyan
  '#8b5cf6', // purple
  '#10b981', // emerald
  '#f59e0b', // amber
  '#f43f5e', // rose
  '#3b82f6', // blue
];

export const ListsModal: React.FC<ListsModalProps> = ({
  isOpen,
  onClose,
  lists,
  onCreateList,
  onDeleteList,
  selectedLeadIdsForList,
  onAddLeadsToList,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#4f46e5');
  const [activeTab, setActiveTab] = useState<'manage' | 'create'>('manage');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onCreateList(name, description, color);
    setName('');
    setDescription('');
    setActiveTab('manage');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center">
              <Folder className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Prospect Lists & Segments</h3>
              <p className="text-[11px] text-slate-500">Organize scraped leads by ICP, account tiers, and campaigns</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 bg-white px-6 pt-2">
          <button
            onClick={() => setActiveTab('manage')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'manage'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            All Lists ({lists.length})
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-all ${
              activeTab === 'create'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            + Create New List
          </button>
        </div>

        {/* Body */}
        <div className="p-6 text-xs text-slate-700 flex-1 overflow-y-auto max-h-96">
          {activeTab === 'manage' ? (
            <div className="space-y-3">
              {lists.map((l) => (
                <div
                  key={l.id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-full shrink-0"
                      style={{ backgroundColor: l.color }}
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">{l.name}</h4>
                      <p className="text-[11px] text-slate-500">{l.description || 'Custom segment'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[11px] text-indigo-700 font-bold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                      {l.leadIds.length} leads
                    </span>

                    {selectedLeadIdsForList && selectedLeadIdsForList.length > 0 && onAddLeadsToList && (
                      <button
                        onClick={() => {
                          onAddLeadsToList(l.id, selectedLeadIdsForList);
                          onClose();
                        }}
                        className="px-2.5 py-1 rounded bg-indigo-600 text-white font-semibold text-[11px] hover:bg-indigo-700 transition-colors shadow-xs"
                      >
                        Add {selectedLeadIdsForList.length} Leads
                      </button>
                    )}

                    <button
                      onClick={() => onDeleteList(l.id)}
                      className="text-slate-400 hover:text-rose-600 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">List Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Q3 FinTech CTOs"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Target segment for enterprise outreach"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Label Color</label>
                <div className="flex gap-2">
                  {COLOR_OPTIONS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                        color === c ? 'ring-2 ring-indigo-600 scale-110' : 'opacity-70 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c }}
                    >
                      {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-xs"
              >
                Create List
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
