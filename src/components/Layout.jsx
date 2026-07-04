import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  LayoutDashboard, 
  Mic, 
  FileCheck, 
  Users, 
  Activity, 
  Terminal, 
  ShieldAlert, 
  Leaf,
  Menu, 
  X,
  Brain,
  Bot,
} from 'lucide-react';

export const Layout = ({ children }) => {
  const { activeTab, setActiveTab, agentLogs, eegData, isRecording } = useDashboard();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Take the most recent log for the footer ticker
  const latestLog = agentLogs[agentLogs.length - 1];

  // Sidebar is organized to follow the real clinical journey, step by step.
  const navGroups = [
    {
      label: null,
      items: [
        { id: 'overview', name: 'Overview', desc: 'Daily summary & status', icon: LayoutDashboard },
      ],
    },
    {
      label: 'Patient Journey',
      items: [
        { id: 'intake', name: 'Intake & Scheduling', desc: 'Booking & eligibility', icon: Users, step: 1 },
        { id: 'scribe', name: 'Ambient Scribe', desc: 'Visit notes & SOAP', icon: Mic, step: 2, badge: isRecording ? 'REC' : null },
        { id: 'prior-auth', name: 'Prior Auth Portal', desc: 'Insurance approvals', icon: FileCheck, step: 3 },
        { id: 'rcm-cds', name: 'CDS Monitor & RCM', desc: 'Alerts & billing', icon: Activity, step: 4 },
      ],
    },
    {
      label: 'System',
      items: [
        { id: 'agent-studio', name: 'Agent Studio', desc: 'Agent, MCP & security console', icon: Bot, badge: 'ADK' },
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-200 bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-sage-ivory font-sans">
      
      {/* Top Banner (Clinical Agent status bar) */}
      <header className="sticky top-0 z-40 w-full glass-panel-heavy border-b flex items-center justify-between px-4 py-3 h-16">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-sage-ivory transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight m-0 text-slate-700 dark:text-slate-100 flex items-center gap-1.5">
                <span className="inline-flex items-center justify-center rounded-full bg-teal-100 dark:bg-teal-900/60 text-teal-700 dark:text-teal-300 p-1.5 border border-teal-300/70 dark:border-teal-700/70">
                  <Leaf className="w-[18px] h-[18px]" fill="currentColor" fillOpacity={0.18} />
                </span>
                Sage Clinical Agent
                <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded-md bg-teal-500/10 text-teal-600 dark:bg-slate-800 dark:text-sage-ivory border border-teal-500/20 dark:border-sage-dark-mid/50">
                  Active
                </span>
              </h1>
              <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium hidden sm:block">
                Autonomous Healthcare Scribe & Automation Engine
              </p>
            </div>
          </div>
        </div>

        {/* Real-time EEG brainwave ticker inside Header */}
        <div className="hidden md:flex items-center gap-4 bg-slate-150 dark:bg-slate-900 border border-slate-300/50 dark:border-slate-700/50 px-3 py-1.5 rounded-xl">
          <div className="flex items-center gap-1.5 text-teal-600 dark:text-teal-400">
            <Brain className="w-4 h-4" />
            <span className="text-xs font-mono font-bold tracking-wider">CDS STREAM:</span>
          </div>
          <svg className="w-28 h-6 text-teal-600 dark:text-teal-400" viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              points={eegData.map((val, idx) => `${(idx / (eegData.length - 1)) * 100},${val}`).join(' ')}
            />
          </svg>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono whitespace-nowrap">
            ICP: 11 mmHg · Alpha: Stable
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center font-bold text-sm text-teal-600 dark:text-sage-ivory">
              EY
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-semibold dark:text-sage-ivory">Dr. Evelyn Young</p>
              <p className="text-[10px] text-slate-400 dark:text-sage-ivory-muted">Neurology Specialist</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main container */}
      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Sidebar Navigation */}
        <aside 
          className={`absolute lg:relative z-30 h-[calc(100vh-4rem)] glass-panel border-r flex flex-col justify-between transition-all duration-300 ${
            sidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full lg:w-20 lg:translate-x-0'
          }`}
        >
          <div className="p-4 flex flex-col gap-5">
            {navGroups.map((group, groupIdx) => (
              <div key={group.label || `group-${groupIdx}`} className="flex flex-col gap-1.5">
                {group.label && (
                  <p className={`px-3 mb-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-sage-ivory-muted ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                    {group.label}
                  </p>
                )}
                {group.items.map(item => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={item.name}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 text-left relative group ${
                        isActive
                          ? 'bg-teal-500/10 text-teal-600 dark:bg-slate-800 dark:text-sage-ivory font-semibold shadow-sm border border-teal-500/20 dark:border-sage-dark-mid/50'
                          : 'text-slate-600 dark:text-sage-ivory-muted hover:bg-slate-150 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-105 ${isActive ? 'text-teal-500 dark:text-sage-ivory' : 'text-slate-400 dark:text-sage-ivory-muted'}`} />
                      <span className={`flex flex-col min-w-0 transition-opacity duration-300 ${!sidebarOpen ? 'lg:opacity-0 lg:w-0 overflow-hidden' : 'opacity-100'}`}>
                        <span className="text-sm tracking-wide leading-tight truncate">{item.name}</span>
                        {item.desc && (
                          <span className={`text-[10px] leading-tight truncate ${isActive ? 'text-teal-600/70 dark:text-sage-ivory-muted' : 'text-slate-400 dark:text-sage-ivory-muted'}`}>
                            {item.desc}
                          </span>
                        )}
                      </span>
                      {item.badge ? (
                        <span className={`ml-auto text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                          item.badge === 'ADK'
                            ? 'bg-teal-500/20 text-teal-600 dark:bg-teal-900/40 dark:text-teal-400 border border-teal-400/30'
                            : 'bg-rose-500 text-white animate-pulse'
                        } ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                          {item.badge}
                        </span>
                      ) : item.step ? (
                        <span className={`ml-auto shrink-0 w-5 h-5 flex items-center justify-center text-[10px] font-bold rounded-full border ${
                          isActive
                            ? 'bg-teal-500 text-white border-teal-500'
                            : 'bg-slate-100 text-slate-500 border-slate-300/60 dark:bg-slate-800 dark:text-sage-ivory-muted dark:border-slate-700'
                        } ${!sidebarOpen ? 'lg:hidden' : ''}`}>
                          {item.step}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Sidebar Footer - Agent Status */}
          <div className={`p-4 border-t border-slate-200/50 dark:border-slate-800/50 flex flex-col gap-2 ${!sidebarOpen ? 'lg:hidden' : ''}`}>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-150 dark:bg-slate-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="w-2 h-2 rounded-full bg-emerald-500 absolute" />
              <p className="text-[11px] font-medium text-slate-600 dark:text-slate-400">
                Agent Systems Online
              </p>
            </div>
            <p className="text-[10px] text-slate-400 dark:text-sage-ivory text-center">
              v1.2.4-stable
            </p>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 h-[calc(100vh-4rem)] overflow-y-auto px-4 py-6 md:px-6 relative bg-slate-100 dark:bg-slate-950">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

      {/* Footer System Log Ticker */}
      <footer className="h-10 border-t glass-panel flex items-center px-4 justify-between z-40 text-xs shrink-0 select-none">
        <div className="flex items-center gap-2 truncate text-slate-600 dark:text-slate-400 max-w-[80%]">
          <Terminal className="w-3.5 h-3.5 text-teal-600 shrink-0" />
          <span className="font-semibold text-[10px] uppercase tracking-wider text-slate-600 dark:text-sage-ivory shrink-0">System Activity:</span>
          {latestLog ? (
            <span className="font-mono text-[11px] truncate">
              [{latestLog.time}] {latestLog.text}
            </span>
          ) : (
            <span className="font-mono text-[11px]">System idle. Awaiting inputs.</span>
          )}
        </div>
        
        <div className="flex items-center gap-4 text-[10px] font-medium text-slate-400 dark:text-sage-ivory">
          <span className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-teal-500" />
            EEG Stream: ON
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Portal API: CONNECTED
          </span>
        </div>
      </footer>
    </div>
  );
};
