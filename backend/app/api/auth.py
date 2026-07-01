from fastapi import APIRouter, Depends, HTTPException; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.schemas.user import UserCreate, UserLogin, TokenResponse; from app.services import auth as s
router = APIRouter(prefix="/api/auth", tags=["auth"])
@router.post("/register", response_model=TokenResponse)
async def register(data: UserCreate, db: AsyncSession = Depends(get_db)):
    try: return await s.register(db, data)
    except ValueError as e: raise HTTPException(status_code=400, detail=str(e))
@router.post("/login", response_model=TokenResponse)
async def login(data: UserLogin, db: AsyncSession = Depends(get_db)):
    try: return await s.login(db, data.email, data.password)
    except ValueError as e: raise HTTPException(status_code=401, detail=str(e))
