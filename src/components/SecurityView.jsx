import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { SECURITY_CONTROLS } from '../context/DashboardContext';
import { ShieldCheck, ShieldAlert, Lock, Eye, EyeOff, CheckCircle2, AlertTriangle, FileText, RefreshCw } from 'lucide-react';

const CONTROL_STATUS_ICONS = {
  healthy: { Icon: CheckCircle2, color: 'text-emerald-500' },
  enforced: { Icon: CheckCircle2, color: 'text-emerald-500' },
  active: { Icon: CheckCircle2, color: 'text-emerald-500' },
  streaming: { Icon: CheckCircle2, color: 'text-teal-500' },
  degraded: { Icon: AlertTriangle, color: 'text-amber-500' },
};

export const SecurityView = () => {
  const { securityEvents, phiRedactionLog, vaultItems, rbacScope, agentLogs, runAgentCommand } = useDashboard();
  const [showVaultValues, setShowVaultValues] = useState({});
  const [activeTab, setActiveTab] = useState('rbac');
  const [auditFilter, setAuditFilter] = useState('all');

  const toggleVaultItem = (id) => {
    setShowVaultValues(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const auditLogs = agentLogs.filter(log => {
    if (auditFilter === 'all') return true;
    if (auditFilter === 'security') return log.type === 'system' || log.text?.includes('Security') || log.text?.includes('PHI') || log.text?.includes('RBAC') || log.text?.includes('vault');
    if (auditFilter === 'success') return log.type === 'success';
    return true;
  }).slice(-30).reverse();

  const tabs = [
    { id: 'rbac', label: 'RBAC & Session', icon: Lock },
    { id: 'phi', label: 'PHI Redaction', icon: Eye },
    { id: 'vault', label: 'Credential Vault', icon: ShieldCheck },
    { id: 'audit', label: 'Audit Trail', icon: FileText },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/50 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-100">Security Posture Dashboard</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">RBAC scope, PHI redaction log, credential vault, and immutable audit trail</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-mono bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200/60 dark:border-emerald-700/40 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          ALL CONTROLS ACTIVE
        </div>
      </div>

      {/* Security Control Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {SECURITY_CONTROLS.map(control => {
          const { Icon, color } = CONTROL_STATUS_ICONS[control.status] || { Icon: AlertTriangle, color: 'text-amber-500' };
          return (
            <div key={control.id} className="glass-panel rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <Icon className={`w-4 h-4 ${color}`} />
                <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded
                  ${control.status === 'healthy' || control.status === 'enforced' || control.status === 'active'
                    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                    : 'bg-teal-100 text-teal-700 dark:bg-teal-900/20 dark:text-teal-400'}`}>
                  {control.status}
                </span>
              </div>
              <h4 className="text-[11px] font-bold text-slate-700 dark:text-slate-100 mb-1">{control.name}</h4>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">{control.detail}</p>
            </div>
          );
        })}
      </div>

      {/* Sub-tabs */}
      <div className="glass-panel rounded-2xl overflow-hidden">
        <div className="flex border-b border-slate-200/70 dark:border-slate-700/50">
          {tabs.map(tab => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-4 py-3 text-[11px] font-semibold transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? 'text-teal-600 dark:text-teal-400 border-b-2 border-teal-500 bg-teal-50/50 dark:bg-teal-900/10'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
                }`}
              >
                <TabIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-5">
          {/* RBAC & Session */}
          {activeTab === 'rbac' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              <div className="lg:col-span-5">
                <div className="surface-card rounded-xl p-4 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Current Session</p>
                  <div className="space-y-2 text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">User</span>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{rbacScope.user}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Role</span>
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400">{rbacScope.role}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400">Session ID</span>
                      <code className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{rbacScope.sessionId}</code>
                    </div>
                  </div>
                </div>

                <div className="surface-card rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Granted Permissions ({rbacScope.granted.length})</p>
                  </div>
                  <div className="space-y-1">
                    {rbacScope.granted.map(perm => (
                      <div key={perm} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-700/40">
                        {perm}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7">
                <div className="surface-card rounded-xl p-4 mb-4">
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Denied Permissions ({rbacScope.denied.length})</p>
                  </div>
                  <div className="space-y-1">
                    {rbacScope.denied.map(perm => (
                      <div key={perm} className="text-[10px] font-mono px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-700/40">
                        <ShieldAlert className="inline w-3 h-3 mr-1.5 opacity-70" />{perm}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="surface-card rounded-xl p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">Recent Security Events</p>
                  <div className="space-y-2">
                    {securityEvents.map(event => (
                      <div key={event.id} className="flex items-start gap-2 text-[10px]">
                        {event.severity === 'success'
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          : <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                        }
                        <div>
                          <p className="font-semibold text-slate-700 dark:text-slate-200">{event.title}</p>
                          <p className="text-slate-500 dark:text-slate-400">{event.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PHI Redaction Log */}
          {activeTab === 'phi' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Eye className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100">PHI Redaction Guard Log</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Tokens automatically redacted from logs, payloads, and audit trails</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5 text-[10px] font-mono text-teal-600 dark:text-teal-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-ping" />
                  {phiRedactionLog.length} events
                </div>
              </div>

              <div className="space-y-2">
                {phiRedactionLog.length === 0 && (
                  <p className="text-[10px] text-slate-400 italic text-center py-6">Start a scribe session to see PHI redaction events</p>
                )}
                {phiRedactionLog.map(event => (
                  <div key={event.id} className="surface-card rounded-xl px-4 py-3 flex items-center gap-4 text-[10px]">
                    <div className="w-2 h-2 rounded-full bg-rose-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-rose-600 dark:text-rose-400 line-through opacity-70">"{event.token}"</span>
                        <span className="text-slate-400">→</span>
                        <span className="font-mono text-emerald-600 dark:text-emerald-400 font-bold">{event.replacement}</span>
                      </div>
                      <p className="text-slate-400 dark:text-slate-500 mt-0.5">Context: {event.context}</p>
                    </div>
                    <span className="text-slate-400 shrink-0">{event.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Credential Vault */}
          {activeTab === 'vault' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Lock className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100">Credential Vault</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">Secrets are never exposed in logs or UI — only masked metadata is shown</p>
                </div>
              </div>

              <div className="space-y-2">
                {vaultItems.map(item => (
                  <div key={item.id} className="surface-card rounded-xl px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Lock className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <code className="text-[11px] font-mono font-bold text-slate-700 dark:text-slate-200">{item.name}</code>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                            item.status === 'synced'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400'
                              : 'bg-amber-100 text-amber-700'
                          }`}>{item.status}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="font-mono text-[11px] text-slate-400">
                            {showVaultValues[item.id] ? <span className="text-amber-600 dark:text-amber-400">[value intentionally redacted]</span> : item.maskedValue}
                          </span>
                          <button
                            onClick={() => toggleVaultItem(item.id)}
                            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                          >
                            {showVaultValues[item.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-slate-400 dark:text-slate-500">Last sync</p>
                        <p className="text-[10px] font-medium text-slate-600 dark:text-slate-400">{item.lastSync}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-200/60 dark:border-amber-700/40 text-[10px] text-amber-700 dark:text-amber-400 flex items-start gap-2">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>Actual credential values are stored in an encrypted vault and are never transmitted through the agent CLI, UI logs, or audit trails. The PHI Redaction Guard further masks any accidental credential exposure in log outputs.</span>
              </div>
            </div>
          )}

          {/* Audit Trail */}
          {activeTab === 'audit' && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-4 h-4 text-slate-600 dark:text-slate-400" />
                <div>
                  <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100">Immutable Audit Trail</h3>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">All agent actions are appended to this read-only event log</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <select
                    value={auditFilter}
                    onChange={e => setAuditFilter(e.target.value)}
                    className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-400 outline-none"
                  >
                    <option value="all">All events</option>
                    <option value="success">Success only</option>
                    <option value="security">Security events</option>
                  </select>
                  <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />STREAMING
                  </span>
                </div>
              </div>

              <div className="space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
                {auditLogs.map(log => (
                  <div
                    key={log.id}
                    className={`flex items-start gap-2 px-3 py-2 rounded-lg border text-[10px] ${
                      log.type === 'success' ? 'bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200/40 dark:border-emerald-700/30' :
                      log.type === 'system' ? 'bg-slate-50 dark:bg-slate-900/50 border-slate-200/40 dark:border-slate-700/30' :
                      'bg-white dark:bg-slate-900/30 border-slate-200/40 dark:border-slate-700/30'
                    }`}
                  >
                    <span className="text-slate-400 dark:text-slate-500 shrink-0 font-mono">[{log.time}]</span>
                    <span className={`font-mono break-all ${
                      log.type === 'success' ? 'text-emerald-700 dark:text-emerald-400' :
                      log.type === 'system' ? 'text-slate-500 dark:text-slate-400' :
                      'text-slate-600 dark:text-slate-300'
                    }`}>{log.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
