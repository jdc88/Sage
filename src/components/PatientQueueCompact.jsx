import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ChevronDown, ChevronUp, ShieldCheck, User, Check } from 'lucide-react';

export const PatientQueueCompact = () => {
  const { patientQueue, currentPatientId, setCurrentPatient, triggerEligibilityCheck } = useDashboard();
  const [showVerified, setShowVerified] = useState(false);

  const current = patientQueue.find(p => p.id === currentPatientId);
  const others = patientQueue.filter(p => p.id !== currentPatientId);
  const next = others[0];
  const needsAction = patientQueue.filter(
    p => (p.status === 'Pending' || p.status === 'Ineligible') && p.id !== currentPatientId
  );
  const verifiedRest = patientQueue.filter(
    p => p.status === 'Eligible' && p.id !== currentPatientId && p.id !== next?.id
  );

  const renderRow = (patient, { highlight = false, actionRequired = false } = {}) => (
    <div
      key={patient.id}
      className={`flex items-center justify-between gap-4 p-4 rounded-2xl border transition-colors ${
        highlight
          ? 'border-teal-400/40 bg-teal-50/40 dark:bg-teal-900/10 dark:border-teal-700/40'
          : 'border-slate-200/70 dark:border-slate-700/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/20'
      }`}
    >
      <button
        type="button"
        onClick={() => setCurrentPatient(patient.id)}
        className="flex items-center gap-3 min-w-0 text-left flex-1"
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
          highlight ? 'bg-teal-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-sage-ivory'
        }`}>
          {patient.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{patient.name}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">{patient.time} · {patient.reason}</p>
        </div>
      </button>
      {actionRequired ? (
        <button
          onClick={() => triggerEligibilityCheck(patient.id)}
          className="shrink-0 inline-flex items-center gap-1.5 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-sm"
        >
          <ShieldCheck className="w-4 h-4" />
          Verify
        </button>
      ) : patient.status === 'Eligible' ? (
        <Check className="w-5 h-5 text-emerald-500 shrink-0" aria-label="Verified" />
      ) : null}
    </div>
  );

  return (
    <div className="surface-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center gap-2">
        <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">Today&apos;s queue</h3>
      </div>

      {current && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 m-0">Current</p>
          {renderRow(current, { highlight: true })}
        </div>
      )}

      {next && next.status === 'Eligible' && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">Next</p>
          {renderRow(next)}
        </div>
      )}

      {needsAction.length > 0 && (
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 m-0">Needs action</p>
          {needsAction.map(p => renderRow(p, { actionRequired: true }))}
        </div>
      )}

      {verifiedRest.length > 0 && (
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => setShowVerified(v => !v)}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"
          >
            {showVerified ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            Verified ({verifiedRest.length})
          </button>
          {showVerified && verifiedRest.map(p => renderRow(p))}
        </div>
      )}
    </div>
  );
};
