import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { AGENT_REGISTRY } from '../context/DashboardContext';
import { Bot, MessageSquare, CheckCircle2, Clock, Zap, ArrowRight, Circle } from 'lucide-react';

const AGENT_COLORS = {
  orchestrator: { bg: 'bg-teal-500', light: 'bg-teal-50 dark:bg-teal-900/20', text: 'text-teal-700 dark:text-teal-300', border: 'border-teal-300/60 dark:border-teal-700/50', dot: 'bg-teal-500' },
  'scribe-agent': { bg: 'bg-indigo-500', light: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-300/60 dark:border-indigo-700/50', dot: 'bg-indigo-500' },
  'portal-agent': { bg: 'bg-amber-500', light: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-300/60 dark:border-amber-700/50', dot: 'bg-amber-500' },
  'rcm-agent': { bg: 'bg-rose-500', light: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-300/60 dark:border-rose-700/50', dot: 'bg-rose-500' },
};

const TASK_STATUS_STYLES = {
  active: 'text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-900/20 border-teal-300/50',
  done: 'text-slate-400 dark:text-slate-500 bg-slate-50 dark:bg-slate-900 border-slate-200/50 dark:border-slate-800',
  pending: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-300/50',
};

const MESSAGE_TYPE_STYLES = {
  task: 'border-l-teal-400 bg-teal-50/50 dark:bg-teal-900/10',
  response: 'border-l-emerald-400 bg-emerald-50/50 dark:bg-emerald-900/10',
  forward: 'border-l-amber-400 bg-amber-50/50 dark:bg-amber-900/10',
};

const AGENT_NAMES = {
  orchestrator: 'Orchestrator',
  'scribe-agent': 'Scribe',
  'portal-agent': 'Portal',
  'rcm-agent': 'RCM',
};

// SVG Topology Graph
const TopologyGraph = ({ selectedAgent, onSelectAgent }) => {
  const agents = AGENT_REGISTRY;
  const orchestrator = agents.find(a => a.id === 'orchestrator');
  const subAgents = agents.filter(a => a.id !== 'orchestrator');

  const cx = 280, cy = 120;
  const subPositions = [
    { x: 100, y: 260 },
    { x: 280, y: 280 },
    { x: 460, y: 260 },
  ];

  return (
    <div className="relative w-full overflow-x-auto">
      <svg viewBox="0 0 560 340" className="w-full max-w-lg mx-auto" style={{ minHeight: 240 }}>
        <defs>
          <marker id="arrow-teal" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#869b8b" />
          </marker>
          <marker id="arrow-return" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#9cb5ad" opacity="0.5" />
          </marker>
          <filter id="node-glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Edges from orchestrator to sub-agents */}
        {subAgents.map((agent, i) => {
          const pos = subPositions[i];
          const isActive = selectedAgent === agent.id || selectedAgent === 'orchestrator';
          return (
            <g key={agent.id}>
              <line
                x1={cx} y1={cy + 28} x2={pos.x} y2={pos.y - 28}
                stroke={isActive ? '#869b8b' : '#a9baab'}
                strokeWidth={isActive ? 2 : 1}
                strokeDasharray={isActive ? 'none' : '4 4'}
                opacity={isActive ? 1 : 0.4}
                markerEnd="url(#arrow-teal)"
                className="transition-all duration-500"
              />
              {/* Animated data packet on active edges */}
              {isActive && (
                <circle r="4" fill="#869b8b" opacity="0.8">
                  <animateMotion dur={`${2 + i * 0.5}s`} repeatCount="indefinite" path={`M${cx},${cy + 28} L${pos.x},${pos.y - 28}`} />
                </circle>
              )}
            </g>
          );
        })}

        {/* Orchestrator node */}
        <g
          onClick={() => onSelectAgent(selectedAgent === 'orchestrator' ? null : 'orchestrator')}
          style={{ cursor: 'pointer' }}
        >
          <circle
            cx={cx} cy={cy} r={34}
            fill={selectedAgent === 'orchestrator' ? '#647b6a' : '#869b8b'}
            className="transition-all duration-300"
            filter="url(#node-glow)"
          />
          <circle cx={cx} cy={cy} r={34} fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.3" />
          <text x={cx} y={cy - 8} textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">
            {'\u25C6'}
          </text>
          <text x={cx} y={cy + 4} textAnchor="middle" fill="white" fontSize="9" fontWeight="bold">
            ORCHESTRATOR
          </text>
          <text x={cx} y={cy + 15} textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="7.5">
            gemini-2.5-pro
          </text>
          {/* Status pulse */}
          <circle cx={cx + 24} cy={cy - 24} r={5} fill="#10b981" />
          <circle cx={cx + 24} cy={cy - 24} r={5} fill="#10b981" opacity="0.5">
            <animate attributeName="r" from="5" to="9" dur="1.5s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="1.5s" repeatCount="indefinite" />
          </circle>
        </g>

        {/* Sub-agent nodes */}
        {subAgents.map((agent, i) => {
          const pos = subPositions[i];
          const col = AGENT_COLORS[agent.id] || AGENT_COLORS['scribe-agent'];
          const isSelected = selectedAgent === agent.id;
          const dotColors = {
            'scribe-agent': '#6366f1',
            'portal-agent': '#f59e0b',
            'rcm-agent': '#f43f5e',
          };
          const fillColor = dotColors[agent.id] || '#647b6a';

          return (
            <g
              key={agent.id}
              onClick={() => onSelectAgent(isSelected ? null : agent.id)}
              style={{ cursor: 'pointer' }}
            >
              <rect
                x={pos.x - 52} y={pos.y - 26} width={104} height={52}
                rx={10}
                fill={isSelected ? fillColor : '#f7faf8'}
                stroke={fillColor}
                strokeWidth={isSelected ? 2.5 : 1.5}
                strokeOpacity={isSelected ? 1 : 0.5}
                className="dark:fill-slate-900 transition-all duration-300"
                filter={isSelected ? 'url(#node-glow)' : 'none'}
              />
              <text
                x={pos.x} y={pos.y - 8}
                textAnchor="middle"
                fill={isSelected ? 'white' : fillColor}
                fontSize="9.5" fontWeight="bold"
                className="dark:fill-white transition-colors duration-300"
              >
                {agent.name.toUpperCase()}
              </text>
              <text
                x={pos.x} y={pos.y + 4}
                textAnchor="middle"
                fill={isSelected ? 'rgba(255,255,255,0.8)' : '#748879'}
                fontSize="7.5"
              >
                {agent.model}
              </text>
              <text
                x={pos.x} y={pos.y + 16}
                textAnchor="middle"
                fill={isSelected ? 'rgba(255,255,255,0.7)' : '#9cb5ad'}
                fontSize="7"
              >
                {agent.skills.length} skills · {agent.mcpTools.length} tools
              </text>
              {/* Status dot */}
              <circle cx={pos.x + 44} cy={pos.y - 20} r={4} fill="#10b981" />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export const MultiAgentView = () => {
  const { agentMessages, agentTaskQueues } = useDashboard();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const displayedAgent = selectedAgent
    ? AGENT_REGISTRY.find(a => a.id === selectedAgent)
    : null;

  const agentQueue = selectedAgent ? (agentTaskQueues[selectedAgent] || []) : [];
  const colors = selectedAgent ? (AGENT_COLORS[selectedAgent] || AGENT_COLORS['scribe-agent']) : null;

  const recentMessages = [...agentMessages].reverse().slice(0, 12);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-teal-50 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-700/50 flex items-center justify-center">
          <Bot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-100">Multi-Agent Topology</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Live orchestrator view — click a node to inspect its task queue</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-mono bg-teal-50 dark:bg-teal-900/20 border border-teal-200/60 dark:border-teal-700/40 text-teal-600 dark:text-teal-400 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          {AGENT_REGISTRY.length} AGENTS ACTIVE
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Topology + Agent Cards */}
        <div className="xl:col-span-7 space-y-4">
          {/* Topology Graph */}
          <div className="glass-panel rounded-2xl p-5">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Agent Orchestration Graph
            </p>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-4">Click a node to inspect its task queue and capabilities</p>
            <TopologyGraph selectedAgent={selectedAgent} onSelectAgent={setSelectedAgent} />
            {!selectedAgent && (
              <p className="text-center text-[10px] text-slate-400 dark:text-slate-500 mt-2 italic">← Select an agent node to inspect</p>
            )}
          </div>

          {/* Agent Detail Panel (when selected) */}
          {displayedAgent && colors && (
            <div className={`glass-panel rounded-2xl p-5 border-l-4 ${colors.border.split(' ')[0].replace('border', 'border-l')} transition-all`}>
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-2.5 h-2.5 rounded-full ${colors.dot} animate-pulse`} />
                    <h3 className="text-sm font-bold text-slate-700 dark:text-slate-100">{displayedAgent.name}</h3>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${colors.light} ${colors.text} ${colors.border}`}>
                      {displayedAgent.status}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{displayedAgent.role}</p>
                </div>
                <code className="text-[10px] font-mono text-slate-400 bg-slate-100 dark:bg-slate-900 px-2 py-0.5 rounded border border-slate-200/70 dark:border-slate-700/50">{displayedAgent.model}</code>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Skills</p>
                  <div className="space-y-1">
                    {displayedAgent.skills.map(skill => (
                      <div key={skill} className={`text-[10px] font-mono px-2 py-1 rounded-lg border ${colors.light} ${colors.text} ${colors.border}`}>{skill}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">MCP Tools</p>
                  <div className="space-y-1">
                    {displayedAgent.mcpTools.map(tool => (
                      <div key={tool} className="text-[10px] font-mono px-2 py-1 rounded-lg border bg-slate-50 dark:bg-slate-900/50 border-slate-200/60 dark:border-slate-700/50 text-slate-600 dark:text-slate-400">{tool}</div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task Queue */}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2 flex items-center gap-1.5">
                  <Zap className="w-3 h-3" /> Task Queue ({agentQueue.length})
                </p>
                <div className="space-y-1.5">
                  {agentQueue.length === 0 && (
                    <p className="text-[10px] text-slate-400 italic">No tasks in queue</p>
                  )}
                  {agentQueue.map(task => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-[10px] ${TASK_STATUS_STYLES[task.status]}`}
                    >
                      {task.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse shrink-0" />}
                      {task.status === 'done' && <CheckCircle2 className="w-3 h-3 text-slate-400 shrink-0" />}
                      {task.status === 'pending' && <Clock className="w-3 h-3 text-amber-500 shrink-0" />}
                      <span className="flex-1 font-medium">{task.task}</span>
                      <span className="shrink-0 opacity-60">{task.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Bus Log */}
        <div className="xl:col-span-5">
          <div className="glass-panel rounded-2xl p-5 h-full">
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100">Agent Message Bus</h3>
              <span className="ml-auto flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />LIVE
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
              {recentMessages.map(msg => {
                const fromAgent = AGENT_REGISTRY.find(a => a.id === msg.from);
                const toAgent = AGENT_REGISTRY.find(a => a.id === msg.to);
                const msgStyle = MESSAGE_TYPE_STYLES[msg.type] || MESSAGE_TYPE_STYLES.task;
                return (
                  <div key={msg.id} className={`border-l-2 pl-3 py-2 pr-2 rounded-r-lg text-[10px] ${msgStyle}`}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {AGENT_NAMES[msg.from] || msg.from}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-400" />
                      <span className="font-bold text-slate-700 dark:text-slate-200">
                        {AGENT_NAMES[msg.to] || msg.to}
                      </span>
                      <span className={`ml-auto px-1.5 py-0.5 rounded text-[9px] font-bold uppercase
                        ${msg.type === 'task' ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' :
                          msg.type === 'response' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                          'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                        {msg.type}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-400 leading-normal">{msg.content}</p>
                    <p className="text-slate-400 dark:text-slate-500 mt-1">{msg.time}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
