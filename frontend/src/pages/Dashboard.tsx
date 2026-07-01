import { useEffect, useState } from "react"; import { Activity, Cloud, AlertTriangle, Shield } from "lucide-react";
import { useAuthStore } from "../store/authStore"; import { useFindingStore } from "../store/findingStore"; import { useWebSocket } from "../hooks/useWebSocket";
const A = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Dashboard() {
  const t = useAuthStore((s) => s.token); const findings = useFindingStore((s) => s.findings); const [stats, setStats] = useState({ assets: 0, findings: 0, open: 0, critical: 0 }); useWebSocket();
  useEffect(() => {
    if (!t) return; fetch(`${A}/api/assets/stats`, { headers: { Authorization: `Bearer ${t}` } }).then((r) => r.json()).then(setStats).catch(() => {});
  }, [t]);
  const sev = (s: string) => ({ critical: "bg-red-900/30 text-red-400 border-red-800", high: "bg-orange-900/30 text-orange-400 border-orange-800", medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800", low: "bg-green-900/30 text-green-400 border-green-800" })[s] || "";
  return (<div className="space-y-8"><h1 className="text-2xl font-bold text-white">Dashboard</h1>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Assets</p><p className="text-3xl font-bold text-white mt-1">{stats.assets}</p></div><Cloud className="w-10 h-10 text-blue-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Findings</p><p className="text-3xl font-bold text-white mt-1">{stats.findings}</p></div><AlertTriangle className="w-10 h-10 text-yellow-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Open</p><p className="text-3xl font-bold text-white mt-1">{stats.open}</p></div><Activity className="w-10 h-10 text-orange-400/50" /></div></div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6"><div className="flex items-center justify-between"><div><p className="text-gray-400 text-sm">Critical</p><p className="text-3xl font-bold text-white mt-1">{stats.critical}</p></div><Shield className="w-10 h-10 text-red-400/50" /></div></div>
    </div>
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-white mb-4">Live Scan Findings</h2>
      {findings.length === 0 ? <p className="text-gray-500 text-sm">No findings yet. Add assets and scan them.</p> :
      <div className="space-y-3">{findings.slice(0, 10).map((f, i) => (<div key={i} className="bg-gray-950 border border-gray-800 rounded-lg p-4">
        <div className="flex items-center justify-between mb-1"><span className="text-sm font-medium text-white">{f.finding.check_name}</span><span className={`text-xs px-2 py-0.5 rounded border ${sev(f.finding.severity)}`}>{f.finding.severity}</span></div>
        <p className="text-sm text-gray-400">{f.finding.description}</p>
        <p className="text-xs text-gray-600 mt-1">Asset: {f.asset_name} | Remediation: {f.finding.remediation}</p>
      </div>))}</div>}
    </div></div>);
}
