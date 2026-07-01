import { useEffect, useState } from "react"; import { Plus, Search } from "lucide-react";
import { useAuthStore } from "../store/authStore"; import { useWebSocket } from "../hooks/useWebSocket";
const A = import.meta.env.VITE_API_URL || "http://localhost:8000"; const PROVIDERS = ["AWS", "GCP", "Azure", "DigitalOcean"];
export default function Assets() {
  const t = useAuthStore((s) => s.token)!;
  const [assets, setAssets] = useState<any[]>([]); const [show, setShow] = useState(false); const [findings, setFindings] = useState<any[]>([]);
  const [pr, setPr] = useState("AWS"); const [at, setAt] = useState(""); const [nm, setNm] = useState(""); const [rg, setRg] = useState(""); const [pub, setPub] = useState(false); const [viewFindings, setViewFindings] = useState<string | null>(null);
  const { send } = useWebSocket();

  const fetchAssets = async () => { const r = await fetch(`${A}/api/assets`, { headers: { Authorization: `Bearer ${t}` } }); const d = await r.json(); setAssets(Array.isArray(d) ? d : []); };
  useEffect(() => { fetchAssets(); }, [t]);

  const create = async (e: React.FormEvent) => {
    e.preventDefault(); await fetch(`${A}/api/assets`, { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${t}` }, body: JSON.stringify({ provider: pr, asset_type: at, name: nm, region: rg || null, is_public: pub }) });
    setShow(false); setAt(""); setNm(""); setRg(""); fetchAssets();
  };

  const scan = async (id: string) => send({ action: "scan", asset_id: id });

  const loadFindings = async (aid: string) => {
    const r = await fetch(`${A}/api/assets/findings?asset_id=${aid}`, { headers: { Authorization: `Bearer ${t}` } }); const d = await r.json(); setFindings(Array.isArray(d) ? d : []); setViewFindings(aid);
  };

  const sev = (s: string) => ({ critical: "bg-red-900/30 text-red-400 border-red-800", high: "bg-orange-900/30 text-orange-400 border-orange-800", medium: "bg-yellow-900/30 text-yellow-400 border-yellow-800", low: "bg-green-900/30 text-green-400 border-green-800" })[s] || "bg-gray-800 text-gray-400";

  return (<div className="space-y-6">
    <div className="flex items-center justify-between"><h1 className="text-2xl font-bold text-white">Cloud Assets</h1>
      <button onClick={() => setShow(!show)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors"><Plus className="w-4 h-4" /> Add Asset</button></div>

    {show && <form onSubmit={create} className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><label className="block text-sm text-gray-400 mb-1">Provider</label>
          <select value={pr} onChange={(e) => setPr(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500">
            {PROVIDERS.map((p) => <option key={p} value={p}>{p}</option>)}</select></div>
        <div><label className="block text-sm text-gray-400 mb-1">Asset Type</label><input type="text" value={at} onChange={(e) => setAt(e.target.value)} placeholder="s3, ec2, bucket, vm, sql..." className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Name</label><input type="text" value={nm} onChange={(e) => setNm(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required /></div>
        <div><label className="block text-sm text-gray-400 mb-1">Region</label><input type="text" value={rg} onChange={(e) => setRg(e.target.value)} placeholder="us-east-1" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" /></div>
        <div className="flex items-center gap-3"><input type="checkbox" checked={pub} onChange={(e) => setPub(e.target.checked)} className="w-4 h-4" /><label className="text-sm text-gray-400">Publicly accessible</label></div>
      </div>
      <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-colors">Add Asset</button>
    </form>}

    <div className="space-y-4">{assets.length === 0 ? <div className="bg-gray-900 border border-gray-800 rounded-xl p-8 text-center text-gray-500">No cloud assets registered.</div> :
      assets.map((a) => (<div key={a.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div className="flex items-start justify-between">
          <div><h3 className="text-white font-semibold">{a.name}</h3>
            <div className="flex gap-3 mt-1 text-sm text-gray-400">
              <span className="bg-gray-800 px-2 py-0.5 rounded text-xs">{a.provider}</span>
              <span>{a.asset_type}</span>
              {a.region && <span>{a.region}</span>}
              <span className={`text-xs px-2 py-0.5 rounded ${a.is_public ? "bg-red-900/30 text-red-400" : "bg-green-900/30 text-green-400"}`}>{a.is_public ? "Public" : "Private"}</span>
              {a.score !== null && <span className={`text-xs px-2 py-0.5 rounded ${a.score >= 80 ? "bg-green-900/30 text-green-400" : a.score >= 50 ? "bg-yellow-900/30 text-yellow-400" : "bg-red-900/30 text-red-400"}`}>Score: {a.score}</span>}
            </div>
          </div>
          <button onClick={() => scan(a.id)} className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg transition-colors">Scan</button>
        </div>
        <button onClick={() => loadFindings(a.id)} className="text-xs text-gray-500 hover:text-blue-400 mt-2 transition-colors">View findings</button>
        {viewFindings === a.id && findings.length > 0 && (
          <div className="mt-3 space-y-2 border-t border-gray-800 pt-3">
            {findings.map((f) => (<div key={f.id} className="bg-gray-950 border border-gray-800 rounded-lg p-3 flex items-start gap-2">
              <span className={`text-xs px-1.5 py-0.5 rounded border ${sev(f.severity)} whitespace-nowrap mt-0.5`}>{f.severity}</span>
              <div><p className="text-sm text-gray-300">{f.check_name}: {f.description}</p>
                {f.remediation && <p className="text-xs text-gray-500 mt-0.5">Fix: {f.remediation}</p>}
                {f.framework && <p className="text-xs text-gray-600">{f.framework} {f.compliance_id}</p>}
              </div>
            </div>))}
          </div>
        )}
      </div>))
    }</div></div>);
}
