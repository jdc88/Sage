import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Bot, ShieldCheck, PlugZap, Wrench, CheckCircle2, AlertTriangle } from 'lucide-react';

export const AgentConceptsPanel = () => {
  const { agentRegistry, mcpServers, securityControls, securityEvents, agentSkills } = useDashboard();

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
      <div className="xl:col-span-5 glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-teal-500" />
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Multi-Agent Control Plane</h3>
            <p className="text-[10px] text-slate-600">Frontend demonstration of agent roles, skills, and tool routing</p>
          </div>
        </div>

        <div className="space-y-3">
          {agentRegistry.map((agent) => (
            <div key={agent.id} className="surface-card rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 dark:text-slate-100">{agent.name}</h4>
                  <p className="text-[10px] text-slate-600 dark:text-slate-400">{agent.role}</p>
                </div>
                <span className="sage-badge clinical-status bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35">
                  {agent.status}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Model: {agent.model}</p>
              <div className="grid grid-cols-2 gap-3 text-[10px]">
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">Skills</p>
                  <p className="text-slate-600 dark:text-slate-400">{agent.skills.join(', ')}</p>
                </div>
                <div>
                  <p className="font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300">MCP Tools</p>
                  <p className="text-slate-600 dark:text-slate-400">{agent.mcpTools.join(', ')}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="xl:col-span-4 glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <PlugZap className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Mock MCP Servers</h3>
            <p className="text-[10px] text-slate-600">Tool endpoints that the agents would call in a real system</p>
          </div>
        </div>

        <div className="space-y-3">
          {mcpServers.map((server) => (
            <div key={server.id} className="surface-card rounded-xl p-4">
              <div className="flex items-center justify-between gap-3">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-100">{server.name}</h4>
                <span className={`sage-badge clinical-status ${server.status === 'online' ? 'bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35' : 'bg-amber-100 text-amber-700 dark:bg-slate-950 dark:text-sage-ivory border-amber-400/40 dark:border-amber-300/35'}`}>
                  {server.status}
                </span>
              </div>
              <p className="text-[10px] font-mono text-slate-500 dark:text-slate-400 mt-1">Latency: {server.latency}</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2">{server.tools.join(' • ')}</p>
            </div>
          ))}
        </div>

        <div className="surface-card rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Wrench className="w-4 h-4 text-teal-500" />
            <h4 className="text-sm font-bold text-slate-700 dark:text-slate-100">Agents CLI Skills</h4>
          </div>
          <div className="space-y-2">
            {agentSkills.map((skill) => (
              <div key={skill.id} className="text-[10px]">
                <p className="font-mono text-slate-700 dark:text-slate-200">{skill.command}</p>
                <p className="text-slate-600 dark:text-slate-400">{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="xl:col-span-3 glass-panel rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Security Posture</h3>
            <p className="text-[10px] text-slate-600">Prototype-level controls demonstrating auth, vault, and audit concepts</p>
          </div>
        </div>

        <div className="space-y-3">
          {securityControls.map((control) => (
            <div key={control.id} className="surface-card rounded-xl p-4">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-100">{control.name}</h4>
                <span className="text-slate-600 dark:text-slate-300">
                  {control.status === 'healthy' || control.status === 'enforced' || control.status === 'active' || control.status === 'streaming'
                    ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    : <AlertTriangle className="w-4 h-4 text-amber-500" />}
                </span>
              </div>
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-500 dark:text-slate-400 mt-1">{control.status}</p>
              <p className="text-[10px] text-slate-600 dark:text-slate-400 mt-2">{control.detail}</p>
            </div>
          ))}
        </div>

        <div className="surface-card rounded-xl p-4">
          <h4 className="text-sm font-bold text-slate-700 dark:text-slate-100 mb-2">Recent Security Events</h4>
          <div className="space-y-2">
            {securityEvents.map((event) => (
              <div key={event.id} className="text-[10px]">
                <p className="font-semibold text-slate-700 dark:text-slate-200">{event.title}</p>
                <p className="text-slate-600 dark:text-slate-400">{event.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
