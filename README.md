# CloudArmor — CSPM Platform

![Version](https://img.shields.io/badge/version-1.0.0-3b82f6) ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-3b82f6) ![React](https://img.shields.io/badge/React-18.3-3b82f6) ![License](https://img.shields.io/badge/license-MIT-3b82f6)

AI-powered Cloud Security Posture Management (CSPM) platform. Discover multi-cloud assets, scan for misconfigurations, check CIS compliance, and monitor security posture in real time.

## Quick Start

```bash
docker compose up -d
```

Open [http://localhost:3000](http://localhost:3000) and register a new account.

## Features

- **Multi-Cloud Asset Discovery** — Track AWS, GCP, Azure, and DigitalOcean resources with full metadata
- **CIS Benchmark Scanning** — 10 built-in compliance checks: public buckets, encryption at rest, logging enabled, IAM best practices, networking rules, instance security
- **Security Scoring** — Auto-calculated security scores (0-100) per asset and overall posture rating
- **Automated Remediation** — Actionable fix recommendations for every compliance finding
- **Real-Time Feed** — WebSocket-powered live scan findings streaming to dashboard
- **Compliance Reporting** — Framework-aligned findings with CIS control IDs and severity levels

### CIS Benchmark Checks

| Check | Description | Severity |
|-------|-------------|----------|
| S3 Public Buckets | Detect publicly accessible storage buckets | Critical |
| Encryption at Rest | Verify encryption is enabled for storage/databases | High |
| Cloud Logging | Ensure audit logging is enabled | High |
| IAM Admin Users | Detect excessive admin/root user permissions | Critical |
| Default VPCs | Detect default VPC/subnet usage | Medium |
| Open Security Groups | Detect overly permissive firewall rules | Critical |
| Unencrypted DB | Detect databases without encryption | High |
| Public IPs | Detect instances with public IP exposure | Medium |
| Key Rotation | Verify encryption key rotation policy | Medium |
| MFA Status | Detect accounts without multi-factor auth | Critical |

## Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                       CloudArmor System                            │
├──────────────┬──────────────┬──────────────┬──────────────────────┤
│   Multi-Cloud │  CIS Scanner │   Scoring    │    WebSocket         │
│   Discovery   │   Engine     │   Engine     │    Dashboard         │
├──────────────┴──────────────┴──────────────┴──────────────────────┤
│                   FastAPI + async SQLAlchemy + Redis                 │
├──────────────────────────────────────────────────────────────────┤
│                  PostgreSQL + Redis + Docker Compose                │
└──────────────────────────────────────────────────────────────────┘
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python 3.12, FastAPI, SQLAlchemy (async), asyncpg |
| Frontend | React 18, TypeScript, Vite, Zustand |
| Engine | CIS benchmark scanner (10 checks) |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Realtime | WebSockets |
| Infra | Docker, Docker Compose, nginx |

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/assets` | Register a cloud asset |
| GET | `/api/assets` | List assets |
| POST | `/api/assets/{id}/scan` | Run CIS scan on asset |
| GET | `/api/assets/stats` | Asset statistics |
| GET | `/api/findings` | List scan findings |
| GET | `/api/findings/stats` | Findings statistics |
| WS | `/ws/{user_id}` | WebSocket real-time feed |
| GET | `/api/health` | Health check |

## Project Structure

```
CloudArmor/
├── backend/
│   ├── app/
│   │   ├── core/        # Config, security, database, deps
│   │   ├── models/      # SQLAlchemy models
│   │   ├── schemas/     # Pydantic schemas
│   │   ├── services/    # Business logic layer
│   │   ├── agents/      # CIS scanner engine
│   │   ├── api/         # Route handlers
│   │   └── main.py      # FastAPI app entrypoint
│   ├── tests/           # Pytest test suite
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── store/       # Zustand state stores
│   │   ├── hooks/       # React hooks (WebSocket)
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Login, Register, Dashboard
│   │   ├── main.tsx     # Entry point
│   │   └── App.tsx      # Router
│   ├── Dockerfile
│   └── nginx.conf
├── docker-compose.yml
└── README.md
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `postgresql+asyncpg://...` | PostgreSQL connection string |
| `REDIS_URL` | `redis://redis:6379/0` | Redis connection string |
| `SECRET_KEY` | `change-me-in-production` | JWT signing key |

## Demo Credentials

Register a new account at `/register` after starting the app.

## License

MIT
