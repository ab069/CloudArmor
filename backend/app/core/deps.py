from fastapi import Depends; from sqlalchemy import select; from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db; from app.core.security import get_current_user_id; from app.models.user import User
async def get_current_user(uid: str = Depends(get_current_user_id), db: AsyncSession = Depends(get_db)) -> User:
    r = await db.execute(select(User).where(User.id == uid)); u = r.scalar_one_or_none()
    if not u: from fastapi import HTTPException; raise HTTPException(status_code=404, detail="User not found")
    return u
