import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Bell, X, AlertTriangle } from 'lucide-react';

/** Patient-scoped clinical alerts — no global alert wall. */
export const ClinicalAlertsDrawer = () => {
  const { activePatientAlerts, dismissAlert, currentPatient } = useDashboard();
  const [open, setOpen] = useState(false);
  const count = activePatientAlerts.length;

  if (count === 0) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold border transition-colors bg-amber-50 text-amber-800 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-200 dark:border-amber-800/50"
      >
        <Bell className="w-4 h-4" />
        Clinical Alerts
        <span className="min-w-[1.25rem] h-5 px-1.5 flex items-center justify-center rounded-full bg-amber-500 text-white text-[10px] font-bold">
          {count}
        </span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="fixed inset-0 bg-black/20 dark:bg-black/40 z-40"
            aria-label="Close alerts"
            onClick={() => setOpen(false)}
          />
          <aside className="fixed top-0 right-0 h-full w-full max-w-md z-50 glass-panel-heavy border-l shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200/60 dark:border-slate-700/50">
              <div>
                <h2 className="text-sm font-bold text-slate-800 dark:text-slate-100 m-0">Clinical Alerts</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 mb-0">{currentPatient?.name}</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {activePatientAlerts.map(alert => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${
                    alert.severity === 'danger'
                      ? 'border-rose-200 bg-rose-50/80 dark:border-rose-900/50 dark:bg-rose-950/30'
                      : 'border-amber-200 bg-amber-50/80 dark:border-amber-900/50 dark:bg-amber-950/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{alert.type}</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">{alert.value} · {alert.time}</p>
                        <p className="text-xs leading-relaxed mt-2 text-slate-700 dark:text-slate-300">{alert.msg}</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => dismissAlert(alert.id)}
                      className="text-[10px] font-bold uppercase tracking-wider text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 shrink-0"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </>
      )}
    </>
  );
};
