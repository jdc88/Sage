import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { PatientQueueSidebar } from './PatientQueueSidebar';
import { Leaf, Menu, X, Settings2, ArrowLeft } from 'lucide-react';

export const Layout = ({ children }) => {
  const { activeTab, setActiveTab } = useDashboard();
  const [mobileQueueOpen, setMobileQueueOpen] = useState(false);

  const isClinical = activeTab !== 'agent-studio';
  const isTechConsole = activeTab === 'agent-studio';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#f7faf8] text-slate-800 font-sans">
      <header className="shrink-0 z-40 w-full bg-white/90 backdrop-blur-sm border-b border-slate-200/80 flex items-center justify-between px-5 md:px-8 h-16">
        <div className="flex items-center gap-3">
          {isTechConsole ? (
            <button
              type="button"
              onClick={() => setActiveTab('clinical')}
              className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-teal-600"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Back to clinic</span>
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setMobileQueueOpen(!mobileQueueOpen)}
                className="p-2 rounded-xl hover:bg-slate-100 lg:hidden"
                aria-label="Toggle queue"
              >
                {mobileQueueOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2.5">
                <span className="inline-flex p-2 rounded-full bg-teal-100 text-teal-700 border border-teal-200/60">
                  <Leaf className="w-5 h-5" fill="currentColor" fillOpacity={0.15} />
                </span>
                <div>
                  <h1 className="text-base font-bold m-0 text-slate-900">Sage Clinical Agent</h1>
                  <p className="text-[11px] text-slate-500 m-0 hidden sm:block">Neurology · Dr. Evelyn Young</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button
            type="button"
            onClick={() => setActiveTab('agent-studio')}
            title="Tech Console (ADK debugging)"
            className={`p-2.5 rounded-xl border transition-colors ${
              isTechConsole
                ? 'bg-slate-200 border-slate-300 text-slate-700'
                : 'border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
            aria-label="Open Tech Console"
          >
            <Settings2 className="w-5 h-5" />
          </button>
          <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-slate-200">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-bold text-teal-800">
              EY
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 overflow-hidden">
        {isClinical && (
          <>
            <div className={`${mobileQueueOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:relative z-30 h-full transition-transform duration-200`}>
              <PatientQueueSidebar onPatientSelect={() => setMobileQueueOpen(false)} />
            </div>
            {mobileQueueOpen && (
              <button
                type="button"
                className="fixed inset-0 bg-black/20 z-20 lg:hidden"
                aria-label="Close queue"
                onClick={() => setMobileQueueOpen(false)}
              />
            )}
          </>
        )}

        <main className="flex-1 min-w-0 overflow-y-auto px-6 py-8 md:px-10 md:py-10">
          <div className={isTechConsole ? 'max-w-7xl mx-auto' : 'max-w-6xl mx-auto'}>
            {children}
          </div>
        </main>
      </div>

      <footer className="shrink-0 border-t border-slate-200/80 bg-white/80 px-5 md:px-8 py-3">
        <p className="text-center text-[11px] text-slate-500 m-0">
          © {new Date().getFullYear()} Sage Clinical Agent by Josephine Choi. All rights reserved.
        </p>
      </footer>
    </div>
  );
};
