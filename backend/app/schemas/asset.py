from datetime import datetime; from pydantic import BaseModel
class AssetCreate(BaseModel): provider: str; asset_type: str; name: str; region: str | None = None; config: dict | None = None; tags: dict | None = None; is_public: bool = False
class AssetResponse(BaseModel):
    id: str; provider: str; asset_type: str; name: str; region: str | None; config: dict | None; tags: dict | None
    is_public: bool; score: int | None; discovered_at: datetime
    model_config = {"from_attributes": True}
class FindingResponse(BaseModel):
    id: str; asset_id: str; check_name: str; severity: str; status: str; description: str | None
    remediation: str | None; framework: str | None; compliance_id: str | None; created_at: datetime
    model_config = {"from_attributes": True}
