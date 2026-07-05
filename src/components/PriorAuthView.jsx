import React, { useState, useEffect, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Terminal, Leaf, Sprout, HelpCircle, AlertCircle, Send, Bot, ShieldCheck } from 'lucide-react';

export const PriorAuthView = ({ clinicalMode = false, patientName }) => {
  const { claims, agentLogs, runAgentCommand, agentSkills } = useDashboard();
  const [filter, setFilter] = useState('All');
  const [commandInput, setCommandInput] = useState('/agents list');
  
  const terminalEndRef = useRef(null);

  // Auto-scroll the terminal console to the bottom on new logs
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [agentLogs]);

  // Filtered claims
  const scopedClaims = clinicalMode && patientName
    ? claims.filter(c => c.patient === patientName)
    : claims;

  const filteredClaims = filter === 'All'
    ? scopedClaims
    : scopedClaims.filter(c => c.status === filter);

  // Colors for claims status
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35';
      case 'In Review':
        return 'bg-teal-100 text-teal-700 dark:bg-slate-950 dark:text-sage-ivory border-teal-400/40 dark:border-teal-300/35';
      case 'Additional Info':
        return 'bg-amber-100 text-amber-700 dark:bg-slate-950 dark:text-sage-ivory border-amber-400/40 dark:border-amber-300/35';
      case 'Denied':
        return 'bg-indigo-100 text-indigo-700 dark:bg-slate-950 dark:text-sage-ivory border-indigo-400/40 dark:border-indigo-300/35';
      default:
        return 'bg-slate-150 dark:bg-slate-950 text-slate-700 dark:text-sage-ivory border-slate-300 dark:border-sage-dark-mid/50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Approved':
        return <Leaf className="w-4 h-4 text-emerald-600 shrink-0" fill="currentColor" fillOpacity={0.25} />;
      case 'In Review':
        return <Sprout className="w-4 h-4 text-teal-600 shrink-0" />;
      case 'Additional Info':
        return <HelpCircle className="w-4 h-4 text-amber-600 shrink-0" />;
      case 'Denied':
        return <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />;
      default:
        return null;
    }
  };

  return (
    <div className={`grid grid-cols-1 ${clinicalMode ? '' : 'lg:grid-cols-12'} gap-8`}>
      <div className={`${clinicalMode ? '' : 'lg:col-span-7'} flex flex-col gap-4`}>
        <div className={`surface-card rounded-2xl p-6 flex flex-col ${clinicalMode ? '' : 'h-[550px]'}`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Prior Authorizations</h3>
              <p className="text-[10px] text-slate-600">Insurer portal automation pipelines status</p>
            </div>
            
            {/* Status filters */}
            <div className="flex gap-1 bg-slate-150 dark:bg-slate-900 p-1 rounded-xl border border-slate-300/50 dark:border-slate-700/50 text-[10px] font-bold self-start">
              {['All', 'Approved', 'In Review', 'Additional Info', 'Denied'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-2 py-1.5 rounded-lg transition-colors ${
                    filter === status 
                      ? 'bg-white dark:bg-slate-800 text-slate-700 dark:text-sage-dark-light shadow-sm' 
                      : 'text-slate-500 dark:text-sage-dark-light hover:text-slate-850 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Claims Grid Content */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
            {filteredClaims.length === 0 ? (
              <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-8">
                No prior authorizations for this patient.
              </p>
            ) : (
            filteredClaims.map((claim) => (
              <div 
                key={claim.id} 
                className="p-4 rounded-xl border border-slate-250/60 dark:border-slate-700 surface-card hover:border-teal-400/50 dark:hover:border-teal-600/40 transition-all duration-150 flex flex-col gap-3 group"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 font-bold">
                      {claim.id} • {claim.date}
                    </span>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-sage-dark-light mt-0.5 group-hover:text-teal-600 dark:group-hover:text-teal-300 transition-colors">
                      {claim.patient}
                    </h4>
                  </div>
                  <div className={`clinical-status flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyles(claim.status)}`}>
                    {getStatusIcon(claim.status)}
                    {claim.status}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">CPT/Procedure</span>
                    <p className="font-medium mt-0.5 truncate text-slate-700 dark:text-sage-dark-light">{claim.procedure}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Payor Portal</span>
                    <p className="font-medium mt-0.5 truncate text-slate-700 dark:text-sage-dark-light">{claim.insurer}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono font-medium text-slate-600">
                    <span className="truncate">Active task: {claim.log}</span>
                    <span>{claim.progress}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-550 rounded-full ${
                        claim.status === 'Denied' 
                          ? 'bg-rose-500' 
                          : claim.status === 'Approved' 
                            ? 'bg-emerald-500' 
                            : 'bg-teal-500'
                      }`}
                      style={{ width: `${claim.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
            )}
          </div>
        </div>
      </div>

      {!clinicalMode && (
      <div className="lg:col-span-5 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-500" />
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Agents CLI</h3>
                <p className="text-[10px] text-slate-600">Run demo commands for agents, MCP tools, skills, and security</p>
              </div>
            </div>
            <span className="sage-badge clinical-status bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35">
              Demo Mode
            </span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              runAgentCommand(commandInput);
              setCommandInput('');
            }}
            className="flex items-center gap-2"
          >
            <div className="flex items-center gap-2 flex-1 rounded-xl border border-slate-300/60 dark:border-slate-700/50 bg-slate-100 dark:bg-slate-900 px-3 py-2">
              <span className="text-[10px] font-mono text-teal-600 dark:text-sage-ivory">agents-cli$</span>
              <input
                type="text"
                value={commandInput}
                onChange={(e) => setCommandInput(e.target.value)}
                className="flex-1 bg-transparent outline-none text-xs font-mono text-slate-700 dark:text-sage-ivory"
                placeholder="/agents list"
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-xl bg-teal-500 hover:bg-teal-600 text-white px-3 py-2 text-xs font-semibold transition-colors"
            >
              <Send className="w-3.5 h-3.5" />
              Run
            </button>
          </form>

          <div className="flex flex-wrap gap-2">
            {agentSkills.map((skill) => (
              <button
                key={skill.id}
                onClick={() => setCommandInput(skill.command)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-mono bg-slate-150 dark:bg-slate-900 text-slate-700 dark:text-sage-ivory border border-slate-300/50 dark:border-slate-700/50 hover:border-teal-500/40 transition-colors"
              >
                {skill.command}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[10px] text-slate-600 dark:text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Commands are simulated locally and append to the shared agent activity log.
          </div>
        </div>

        <div className="glass-panel rounded-2xl p-5 flex flex-col h-[550px] bg-slate-950 border-slate-900 relative">
          <div className="absolute top-0 right-0 left-0 h-10 bg-slate-900 border-b border-slate-800 flex items-center px-4 justify-between z-10 shrink-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span className="text-xs font-mono font-bold text-slate-300 tracking-wider">
                SAGE_CLI_ENGINE:~
              </span>
            </div>
            
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-teal-500/80" />
            </div>
          </div>

          {/* Terminal log messages */}
          <div className="flex-1 overflow-y-auto font-mono text-[11px] leading-relaxed text-emerald-400 p-4 pt-12 space-y-2 mt-1 select-text scrollbar-thin scrollbar-thumb-slate-800 scroll-smooth terminal-glow">
            {agentLogs.map((log) => {
              let color = 'text-emerald-400';
              if (log.type === 'system') color = 'text-slate-400';
              if (log.type === 'scribe') color = 'text-amber-300';
              if (log.type === 'portal') color = 'text-teal-300';
              if (log.type === 'success') color = 'text-emerald-300 font-bold';
              if (log.type === 'rcm') color = 'text-indigo-300';

              return (
                <div key={log.id} className={`${color} break-words`}>
                  <span className="text-slate-500 mr-1.5 select-none">[{log.time}]</span>
                  {log.text}
                </div>
              );
            })}
            <div ref={terminalEndRef} />
          </div>

          {/* Prompt line (CLI indicator) */}
          <div className="pt-3 border-t border-slate-900 shrink-0 flex items-center gap-2 text-slate-500 font-mono text-xs select-none">
            <span className="text-teal-400">sys-agent$</span>
            <input 
              type="text" 
              readOnly 
              value="Use Agents CLI above: /agents list | /mcp tools | /security audit" 
              className="bg-transparent border-none outline-none text-slate-400 flex-1 pointer-events-none"
            />
            <span className="w-2 h-4 bg-teal-400 animate-pulse" />
          </div>
        </div>
      </div>
      )}

    </div>
  );
};
