import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MCP_SERVERS } from '../context/DashboardContext';
import { PlugZap, CheckCircle2, AlertTriangle, Activity, Play, ChevronDown, Clock } from 'lucide-react';

const STATUS_STYLES = {
  success: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-300/50',
  timeout: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-300/50',
  pending: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300/50',
  error: 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 border-rose-300/50',
};

const CALLER_COLORS = {
  'scribe-agent': 'text-indigo-600 dark:text-indigo-400',
  'portal-agent': 'text-amber-600 dark:text-amber-400',
  'rcm-agent': 'text-rose-600 dark:text-rose-400',
  'orchestrator': 'text-teal-600 dark:text-teal-400',
  'manual-test': 'text-slate-500 dark:text-slate-400',
};

// Latency sparkline
const LatencySparkline = ({ data, serverId }) => {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const h = 28;
  const w = 80;

  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((val - min) / range) * h;
    return `${x},${y}`;
  }).join(' ');

  const isDegraded = serverId === 'billing-mcp';
  const color = isDegraded ? '#bb9442' : '#869b8b';

  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline fill="none" stroke={color} strokeWidth="1.5" points={points} />
      {/* Last point dot */}
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) / (data.length - 1) * w}
          cy={h - ((data[data.length - 1] - min) / range) * h}
          r="2.5"
          fill={color}
        />
      )}
    </svg>
  );
};

export const McpInspectorView = () => {
  const { mcpCallLog, mcpLatencyHistory, mcpServerCallCounts, runMcpToolTest } = useDashboard();
  const [selectedServer, setSelectedServer] = useState(null);
  const [selectedTool, setSelectedTool] = useState('');
  const [mockPatient, setMockPatient] = useState('PT-01');
  const [filterServer, setFilterServer] = useState('all');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);

  const filteredCalls = filterServer === 'all'
    ? mcpCallLog
    : mcpCallLog.filter(c => c.server === filterServer);

  const handleTest = () => {
    if (!selectedServer || !selectedTool) return;
    setIsTesting(true);
    setTestResult(null);
    setTimeout(() => {
      const result = runMcpToolTest(selectedServer, selectedTool, { patientId: mockPatient, requestedAt: new Date().toISOString() });
      setTestResult(result);
      setIsTesting(false);
    }, 600 + Math.random() * 800);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/50 flex items-center justify-center">
          <PlugZap className="w-5 h-5 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h2 className="text-sm font-bold text-slate-700 dark:text-slate-100">MCP Server Inspector</h2>
          <p className="text-[10px] text-slate-500 dark:text-slate-400">Real-time tool-call traces, latency sparklines, and interactive tool tester</p>
        </div>
        <div className="ml-auto flex items-center gap-2 text-[10px] font-mono bg-amber-50 dark:bg-amber-900/20 border border-amber-200/60 dark:border-amber-700/40 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          {MCP_SERVERS.length} SERVERS REGISTERED
        </div>
      </div>

      {/* Server Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {MCP_SERVERS.map(server => {
          const latencyHistory = mcpLatencyHistory[server.id] || [];
          const currentLatency = latencyHistory[latencyHistory.length - 1] || server.latency;
          const isDegraded = server.status === 'degraded';
          const callCount = mcpServerCallCounts[server.id] || 0;

          return (
            <button
              key={server.id}
              onClick={() => {
                setSelectedServer(selectedServer === server.id ? null : server.id);
                setSelectedTool(server.tools[0] || '');
                setTestResult(null);
              }}
              className={`glass-panel rounded-2xl p-4 text-left transition-all duration-200 hover:border-amber-400/40 ${
                selectedServer === server.id ? 'border-amber-400/60 shadow-md bg-amber-50/50 dark:bg-amber-900/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${isDegraded ? 'bg-amber-500' : 'bg-emerald-500'} ${isDegraded ? '' : 'animate-pulse'}`} />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    {isDegraded ? 'Degraded' : 'Online'}
                  </span>
                </div>
                {isDegraded
                  ? <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                  : <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                }
              </div>

              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100 mb-0.5">{server.name}</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-mono mb-3">{server.endpoint}</p>

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mb-0.5">Latency</p>
                  <p className={`text-sm font-mono font-bold ${isDegraded ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-100'}`}>
                    {Math.round(currentLatency)}ms
                  </p>
                </div>
                <LatencySparkline data={latencyHistory} serverId={server.id} />
              </div>

              <div className="mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{callCount} calls today</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500">{server.tools.length} tools</p>
                </div>
                <Activity className="w-4 h-4 text-slate-300 dark:text-slate-600" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* Tool Call Trace */}
        <div className="xl:col-span-7">
          <div className="glass-panel rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100 flex-1">Live Tool-Call Trace</h3>
              <select
                value={filterServer}
                onChange={e => setFilterServer(e.target.value)}
                className="text-[10px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-lg px-2 py-1 text-slate-600 dark:text-slate-400 outline-none"
              >
                <option value="all">All servers</option>
                {MCP_SERVERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />LIVE
              </span>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {filteredCalls.length === 0 && (
                <p className="text-[10px] text-slate-400 italic text-center py-4">No calls yet — tool invocations will appear here</p>
              )}
              {filteredCalls.map(call => {
                const server = MCP_SERVERS.find(s => s.id === call.server);
                return (
                  <div
                    key={call.id}
                    className={`rounded-xl border px-3 py-2.5 text-[10px] ${call.isManual ? 'border-amber-300/50 bg-amber-50/50 dark:bg-amber-900/10' : 'surface-card'}`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono font-bold text-slate-700 dark:text-slate-200">{call.tool}</span>
                      {call.isManual && (
                        <span className="text-[9px] bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-1.5 py-0.5 rounded font-bold">MANUAL</span>
                      )}
                      <span className={`ml-auto px-1.5 py-0.5 rounded border text-[9px] font-bold uppercase ${STATUS_STYLES[call.status]}`}>
                        {call.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-slate-400 dark:text-slate-500">server: <span className="text-slate-600 dark:text-slate-400">{server?.name || call.server}</span></span>
                      <span className="text-slate-400 dark:text-slate-500">caller: <span className={CALLER_COLORS[call.caller] || 'text-slate-600'}>{call.caller}</span></span>
                      <span className="text-slate-400 dark:text-slate-500">latency: <span className={call.latency > 120 ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-600 dark:text-slate-400'}>{call.latency}ms</span></span>
                      <span className="text-slate-400 dark:text-slate-500 ml-auto flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5" />{call.time}
                      </span>
                    </div>
                    <div className="mt-1 font-mono text-[9px] text-slate-400 dark:text-slate-500 truncate">
                      params: {JSON.stringify(call.params)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Interactive Tool Tester */}
        <div className="xl:col-span-5">
          <div className="glass-panel rounded-2xl p-5 h-full flex flex-col gap-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-100 mb-1">Interactive Tool Tester</h3>
              <p className="text-[10px] text-slate-400 dark:text-slate-500">Fire a simulated MCP tool call and see the response in the trace</p>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Server</label>
                <select
                  value={selectedServer || ''}
                  onChange={e => {
                    setSelectedServer(e.target.value || null);
                    const srv = MCP_SERVERS.find(s => s.id === e.target.value);
                    setSelectedTool(srv?.tools[0] || '');
                    setTestResult(null);
                  }}
                  className="w-full text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 outline-none"
                >
                  <option value="">— Select server —</option>
                  {MCP_SERVERS.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Tool</label>
                <select
                  value={selectedTool}
                  onChange={e => { setSelectedTool(e.target.value); setTestResult(null); }}
                  disabled={!selectedServer}
                  className="w-full text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 outline-none disabled:opacity-40"
                >
                  {selectedServer
                    ? MCP_SERVERS.find(s => s.id === selectedServer)?.tools.map(t => <option key={t} value={t}>{t}</option>)
                    : <option value="">— Select server first —</option>
                  }
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 block mb-1.5">Mock Patient ID</label>
                <select
                  value={mockPatient}
                  onChange={e => setMockPatient(e.target.value)}
                  className="w-full text-[11px] font-mono bg-slate-100 dark:bg-slate-900 border border-slate-200/70 dark:border-slate-700/50 rounded-lg px-3 py-2 text-slate-700 dark:text-slate-200 outline-none"
                >
                  {['PT-01', 'PT-02', 'PT-03', 'PT-04', 'PT-05'].map(id => <option key={id} value={id}>{id}</option>)}
                </select>
              </div>

              {/* Params preview */}
              {selectedServer && selectedTool && (
                <div className="bg-slate-950 rounded-xl p-3 font-mono text-[10px] text-slate-400">
                  <span className="text-slate-500">// Request payload</span>
                  <pre className="text-emerald-400 mt-1 whitespace-pre-wrap">{JSON.stringify({
                    server: selectedServer,
                    tool: selectedTool,
                    params: { patientId: mockPatient, requestedAt: '<now>' }
                  }, null, 2)}</pre>
                </div>
              )}

              <button
                onClick={handleTest}
                disabled={!selectedServer || !selectedTool || isTesting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isTesting ? (
                  <>
                    <span className="w-3 h-3 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Calling tool…
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" />
                    Fire Tool Call
                  </>
                )}
              </button>
            </div>

            {/* Test Result */}
            {testResult && (
              <div className={`rounded-xl border p-3 text-[10px] ${STATUS_STYLES[testResult.status]}`}>
                <p className="font-bold mb-1 flex items-center gap-1.5">
                  {testResult.status === 'success' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  {testResult.status === 'success' ? 'Tool call succeeded' : 'Tool call timed out'}
                </p>
                <p>Latency: <span className="font-mono font-bold">{testResult.latency}ms</span></p>
                <p>Time: {testResult.time}</p>
                <p className="mt-1 opacity-70">Result visible in the call trace →</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
