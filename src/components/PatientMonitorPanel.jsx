import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Activity } from 'lucide-react';

/** Patient-scoped CDS telemetry with always-on EEG stream. */
export const PatientMonitorPanel = () => {
  const {
    currentPatient,
    activePatientId,
    eegData,
    cdsStreamStatus,
    activePatientAlerts,
    patientMonitor,
  } = useDashboard();

  const streamLabel =
    cdsStreamStatus === 'stable' ? 'Nominal' : cdsStreamStatus === 'warning' ? 'Review' : 'Alert';

  const waveColor =
    cdsStreamStatus === 'critical'
      ? 'text-rose-600'
      : cdsStreamStatus === 'warning'
      ? 'text-amber-600'
      : 'text-teal-600';

  const points = eegData?.length
    ? eegData.map((val, idx) => `${(idx / (eegData.length - 1)) * 100},${val}`).join(' ')
    : '';

  return (
    <div
      key={activePatientId}
      className="rounded-2xl border border-slate-200/80 bg-white/60 px-5 py-4 space-y-3"
    >
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-teal-600" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 m-0">
          Active monitor · {currentPatient?.name}
        </h3>
      </div>
      <div className="flex flex-wrap items-center gap-6 text-sm">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">ICP</p>
          <p className="font-semibold text-slate-800 m-0">{patientMonitor?.icp ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">Alpha waves</p>
          <p className="font-semibold text-slate-800 m-0">{patientMonitor?.alpha ?? '—'}</p>
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">EEG stream</p>
          <p className={`font-semibold m-0 ${
            cdsStreamStatus === 'critical' ? 'text-rose-600' :
            cdsStreamStatus === 'warning' ? 'text-amber-600' : 'text-emerald-600'
          }`}>
            {streamLabel}
          </p>
        </div>
      </div>
      <svg
        className={`w-full h-10 ${waveColor}`}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-label="Live ambulatory EEG waveform"
      >
        <polyline
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          vectorEffect="non-scaling-stroke"
          points={points}
        />
      </svg>
      {activePatientAlerts.length > 0 && (
        <p className="text-[11px] text-amber-700 m-0">
          {activePatientAlerts.length} alert{activePatientAlerts.length > 1 ? 's' : ''} — see Clinical Alerts badge.
        </p>
      )}
    </div>
  );
};
