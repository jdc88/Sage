import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Activity } from 'lucide-react';

/** Patient-scoped CDS telemetry — not shown in global header. */
export const PatientMonitorPanel = () => {
  const { currentPatient, eegData, cdsStreamStatus, activePatientAlerts } = useDashboard();
  const showWave = cdsStreamStatus === 'critical';

  return (
    <div className="rounded-2xl border border-slate-200/80 dark:border-slate-700/50 bg-white/60 dark:bg-slate-900/40 px-5 py-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400 m-0">
          Active monitor · {currentPatient?.name}
        </h3>
      </div>
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">ICP</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100 m-0">11 mmHg</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">Alpha waves</p>
          <p className="font-semibold text-slate-800 dark:text-slate-100 m-0">Stable</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-0.5">EEG stream</p>
          <p className="font-semibold text-emerald-600 dark:text-emerald-400 m-0">
            {cdsStreamStatus === 'stable' ? 'Nominal' : cdsStreamStatus === 'warning' ? 'Review' : 'Alert'}
          </p>
        </div>
      </div>
      {showWave && (
        <svg className="w-full h-8 text-teal-600 dark:text-teal-400" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polyline
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            points={eegData.map((val, idx) => `${(idx / (eegData.length - 1)) * 100},${val}`).join(' ')}
          />
        </svg>
      )}
      {activePatientAlerts.length > 0 && (
        <p className="text-[11px] text-amber-700 dark:text-amber-300 m-0">
          {activePatientAlerts.length} alert{activePatientAlerts.length > 1 ? 's' : ''} — see Clinical Alerts badge.
        </p>
      )}
    </div>
  );
};
