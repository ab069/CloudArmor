# CloudArmor

> AI-powered Cloud Security Posture Management (CSPM) platform. Discover multi-cloud assets, scan for misconfigurations, check CIS compliance, and monitor security posture in real time.

## Features

- **Multi-Cloud Asset Discovery** — Track AWS, GCP, Azure, and DigitalOcean resources
- **CIS Benchmark Scanning** — 10+ built-in compliance checks (public buckets, encryption, logging, IAM, networking)
- **Security Scoring** — Auto-calculated security scores per asset (0-100)
- **Automated Remediation** — Actionable fix recommendations for every finding
- **Real-Time Feed** — WebSocket-powered live scan findings
- **Compliance Reporting** — Framework-aligned findings with CIS control IDs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | FastAPI + Python 3.12 + async SQLAlchemy |
| Frontend | React 18 + TypeScript + Zustand |
| Engine | CIS benchmark scanner |
| Database | PostgreSQL + Redis |
| Infra | Docker Compose |
| Auth | JWT + bcrypt |
| Realtime | WebSockets |

## Quick Start

```bash
git clone https://github.com/ab069/CloudArmor.git
cd CloudArmor; docker compose up -d; open http://localhost:3000
```

## License MIT
