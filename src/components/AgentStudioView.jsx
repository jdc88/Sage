import React, { useState } from 'react';
import { Bot, PlugZap, ShieldCheck, Terminal, ChevronRight } from 'lucide-react';
import { MultiAgentView } from './MultiAgentView';
import { McpInspectorView } from './McpInspectorView';
import { SecurityView } from './SecurityView';
import { AgentsCliView } from './AgentsCliView';

const TABS = [
  {
    id: 'multi-agent',
    label: 'Multi-Agent',
    shortLabel: 'Agents',
    icon: Bot,
    description: 'Orchestration topology, task queues & message bus',
    color: 'teal',
    activeClass: 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 bg-teal-50/50 dark:bg-teal-900/10',
    dotColor: 'bg-teal-500',
  },
  {
    id: 'mcp-inspector',
    label: 'MCP Inspector',
    shortLabel: 'MCP',
    icon: PlugZap,
    description: 'Server health, latency sparklines & tool-call trace',
    color: 'amber',
    activeClass: 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-500 bg-amber-50/50 dark:bg-amber-900/10',
    dotColor: 'bg-amber-500',
  },
  {
    id: 'security',
    label: 'Security',
    shortLabel: 'Security',
    icon: ShieldCheck,
    description: 'RBAC scope, PHI guard, vault & audit trail',
    color: 'emerald',
    activeClass: 'text-emerald-600 dark:text-emerald-400 border-b-2 border-emerald-500 bg-emerald-50/50 dark:bg-emerald-900/10',
    dotColor: 'bg-emerald-500',
  },
  {
    id: 'cli',
    label: 'Agents CLI',
    shortLabel: 'CLI',
    icon: Terminal,
    description: 'Interactive skill runner terminal with autocomplete',
    color: 'slate',
    activeClass: 'text-slate-700 dark:text-slate-200 border-b-2 border-slate-500 bg-slate-50/50 dark:bg-slate-900/20',
    dotColor: 'bg-slate-500',
  },
];

export const AgentStudioView = () => {
  const [activeSubTab, setActiveSubTab] = useState('multi-agent');
  const activeTab = TABS.find(t => t.id === activeSubTab);

  const renderContent = () => {
    switch (activeSubTab) {
      case 'multi-agent': return <MultiAgentView />;
      case 'mcp-inspector': return <McpInspectorView />;
      case 'security': return <SecurityView />;
      case 'cli': return <AgentsCliView />;
      default: return <MultiAgentView />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Page Title */}
      <div className="glass-panel-heavy rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-l-4 border-l-teal-500">
        <div className="space-y-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-700 dark:text-slate-100 m-0">
            Tech Console
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xl">
            ADK debugging — multi-agent topology, MCP, security, and Agents CLI. Not for use during patient care.
          </p>
        </div>

        {/* Quick stat pills */}
        <div className="flex gap-3 shrink-0 flex-wrap">
          {[
            { label: '4 Agents', color: 'teal' },
            { label: '4 MCP Servers', color: 'amber' },
            { label: 'RBAC Active', color: 'emerald' },
            { label: 'PHI Guard ON', color: 'rose' },
          ].map(({ label, color }) => (
            <span
              key={label}
              className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border
                ${color === 'teal' ? 'bg-teal-50 text-teal-700 border-teal-200/70 dark:bg-teal-900/20 dark:text-teal-400 dark:border-teal-700/50' :
                  color === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200/70 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-700/50' :
                  color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200/70 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-700/50' :
                  'bg-rose-50 text-rose-700 border-rose-200/70 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-700/50'}`}
            >
              {label}
            </span>
          ))}
        </div>
      </div>

      {/* Sub-tab navigation */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-slate-200/70 dark:border-slate-700/50 overflow-x-auto">
          {TABS.map(tab => {
            const TabIcon = tab.icon;
            const isActive = activeSubTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-[11px] font-semibold transition-all whitespace-nowrap ${
                  isActive ? tab.activeClass : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                }`}
              >
                {isActive && <span className={`w-1.5 h-1.5 rounded-full ${tab.dotColor} shrink-0`} />}
                <TabIcon className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Active tab description bar */}
        {activeTab && (
          <div className="px-5 py-2.5 bg-slate-50/50 dark:bg-slate-900/30 border-b border-slate-200/50 dark:border-slate-700/30 flex items-center gap-2">
            <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
            <p className="text-[10px] text-slate-500 dark:text-slate-400">{activeTab.description}</p>
          </div>
        )}

        {/* Content area */}
        <div className="p-5">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
