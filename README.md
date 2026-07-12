# EcoSphere – ESG Management Platform

An enterprise-grade Environmental, Social & Governance (ESG) management platform built with React, Express, PostgreSQL, and Prisma.

## Architecture

- **Frontend:** React + Vite + Tailwind CSS v3
- **Backend:** Node.js + Express.js
- **Database:** PostgreSQL 15
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Validation:** Zod
- **Charts:** Chart.js

## Project Structure

```
ecosphere/
├── frontend/          # React + Vite application
├── backend/           # Express.js API server
├── docker-compose.yml # PostgreSQL container
├── .env.example       # Environment template
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- Git

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yashashvialva/EcoSphere-ESG-Management-Platform-odoo.git
   cd EcoSphere-ESG-Management-Platform-odoo
   ```

2. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

3. **Backend Setup**
   ```bash
   cd backend
   cp ../.env.example .env
   npm install
   npx prisma migrate dev
   npx prisma db seed
   npm run dev
   ```

4. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api/v1

## Modules

| Module | Owner | Description |
|--------|-------|-------------|
| Environmental | Developer 1 | Emission factors, carbon transactions, ESG goals |
| Social | Developer 2 | CSR activities, participation, training, diversity |
| Governance | Developer 3 | Policies, audits, compliance |
| Gamification | Developer 4 | Challenges, XP, badges, rewards, leaderboard |

## Branch Strategy

- `main` – Production (combined integration)
- `develop` – Integration branch
- `feature/environmental` – Developer 1
- `feature/social` – Developer 2
- `feature/governance` – Developer 3
- `feature/gamification` – Developer 4

## Default Credentials

```
Email: admin@ecosphere.com
Password: Admin@123
```

## License

MIT
