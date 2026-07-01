import { useState } from "react"; import { useNavigate } from "react-router-dom"; import { Shield } from "lucide-react"; import { useAuthStore } from "../store/authStore";
const A = import.meta.env.VITE_API_URL || "http://localhost:8000";
export default function Login() {
  const [r, setR] = useState(false); const [e, setE] = useState(""); const [p, setP] = useState(""); const [n, setN] = useState(""); const [er, setEr] = useState(""); const [l, setL] = useState(false);
  const sa = useAuthStore((s) => s.setAuth); const nav = useNavigate();
  const sub = async (e2: React.FormEvent) => {
    e2.preventDefault(); setEr(""); setL(true);
    try { const res = await fetch(`${A}/api/auth/${r ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(r ? { email: e, password: p, name: n } : { email: e, password: p }) }); const d = await res.json(); if (!res.ok) { setEr(d.detail || "Error"); return; } sa(d.access_token, d.user); nav("/"); }
    catch { setEr("Connection error"); } finally { setL(false); }
  };
  return (<div className="min-h-screen bg-gray-950 flex items-center justify-center p-4"><div className="w-full max-w-md"><div className="flex items-center justify-center gap-3 mb-8"><Shield className="w-10 h-10 text-blue-400" /><span className="text-2xl font-bold text-white">CloudArmor</span></div>
    <form onSubmit={sub} className="bg-gray-900 border border-gray-800 rounded-xl p-8 space-y-5">
      <h2 className="text-xl font-semibold text-white">{r ? "Create Account" : "Sign In"}</h2>
      {er && <div className="bg-red-900/30 border border-red-800 text-red-400 px-4 py-2 rounded-lg text-sm">{er}</div>}
      {r && <div><label className="block text-sm text-gray-400 mb-1">Name</label><input type="text" value={n} onChange={(e) => setN(e.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required /></div>}
      <div><label className="block text-sm text-gray-400 mb-1">Email</label><input type="email" value={e} onChange={(e2) => setE(e2.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required /></div>
      <div><label className="block text-sm text-gray-400 mb-1">Password</label><input type="password" value={p} onChange={(e2) => setP(e2.target.value)} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500" required /></div>
      <button type="submit" disabled={l} className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition-colors">{l ? "Loading..." : r ? "Register" : "Sign In"}</button>
      <p className="text-center text-sm text-gray-500">{r ? "Have an account?" : "No account?"} <button type="button" onClick={() => setR(!r)} className="text-blue-400 hover:underline">{r ? "Sign In" : "Register"}</button></p>
    </form></div></div>);
}
