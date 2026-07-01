from fastapi import APIRouter, Depends; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.core.deps import get_current_user; from app.models.user import User
from app.schemas.asset import AssetCreate, AssetResponse, FindingResponse; from app.services import asset_service as s
router = APIRouter(prefix="/api/assets", tags=["assets"])
@router.post("", response_model=AssetResponse)
async def create(data: AssetCreate, u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.create_asset(db, u.id, data)
@router.get("", response_model=list[AssetResponse])
async def list_assets(u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.list_assets(db, u.id)
@router.get("/findings", response_model=list[FindingResponse])
async def list_findings(asset_id: str | None = None, u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.get_findings(db, u.id, asset_id)
@router.get("/stats")
async def stats(u: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await s.get_stats(db, u.id)
