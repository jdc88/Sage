import React, { useState, useRef, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AGENT_SKILLS } from '../context/DashboardContext';
import { isBackendConfigured, runAgentCommandRemote } from '../api/agentApi';
import { Terminal, ChevronRight, CornerDownLeft, Clock, Layers, ShieldCheck, PlugZap, Bot, Wrench } from 'lucide-react';

const SKILL_CATEGORY_COLORS = {
  orchestration: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border-teal-200/70 dark:border-teal-700/50',
  mcp: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200/70 dark:border-amber-700/50',
  security: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-200/70 dark:border-rose-700/50',
  skill: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200/70 dark:border-indigo-700/50',
};

const SKILL_CATEGORY_ICONS = {
  orchestration: Bot,
  mcp: PlugZap,
  security: ShieldCheck,
  skill: Wrench,
};

const LOG_TYPE_STYLES = {
  system:  'text-slate-400',
  portal:  'text-amber-400',
  scribe:  'text-indigo-400',
  rcm:     'text-rose-400',
  success: 'text-emerald-400',
  error:   'text-rose-500',
};

export const AgentsCliView = () => {
  const { agentLogs, runAgentCommand, agentSkills } = useDashboard();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const logEndRef = useRef(null);
  const [cliOutput, setCliOutput] = useState([
    { id: 'boot-1', text: '╔═══════════════════════════════════════════════════╗', type: 'system', time: '' },
    { id: 'boot-2', text: '║     Sage Clinical Agent — Agents CLI v1.2.4       ║', type: 'success', time: '' },
    { id: 'boot-3', text: '║     Multi-Agent Orchestration Terminal            ║', type: 'system', time: '' },
    { id: 'boot-4', text: '╚═══════════════════════════════════════════════════╝', type: 'system', time: '' },
    { id: 'boot-5', text: '', type: 'system', time: '' },
    { id: 'boot-6', text: 'Type a command below or click a skill chip to get started.', type: 'system', time: '' },
    { id: 'boot-7', text: 'Available: /agents list  /mcp tools  /mcp ping  /security audit  /security phi-log  /skill run <skill>  /agent status <id>', type: 'system', time: '' },
  ]);

  const allCommands = AGENT_SKILLS.map(s => s.command);

  // Auto-scroll to bottom when new output arrives
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [cliOutput]);

  const handleInput = (val) => {
    setInput(val);
    setHistoryIdx(-1);
    if (val.length > 0) {
      const matches = allCommands.filter(cmd => cmd.startsWith(val) && cmd !== val);
      setSuggestions(matches.slice(0, 4));
    } else {
      setSuggestions([]);
    }
  };

  const submit = async (cmd) => {
    const command = (cmd || input).trim();
    if (!command) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const userEntry = { id: Date.now(), text: `$ ${command}`, type: 'user-input', time };
    setCliOutput(prev => [...prev, userEntry]);

    let formatted = [];

    if (isBackendConfigured()) {
      try {
        const remote = await runAgentCommandRemote(command);
        formatted = (remote?.logs || []).map((e, i) => ({
          id: Date.now() + i + 1,
          text: e.text,
          type: e.type,
          time,
        }));
      } catch {
        formatted = (runAgentCommand(command) || []).map((e, i) => ({
          id: e.id || Date.now() + i + 1,
          text: e.text,
          type: e.type,
          time: e.time || time,
        }));
        formatted.unshift({
          id: Date.now() - 1,
          text: '[Agents CLI] Backend unavailable — using local simulator.',
          type: 'system',
          time,
        });
      }
    } else {
      formatted = (runAgentCommand(command) || []).map((e, i) => ({
        id: e.id || Date.now() + i + 1,
        text: e.text,
        type: e.type,
        time: e.time || time,
      }));
    }

    setCliOutput(prev => [...prev, ...formatted, { id: Date.now() + 9999, text: '', type: 'system', time: '' }]);
    setHistory(prev => [command, ...prev].slice(0, 50));
    setInput('');
    setSuggestions([]);
    setHistoryIdx(-1);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (suggestions.length > 0 && input.length > 0 && suggestions[0].startsWith(input) && suggestions[0] !== input) {
        // Tab-complete on Enter if suggestion is unambiguous
      }
      submit();
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setInput(suggestions[0]);
        setSuggestions([]);
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(nextIdx);
      if (history[nextIdx]) setInput(history[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx >= 0 ? history[nextIdx] : '');
    } else if (e.key === 'Escape') {
      setSuggestions([]);
    }
  };

  const categories = ['orchestration', 'mcp', 'security', 'skill'];

  return (
    <div className="space-y-5 h-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-700 flex items-center justify-center">
            <Terminal className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-700 dark:text-slate-100">Agents CLI Terminal</h2>
            <p className="text-[10px] text-slate-500 dark:text-slate-400">Interactive multi-agent command interface with skill execution</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/70 dark:border-emerald-700/40 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          AGENTS ONLINE
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Terminal Panel */}
        <div className="xl:col-span-8 flex flex-col gap-3">
          {/* Terminal output */}
          <div
            className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col overflow-hidden"
            style={{ minHeight: '480px', maxHeight: '560px' }}
            onClick={() => inputRef.current?.focus()}
          >
            {/* Terminal chrome */}
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-800 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-rose-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>
              <span className="text-[10px] font-mono text-slate-500 ml-2">sage-agents-cli — bash</span>
              <div className="ml-auto flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-600" />
                <span className="text-[10px] font-mono text-slate-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>

            {/* Log output */}
            <div className="flex-1 overflow-y-auto px-4 py-3 font-mono text-[11px] leading-relaxed space-y-0.5">
              {cliOutput.map((entry) => {
                if (entry.text === '') return <div key={entry.id} className="h-2" />;
                const style = entry.type === 'user-input'
                  ? 'text-white font-semibold'
                  : (LOG_TYPE_STYLES[entry.type] || 'text-slate-400');
                return (
                  <div key={entry.id} className={`${style} flex items-start gap-2`}>
                    {entry.time && entry.type !== 'user-input' && (
                      <span className="text-slate-600 shrink-0 text-[10px]">[{entry.time}]</span>
                    )}
                    <span className="break-all">{entry.text}</span>
                  </div>
                );
              })}
              <div ref={logEndRef} />
            </div>

            {/* Input row */}
            <div className="border-t border-slate-800 px-4 py-3 shrink-0 relative">
              {suggestions.length > 0 && (
                <div className="absolute bottom-full left-4 mb-1 bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-lg z-10">
                  {suggestions.map((sug, i) => (
                    <button
                      key={i}
                      className="w-full text-left px-3 py-1.5 text-[11px] font-mono text-slate-300 hover:bg-slate-800 flex items-center gap-2"
                      onMouseDown={(e) => { e.preventDefault(); setInput(sug); setSuggestions([]); inputRef.current?.focus(); }}
                    >
                      <ChevronRight className="w-3 h-3 text-teal-500 shrink-0" />
                      {sug}
                    </button>
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold text-sm shrink-0">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type a command… (Tab to autocomplete, ↑↓ for history)"
                  className="flex-1 bg-transparent text-white text-[12px] font-mono outline-none placeholder:text-slate-600 caret-emerald-400"
                  autoFocus
                  spellCheck={false}
                />
                <button
                  onClick={() => submit()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors text-[10px] font-mono"
                >
                  <CornerDownLeft className="w-3 h-3" />
                  Run
                </button>
              </div>
            </div>
          </div>

          {/* History */}
          {history.length > 0 && (
            <div className="glass-panel rounded-xl px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                <Clock className="w-3 h-3" /> Command History
              </p>
              <div className="flex flex-wrap gap-1.5">
                {history.slice(0, 10).map((cmd, i) => (
                  <button
                    key={i}
                    onClick={() => submit(cmd)}
                    className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/50 transition-colors"
                  >
                    {cmd}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Skill Picker Panel */}
        <div className="xl:col-span-4 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-4 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100">Skill Picker</h3>
              <span className="ml-auto text-[10px] text-slate-500 dark:text-slate-400">Click to run</span>
            </div>

            <div className="space-y-4">
              {categories.map(cat => {
                const skills = AGENT_SKILLS.filter(s => s.category === cat);
                const colorClass = SKILL_CATEGORY_COLORS[cat];
                const Icon = SKILL_CATEGORY_ICONS[cat];
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Icon className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">{cat}</p>
                    </div>
                    <div className="space-y-1.5">
                      {skills.map(skill => (
                        <button
                          key={skill.id}
                          onClick={() => submit(skill.command)}
                          className={`w-full text-left rounded-lg px-3 py-2 border transition-all hover:opacity-90 active:scale-[0.98] ${colorClass}`}
                        >
                          <p className="font-mono text-[11px] font-bold">{skill.command}</p>
                          <p className="text-[10px] opacity-70 mt-0.5 leading-normal">{skill.description}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keyboard shortcuts */}
          <div className="glass-panel rounded-xl p-3">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">Keyboard Shortcuts</p>
            <div className="space-y-1 text-[10px]">
              {[['↵ Enter', 'Run command'], ['Tab', 'Autocomplete'], ['↑ / ↓', 'History'], ['Esc', 'Dismiss suggestions']].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <code className="bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 px-1.5 py-0.5 rounded text-[9px] font-mono text-slate-600 dark:text-slate-400">{key}</code>
                  <span className="text-slate-500 dark:text-slate-400">{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
