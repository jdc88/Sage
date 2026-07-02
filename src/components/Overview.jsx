import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { 
  Sparkles, 
  CheckCircle, 
  Activity, 
  ArrowUpRight, 
  Mic, 
  FileCheck, 
  UserPlus, 
  TrendingUp, 
  Terminal, 
  Cpu,
  Bot,
  PlugZap,
  ShieldCheck,
  Wrench,
} from 'lucide-react';

export const Overview = () => {
  const { setActiveTab, agentLogs, claims, patientQueue, cdsAlerts } = useDashboard();

  // Get some statistics
  const activeLogs = agentLogs.slice(-3).reverse();
  const pendingClaimsCount = claims.filter(c => c.status === 'In Review').length;
  const pendingIntakeCount = patientQueue.filter(p => p.status === 'Pending').length;
  const activeAlertCount = cdsAlerts.filter(a => a.severity === 'danger' || a.severity === 'warning').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome & Status Hero */}
      <div className="glass-panel-heavy rounded-2xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 border-l-4 border-l-teal-500">
        <div className="space-y-2">
          <h2 className="text-xl font-bold tracking-tight text-slate-700 dark:text-slate-100 m-0 flex items-center gap-2">
            Welcome back, Dr. Evelyn Young
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl">
            Sage Clinical Agent is monitoring your intake queue, processing prior authorizations, and transcribing active examinations in the background.
          </p>
        </div>

        {/* Live System Stats */}
        <div className="flex gap-4 sm:gap-8 items-center shrink-0">
          <div className="text-left">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">EHR Link Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">Online & Syncing</span>
            </div>
          </div>
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />
          <div className="text-left">
            <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Active Tasks</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200">
                {pendingClaimsCount} Auth Pipelines
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1 */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/35 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-450 dark:text-slate-455 font-bold uppercase tracking-wider">
              Scribe Accuracy
            </span>
            <Mic className="w-4 h-4 text-teal-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-700 dark:text-slate-100">99.2%</h3>
            <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              +0.4% from last week
            </p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/35 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-455 dark:text-slate-460 font-bold uppercase tracking-wider">
              Prior Auths Approval
            </span>
            <FileCheck className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-700 dark:text-slate-100">84.0%</h3>
            <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
              <span className="text-emerald-500 font-bold font-mono">Auto-approved</span>
              via clearinghouse
            </p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/35 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-455 dark:text-slate-460 font-bold uppercase tracking-wider">
              Intake Reductions
            </span>
            <UserPlus className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-700 dark:text-slate-100">42.5%</h3>
            <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              Surpassed 40% goal
            </p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between hover:border-teal-500/35 transition-all duration-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-455 dark:text-slate-460 font-bold uppercase tracking-wider">
              CDS Alerts Ignored
            </span>
            <Activity className="w-4 h-4 text-amber-500 animate-pulse" />
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold font-mono tracking-tight text-slate-700 dark:text-slate-100">0%</h3>
            <p className="text-[10px] text-slate-600 mt-1 flex items-center gap-1">
              <span className="text-teal-500 font-bold font-mono">{activeAlertCount} active</span>
              alerts awaiting review
            </p>
          </div>
        </div>

      </div>

      {/* Main Grid: Modules Launchers & Activity logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Quick Launch Actions */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[360px]">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Sage Clinical Agent — Quick Launchers</h3>
              <p className="text-[10px] text-slate-600">Navigate directly to clinical agent pipelines</p>
            </div>

            <div className="grid grid-cols-2 gap-4 my-4">
              
              <button 
                onClick={() => setActiveTab('scribe')}
                className="p-4 rounded-xl border border-slate-300/60 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-150 dark:hover:bg-slate-900 text-left flex flex-col gap-2 transition-all group"
              >
                <Mic className="w-5 h-5 text-teal-500 group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    Ambient Scribe
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-normal">Dictation listener & SOAP note compiler</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('prior-auth')}
                className="p-4 rounded-xl border border-slate-300/60 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-150 dark:hover:bg-slate-900 text-left flex flex-col gap-2 transition-all group"
              >
                <FileCheck className="w-5 h-5 text-indigo-500 group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    Prior Auth Portal
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-normal">Monitor web portals and claim documents</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('intake')}
                className="p-4 rounded-xl border border-slate-300/60 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-150 dark:hover:bg-slate-900 text-left flex flex-col gap-2 transition-all group"
              >
                <UserPlus className="w-5 h-5 text-rose-500 group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    Intake & Check-in
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-normal">Manage patient scheduling & eligibility checks</p>
                </div>
              </button>

              <button 
                onClick={() => setActiveTab('rcm-cds')}
                className="p-4 rounded-xl border border-slate-300/60 dark:border-slate-700 hover:border-teal-500/50 hover:bg-slate-150 dark:hover:bg-slate-900 text-left flex flex-col gap-2 transition-all group"
              >
                <Activity className="w-5 h-5 text-amber-500 group-hover:scale-105 transition-transform" />
                <div>
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center justify-between">
                    CDS & RCM
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <p className="text-[10px] text-slate-600 mt-0.5 leading-normal">Review neurology CDS stream alerts & appeals billing</p>
                </div>
              </button>

            </div>
          </div>
        </div>

        {/* Real-time agent activity logs snippet */}
        <div className="lg:col-span-6 flex flex-col gap-4">
          <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[360px] bg-slate-950 border-slate-900">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-900 shrink-0">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-teal-400" />
                  <h3 className="font-mono text-xs font-bold text-sage-dark-light tracking-wider">
                    LATEST_AGENT_STREAM
                  </h3>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] font-mono text-emerald-500 font-bold">LIVE</span>
                </div>
              </div>

              {/* Ticker logs */}
              <div className="space-y-3 font-mono text-[10px] py-4 leading-relaxed max-h-[220px] overflow-hidden text-emerald-400">
                {activeLogs.map((log) => (
                  <div key={log.id} className="p-2 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="text-slate-400">[{log.time}]</span>{' '}
                    <span className="font-semibold text-slate-300 uppercase mr-1">
                      {log.type}:
                    </span>{' '}
                    {log.text}
                  </div>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-sage-dark-light/80 text-center border-t border-slate-800 pt-3">
              Press Sidebar icons to view full audit logs
            </div>
          </div>
        </div>

      </div>

      {/* Agent Studio Summary Strip */}
      <div className="glass-panel-heavy rounded-2xl p-5 border-l-4 border-l-teal-500">
        <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
          <div>
            <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm flex items-center gap-2">
              <Bot className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              Agent System — Live Overview
            </h3>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">Multi-agent orchestration, MCP servers, and security controls — all active</p>
          </div>
          <button
            onClick={() => setActiveTab('agent-studio')}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-600 dark:text-teal-400 border border-teal-500/20 dark:border-teal-600/30 text-xs font-semibold transition-all group"
          >
            Open Agent Studio
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            {
              icon: Bot,
              label: 'Multi-Agent System',
              value: '4 Agents Online',
              sub: 'Orchestrator + 3 specialists',
              color: 'teal',
            },
            {
              icon: PlugZap,
              label: 'MCP Servers',
              value: '3/4 Healthy',
              sub: 'Billing: degraded (164ms)',
              color: 'amber',
            },
            {
              icon: ShieldCheck,
              label: 'Security Controls',
              value: 'All Active',
              sub: 'RBAC · PHI Guard · Vault',
              color: 'emerald',
            },
            {
              icon: Wrench,
              label: 'Agent Skills',
              value: '9 Skills Ready',
              sub: 'Orchestration · MCP · CLI',
              color: 'indigo',
            },
          ].map(({ icon: Icon, label, value, sub, color }) => (
            <button
              key={label}
              onClick={() => setActiveTab('agent-studio')}
              className={`text-left p-4 rounded-xl border transition-all group hover:border-teal-400/40 hover:shadow-sm
                ${color === 'teal' ? 'bg-teal-50/50 dark:bg-teal-900/10 border-teal-200/60 dark:border-teal-700/40' :
                  color === 'amber' ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200/60 dark:border-amber-700/40' :
                  color === 'emerald' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/60 dark:border-emerald-700/40' :
                  'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200/60 dark:border-indigo-700/40'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4
                  ${color === 'teal' ? 'text-teal-600 dark:text-teal-400' :
                    color === 'amber' ? 'text-amber-600 dark:text-amber-400' :
                    color === 'emerald' ? 'text-emerald-600 dark:text-emerald-400' :
                    'text-indigo-600 dark:text-indigo-400'}`} />
                <ArrowUpRight className="w-3 h-3 text-slate-300 dark:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-100">{value}</p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};
