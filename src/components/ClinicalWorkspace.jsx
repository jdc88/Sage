import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { EncounterWorkflow } from './EncounterWorkflow';
import { PatientMonitorPanel } from './PatientMonitorPanel';
import { ClinicalAlertsDrawer } from './ClinicalAlertsDrawer';
import { PriorAuthView } from './PriorAuthView';
import { RcmCdsView } from './RcmCdsView';
import {
  Play, ChevronDown, ChevronUp, Copy, Download, Save, Lock, Volume2, Check,
  ShieldCheck, Clock, AlertCircle,
} from 'lucide-react';

const formatSoap = (soapNote, patientName) => `
# CLINICAL SOAP NOTE
Date: ${new Date().toLocaleDateString()}
Patient: ${patientName || '—'}
Clinician: Dr. Evelyn Young

## SUBJECTIVE
${soapNote.subjective || '—'}

## OBJECTIVE
${soapNote.objective || '—'}

## ASSESSMENT
${soapNote.assessment || '—'}

## PLAN
${soapNote.plan || '—'}
`.trim();

const IntakePanel = () => {
  const { currentPatient, triggerEligibilityCheck } = useDashboard();
  if (!currentPatient) return null;

  const needsVerify = currentPatient.status === 'Pending' || currentPatient.status === 'Ineligible';

  return (
    <div className="surface-card rounded-2xl p-8 space-y-6 max-w-xl">
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 m-0">Intake & eligibility</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
          Coverage and check-in status for {currentPatient.name}
        </p>
      </div>

      <dl className="grid grid-cols-2 gap-6 text-sm">
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appointment</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100 mt-1 m-0">{currentPatient.time}</dd>
        </div>
        <div>
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Copay</dt>
          <dd className="font-semibold text-slate-800 dark:text-slate-100 mt-1 m-0">{currentPatient.copay}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Visit reason</dt>
          <dd className="font-medium text-slate-700 dark:text-slate-300 mt-1 m-0">{currentPatient.reason}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Verification</dt>
          <dd className="flex items-center gap-2 mt-1 m-0">
            {currentPatient.status === 'Eligible' ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span className="font-medium text-emerald-700 dark:text-emerald-400">Verified · {currentPatient.verifiedAt}</span>
              </>
            ) : currentPatient.status === 'Pending' ? (
              <>
                <Clock className="w-4 h-4 text-amber-500" />
                <span className="font-medium text-amber-700 dark:text-amber-400">Pending verification</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-rose-500" />
                <span className="font-medium text-rose-700 dark:text-rose-400">{currentPatient.verifiedAt}</span>
              </>
            )}
          </dd>
        </div>
      </dl>

      {needsVerify && (
        <button
          type="button"
          onClick={() => triggerEligibilityCheck(currentPatient.id)}
          className="inline-flex items-center gap-2 py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20"
        >
          <ShieldCheck className="w-5 h-5" />
          Verify eligibility
        </button>
      )}
    </div>
  );
};

export const ClinicalWorkspace = () => {
  const {
    currentPatient,
    activeEncounterStep,
    isRecording,
    setIsRecording,
    resetScribeSession,
    transcript,
    soapNote,
    updateSoapNoteSection,
    noteLocked,
    lockNote,
  } = useDashboard();

  const [showTranscript, setShowTranscript] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(formatSoap(soapNote, currentPatient?.name));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([formatSoap(soapNote, currentPatient?.name)], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `SOAP_${currentPatient?.name?.replace(/\s+/g, '_') || 'note'}.md`;
    a.click();
  };

  const renderStep = () => {
    switch (activeEncounterStep) {
      case 'intake':
        return <IntakePanel />;
      case 'prior-auth':
        return <PriorAuthView clinicalMode patientName={currentPatient?.name} />;
      case 'billing':
        return <RcmCdsView clinicalMode patientName={currentPatient?.name} />;
      case 'scribe':
      default:
        return (
          <div className="space-y-8">
            <article className="surface-card rounded-2xl p-8 md:p-10 space-y-8 shadow-sm">
              <header className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50 m-0">
                    Clinical SOAP Note
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-0">
                    {noteLocked ? 'Signed and locked' : 'AI draft — review before attestation'}
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={noteLocked}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    Copy
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </button>
                  <button
                    type="button"
                    onClick={lockNote}
                    disabled={noteLocked}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold rounded-xl bg-teal-600 hover:bg-teal-700 text-white disabled:opacity-60 shadow-md shadow-teal-600/20"
                  >
                    {noteLocked ? <Lock className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                    {noteLocked ? 'Locked' : 'Save & Lock'}
                  </button>
                </div>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { key: 'subjective', label: 'Subjective' },
                  { key: 'objective', label: 'Objective' },
                  { key: 'assessment', label: 'Assessment' },
                  { key: 'plan', label: 'Plan' },
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {label}
                    </label>
                    <textarea
                      value={soapNote[key]}
                      onChange={(e) => updateSoapNoteSection(key, e.target.value)}
                      disabled={noteLocked}
                      rows={6}
                      placeholder={`Enter ${label.toLowerCase()}…`}
                      className="w-full p-4 text-sm leading-relaxed rounded-2xl bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/15 outline-none text-slate-800 dark:text-slate-100 disabled:opacity-70 resize-none"
                    />
                  </div>
                ))}
              </div>
            </article>

            <div className="rounded-2xl border border-slate-200/70 dark:border-slate-700/50 overflow-hidden">
              <button
                type="button"
                onClick={() => setShowTranscript(v => !v)}
                className="w-full flex items-center justify-between px-6 py-4 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50/80 dark:hover:bg-slate-900/30"
              >
                <span className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4" />
                  Ambient transcript
                  {isRecording && <span className="text-rose-500 font-medium">· Recording</span>}
                </span>
                {showTranscript ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              {showTranscript && (
                <div className="px-6 pb-6 space-y-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={resetScribeSession}
                      disabled={isRecording || noteLocked}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold disabled:opacity-40"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      Start session
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRecording(false)}
                      disabled={!isRecording}
                      className="px-4 py-2 rounded-xl border text-xs font-bold disabled:opacity-40"
                    >
                      Pause
                    </button>
                  </div>
                  <div className="space-y-3 max-h-40 overflow-y-auto">
                    {transcript.length === 0 ? (
                      <p className="text-sm text-slate-500 dark:text-slate-400 m-0">No transcript yet. Start an ambient scribe session.</p>
                    ) : (
                      transcript.map((msg, idx) => (
                        <p key={idx} className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed m-0">
                          <span className="font-semibold text-slate-500">{msg.speaker}:</span> {msg.text}
                        </p>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8 pb-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 m-0">
            Active encounter
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-50 m-0 tracking-tight">
            {currentPatient?.name}
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 m-0">
            {currentPatient?.reason} · {currentPatient?.time}
          </p>
        </div>
        <ClinicalAlertsDrawer />
      </header>

      <EncounterWorkflow />

      <PatientMonitorPanel />

      {renderStep()}
    </div>
  );
};
