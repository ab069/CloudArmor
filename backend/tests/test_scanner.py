from app.agents.scanner import scan_asset, calculate_score, CIS_CHECKS

def test_checks_count(): assert len(CIS_CHECKS) == 10
def test_scan_returns_list(): r = scan_asset({"is_public": False, "asset_type": "s3"}); assert isinstance(r, list)
def test_public_asset_has_critical(): r = scan_asset({"is_public": True, "asset_type": "s3"}); assert any(f["severity"] == "critical" for f in r)
def test_calculate_score(): assert calculate_score(0, 0, 0) == 100
def test_calculate_score_deductions(): s = calculate_score(1, 2, 1); assert s < 100
