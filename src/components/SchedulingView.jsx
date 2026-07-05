import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Users, Leaf, Sprout, XCircle, ShieldCheck, PhoneCall, TrendingDown } from 'lucide-react';

export const SchedulingView = () => {
  const { patientQueue, triggerEligibilityCheck } = useDashboard();

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Eligible':
        return (
          <span className="sage-badge clinical-status bg-emerald-100 text-emerald-700 dark:bg-slate-950 dark:text-sage-ivory border-emerald-400/40 dark:border-emerald-300/35">
            <Leaf className="w-3.5 h-3.5" fill="currentColor" fillOpacity={0.25} />
            Eligible
          </span>
        );
      case 'Ineligible':
        return (
          <span className="sage-badge clinical-status bg-indigo-100 text-indigo-700 dark:bg-slate-950 dark:text-sage-ivory border-indigo-400/40 dark:border-indigo-300/35">
            <XCircle className="w-3.5 h-3.5" />
            Ineligible
          </span>
        );
      case 'Pending':
      default:
        return (
          <span className="sage-badge clinical-status bg-amber-100 text-amber-700 dark:bg-slate-950 dark:text-sage-ivory border-amber-400/40 dark:border-amber-300/35">
            <Sprout className="w-3.5 h-3.5" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Patient Intake Queue */}
      <div className="lg:col-span-8 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col h-[560px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-teal-500" />
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Patient Intake & Scheduling</h3>
                <p className="text-[10px] text-slate-600">Daily appointment queue and real-time copay checks</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400 font-mono">
                Total: {patientQueue.length} appointments
              </span>
            </div>
          </div>

          {/* Queue Table List */}
          <div className="flex-1 overflow-y-auto py-4 pr-1">
            <div className="w-full overflow-hidden border border-slate-200/50 dark:border-slate-850 rounded-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-150 dark:bg-slate-900 border-b border-slate-300/50 dark:border-slate-700/50 text-[10px] uppercase font-bold text-slate-600 tracking-wider">
                    <th className="p-4">Patient Details</th>
                    <th className="p-4">Time & Reason</th>
                    <th className="p-4">Copay</th>
                    <th className="p-4">Coverage Status</th>
                    {(patientQueue.some(p => p.status === 'Pending' || p.status === 'Ineligible')) && (
                      <th className="p-4 text-right">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200/30 dark:divide-slate-850">
                  {patientQueue.map((patient) => (
                    <tr key={patient.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-900/20 transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                          {patient.name}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          ID: {patient.id}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="font-semibold text-slate-700 dark:text-slate-300">
                          {patient.time}
                        </div>
                        <div className="text-xs text-slate-500 mt-1">
                          {patient.reason}
                        </div>
                      </td>
                      <td className="p-4 font-bold text-slate-700 dark:text-sage-dark-light">
                        {patient.copay}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5">
                          {getStatusBadge(patient.status)}
                          <span className="text-[10px] text-slate-500 italic">
                            {patient.verifiedAt}
                          </span>
                        </div>
                      </td>
                      {(patientQueue.some(p => p.status === 'Pending' || p.status === 'Ineligible')) && (
                      <td className="p-4 text-right">
                        {(patient.status === 'Pending' || patient.status === 'Ineligible') && (
                          <button
                            onClick={() => triggerEligibilityCheck(patient.id)}
                            className="inline-flex items-center gap-1.5 py-2 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Verify
                          </button>
                        )}
                      </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Clinical Metrics & SVG Chart */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        
        {/* KPI stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-1.5 justify-between">
            <span className="p-2 bg-rose-100 text-rose-600 rounded-lg w-fit">
              <PhoneCall className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Call Volume</p>
              <h4 className="text-xl font-bold tracking-tight text-rose-600 font-mono mt-0.5">-42.5%</h4>
            </div>
            <p className="text-[9px] text-slate-600 mt-1">Average incoming phone intake calls</p>
          </div>

          <div className="glass-panel rounded-2xl p-4 flex flex-col gap-1.5 justify-between">
            <span className="p-2 bg-emerald-100 text-emerald-600 rounded-lg w-fit">
              <TrendingDown className="w-4 h-4" />
            </span>
            <div>
              <p className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">Avg Check-in Time</p>
              <h4 className="text-xl font-bold tracking-tight text-emerald-600 font-mono mt-0.5">2.4m</h4>
            </div>
            <p className="text-[9px] text-slate-600 mt-1">Reduction from 9.8m standard manual</p>
          </div>
        </div>

        {/* Visual Call Reduction Chart */}
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between flex-1 min-h-[300px]">
          <div>
            <h4 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Intake Automation Performance</h4>
            <p className="text-[10px] text-slate-600 mt-0.5">Monthly phone calls vs automated portal registrations</p>
          </div>

          {/* SVG Bar Chart Comparison */}
          <div className="my-6 flex items-end justify-between h-44 px-2 select-none">
            {/* Legend and Columns */}
            {[
              { label: 'Jan', manual: 120, auto: 15 },
              { label: 'Feb', manual: 110, auto: 25 },
              { label: 'Mar', manual: 105, auto: 45 },
              { label: 'Apr', manual: 85, auto: 60 },
              { label: 'May', manual: 70, auto: 80 },
              { label: 'Jun', manual: 55, auto: 95 }
            ].map((col, idx) => (
              <div key={idx} className="flex flex-col items-center gap-1.5 h-full w-12 justify-end">
                <div className="flex gap-1 h-full items-end justify-center w-full">
                  {/* Manual Call bar (Rose color) */}
                  <div 
                    className="w-3.5 bg-rose-400/70 border-t border-rose-600 hover:bg-rose-500/80 rounded-t-sm transition-all duration-300 relative group cursor-pointer"
                    style={{ height: `${col.manual * 0.9}%` }}
                    title={`Manual: ${col.manual} calls`}
                  >
                    <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow z-10 font-mono whitespace-nowrap">
                      {col.manual} calls
                    </span>
                  </div>
                  {/* Auto Intake bar (Teal color) */}
                  <div 
                    className="w-3.5 bg-teal-500 hover:bg-teal-600 rounded-t-sm transition-all duration-300 relative group cursor-pointer"
                    style={{ height: `${col.auto * 0.9}%` }}
                    title={`Automated: ${col.auto}`}
                  >
                    <span className="hidden group-hover:block absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[8px] font-bold px-1 py-0.5 rounded shadow z-10 font-mono whitespace-nowrap">
                      {col.auto} auto
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-600 font-mono font-medium">{col.label}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center border-t border-slate-300/50 dark:border-slate-700/50 pt-3 text-[10px] text-slate-600 font-bold uppercase tracking-wider font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-rose-500/70 border border-rose-600" />
              Manual Calls
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded bg-teal-500" />
              Auto Intake
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
