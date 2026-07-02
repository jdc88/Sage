import React from 'react';
import { useDashboard } from './context/DashboardContext';
import { Layout } from './components/Layout';
import { Overview } from './components/Overview';
import { ScribeView } from './components/ScribeView';
import { PriorAuthView } from './components/PriorAuthView';
import { SchedulingView } from './components/SchedulingView';
import { RcmCdsView } from './components/RcmCdsView';
import { AgentStudioView } from './components/AgentStudioView';

function App() {
  const { activeTab } = useDashboard();

  const renderContent = () => {
    switch (activeTab) {
      case 'scribe':
        return <ScribeView />;
      case 'prior-auth':
        return <PriorAuthView />;
      case 'intake':
        return <SchedulingView />;
      case 'rcm-cds':
        return <RcmCdsView />;
      case 'agent-studio':
        return <AgentStudioView />;
      case 'overview':
      default:
        return <Overview />;
    }
  };

  return (
    <Layout>
      <div className="app-content">
        {renderContent()}
      </div>
    </Layout>
  );
}

export default App;
