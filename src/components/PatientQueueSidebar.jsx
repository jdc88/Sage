import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Calendar, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

const StatusIndicator = ({ status }) => {
  if (status === 'Eligible') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 className="w-3.5 h-3.5" />
        Eligible
      </span>
    );
  }
  if (status === 'Pending') {
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-amber-700 dark:text-amber-400">
        <Clock className="w-3.5 h-3.5" />
        Pending action
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-rose-700 dark:text-rose-400">
      <AlertCircle className="w-3.5 h-3.5" />
      Ineligible
    </span>
  );
};

export const PatientQueueSidebar = ({ onPatientSelect }) => {
  const {
    patientQueue,
    activePatientId,
    setActivePatient,
    triggerEligibilityCheck,
  } = useDashboard();

  const selectPatient = (id) => {
    setActivePatient(id);
    onPatientSelect?.();
  };

  const needsAction = (status) => status === 'Pending' || status === 'Ineligible';

  return (
    <aside className="w-80 max-w-xs shrink-0 flex flex-col h-full border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-950/95">
      <div className="px-5 py-5 border-b border-slate-200/60 dark:border-slate-800/60 shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-teal-600 dark:text-teal-400" />
          <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">Today&apos;s Queue</h2>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 mb-0">
          {patientQueue.length} patients · {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {patientQueue.map((patient) => {
          const isSelected = patient.id === activePatientId;
          const showVerify = needsAction(patient.status);

          return (
            <div
              key={patient.id}
              className={`rounded-2xl border p-4 transition-all ${
                isSelected
                  ? 'border-teal-500/60 bg-teal-50/50 dark:bg-teal-950/20 dark:border-teal-700/50 shadow-sm ring-1 ring-teal-500/20'
                  : 'border-slate-200/70 dark:border-slate-700/50 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50/50 dark:hover:bg-slate-900/30'
              }`}
            >
              <button
                type="button"
                onClick={() => selectPatient(patient.id)}
                className="w-full text-left flex items-start gap-3"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  isSelected
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}>
                  {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-50 truncate m-0">
                    {patient.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-1 truncate">
                    {patient.time}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug line-clamp-2 m-0">
                    {patient.reason}
                  </p>
                  <div className="mt-2">
                    <StatusIndicator status={patient.status} />
                  </div>
                </div>
              </button>

              {showVerify && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    triggerEligibilityCheck(patient.id);
                  }}
                  className="mt-3 w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Verify eligibility
                </button>
              )}
            </div>
          );
        })}
      </div>
    </aside>
  );
};
