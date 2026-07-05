import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const DashboardContext = createContext();

// Pre-defined transcripts to simulate live neurology scribe session
const MOCK_SCRIBE_STREAM = [
  { speaker: 'Doctor', text: "Hello, Arthur. Let's review your chronic migraine management since we started topiramate. How many headache days per month are you having now?" },
  { speaker: 'Patient', text: "Down from about fifteen to eight, but I still get two or three migraines a week with visual aura. The morning headaches wake me up sometimes." },
  { speaker: 'Doctor', text: "I see. Your ambulatory EEG summary shows stable alpha rhythms overnight, and ICP trending at 11 mmHg on the last monitoring pass. Any new weakness, numbness, or speech changes?" },
  { speaker: 'Patient', text: "No weakness or speech issues. The tingling in my left hand happens maybe once a week, mostly at night." },
  { speaker: 'Doctor', text: "That pattern is consistent with intermittent peripheral neuropathy. We'll increase topiramate to 50mg nightly, order a brain MRI without contrast to rule out secondary causes, and schedule EMG/NCS for the upper extremities." },
  { speaker: 'Patient', text: "Okay. Will the MRI need prior authorization again?" },
  { speaker: 'Doctor', text: "The portal agent is already assembling documentation for CPT 70551. We'll also evaluate CGRP therapy if your headache frequency stays above four per month at the next visit." }
];

const INITIAL_SOAP_NOTE = {
  subjective: "Arthur, a 58-year-old male, reports 8 migraine days/month (down from 15) on topiramate 25mg nightly. Describes visual aura and nocturnal awakening headaches. Intermittent left-hand paresthesias without weakness or speech difficulty.",
  objective: "Neuro exam: alert, oriented, cranial nerves II-XII intact. Motor 5/5 throughout. Sensation intact to light touch. Ambulatory EEG: alpha rhythms stable. ICP trend 11 mmHg. Gait normal. No pronator drift.",
  assessment: "1. Chronic migraine with aura (ICD-10: G43.109) - partially controlled on current regimen.\n2. Peripheral neuropathy, unspecified (ICD-10: G62.9) - intermittent paresthesias, pending electrodiagnostic workup.",
  plan: "1. Increase topiramate to 50mg PO nightly.\n2. Order Brain MRI without contrast (CPT 70551) and routine EEG (CPT 95816).\n3. Schedule EMG/NCS upper extremities (CPT 95886).\n4. Consider CGRP monoclonal antibody therapy if headache frequency remains >4/month at 6-week follow-up."
};

const INITIAL_CLAIMS = [
  { id: 'CLM-001', patient: 'Arthur Pendelton', insurer: 'Aetna HMO', procedure: 'Routine EEG (95816)', status: 'Approved', date: '2026-07-01', progress: 100, log: 'Auto-auth approved via API' },
  { id: 'CLM-002', patient: 'Sarah Jenkins', insurer: 'UnitedHealthcare', procedure: 'Brain MRI w/o Contrast (70551)', status: 'In Review', date: '2026-07-01', progress: 65, log: 'Navigating UHC Portal: Reviewing neurology clinical notes...' },
  { id: 'CLM-003', patient: 'Michael Chang', insurer: 'Blue Cross Shield', procedure: 'EMG/NCS Upper Extremity (95886)', status: 'Additional Info', date: '2026-06-30', progress: 40, log: 'Awaiting neurology attestation for neuropathy workup...' },
  { id: 'CLM-004', patient: 'Eliza Ross', insurer: 'Cigna PPO', procedure: 'CGRP Infusion Therapy (J0585)', status: 'Approved', date: '2026-06-30', progress: 100, log: 'Auto-auth approved via Clearinghouse' },
  { id: 'CLM-005', patient: 'David Vance', insurer: 'Humana', procedure: 'Brain MRA w/o Contrast (70544)', status: 'Denied', date: '2026-06-29', progress: 100, log: 'Denied: Insufficient documentation of refractory migraine criteria' }
];

const INITIAL_QUEUE = [
  { id: 'PT-01', name: 'Arthur Pendelton', time: '09:00 AM', reason: 'Chronic Migraine Follow-up', status: 'Eligible', copay: '$20', verifiedAt: '08:45 AM' },
  { id: 'PT-02', name: 'Sarah Jenkins', time: '09:30 AM', reason: 'New Onset Headache & Aura Workup', status: 'Eligible', copay: '$35', verifiedAt: '09:10 AM' },
  { id: 'PT-03', name: 'Michael Chang', time: '10:00 AM', reason: 'Peripheral Neuropathy Assessment', status: 'Pending', copay: '$15', verifiedAt: 'Checking...' },
  { id: 'PT-04', name: 'Diana Prince', time: '10:30 AM', reason: 'Epilepsy Medication Review', status: 'Eligible', copay: '$0', verifiedAt: '09:20 AM' },
  { id: 'PT-05', name: 'Robert Bruce', time: '11:00 AM', reason: 'Neuromuscular Weakness Evaluation', status: 'Ineligible', copay: '$50', verifiedAt: '09:30 AM (In-network issue)' }
];

const buildPatientEncounters = () => ({
  'PT-01': {
    activeEncounterStep: 'scribe',
    noteLocked: false,
    isRecording: false,
    scribeIndex: 1,
    transcript: [MOCK_SCRIBE_STREAM[0]],
    soapNote: { ...INITIAL_SOAP_NOTE },
  },
  'PT-02': {
    activeEncounterStep: 'scribe',
    noteLocked: false,
    isRecording: false,
    scribeIndex: 0,
    transcript: [],
    soapNote: {
      subjective: 'Sarah, 34-year-old female, presents with 3 weeks of new daily headaches with visual aura. No prior migraine history.',
      objective: 'Neuro exam unremarkable. Fundoscopic exam normal. Ambulatory EEG pending.',
      assessment: '1. New onset headache with aura (ICD-10: G43.909) — rule out secondary causes.',
      plan: '1. Order Brain MRI without contrast (CPT 70551).\n2. Routine EEG (CPT 95816).\n3. Headache diary for 2 weeks.',
    },
  },
  'PT-03': {
    activeEncounterStep: 'intake',
    noteLocked: false,
    isRecording: false,
    scribeIndex: 0,
    transcript: [],
    soapNote: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    },
  },
  'PT-04': {
    activeEncounterStep: 'prior-auth',
    noteLocked: true,
    isRecording: false,
    scribeIndex: 0,
    transcript: [],
    soapNote: {
      subjective: 'Diana reports 2 breakthrough seizures in the past month on current levetiracetam dose.',
      objective: 'EEG: stable background rhythm. Antiepileptic level within range.',
      assessment: '1. Epilepsy, partial onset (ICD-10: G40.109) — breakthrough events.',
      plan: '1. Increase levetiracetam to 750mg BID.\n2. Prior auth for vEEG if seizures persist.',
    },
  },
  'PT-05': {
    activeEncounterStep: 'intake',
    noteLocked: false,
    isRecording: false,
    scribeIndex: 0,
    transcript: [],
    soapNote: {
      subjective: '',
      objective: '',
      assessment: '',
      plan: '',
    },
  },
});

const INITIAL_CDS_ALERTS = [
  { id: 'CDS-1', patient: 'Arthur Pendelton', type: 'ICP Trend', value: '11 mmHg', severity: 'warning', msg: 'ICP approaching upper normal limit; correlate with headache diary and neuro imaging', time: '09:03 AM' },
  { id: 'CDS-2', patient: 'Robert Bruce', type: 'EEG Spike Activity', value: 'Focal temporal', severity: 'info', msg: 'Intermittent focal temporal sharp waves on ambulatory EEG stream', time: '09:12 AM' }
];

const AGENT_LOG_TEMPLATES = [
  "Agent checking insurer portal connection...",
  "Loading UnitedHealthcare Provider Portal — Neurology Prior Auth queue...",
  "Autofilling login credentials from secure credentials manager...",
  "Auth bypass completed. Navigating to neuroimaging authorization requests...",
  "Prior Auth form detected. Injecting neurology clinical records and EEG summary...",
  "Extracting ICD-10 and CPT codes from doctor's SOAP note...",
  "Identified: ICD-10 G43.909 (Migraine), CPT 70551 (Brain MRI without contrast)...",
  "Syncing ambulatory EEG data stream to payer clinical attachment bundle...",
  "Uploading PDF summary of headache diary, neuro exam, and 3-month treatment history...",
  "Submitting neurology prior auth for CGRP monoclonal antibody therapy...",
  "Portal response received: Claim CLM-002 (Brain MRI 70551) under standard clinical review (reference ID: UHC-992384)."
];

export const AGENT_REGISTRY = [
  {
    id: 'orchestrator',
    name: 'Orchestrator Agent',
    role: 'Root coordinator — routes tasks to specialist sub-agents based on clinical context.',
    status: 'online',
    model: 'gemini-2.5-pro',
    skills: ['orchestrate.dispatch', 'context.resolve', 'agent.monitor'],
    mcpTools: ['registry.listAgents', 'registry.routeTask', 'audit.logEvent'],
    color: 'teal',
    taskQueue: [],
  },
  {
    id: 'scribe-agent',
    name: 'Scribe Agent',
    role: 'Transforms live dialogue into structured neurology SOAP notes.',
    status: 'online',
    model: 'gemini-2.5-flash',
    skills: ['scribe.start', 'soap.generate', 'note.export'],
    mcpTools: ['ehr.getPatientContext', 'ehr.writeSoapDraft'],
    color: 'indigo',
    taskQueue: [],
  },
  {
    id: 'portal-agent',
    name: 'Portal Agent',
    role: 'Coordinates prior auth, payer portal navigation, and eligibility tasks.',
    status: 'online',
    model: 'gemini-2.5-flash',
    skills: ['prior-auth.submit', 'intake.verify', 'eligibility.refresh'],
    mcpTools: ['payer.submitPriorAuth', 'payer.checkEligibility', 'imaging.attachClinicalPacket'],
    color: 'amber',
    taskQueue: [],
  },
  {
    id: 'rcm-agent',
    name: 'RCM Agent',
    role: 'Monitors claims, denial workflows, and appeal packet generation.',
    status: 'online',
    model: 'gemini-2.5-flash',
    skills: ['rcm.appeal', 'rcm.audit', 'denial.review'],
    mcpTools: ['claims.fetchStatus', 'claims.createAppeal', 'billing.auditTrail'],
    color: 'rose',
    taskQueue: [],
  },
];

export const MCP_SERVERS = [
  {
    id: 'ehr-mcp',
    name: 'EHR MCP Server',
    endpoint: 'mcp://ehr.internal:8001',
    status: 'online',
    latency: 42,
    tools: ['ehr.getPatientContext', 'ehr.writeSoapDraft', 'ehr.attachNeuroExam'],
    description: 'Epic EHR integration — reads/writes patient records and clinical documents.',
    callCount: 0,
  },
  {
    id: 'payer-mcp',
    name: 'Payer MCP Server',
    endpoint: 'mcp://payer.clearinghouse:8002',
    status: 'online',
    latency: 88,
    tools: ['payer.submitPriorAuth', 'payer.checkEligibility', 'payer.fetchDecision'],
    description: 'Clearinghouse API — submits auth requests and checks eligibility in real-time.',
    callCount: 0,
  },
  {
    id: 'billing-mcp',
    name: 'Billing MCP Server',
    endpoint: 'mcp://billing.internal:8003',
    status: 'degraded',
    latency: 164,
    tools: ['claims.fetchStatus', 'claims.createAppeal', 'billing.auditTrail'],
    description: 'RCM billing pipeline — claim status tracking, appeal generation, audit log writer.',
    callCount: 0,
  },
  {
    id: 'imaging-mcp',
    name: 'Imaging MCP Server',
    endpoint: 'mcp://pacs.internal:8004',
    status: 'online',
    latency: 55,
    tools: ['imaging.attachClinicalPacket', 'imaging.fetchStudy', 'imaging.orderMRI'],
    description: 'PACS integration — attaches imaging studies and clinical packets to prior auth bundles.',
    callCount: 0,
  },
];

export const SECURITY_CONTROLS = [
  { id: 'rbac', name: 'Role-based access control', status: 'enforced', detail: 'Neurology clinician session scoped to read/write clinical workflows.' },
  { id: 'vault', name: 'Credential vault', status: 'healthy', detail: 'Portal credentials represented as vaulted secrets, never shown in UI.' },
  { id: 'audit', name: 'Audit trail', status: 'streaming', detail: 'All agent actions append to immutable system activity logs.' },
  { id: 'phi', name: 'PHI redaction guard', status: 'active', detail: 'CLI and logs redact secret-bearing commands and sensitive tokens.' },
  { id: 'injection', name: 'Prompt injection guard', status: 'active', detail: 'Blocks adversarial instructions in clinical notes and prior-auth text before agent tools run.' },
];

export const AGENT_SKILLS = [
  { id: 'agents.list', command: '/agents list', description: 'List active agents and assigned roles.', category: 'orchestration' },
  { id: 'mcp.tools', command: '/mcp tools', description: 'Show connected MCP servers and exposed tools.', category: 'mcp' },
  { id: 'mcp.ping', command: '/mcp ping', description: 'Ping all MCP servers and display latency.', category: 'mcp' },
  { id: 'security.audit', command: '/security audit', description: 'Run a simulated security posture check.', category: 'security' },
  { id: 'security.phi', command: '/security phi-log', description: 'Display recent PHI redaction events.', category: 'security' },
  { id: 'security.injection', command: '/security injection-test', description: 'Test prompt-injection detection on sample adversarial text.', category: 'security' },
  { id: 'skill.intake.verify', command: '/skill run intake.verify PT-03', description: 'Execute eligibility verification skill for a queued patient.', category: 'skill' },
  { id: 'skill.rcm.appeal', command: '/skill run rcm.appeal RCM-101', description: 'Dispatch an RCM appeal workflow skill.', category: 'skill' },
  { id: 'skill.soap.generate', command: '/skill run soap.generate', description: 'Request scribe agent to finalize the current SOAP note.', category: 'skill' },
  { id: 'agent.status', command: '/agent status scribe-agent', description: 'Get detailed status for a specific agent.', category: 'orchestration' },
];

const INITIAL_VAULT_ITEMS = [
  { id: 'v1', name: 'uhc-portal-password', maskedValue: '••••••••••••', lastSync: '4 min ago', status: 'synced' },
  { id: 'v2', name: 'aetna-api-key', maskedValue: '•••••••••••••••••••••', lastSync: '4 min ago', status: 'synced' },
  { id: 'v3', name: 'epic-fhir-token', maskedValue: '••••••••••••••••', lastSync: '2 min ago', status: 'synced' },
  { id: 'v4', name: 'clearinghouse-client-secret', maskedValue: '•••••••••••••••••••••••••', lastSync: '6 min ago', status: 'synced' },
  { id: 'v5', name: 'pacs-service-account', maskedValue: '••••••••••••••••••', lastSync: '8 min ago', status: 'synced' },
];

const RBAC_SCOPE = {
  role: 'Neurology Clinician',
  sessionId: 'sess-a4f9-2026',
  user: 'Dr. Evelyn Young',
  granted: [
    'ehr:read:patient.*',
    'ehr:write:soap-note',
    'ehr:write:order',
    'payer:read:eligibility',
    'payer:write:prior-auth',
    'claims:read:status',
    'imaging:read:study',
    'imaging:write:order',
  ],
  denied: [
    'admin:write:user-management',
    'billing:write:fee-schedule',
    'ehr:delete:record',
    'audit:write:*',
    'vault:read:credentials',
  ],
};

const PHI_TOKENS = [
  'Arthur Pendelton', 'DOB: 1968-03-14', 'SSN: ***-**-****', 'Sarah Jenkins',
  'Michael Chang', '58-year-old male', 'G43.109', '95816', '70551',
  'Diana Prince', 'Robert Bruce', '10 mmHg', 'topiramate 50mg'
];

// Generates a timestamp string
const nowTime = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

// Inter-agent message templates
const MESSAGE_TEMPLATES = [
  { from: 'orchestrator', to: 'portal-agent', content: 'Dispatch eligibility check for PT-03 (Michael Chang). Required before 10:00 AM slot.', type: 'task' },
  { from: 'portal-agent', to: 'orchestrator', content: 'Eligibility check complete for PT-03. Coverage active. Deductible: $500 remaining.', type: 'response' },
  { from: 'orchestrator', to: 'scribe-agent', content: 'Begin scribe session for Dr. Young — Arthur Pendelton encounter started.', type: 'task' },
  { from: 'scribe-agent', to: 'orchestrator', content: 'SOAP note draft generated. Awaiting physician attestation before EHR commit.', type: 'response' },
  { from: 'orchestrator', to: 'rcm-agent', content: 'Initiate appeal workflow for RCM-101 (David Vance, CLM-005). Attach neuro clinical records.', type: 'task' },
  { from: 'rcm-agent', to: 'orchestrator', content: 'Appeal packet compiled. Dispatched to Humana clearinghouse (Ref: APP-7823).', type: 'response' },
  { from: 'portal-agent', to: 'orchestrator', content: 'UHC portal session active. Auth form for CLM-002 (Brain MRI 70551) submitted.', type: 'response' },
  { from: 'orchestrator', to: 'scribe-agent', content: 'Extract ICD-10 and CPT codes from latest SOAP note for prior auth bundle.', type: 'task' },
  { from: 'scribe-agent', to: 'portal-agent', content: 'Forwarding extracted codes: ICD-10 G43.109, CPT 70551, CPT 95816.', type: 'forward' },
];

// MCP tool call templates
const MCP_CALL_TEMPLATES = [
  { server: 'ehr-mcp', tool: 'ehr.getPatientContext', caller: 'scribe-agent', params: { patientId: 'PT-01', fields: ['demographics', 'diagnoses', 'medications'] }, status: 'success' },
  { server: 'payer-mcp', tool: 'payer.checkEligibility', caller: 'portal-agent', params: { patientId: 'PT-03', insurerId: 'BCBS' }, status: 'success' },
  { server: 'ehr-mcp', tool: 'ehr.writeSoapDraft', caller: 'scribe-agent', params: { encounterId: 'ENC-2026-0701', version: 3 }, status: 'success' },
  { server: 'payer-mcp', tool: 'payer.submitPriorAuth', caller: 'portal-agent', params: { claimId: 'CLM-002', cptCode: '70551' }, status: 'success' },
  { server: 'billing-mcp', tool: 'claims.fetchStatus', caller: 'rcm-agent', params: { claimId: 'CLM-005' }, status: 'success' },
  { server: 'billing-mcp', tool: 'claims.createAppeal', caller: 'rcm-agent', params: { claimId: 'CLM-005', reason: 'Insufficient documentation' }, status: 'timeout' },
  { server: 'imaging-mcp', tool: 'imaging.attachClinicalPacket', caller: 'portal-agent', params: { authId: 'UHC-992384', studyType: 'MRI-Brain' }, status: 'success' },
  { server: 'ehr-mcp', tool: 'ehr.attachNeuroExam', caller: 'scribe-agent', params: { encounterId: 'ENC-2026-0701' }, status: 'success' },
  { server: 'payer-mcp', tool: 'payer.fetchDecision', caller: 'portal-agent', params: { authId: 'UHC-992384' }, status: 'pending' },
  { server: 'billing-mcp', tool: 'billing.auditTrail', caller: 'rcm-agent', params: { range: 'today' }, status: 'success' },
];

export const DashboardProvider = ({ children }) => {
  // Navigation State
  const [activeTab, setActiveTab] = useState('clinical');

  const [activePatientId, setActivePatientId] = useState('PT-01');
  const activePatientIdRef = useRef('PT-01');
  const [patientEncounters, setPatientEncounters] = useState(buildPatientEncounters);
  const [dismissedAlertIds, setDismissedAlertIds] = useState([]);

  // Prior Auth & Claims Manager State
  const [claims, setClaims] = useState(INITIAL_CLAIMS);
  const [agentLogs, setAgentLogs] = useState([
    { id: 1, text: "Clinical automation agent initialized successfully.", type: 'system', time: '09:00 AM' },
    { id: 2, text: "Prior auth monitor listening on active medical records...", type: 'system', time: '09:01 AM' },
    { id: 3, text: "[Agent Orchestrator] Registered 4 agents, 4 MCP servers, and 4 security controls.", type: 'system', time: '09:01 AM' }
  ]);

  // Patient Intake Queue
  const [patientQueue, setPatientQueue] = useState(INITIAL_QUEUE);

  // CDS Alerts State
  const [cdsAlerts, setCdsAlerts] = useState(INITIAL_CDS_ALERTS);

  // RCM Ledger State
  const [rcmLedger, setRcmLedger] = useState([
    { id: 'RCM-101', patient: 'David Vance', code: '99214', fee: '$220', status: 'Denied', action: 'Appeal Denied Claim', reason: 'Chronic migraine visit — insufficient headache diary documentation' },
    { id: 'RCM-102', patient: 'Eliza Ross', code: '64615', fee: '$680', status: 'Paid', action: 'None', reason: 'Botox injection for chronic migraine — processed successfully' },
    { id: 'RCM-103', patient: 'Arthur Pendelton', code: '95816', fee: '$185', status: 'Draft', action: 'Generate Claim', reason: 'Routine EEG — awaiting ambulatory study completion' },
    { id: 'RCM-104', patient: 'Sarah Jenkins', code: '70551', fee: '$950', status: 'Submitted', action: 'Monitor Status', reason: 'Brain MRI w/o contrast — claim sent to clearinghouse' },
    { id: 'RCM-105', patient: 'Michael Chang', code: '95886', fee: '$420', status: 'Submitted', action: 'Monitor Status', reason: 'EMG/NCS upper extremity neuropathy workup' }
  ]);

  // EEG ticker state (simulating ambulatory brainwave stream)
  const [eegData, setEegData] = useState(
    Array.from({ length: 40 }, (_, i) => 50 + Math.sin(i * 0.4) * 12 + Math.sin(i * 0.85) * 6 + Math.sin(i * 1.6) * 4)
  );

  const [securityEvents, setSecurityEvents] = useState([
    { id: 1, title: 'Vault sync', severity: 'info', detail: 'Credential vault last synced 4 minutes ago.' },
    { id: 2, title: 'RBAC policy', severity: 'success', detail: 'Neurology workstation policy matches expected access scope.' },
  ]);

  // === NEW AGENT STUDIO STATE ===

  // Inter-agent message bus log
  const [agentMessages, setAgentMessages] = useState([
    { id: 1, from: 'orchestrator', to: 'portal-agent', content: 'Dispatch eligibility check for PT-03 (Michael Chang).', type: 'task', time: '09:01 AM' },
    { id: 2, from: 'portal-agent', to: 'orchestrator', content: 'Eligibility check complete for PT-03. Coverage active.', type: 'response', time: '09:02 AM' },
    { id: 3, from: 'orchestrator', to: 'scribe-agent', content: 'Begin scribe session for Arthur Pendelton encounter.', type: 'task', time: '09:02 AM' },
  ]);

  // MCP tool-call trace log
  const [mcpCallLog, setMcpCallLog] = useState([
    { id: 1, server: 'ehr-mcp', tool: 'ehr.getPatientContext', caller: 'scribe-agent', params: { patientId: 'PT-01' }, status: 'success', latency: 38, time: '09:00:12 AM' },
    { id: 2, server: 'payer-mcp', tool: 'payer.checkEligibility', caller: 'portal-agent', params: { patientId: 'PT-03', insurerId: 'BCBS' }, status: 'success', latency: 92, time: '09:01:05 AM' },
    { id: 3, server: 'ehr-mcp', tool: 'ehr.writeSoapDraft', caller: 'scribe-agent', params: { encounterId: 'ENC-2026-0701' }, status: 'success', latency: 45, time: '09:01:48 AM' },
  ]);

  // Per-server rolling latency history (last 20 samples each)
  const [mcpLatencyHistory, setMcpLatencyHistory] = useState({
    'ehr-mcp': Array.from({ length: 20 }, () => 40 + Math.random() * 20),
    'payer-mcp': Array.from({ length: 20 }, () => 80 + Math.random() * 30),
    'billing-mcp': Array.from({ length: 20 }, () => 150 + Math.random() * 50),
    'imaging-mcp': Array.from({ length: 20 }, () => 50 + Math.random() * 20),
  });

  // Per-server call counts (updates with each simulated call)
  const [mcpServerCallCounts, setMcpServerCallCounts] = useState({
    'ehr-mcp': 14,
    'payer-mcp': 9,
    'billing-mcp': 5,
    'imaging-mcp': 3,
  });

  // PHI redaction events
  const [phiRedactionLog, setPhiRedactionLog] = useState([
    { id: 1, token: 'Arthur Pendelton', context: 'agent-log', replacement: '[PATIENT_NAME]', time: '09:01:02 AM' },
    { id: 2, token: 'DOB: 1968-03-14', context: 'mcp-payload', replacement: '[PHI_DATE]', time: '09:01:15 AM' },
    { id: 3, token: 'Sarah Jenkins', context: 'agent-log', replacement: '[PATIENT_NAME]', time: '09:02:30 AM' },
  ]);

  // Credential vault items
  const [vaultItems] = useState(INITIAL_VAULT_ITEMS);

  // RBAC scope for current session
  const [rbacScope] = useState(RBAC_SCOPE);

  // Per-agent task queues
  const [agentTaskQueues, setAgentTaskQueues] = useState({
    'orchestrator': [
      { id: 'T-001', task: 'Route eligibility check for PT-03', status: 'done', time: '09:01 AM' },
      { id: 'T-002', task: 'Dispatch scribe session for Pendelton encounter', status: 'done', time: '09:02 AM' },
      { id: 'T-003', task: 'Monitor CLM-002 portal submission progress', status: 'active', time: '09:05 AM' },
    ],
    'scribe-agent': [
      { id: 'T-004', task: 'Transcribe Dr. Young / Arthur Pendelton dialogue', status: 'active', time: '09:00 AM' },
      { id: 'T-005', task: 'Generate SOAP note draft (version 3)', status: 'done', time: '09:03 AM' },
    ],
    'portal-agent': [
      { id: 'T-006', task: 'Navigate UHC portal for CLM-002 Brain MRI auth', status: 'active', time: '09:02 AM' },
      { id: 'T-007', task: 'Verify eligibility PT-03 (BCBS)', status: 'done', time: '09:01 AM' },
      { id: 'T-008', task: 'Attach imaging packet to UHC-992384', status: 'pending', time: '09:10 AM' },
    ],
    'rcm-agent': [
      { id: 'T-009', task: 'Compile appeal packet for RCM-101', status: 'pending', time: '09:08 AM' },
      { id: 'T-010', task: 'Audit billing trail for today\'s claims', status: 'active', time: '09:06 AM' },
    ],
  });

  // Ensure light mode only
  useEffect(() => {
    document.documentElement.classList.remove('dark');
  }, []);

  const updateEncounter = (patientId, patch) => {
    setPatientEncounters(prev => ({
      ...prev,
      [patientId]: { ...prev[patientId], ...patch },
    }));
  };

  const emptyEncounter = {
    activeEncounterStep: 'intake',
    noteLocked: false,
    isRecording: false,
    scribeIndex: 0,
    transcript: [],
    soapNote: { subjective: '', objective: '', assessment: '', plan: '' },
  };

  const activeEncounter = patientEncounters[activePatientId] || patientEncounters['PT-01'] || emptyEncounter;
  const {
    activeEncounterStep,
    noteLocked,
    isRecording,
    scribeIndex,
    transcript,
    soapNote,
  } = activeEncounter;

  const setActiveEncounterStep = (step) => updateEncounter(activePatientId, { activeEncounterStep: step });

  const setIsRecording = (value) => {
    updateEncounter(activePatientId, {
      isRecording: typeof value === 'function' ? value(isRecording) : value,
    });
  };

  const resetScribeSession = () => {
    updateEncounter(activePatientId, {
      transcript: [MOCK_SCRIBE_STREAM[0]],
      scribeIndex: 1,
      isRecording: true,
    });
  };

  const updateSoapNoteSection = (section, value) => {
    setPatientEncounters(prev => ({
      ...prev,
      [activePatientId]: {
        ...prev[activePatientId],
        soapNote: { ...prev[activePatientId].soapNote, [section]: value },
      },
    }));
  };

  // EEG live animation simulator (neurology CDS stream ticker)
  useEffect(() => {
    const interval = setInterval(() => {
      setEegData(prev => {
        const nextData = [...prev.slice(1)];
        const tick = Date.now() / 280;
        let val = 50
          + Math.sin(tick * 1.1) * 14
          + Math.sin(tick * 2.0) * 7
          + Math.sin(tick * 0.45) * 5
          + (Math.random() - 0.5) * 3;
        val = Math.max(8, Math.min(92, val));
        nextData.push(val);
        return nextData;
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // MCP latency history updater (continuous sparklines)
  useEffect(() => {
    const interval = setInterval(() => {
      setMcpLatencyHistory(prev => {
        const next = { ...prev };
        const baseLatencies = { 'ehr-mcp': 42, 'payer-mcp': 88, 'billing-mcp': 164, 'imaging-mcp': 55 };
        Object.keys(next).forEach(serverId => {
          const base = baseLatencies[serverId] || 60;
          const jitter = (Math.random() - 0.5) * 30;
          const spike = Math.random() > 0.92 ? Math.random() * 80 : 0;
          const val = Math.max(10, base + jitter + spike);
          next[serverId] = [...next[serverId].slice(1), val];
        });
        return next;
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // MCP call simulator (fires every 8-14 seconds)
  useEffect(() => {
    let callIdx = 0;
    const interval = setInterval(() => {
      const template = MCP_CALL_TEMPLATES[callIdx % MCP_CALL_TEMPLATES.length];
      const time = nowTime();
      const baseLatencies = { 'ehr-mcp': 42, 'payer-mcp': 88, 'billing-mcp': 164, 'imaging-mcp': 55 };
      const latency = Math.round((baseLatencies[template.server] || 60) + (Math.random() - 0.5) * 25);

      const newCall = {
        id: Date.now(),
        ...template,
        latency,
        time,
      };

      setMcpCallLog(prev => [newCall, ...prev].slice(0, 30));
      setMcpServerCallCounts(prev => ({
        ...prev,
        [template.server]: (prev[template.server] || 0) + 1,
      }));
      setAgentLogs(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          text: `[MCP Router] ${template.caller} → ${template.server}::${template.tool} (${latency}ms ${template.status})`,
          type: 'portal',
          time,
        }
      ]);
      callIdx++;
    }, 9000);
    return () => clearInterval(interval);
  }, []);

  // Inter-agent message simulator (fires every 12 seconds)
  useEffect(() => {
    let msgIdx = 0;
    const interval = setInterval(() => {
      const template = MESSAGE_TEMPLATES[msgIdx % MESSAGE_TEMPLATES.length];
      const time = nowTime();
      const newMsg = { id: Date.now(), ...template, time };
      setAgentMessages(prev => [...prev, newMsg].slice(-25));

      // Update task queues for the receiving agent
      setAgentTaskQueues(prev => {
        const toAgent = template.to;
        const queue = prev[toAgent] || [];
        if (template.type === 'task') {
          const newTask = {
            id: `T-${Date.now()}`,
            task: template.content.substring(0, 50) + (template.content.length > 50 ? '…' : ''),
            status: 'pending',
            time,
          };
          return {
            ...prev,
            [toAgent]: [newTask, ...queue].slice(0, 8),
          };
        }
        return prev;
      });

      msgIdx++;
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // PHI redaction simulator (fires when scribe is recording)
  useEffect(() => {
    if (!isRecording) return;
    const interval = setInterval(() => {
      const token = PHI_TOKENS[Math.floor(Math.random() * PHI_TOKENS.length)];
      const contexts = ['agent-log', 'mcp-payload', 'scribe-transcript', 'audit-trail'];
      const replacements = {
        'Arthur Pendelton': '[PATIENT_NAME]',
        'Sarah Jenkins': '[PATIENT_NAME]',
        'Michael Chang': '[PATIENT_NAME]',
        'Diana Prince': '[PATIENT_NAME]',
        'Robert Bruce': '[PATIENT_NAME]',
        '58-year-old male': '[PATIENT_DEMO]',
        'DOB: 1968-03-14': '[PHI_DATE]',
        'SSN: ***-**-****': '[PHI_SSN]',
        'topiramate 50mg': '[MEDICATION_DOSE]',
        '10 mmHg': '[CLINICAL_VALUE]',
      };
      const newEvent = {
        id: Date.now(),
        token,
        context: contexts[Math.floor(Math.random() * contexts.length)],
        replacement: replacements[token] || '[PHI_TOKEN]',
        time: nowTime(),
      };
      setPhiRedactionLog(prev => [newEvent, ...prev].slice(0, 20));
    }, 5000);
    return () => clearInterval(interval);
  }, [isRecording]);

  // Ambient Scribe Live Transcript Streaming Simulation
  useEffect(() => {
    if (!isRecording || activePatientId !== 'PT-01') return;

    const interval = setInterval(() => {
      setPatientEncounters(prev => {
        const enc = prev[activePatientId];
        if (!enc) return prev;
        if (enc.scribeIndex >= MOCK_SCRIBE_STREAM.length) {
          if (enc.isRecording) {
            setAgentLogs(logs => [
              ...logs,
              {
                id: logs.length + 1,
                text: '[Scribe Agent] Scribe session complete. Structured clinical SOAP note finalized and verified.',
                type: 'success',
                time: nowTime(),
              },
            ]);
          }
          return {
            ...prev,
            [activePatientId]: { ...enc, isRecording: false },
          };
        }
        const idx = enc.scribeIndex;
        setAgentLogs(logs => [
          ...logs,
          {
            id: logs.length + 1,
            text: `[Scribe Agent] Appending dialogue block from ${MOCK_SCRIBE_STREAM[idx].speaker}...`,
            type: 'scribe',
            time: nowTime(),
          },
        ]);
        return {
          ...prev,
          [activePatientId]: {
            ...enc,
            transcript: [...enc.transcript, MOCK_SCRIBE_STREAM[idx]],
            scribeIndex: idx + 1,
            isRecording: idx + 1 < MOCK_SCRIBE_STREAM.length,
          },
        };
      });
    }, 4500);

    return () => clearInterval(interval);
  }, [isRecording, activePatientId]);

  // Background Web Portal Prior Auth Agent logs simulator
  useEffect(() => {
    let logIndex = 0;
    const interval = setInterval(() => {
      if (logIndex < AGENT_LOG_TEMPLATES.length) {
        setAgentLogs(prev => [
          ...prev,
          {
            id: prev.length + 1,
            text: `[Portal Agent] ${AGENT_LOG_TEMPLATES[logIndex]}`,
            type: 'portal',
            time: nowTime()
          }
        ]);

        if (logIndex === 1) {
          setClaims(prev => prev.map(c => c.id === 'CLM-002' ? { ...c, progress: 70, log: 'portal page loaded' } : c));
        } else if (logIndex === 5) {
          setClaims(prev => prev.map(c => c.id === 'CLM-002' ? { ...c, progress: 85, log: 'injected clinical notes' } : c));
        } else if (logIndex === 10) {
          setClaims(prev => prev.map(c => c.id === 'CLM-002' ? { ...c, progress: 100, log: 'portal submission done' } : c));
        }

        logIndex++;
      } else {
        logIndex = 0;
      }
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Live CDS neurology alerts generator — scoped to active patient only
  useEffect(() => {
    const alertTimer = setInterval(() => {
      const activeId = activePatientIdRef.current;
      const activeName = INITIAL_QUEUE.find(p => p.id === activeId)?.name || 'Arthur Pendelton';
      const alertTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const alertVariants = [
        { type: 'EEG Alpha Suppression', value: 'Theta-dominant', msg: 'Transient alpha wave suppression detected on ambulatory EEG stream during scribe session.' },
        { type: 'ICP Trend', value: `${10 + Math.floor(Math.random() * 4)} mmHg`, msg: 'Intracranial pressure trending upward; correlate with headache severity and imaging.' },
        { type: 'Seizure Risk Flag', value: 'Low-grade', msg: 'Intermittent focal sharp waves — review antiepileptic levels and sleep deprivation history.' },
      ];
      const variant = alertVariants[Math.floor(Math.random() * alertVariants.length)];
      const newAlert = {
        id: `CDS-${Date.now()}`,
        patient: activeName,
        patientId: activeId,
        type: variant.type,
        value: variant.value,
        severity: Math.random() > 0.4 ? 'warning' : 'danger',
        msg: variant.msg,
        time: alertTime
      };
      setCdsAlerts(prev => [newAlert, ...prev.filter(a => a.patientId === activeId || a.patient === activeName)].slice(0, 3));
    }, 45000);

    return () => clearInterval(alertTimer);
  }, []);

  // Eligibility check trigger
  const triggerEligibilityCheck = (patientId) => {
    setPatientQueue(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          status: 'Eligible',
          verifiedAt: `${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (Auto-verified)`
        };
      }
      return p;
    }));

    setAgentLogs(prev => [
      ...prev,
      { id: prev.length + 1, text: `[Portal Agent] Dispatched eligibility verification query for Patient ${patientId} to Clearinghouse API...`, type: 'portal', time: nowTime() },
      { id: prev.length + 2, text: `[Portal Agent] Eligibility check successful. Insurer coverage confirmed ACTIVE.`, type: 'success', time: nowTime() }
    ]);
  };

  // Appeal claim trigger
  const appealClaim = (rcmId) => {
    setRcmLedger(prev => prev.map(r => {
      if (r.id === rcmId) {
        return { ...r, status: 'Appealed', action: 'Under Appeal Review', reason: 'Appeal packet generated and dispatched with clinical SOAP records.' };
      }
      return r;
    }));

    setAgentLogs(prev => [
      ...prev,
      { id: prev.length + 1, text: `[RCM Agent] Compiling medical justification packet for Claim ${rcmId} appeal...`, type: 'rcm', time: nowTime() },
      { id: prev.length + 2, text: `[RCM Agent] Dispatched appeal to clearinghouse portal (Reference: APP-${Math.floor(1000 + Math.random() * 9000)})`, type: 'success', time: nowTime() }
    ]);
  };

  // Interactive MCP tool test (from MCP Inspector)
  const runMcpToolTest = (serverId, toolName, mockParams) => {
    const server = MCP_SERVERS.find(s => s.id === serverId);
    if (!server) return;
    const baseLatencies = { 'ehr-mcp': 42, 'payer-mcp': 88, 'billing-mcp': 164, 'imaging-mcp': 55 };
    const latency = Math.round((baseLatencies[serverId] || 60) + (Math.random()) * 40);
    const time = nowTime();
    const isTimeout = server.status === 'degraded' && Math.random() > 0.5;

    const newCall = {
      id: Date.now(),
      server: serverId,
      tool: toolName,
      caller: 'manual-test',
      params: mockParams,
      status: isTimeout ? 'timeout' : 'success',
      latency,
      time,
      isManual: true,
    };

    setMcpCallLog(prev => [newCall, ...prev].slice(0, 30));
    setMcpServerCallCounts(prev => ({ ...prev, [serverId]: (prev[serverId] || 0) + 1 }));
    setAgentLogs(prev => [
      ...prev,
      { id: Date.now() + 1, text: `[MCP Inspector] Manual test: ${toolName} on ${server.name} → ${newCall.status} (${latency}ms)`, type: isTimeout ? 'system' : 'success', time }
    ]);
    return newCall;
  };

  const runAgentCommand = (rawCommand) => {
    const command = rawCommand.trim();
    if (!command) return;

    const time = nowTime();
    const newEntries = [
      { id: Date.now(), text: `[Agents CLI] ${command}`, type: 'system', time },
    ];

    if (command === '/agents list') {
      AGENT_REGISTRY.forEach((agent, index) => {
        newEntries.push({
          id: Date.now() + index + 1,
          text: `[Agent Orchestrator] ${agent.name} :: ${agent.role} :: skills=${agent.skills.length} :: tools=${agent.mcpTools.length} :: model=${agent.model}`,
          type: 'portal',
          time,
        });
      });
    } else if (command === '/mcp tools') {
      MCP_SERVERS.forEach((server, index) => {
        newEntries.push({
          id: Date.now() + index + 10,
          text: `[MCP Router] ${server.name} (${server.status}, ${server.latency}ms) → ${server.tools.join(', ')}`,
          type: 'portal',
          time,
        });
      });
    } else if (command === '/mcp ping') {
      MCP_SERVERS.forEach((server, index) => {
        const pingMs = Math.round(server.latency + (Math.random() - 0.5) * 20);
        newEntries.push({
          id: Date.now() + index + 15,
          text: `[MCP Router] PING ${server.endpoint} → ${server.status === 'degraded' ? 'DEGRADED' : 'OK'} ${pingMs}ms`,
          type: server.status === 'degraded' ? 'system' : 'success',
          time,
        });
      });
    } else if (command === '/security audit') {
      SECURITY_CONTROLS.forEach((control, index) => {
        newEntries.push({
          id: Date.now() + index + 20,
          text: `[Security Guard] ${control.name}: ${control.status.toUpperCase()} :: ${control.detail}`,
          type: control.status === 'healthy' || control.status === 'enforced' || control.status === 'active' ? 'success' : 'system',
          time,
        });
      });
      setSecurityEvents(prev => [
        { id: prev.length + 1, title: 'Security audit', severity: 'success', detail: 'All simulated controls passed CLI verification.' },
        ...prev,
      ].slice(0, 5));
    } else if (command === '/security phi-log') {
      phiRedactionLog.slice(0, 5).forEach((event, index) => {
        newEntries.push({
          id: Date.now() + index + 25,
          text: `[PHI Guard] Redacted "${event.token}" → ${event.replacement} in ${event.context} at ${event.time}`,
          type: 'system',
          time,
        });
      });
    } else if (command.startsWith('/skill run intake.verify ')) {
      const patientId = command.split(' ').pop();
      triggerEligibilityCheck(patientId);
      newEntries.push({ id: Date.now() + 30, text: `[Skill Runner] intake.verify dispatched for ${patientId}.`, type: 'success', time });
    } else if (command.startsWith('/skill run rcm.appeal ')) {
      const claimId = command.split(' ').pop();
      appealClaim(claimId);
      newEntries.push({ id: Date.now() + 40, text: `[Skill Runner] rcm.appeal dispatched for ${claimId}.`, type: 'success', time });
    } else if (command === '/skill run soap.generate') {
      newEntries.push({
        id: Date.now() + 45,
        text: `[Skill Runner] soap.generate dispatched to Scribe Agent. SOAP note version ${Math.floor(3 + Math.random() * 2)} committed to EHR draft.`,
        type: 'success',
        time,
      });
    } else if (command.startsWith('/agent status ')) {
      const agentId = command.split(' ').pop();
      const agent = AGENT_REGISTRY.find(a => a.id === agentId);
      if (agent) {
        const tasks = agentTaskQueues[agentId] || [];
        newEntries.push({
          id: Date.now() + 50,
          text: `[Orchestrator] ${agent.name} :: status=${agent.status} :: model=${agent.model} :: activeTask=${tasks.find(t => t.status === 'active')?.task || 'none'} :: queueDepth=${tasks.length}`,
          type: 'portal',
          time,
        });
      } else {
        newEntries.push({ id: Date.now() + 50, text: `[Orchestrator] Agent "${agentId}" not found. Try: orchestrator, scribe-agent, portal-agent, rcm-agent`, type: 'system', time });
      }
    } else {
      newEntries.push({
        id: Date.now() + 50,
        text: `[Agents CLI] Unknown command. Available: /agents list, /mcp tools, /mcp ping, /security audit, /security phi-log, /skill run <skill>, /agent status <id>`,
        type: 'system',
        time,
      });
    }

    setAgentLogs(prev => [...prev, ...newEntries]);
    return newEntries;
  };

  const currentPatient = patientQueue.find(p => p.id === activePatientId) || patientQueue[0];

  const thresholdAlerts = cdsAlerts.filter(
    a => (a.severity === 'danger' || a.severity === 'warning')
      && !dismissedAlertIds.includes(a.id)
      && a.patient === currentPatient?.name
  );

  const activePatientAlerts = thresholdAlerts;

  const cdsStreamStatus = activePatientAlerts.some(a => a.severity === 'danger')
    ? 'critical'
    : activePatientAlerts.length > 0
    ? 'warning'
    : 'stable';

  const dismissAlert = (id) => {
    setDismissedAlertIds(prev => (prev.includes(id) ? prev : [...prev, id]));
  };

  const setActivePatient = (id) => {
    setActivePatientId(id);
    activePatientIdRef.current = id;
  };

  // Backward-compatible aliases
  const setCurrentPatient = setActivePatient;
  const currentPatientId = activePatientId;

  const lockNote = () => {
    updateEncounter(activePatientId, { noteLocked: true });
    setAgentLogs(prev => [
      ...prev,
      {
        id: prev.length + 1,
        text: `[Scribe] SOAP note locked for ${currentPatient?.name || 'patient'}.`,
        type: 'success',
        time: nowTime(),
      },
    ]);
  };

  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      activePatientId,
      setActivePatient,
      currentPatientId,
      currentPatient,
      setCurrentPatient,
      activeEncounterStep,
      setActiveEncounterStep,
      dismissedAlertIds,
      dismissAlert,
      thresholdAlerts,
      activePatientAlerts,
      cdsStreamStatus,
      noteLocked,
      lockNote,
      isRecording,
      setIsRecording,
      transcript,
      scribeIndex,
      resetScribeSession,
      soapNote,
      updateSoapNoteSection,
      claims,
      agentLogs,
      agentRegistry: AGENT_REGISTRY,
      mcpServers: MCP_SERVERS,
      securityControls: SECURITY_CONTROLS,
      securityEvents,
      agentSkills: AGENT_SKILLS,
      runAgentCommand,
      patientQueue,
      triggerEligibilityCheck,
      cdsAlerts,
      rcmLedger,
      appealClaim,
      eegData,
      // New Agent Studio state
      agentMessages,
      mcpCallLog,
      mcpLatencyHistory,
      mcpServerCallCounts,
      phiRedactionLog,
      vaultItems,
      rbacScope,
      agentTaskQueues,
      runMcpToolTest,
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => useContext(DashboardContext);
