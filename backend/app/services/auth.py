from sqlalchemy import select; from sqlalchemy.ext.asyncio import AsyncSession
from app.models.user import User; from app.core.security import hash_password, verify_password, create_access_token
from app.schemas.user import UserCreate, TokenResponse, UserResponse
async def register(db: AsyncSession, data: UserCreate) -> TokenResponse:
    r = await db.execute(select(User).where(User.email == data.email))
    if r.scalar_one_or_none(): raise ValueError("Email already registered")
    u = User(email=data.email, password_hash=hash_password(data.password), name=data.name)
    db.add(u); await db.commit(); await db.refresh(u)
    return TokenResponse(access_token=create_access_token(u.id), user=UserResponse.model_validate(u))
async def login(db: AsyncSession, email: str, password: str) -> TokenResponse:
    r = await db.execute(select(User).where(User.email == email)); u = r.scalar_one_or_none()
    if not u or not verify_password(password, u.password_hash): raise ValueError("Invalid credentials")
    return TokenResponse(access_token=create_access_token(u.id), user=UserResponse.model_validate(u))
