import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Activity, ShieldAlert, BadgeDollarSign, CheckSquare, RefreshCw, ChevronRight, Leaf, Sprout } from 'lucide-react';

export const RcmCdsView = ({ clinicalMode = false, patientName }) => {
  const { cdsAlerts, rcmLedger, appealClaim } = useDashboard();

  const scopedLedger = clinicalMode && patientName
    ? rcmLedger.filter(r => r.patient === patientName)
    : rcmLedger;

  const getAlertSeverityStyles = (severity) => {
    switch (severity) {
      case 'danger':
        return 'bg-rose-100 text-rose-700 dark:bg-slate-950 dark:text-sage-ivory border-rose-400/40 dark:border-rose-300/35';
      case 'warning':
        return 'bg-amber-100 text-amber-700 dark:bg-slate-950 dark:text-sage-ivory border-amber-400/40 dark:border-amber-300/35';
      case 'info':
      default:
        return 'bg-teal-100 text-teal-700 dark:bg-slate-950 dark:text-sage-ivory border-teal-400/40 dark:border-teal-300/35';
    }
  };

  const getRcmStatusBadge = (status) => {
    switch (status) {
      case 'Paid':
        return (
          <span className="sage-badge clinical-status bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35 rounded-md text-[10px]">
            <Leaf className="w-3 h-3" fill="currentColor" fillOpacity={0.25} />
            Paid
          </span>
        );
      case 'Denied':
        return (
          <span className="sage-badge clinical-status bg-indigo-100 text-indigo-700 dark:bg-slate-950 dark:text-sage-ivory border-indigo-400/40 dark:border-indigo-300/35 rounded-md text-[10px]">
            Denied
          </span>
        );
      case 'Appealed':
        return (
          <span className="sage-badge clinical-status bg-indigo-100 text-indigo-700 dark:bg-slate-950 dark:text-sage-ivory border-indigo-400/40 dark:border-indigo-300/35 rounded-md text-[10px]">
            <Sprout className="w-3 h-3" />
            Appealed
          </span>
        );
      case 'Submitted':
        return (
          <span className="sage-badge clinical-status bg-teal-100 text-teal-700 dark:bg-slate-950 dark:text-sage-ivory border-teal-400/40 dark:border-teal-300/35 rounded-md text-[10px]">
            <Sprout className="w-3 h-3" />
            Submitted
          </span>
        );
      case 'Draft':
      default:
        return (
          <span className="sage-badge clinical-status bg-slate-150 dark:bg-slate-950 text-slate-600 dark:text-sage-ivory border-slate-300/60 dark:border-sage-dark-mid/50 rounded-md text-[10px]">
            Draft
          </span>
        );
    }
  };

  return (
    <div className={`grid grid-cols-1 ${clinicalMode ? '' : 'lg:grid-cols-12'} gap-8`}>

      {!clinicalMode && (
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">CDS Stream Monitor</h3>
                <p className="text-[10px] text-slate-600 font-mono">Real-time Clinical Decision Support</p>
              </div>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto py-4 space-y-3 pr-1">
            {cdsAlerts.length === 0 ? (
              <p className="text-xs text-slate-600 text-center py-8">No active warnings or alerts.</p>
            ) : (
              cdsAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border flex flex-col gap-2 clinical-status ${getAlertSeverityStyles(alert.severity)}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono tracking-wider uppercase">{alert.type}</span>
                    <span className="text-[9px] font-mono text-slate-600">{alert.time}</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-200">{alert.patient}</h4>
                    <p className="text-[11px] font-medium leading-relaxed mt-1 text-slate-600 dark:text-slate-300">{alert.msg}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      )}

      <div className={`${clinicalMode ? '' : 'lg:col-span-8'} flex flex-col gap-6`}>

        {!clinicalMode && (
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Claims Sent</span>
              <BadgeDollarSign className="w-4 h-4 text-teal-500" />
            </div>
            <h4 className="text-lg font-bold tracking-tight mt-3 font-mono text-slate-700 dark:text-sage-dark-light">$1,665</h4>
            <p className="text-[9px] text-slate-600 mt-1">Total revenue generated</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Appeals Success</span>
              <RefreshCw className="w-4 h-4 text-indigo-500 animate-spin-slow" />
            </div>
            <h4 className="text-lg font-bold tracking-tight mt-3 font-mono text-slate-700 dark:text-sage-dark-light">82%</h4>
            <p className="text-[9px] text-slate-600 mt-1">Insurer denials overturned</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Payment Speed</span>
              <CheckSquare className="w-4 h-4 text-emerald-500" />
            </div>
            <h4 className="text-lg font-bold tracking-tight mt-3 font-mono text-slate-700 dark:text-sage-dark-light">3.2 days</h4>
            <p className="text-[9px] text-slate-600 mt-1">Average reimbursement turnaround</p>
          </div>
        </div>
        )}

        <div className={`surface-card rounded-2xl p-6 flex flex-col ${clinicalMode ? '' : 'h-[400px]'}`}>
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div>
              <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">RCM Claims Ledger</h3>
              <p className="text-[10px] text-slate-600">Revenue cycle auditing and medical code denial tracker</p>
            </div>
          </div>

          {/* Table container */}
          <div className="flex-grow overflow-y-auto py-4 pr-1">
            <div className="w-full overflow-hidden border border-slate-200/50 dark:border-slate-850 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-150 dark:bg-slate-900 border-b border-slate-300/50 dark:border-slate-700/50 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    <th className="p-3">Claim details</th>
                    <th className="p-3">Fee / CPT</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Audit Trails</th>
                    <th className="p-3 text-right">Appeals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-850">
                  {scopedLedger.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-sm text-slate-500 dark:text-slate-400">
                        No billing records for this patient.
                      </td>
                    </tr>
                  ) : (
                  scopedLedger.map((claim) => (
                    <tr key={claim.id} className="hover:bg-slate-150/50 dark:hover:bg-slate-900/30 transition-colors">
                      <td className="p-3">
                        <div className="font-bold text-slate-850 dark:text-sage-dark-light">{claim.patient}</div>
                        <div className="text-[9px] font-mono text-slate-400 mt-0.5">{claim.id}</div>
                      </td>
                      <td className="p-3">
                        <div className="font-bold text-slate-700 dark:text-sage-dark-light">{claim.fee}</div>
                        <div className="text-[9px] font-mono text-slate-400 mt-0.5">CPT: {claim.code}</div>
                      </td>
                      <td className="p-3">
                        {getRcmStatusBadge(claim.status)}
                      </td>
                      <td className="p-3">
                        <p className="text-[10px] text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={claim.reason}>
                          {claim.reason}
                        </p>
                      </td>
                      <td className="p-3 text-right">
                        {claim.status === 'Denied' ? (
                          <button
                            onClick={() => appealClaim(claim.id)}
                            className="inline-flex items-center gap-0.5 py-1 px-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-[9px] transition-colors shadow-sm shadow-indigo-600/10"
                          >
                            Appeal
                            <ChevronRight className="w-3 h-3" />
                          </button>
                        ) : claim.status === 'Appealed' ? (
                          <span className="text-[10px] text-indigo-400 font-bold font-mono">
                            Appealing...
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-600 font-medium">
                            No Action
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
