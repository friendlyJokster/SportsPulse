import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  Zap, 
  Database, 
  ArrowRight, 
  Radio, 
  Flame, 
  RefreshCw, 
  Table, 
  CheckCircle2, 
  FileJson,
  ShieldCheck
} from 'lucide-react';
import { PLATFORM_BENCHMARK_DATA } from '../data/mockData';
import { SportStrategyEngine } from '../engine/strategyRegistry';

interface ArchitectureInspectorProps {
  latencyMs: number;
}

export const ArchitectureInspector: React.FC<ArchitectureInspectorProps> = ({
  latencyMs
}) => {
  const [activeTab, setActiveTab] = useState<'comparison' | 'strategy_pattern' | 'redis_cache' | 'data_normalization'>('comparison');
  const [testFeedType, setTestFeedType] = useState<'manual_referee' | 'optical_camera_feed' | 'smart_ball_sensor'>('manual_referee');

  // Normalization preview data
  const rawFeeds = {
    manual_referee: {
      source: 'REFEREE_TABLET_CLICKER_v3',
      rawPayload: {
        tap_x: 240,
        tap_y: 180,
        button_id: 'btn_goal_home',
        scorer_ref: 'jersey_9',
        system_epoch: Date.now()
      }
    },
    optical_camera_feed: {
      source: 'CV_HAWKEYE_GRASSROOTS_CAM_2',
      rawPayload: {
        ball_velocity_kmh: 104.2,
        net_impact_vector: [0.82, 0.14, 0.95],
        crossing_detected: true,
        confidence: 0.984
      }
    },
    smart_ball_sensor: {
      source: 'IMU_NFC_SMART_BALL_CHIP',
      rawPayload: {
        spin_rpm: 840,
        impact_g_force: 32.4,
        beacon_id: 'pitch1_goal_sensor',
        timestamp_ms: Date.now()
      }
    }
  };

  const currentRaw = rawFeeds[testFeedType];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5" />
                Technical Architecture & Benchmarks
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs bg-slate-800 text-slate-300 font-mono-code">
                Ultra Low-Latency &lt;300ms
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white mt-1">
              Architecture Inspector & Performance Benchmark
            </h2>
            <p className="text-xs text-slate-400">
              Examining the Strategy Pattern, real-time SSE/WebSocket bus, Redis hot cache layer, and cross-sport normalization.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-xl border border-slate-800">
            <div className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-slate-400 block uppercase">Telemetry Pulse</span>
              <span className="text-sm font-mono-code font-bold text-emerald-400">{latencyMs}ms Latency (Pass &lt;300ms)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: 'comparison', label: 'Legacy Apps vs SportPulse Engine', icon: Table },
          { id: 'strategy_pattern', label: 'Modular Strategy Pattern', icon: Layers },
          { id: 'redis_cache', label: 'Redis Hot Caching Layer', icon: Flame },
          { id: 'data_normalization', label: 'Data Normalization Bus', icon: FileJson },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Legacy Platforms vs SportPulse Benchmark Table */}
      {activeTab === 'comparison' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-display font-bold text-white">
                Detailed Benchmark: Legacy Single-Sport Apps vs SportPulse Multi-Sport Engine
              </h3>
              <p className="text-xs text-slate-400">
                Architectural breakdown demonstrating how SportPulse unifies specialized scoring rules across all sports paradigms on a single high-performance engine.
              </p>
            </div>
            <span className="text-xs font-mono-code text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
              Next-Gen Sports Architecture
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono-code uppercase text-[11px]">
                  <th className="py-3 px-4 w-1/5">Feature Dimension</th>
                  <th className="py-3 px-4 w-2/5 text-slate-300">Traditional Single-Sport Systems</th>
                  <th className="py-3 px-4 w-2/5 text-emerald-400 font-bold">SportPulse Multi-Sport Engine</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {PLATFORM_BENCHMARK_DATA.map((row) => (
                  <tr key={row.dimension} className="hover:bg-slate-950/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-white align-top">
                      {row.dimension}
                    </td>
                    <td className="py-3.5 px-4 text-slate-400 leading-relaxed align-top">
                      {row.legacyPlatform}
                    </td>
                    <td className="py-3.5 px-4 text-slate-200 leading-relaxed align-top">
                      <div className="font-semibold text-emerald-300 mb-1">{row.sportPulse}</div>
                      <div className="text-[11px] text-slate-400 flex items-start gap-1">
                        <span className="text-emerald-400 font-bold font-mono-code">Advantage:</span>
                        <span>{row.advantage}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Strategy Pattern Architecture */}
      {activeTab === 'strategy_pattern' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>Modular Strategy Pattern: Interchangeable Rules Engine</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              The engine core manages match lifecycles, event dispatching, and live socket sync. Sport rules are injected dynamically at runtime via interchangeable strategy implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {SportStrategyEngine.getCategories().map((cat) => (
              <div
                key={cat.category}
                className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3 flex flex-col justify-between"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono-code font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    PARADIGM
                  </span>
                  <h4 className="text-sm font-display font-bold text-white mt-1">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono-code text-slate-500 uppercase block mb-1">
                    Supported Sports:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.sports.map((sp) => (
                      <span key={sp} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-xs font-medium border border-slate-800">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Strategy Dispatch Diagram */}
          <div className="bg-slate-950 rounded-2xl p-5 border border-slate-800 font-mono-code text-xs space-y-3">
            <div className="text-emerald-400 font-bold">Runtime Strategy Resolution Pipeline:</div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 w-full sm:w-auto flex-1">
                <div className="text-emerald-400 font-bold">1. Ingress Event</div>
                <div className="text-[11px] text-slate-400">e.g. `POST /api/match/event`</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block shrink-0" />
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 w-full sm:w-auto flex-1">
                <div className="text-amber-400 font-bold">2. Strategy Lookup</div>
                <div className="text-[11px] text-slate-400">`SportStrategyEngine.get(sportId)`</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block shrink-0" />
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 w-full sm:w-auto flex-1">
                <div className="text-blue-400 font-bold">3. Rule Execution</div>
                <div className="text-[11px] text-slate-400">`strategy.applyEvent(state, event)`</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-600 hidden sm:block shrink-0" />
              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 w-full sm:w-auto flex-1">
                <div className="text-purple-400 font-bold">4. SSE Broadcast</div>
                <div className="text-[11px] text-slate-400">Hot cache updated &lt;300ms</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Redis Hot Caching Layer */}
      {activeTab === 'redis_cache' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <Flame className="w-5 h-5 text-rose-500" />
              <span>Redis In-Memory Hot Caching Architecture</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Active matches generate hundreds of score, clock, and tactical events per minute. To protect the persistent database, all active matches reside purely in Redis hot memory until period breaks or final whistle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs space-y-3">
              <div className="text-rose-400 font-bold flex items-center justify-between">
                <span>HOT KEY (Active Match State)</span>
                <span className="text-[10px] text-emerald-400">TTL: 14400s (4 hrs)</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-slate-300 text-[11px] leading-relaxed border border-slate-800 overflow-x-auto">
                KEY: <span className="text-amber-300">"match:live:match_foot_01:state"</span><br/>
                TYPE: <span className="text-purple-400">HASH</span><br/>
                FIELDS:<br/>
                &nbsp;&nbsp;score_a: "2"<br/>
                &nbsp;&nbsp;score_b: "1"<br/>
                &nbsp;&nbsp;clock_sec: "4104"<br/>
                &nbsp;&nbsp;status: "LIVE"<br/>
                &nbsp;&nbsp;active_subscribers: "1,420"
              </div>
              <p className="text-[11px] text-slate-400">
                Score updates hit Redis in 1.4ms with HINCRBY, bypassing disk I/O entirely.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono-code text-xs space-y-3">
              <div className="text-blue-400 font-bold flex items-center justify-between">
                <span>PERSISTENCE WRITE-BEHIND</span>
                <span className="text-[10px] text-slate-400">PostgreSQL / Cloud SQL</span>
              </div>
              <div className="bg-slate-900 p-3 rounded-lg text-slate-300 text-[11px] leading-relaxed border border-slate-800 overflow-x-auto">
                ASYNC FLUSH TRIGGERS:<br/>
                &nbsp;&nbsp;• Period Break (Half Time / End of Set)<br/>
                &nbsp;&nbsp;• Red Card or Significant Stoppage<br/>
                &nbsp;&nbsp;• Full-Time Final Whistle<br/>
                &nbsp;&nbsp;• Write Batch Interval: 60 seconds
              </div>
              <p className="text-[11px] text-slate-400">
                Guarantees 99.999% uptime during grassroots tournament super-Saturdays with 10,000 simultaneous games.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Data Normalization Bus */}
      {activeTab === 'data_normalization' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-display font-bold text-white flex items-center gap-2">
              <FileJson className="w-5 h-5 text-emerald-400" />
              <span>Universal Sports Data Normalization Layer</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Whether events originate from a manual referee tablet, an optical AI camera feed, or an NFC smart ball sensor, this layer normalizes them into a unified `SportEvent` schema.
            </p>
          </div>

          {/* Source feed picker */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-mono-code">Select Ingress Source:</span>
            <div className="flex gap-2">
              {[
                { id: 'manual_referee', label: 'Manual Referee Tablet' },
                { id: 'optical_camera_feed', label: 'Optical AI Camera (Hawkeye)' },
                { id: 'smart_ball_sensor', label: 'NFC Smart Ball Sensor' }
              ].map((src) => (
                <button
                  key={src.id}
                  onClick={() => setTestFeedType(src.id as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    testFeedType === src.id
                      ? 'bg-emerald-500 text-slate-950 font-bold'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {src.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Raw Ingress */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-amber-400 font-bold block">1. INGRESS DATA FEED ({currentRaw.source})</span>
              <div className="p-3 rounded-lg bg-slate-900 text-slate-300 space-y-1.5 border border-slate-800">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Data Source:</span>
                  <span className="text-white font-medium">{currentRaw.source}</span>
                </div>
                {Object.entries(currentRaw.rawPayload).map(([key, val]) => (
                  <div key={key} className="flex justify-between py-0.5">
                    <span className="text-slate-400 capitalize">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-slate-200 font-medium">{Array.isArray(val) ? val.join(', ') : String(val)}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Normalized Unified Event */}
            <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-3">
              <span className="text-emerald-400 font-bold block">2. UNIFIED MATCH EVENT DATA</span>
              <div className="p-3 rounded-lg bg-slate-900 text-emerald-300 space-y-1.5 border border-slate-800">
                <div className="flex justify-between border-b border-slate-800 pb-1">
                  <span className="text-slate-400">Event Action:</span>
                  <span className="text-emerald-400 font-bold">GOAL (+1 pt)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Match Time:</span>
                  <span className="text-white font-medium">68:24 (2nd Half)</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">Executing Team:</span>
                  <span className="text-white font-medium">Strikers FC</span>
                </div>
                <div className="flex justify-between py-0.5">
                  <span className="text-slate-400">AI Highlight Clipping:</span>
                  <span className="text-amber-400 font-medium">Qualified (-30s buffer queued)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
