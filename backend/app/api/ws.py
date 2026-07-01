from fastapi import APIRouter, WebSocket, WebSocketDisconnect; from datetime import datetime, timezone
from sqlalchemy import select; from app.core.database import async_session; from app.models.asset import Asset; from app.models.finding import Finding
from app.agents.scanner import scan_asset, calculate_score
router = APIRouter()

class Mgr:
    def __init__(self): self.active: dict[str, list[WebSocket]] = {}
    async def connect(self, uid: str, ws: WebSocket): await ws.accept(); self.active.setdefault(uid, []).append(ws)
    def disconnect(self, uid: str, ws: WebSocket): self.active.setdefault(uid, []).remove(ws); (not self.active[uid]) and self.active.pop(uid, None)
    async def broadcast(self, uid: str, msg: dict):
        for ws in self.active.get(uid, []):
            try: await ws.send_json(msg)
            except: pass
manager = Mgr()

@router.websocket("/ws/{user_id}")
async def ws_endpoint(ws: WebSocket, user_id: str):
    await manager.connect(user_id, ws)
    try:
        while True:
            data = await ws.receive_json()
            if data.get("action") == "scan":
                asset_id = data.get("asset_id")
                async with async_session() as db:
                    r = await db.execute(select(Asset).where(Asset.id == asset_id, Asset.user_id == user_id))
                    a = r.scalar_one_or_none()
                    if not a: await ws.send_json({"error": "Asset not found"}); continue
                    asset_dict = {"is_public": a.is_public, "asset_type": a.asset_type, "name": a.name, "provider": a.provider}
                    findings = scan_asset(asset_dict)
                    for f in findings:
                        finding = Finding(user_id=user_id, asset_id=asset_id, check_name=f["check_name"], severity=f["severity"],
                            description=f["description"], remediation=f["remediation"], framework=f.get("framework"), compliance_id=f.get("compliance_id"))
                        db.add(finding)
                    cr = sum(1 for f in findings if f["severity"] == "critical"); hi = sum(1 for f in findings if f["severity"] == "high")
                    a.score = calculate_score(1, cr, hi)
                    await db.commit()
                    for f in findings:
                        await manager.broadcast(user_id, {"type": "finding", "finding": f, "asset_id": asset_id, "asset_name": a.name})
    except WebSocketDisconnect: manager.disconnect(user_id, ws)
