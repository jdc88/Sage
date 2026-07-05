import React from 'react';
import { useDashboard } from './context/DashboardContext';
import { Layout } from './components/Layout';
import { ClinicalWorkspace } from './components/ClinicalWorkspace';
import { AgentStudioView } from './components/AgentStudioView';

function App() {
  const { activeTab } = useDashboard();

  return (
    <Layout>
      {activeTab === 'agent-studio' ? <AgentStudioView /> : <ClinicalWorkspace />}
    </Layout>
  );
}

export default App;
