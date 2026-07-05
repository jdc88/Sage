import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Users, Mic, FileCheck, BadgeDollarSign, Check } from 'lucide-react';

const STEPS = [
  { id: 'intake', label: 'Intake', icon: Users },
  { id: 'scribe', label: 'Scribe', icon: Mic },
  { id: 'prior-auth', label: 'Prior Auth', icon: FileCheck },
  { id: 'billing', label: 'Billing', icon: BadgeDollarSign },
];

export const EncounterWorkflow = () => {
  const { activeEncounterStep, setActiveEncounterStep, isRecording } = useDashboard();
  const activeIdx = STEPS.findIndex(s => s.id === activeEncounterStep);

  return (
    <nav className="flex flex-wrap gap-3" aria-label="Encounter workflow">
      {STEPS.map((step, idx) => {
        const Icon = step.icon;
        const isActive = activeEncounterStep === step.id;
        const isComplete = idx < activeIdx;
        return (
          <button
            key={step.id}
            type="button"
            onClick={() => setActiveEncounterStep(step.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl border text-sm font-medium transition-all ${
              isActive
                ? 'bg-teal-600 text-white border-teal-600 shadow-md shadow-teal-600/15'
                : isComplete
                ? 'bg-emerald-50/80 text-emerald-800 border-emerald-200/70 dark:bg-emerald-950/25 dark:text-emerald-300 dark:border-emerald-800/40'
                : 'bg-white dark:bg-slate-900/40 text-slate-600 dark:text-slate-400 border-slate-200/80 dark:border-slate-700/50 hover:border-teal-300/50'
            }`}
          >
            {isComplete ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
            {step.label}
            {step.id === 'scribe' && isRecording && isActive && (
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
