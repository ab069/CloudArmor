import { useEffect, useRef } from "react"; import { useAuthStore } from "../store/authStore"; import { useFindingStore } from "../store/findingStore";
const B = import.meta.env.VITE_WS_URL || `ws://${window.location.hostname}:8000`;
export function useWebSocket() {
  const r = useRef<WebSocket | null>(null); const u = useAuthStore((s) => s.user); const a = useFindingStore((s) => s.addFinding);
  useEffect(() => {
    if (!u) return; const ws = new WebSocket(`${B}/ws/${u.id}`); r.current = ws;
    ws.onmessage = (e) => { try { const d = JSON.parse(e.data); if (d.type === "finding") a(d); } catch {} };
    return () => ws.close();
  }, [u]);
  const send = (d: object) => { if (r.current?.readyState === WebSocket.OPEN) r.current.send(JSON.stringify(d)); };
  return { send };
}
