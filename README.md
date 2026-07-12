# 🌱 EcoSphere - ESG Management Platform

**EcoSphere** is a comprehensive Environmental, Social, and Governance (ESG) Management Platform built to help organizations track sustainability goals, ensure strict governance compliance, and boost employee engagement through gamification.

---

## ✨ Key Features

### 🌍 Environmental Tracking
* **Carbon Footprint Management:** Calculate and monitor carbon emissions across different organizational levels.
* **Product Profiles:** Track individual product lifecycles, recyclability status, and sustainability ratings (0-5 scale).
* **Emission Factors:** Dynamically fetch and categorize emission sources (e.g., Grid Electricity, Fossil Fuels, Supply Chain).

### 🛡️ Governance & Compliance
* **Audit Tracking:** Comprehensive tables and detail views for internal and external audits, mapped directly to specific departments.
* **Policy Management:** Enforce corporate policies and ensure stakeholders acknowledge them.
* **Compliance Dashboard:** Track ongoing compliance issues, securely handle null data cases, and visualize resolution progress.

### 🎮 Gamification & Social (CSR)
* **Employee Engagement:** Motivate employees using gamified ESG leaderboards and achievement badges.
* **Training Modules:** Track completion of sustainability and corporate governance training.
* **CSR Activities:** Log and monitor Corporate Social Responsibility initiatives.

---

## 🛠️ Tech Stack

### Frontend
* **Framework:** React + Vite
* **Styling:** Tailwind CSS + Glassmorphism UI components
* **Icons:** Lucide React
* **Routing:** React Router DOM

### Backend
* **Runtime:** Node.js + Express
* **Database Management:** Prisma ORM
* **Validation:** Zod schemas for robust API data validation

---

## 🚀 Getting Started

### 1. Installation
Ensure you have Node.js installed, then clone the repository and install the dependencies for both the frontend and backend.

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory and provide your database connection string:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/ecosphere"
PORT=5000
```

### 3. Database Setup
Initialize your database using Prisma:
```bash
cd backend
npx prisma generate
npx prisma db push
```

### 4. Run the Application
You will need two terminal windows to run both the frontend and backend development servers simultaneously.

**Backend Server:**
```bash
cd backend
npm run dev
```

**Frontend Server:**
```bash
cd frontend
npm run dev
```

---

## 🎨 UI/UX Highlights
* **Modern Design:** Features a clean, soft-color palette with rounded glassmorphism cards and hover effects.
* **Custom Modals:** Replaces default browser alerts with animated, custom React portals for confirmations and data entry.
* **Hot-Reloading:** Fully optimized Vite setup for instantaneous UI updates.

---

*Built with ❤️ for the Hackathon.*
