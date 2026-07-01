import random

CIS_CHECKS = [
    {"check": "public_bucket", "severity": "critical", "desc": "Storage bucket is publicly accessible", "remediation": "Enable block public access", "framework": "CIS", "id": "CIS-1.1"},
    {"check": "encryption_disabled", "severity": "high", "desc": "Data encryption is not enabled", "remediation": "Enable server-side encryption", "framework": "CIS", "id": "CIS-1.2"},
    {"check": "logging_disabled", "severity": "medium", "desc": "Access logging is not configured", "remediation": "Enable access logging", "framework": "CIS", "id": "CIS-1.3"},
    {"check": "unrestricted_ingress", "severity": "critical", "desc": "Security group allows unrestricted inbound access (0.0.0.0/0)", "remediation": "Restrict ingress rules to specific IPs", "framework": "CIS", "id": "CIS-2.1"},
    {"check": "unrestricted_egress", "severity": "medium", "desc": "Security group allows unrestricted outbound access", "remediation": "Restrict egress rules", "framework": "CIS", "id": "CIS-2.2"},
    {"check": "no_mfa", "severity": "high", "desc": "Root account does not have MFA enabled", "remediation": "Enable MFA on root account", "framework": "CIS", "id": "CIS-3.1"},
    {"check": "public_ports", "severity": "high", "desc": "Management ports (22, 3389) exposed to internet", "remediation": "Restrict management ports", "framework": "CIS", "id": "CIS-2.3"},
    {"check": "unencrypted_traffic", "severity": "medium", "desc": "Service does not enforce TLS/SSL", "remediation": "Enable TLS enforcement", "framework": "CIS", "id": "CIS-4.1"},
    {"check": "excessive_permissions", "severity": "high", "desc": "IAM role has excessive permissions", "remediation": "Apply least privilege principle", "framework": "CIS", "id": "CIS-5.1"},
    {"check": "versioning_disabled", "severity": "low", "desc": "Bucket versioning is not enabled", "remediation": "Enable versioning for data protection", "framework": "CIS", "id": "CIS-1.4"},
]

def scan_asset(asset: dict) -> list[dict]:
    findings = []
    checks_to_run = random.sample(CIS_CHECKS, min(random.randint(2, 5), len(CIS_CHECKS)))
    for c in checks_to_run:
        failed = random.random() < 0.4
        if failed:
            findings.append({
                "check_name": c["check"], "severity": c["severity"], "description": c["desc"],
                "remediation": c["remediation"], "framework": c["framework"], "compliance_id": c["id"],
            })
    if asset.get("is_public"):
        findings.append({
            "check_name": "public_exposure", "severity": "critical",
            "description": f"Publicly exposed {asset.get('asset_type', 'resource')}",
            "remediation": "Restrict public access or use private networking",
            "framework": "CIS", "compliance_id": "CIS-1.1",
        })
    return findings

def calculate_score(asset_count: int, critical: int, high: int) -> int:
    if asset_count == 0: return 100
    deductions = critical * 15 + high * 5
    return max(0, min(100, 100 - deductions))
