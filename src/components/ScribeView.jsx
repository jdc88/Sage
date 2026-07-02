import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Play, RotateCcw, Copy, Download, Save, Volume2, Sparkles, Check } from 'lucide-react';

export const ScribeView = () => {
  const { 
    isRecording, 
    setIsRecording, 
    transcript, 
    resetScribeSession, 
    soapNote, 
    updateSoapNoteSection,
    scribeIndex 
  } = useDashboard();

  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    const formattedSoap = `
# CLINICAL SOAP NOTE
Date: ${new Date().toLocaleDateString()}
Clinician: Dr. Evelyn Young

## SUBJECTIVE
${soapNote.subjective}

## OBJECTIVE
${soapNote.objective}

## ASSESSMENT
${soapNote.assessment}

## PLAN
${soapNote.plan}
    `.trim();

    navigator.clipboard.writeText(formattedSoap);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const formattedSoap = `
# CLINICAL SOAP NOTE
Date: ${new Date().toLocaleDateString()}
Clinician: Dr. Evelyn Young

## SUBJECTIVE
${soapNote.subjective}

## OBJECTIVE
${soapNote.objective}

## ASSESSMENT
${soapNote.assessment}

## PLAN
${soapNote.plan}
    `.trim();

    const element = document.createElement("a");
    const file = new Blob([formattedSoap], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `SOAP_Note_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-stretch">
      
      {/* Ambient Transcription Panel */}
      <div className="xl:col-span-5 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col justify-between h-[580px]">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center gap-2.5">
                <Volume2 className="w-5 h-5 text-teal-500" />
                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">Ambient Audio Input</h3>
              </div>
              <div className="flex items-center gap-2">
                {isRecording ? (
                  <span className="flex items-center gap-1.5 bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse border border-rose-400/40">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    LISTENING
                  </span>
                ) : (
                  <span className="bg-slate-150 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-300/60 dark:border-slate-700/50">
                    STANDBY
                  </span>
                )}
              </div>
            </div>

            {/* Simulated Live Sound Wave Form */}
            {isRecording && (
              <div className="py-4 flex items-center justify-center gap-[3px] h-12 overflow-hidden">
                {Array.from({ length: 28 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[3px] bg-teal-500 rounded-full transition-all duration-150"
                    style={{
                      height: `${10 + Math.sin(i + Date.now() / 100) * 25 + Math.random() * 15}px`,
                      animation: `pulse-soft ${1.5 + (i % 3) * 0.2}s infinite`
                    }}
                  />
                ))}
              </div>
            )}

            {/* Transcript Logs Scroll Area */}
            <div className="space-y-4 overflow-y-auto pr-2 mt-4 max-h-[380px] scroll-smooth">
              {transcript.map((msg, idx) => (
                <div 
                  key={idx} 
                  className={`flex flex-col gap-1 p-3 rounded-xl border text-xs max-w-[90%] transition-all duration-300 animate-pulse-soft ${
                    msg.speaker === 'Doctor' 
                      ? 'ml-auto bg-teal-50 border-teal-300/50 text-right self-end' 
                      : 'bg-white dark:bg-slate-850 border-slate-300/50 dark:border-slate-700/50'
                  }`}
                >
                  <span className="font-bold text-[10px] tracking-wider text-slate-600 dark:text-slate-400 uppercase">
                    {msg.speaker}
                  </span>
                  <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-sans">{msg.text}</p>
                </div>
              ))}
              
              {isRecording && scribeIndex < 7 && (
                <div className="flex gap-2 items-center text-slate-400 p-2 text-xs">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </span>
                  <span className="font-mono text-[10px]">Processing voice segment...</span>
                </div>
              )}
            </div>
          </div>

          {/* Action triggers */}
          <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <button
              onClick={resetScribeSession}
              disabled={isRecording}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium text-xs bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm shadow-teal-500/10"
            >
              <Play className="w-4 h-4 fill-white" />
              Start Ambient Session
            </button>
            
            <button
              onClick={() => setIsRecording(false)}
              disabled={!isRecording}
              className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 disabled:opacity-40 transition-colors"
              title="Pause Scribe"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Structured SOAP Notes Editor Panel */}
      <div className="xl:col-span-7 flex flex-col gap-4">
        <div className="glass-panel rounded-2xl p-5 flex flex-col h-[580px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200/50 dark:border-slate-800/50 shrink-0">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
              <div>
                <h3 className="font-bold text-slate-700 dark:text-slate-100 text-sm">
                  Clinical SOAP Note
                </h3>
                <p className="text-[10px] text-slate-600 font-mono">
                  Synthesized in real-time by AI Agent
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-150 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700/50 transition-all"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-teal-500" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-150 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700 dark:text-slate-200 border border-slate-300/60 dark:border-slate-700/50 transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Export .md
              </button>
            </div>
          </div>

          {/* SOAP note tabs/inputs */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Subjective */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                  Subjective (Symptoms & History)
                </label>
                <textarea
                  value={soapNote.subjective}
                  onChange={(e) => updateSoapNoteSection('subjective', e.target.value)}
                  className="flex-1 min-h-[140px] p-3 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none font-sans leading-relaxed resize-none text-slate-700 dark:text-slate-200"
                  placeholder="Patient's reports and symptoms..."
                />
              </div>

              {/* Objective */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                  Objective (Neuro Exam & Diagnostics)
                </label>
                <textarea
                  value={soapNote.objective}
                  onChange={(e) => updateSoapNoteSection('objective', e.target.value)}
                  className="flex-1 min-h-[140px] p-3 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none font-sans leading-relaxed resize-none text-slate-700 dark:text-slate-200"
                  placeholder="Neurological exam findings, EEG/ICP data, imaging results..."
                />
              </div>

              {/* Assessment */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                  Assessment (Diagnoses & ICD-10)
                </label>
                <textarea
                  value={soapNote.assessment}
                  onChange={(e) => updateSoapNoteSection('assessment', e.target.value)}
                  className="flex-1 min-h-[140px] p-3 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none font-mono leading-relaxed resize-none text-slate-700 dark:text-slate-200"
                  placeholder="Clinical assessment and diagnosis codes..."
                />
              </div>

              {/* Plan */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] uppercase font-bold tracking-wider text-slate-600">
                  Plan (Dosages & Follow-ups)
                </label>
                <textarea
                  value={soapNote.plan}
                  onChange={(e) => updateSoapNoteSection('plan', e.target.value)}
                  className="flex-1 min-h-[140px] p-3 text-xs rounded-xl bg-white dark:bg-slate-850 border border-slate-300 dark:border-slate-700 focus:border-teal-500 focus:ring-1 focus:ring-teal-500/25 outline-none font-sans leading-relaxed resize-none text-slate-700 dark:text-slate-200"
                  placeholder="Treatment, lab orders, prescriptions..."
                />
              </div>

            </div>
          </div>

          <div className="pt-3 border-t border-slate-300/50 dark:border-slate-700/50 shrink-0 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-500">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synced to EHR Patient Chart (Pending save)
            </span>
            <button className="flex items-center gap-1 px-3 py-1.5 font-bold rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors">
              <Save className="w-3.5 h-3.5" />
              Save and Lock Note
            </button>
          </div>
        </div>
      </div>

    </div>
  );
};
