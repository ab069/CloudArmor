from sqlalchemy import select, func; from sqlalchemy.ext.asyncio import AsyncSession
from app.models.asset import Asset; from app.models.finding import Finding
from app.schemas.asset import AssetCreate, AssetResponse, FindingResponse

async def create_asset(db: AsyncSession, uid: str, data: AssetCreate) -> AssetResponse:
    a = Asset(user_id=uid, provider=data.provider, asset_type=data.asset_type, name=data.name,
        region=data.region, config=data.config, tags=data.tags, is_public=data.is_public)
    db.add(a); await db.commit(); await db.refresh(a); return AssetResponse.model_validate(a)

async def list_assets(db: AsyncSession, uid: str) -> list[AssetResponse]:
    r = await db.execute(select(Asset).where(Asset.user_id == uid).order_by(Asset.discovered_at.desc()))
    return [AssetResponse.model_validate(a) for a in r.scalars().all()]

async def get_findings(db: AsyncSession, uid: str, asset_id: str | None = None) -> list[FindingResponse]:
    stmt = select(Finding).where(Finding.user_id == uid)
    if asset_id: stmt = stmt.where(Finding.asset_id == asset_id)
    stmt = stmt.order_by(Finding.created_at.desc())
    r = await db.execute(stmt); return [FindingResponse.model_validate(f) for f in r.scalars().all()]

async def get_stats(db: AsyncSession, uid: str) -> dict:
    ra = await db.execute(select(func.count(Asset.id)).where(Asset.user_id == uid))
    rf = await db.execute(select(func.count(Finding.id)).where(Finding.user_id == uid))
    ro = await db.execute(select(func.count(Finding.id)).where(Finding.user_id == uid, Finding.status == "open"))
    rc = await db.execute(select(func.count(Finding.id)).where(Finding.user_id == uid, Finding.severity == "critical"))
    return {"assets": ra.scalar() or 0, "findings": rf.scalar() or 0, "open": ro.scalar() or 0, "critical": rc.scalar() or 0}
