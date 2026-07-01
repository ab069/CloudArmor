from datetime import datetime, timedelta, timezone; from jose import JWTError, jwt; from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status; from fastapi.security import OAuth2PasswordBearer; from pydantic import BaseModel; from app.core.config import settings
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto"); oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login")
class TokenPayload(BaseModel): sub: str; exp: datetime
def hash_password(pw: str) -> str: return pwd_context.hash(pw)
def verify_password(plain: str, hashed: str) -> bool: return pwd_context.verify(plain, hashed)
def create_access_token(uid: str) -> str: return jwt.encode({"sub": uid, "exp": datetime.now(timezone.utc) + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
def decode_token(token: str) -> TokenPayload:
    try: return TokenPayload(**jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]))
    except JWTError: raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
async def get_current_user_id(token: str = Depends(oauth2_scheme)) -> str: return decode_token(token).sub
