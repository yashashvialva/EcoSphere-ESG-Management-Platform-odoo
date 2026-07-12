# 🌱 EcoSphere - ESG Management Platform

**EcoSphere** is a comprehensive Environmental, Social, and Governance (ESG) Management Platform built to help organizations track sustainability goals, ensure strict governance compliance, and boost employee engagement through gamification.

---

## 🗺️ Detailed Project Flow & Architecture

EcoSphere is designed around a seamless integration of three core modules—Environmental, Governance, and Social. Here is the detailed step-by-step user journey and data architecture.

### 1. Authentication & Role-Based Access
* **Flow:** Users log into the system and are securely authenticated.
* **Roles:** The platform differentiates between standard **Employees** and **Administrators**. 
* **Permissions:** Administrators have the authority to create new Audits, define Policies, and add Product Profiles, while standard employees can view policies, track their own training, and participate in the gamified leaderboards.

### 2. Environmental Flow (The "E" in ESG)
* **Emission Factors Setup:** Admins establish baseline carbon "Emission Factors" (e.g., Grid Electricity, Fleet Vehicles). 
* **Product Profiling:** Users log organizational products into the system, mapping them to specific emission categories and defining their recyclability status and 1-5 sustainability rating.
* **Carbon Tracking:** The system automatically binds these factors together, displaying real-time carbon footprints for every registered product across the organization's lifecycle.

### 3. Governance & Compliance Flow (The "G" in ESG)
* **Policy Creation:** The organization publishes internal ESG policies.
* **Auditing:** The system tracks both *Internal* and *External* audits. Admins can schedule audits, assign them to specific corporate departments, and attach metadata.
* **Compliance Resolution:** If an audit reveals a gap, a **Compliance Issue** is generated. These issues are actively tracked on the Governance dashboard. Users can transition issues from "Open" to "In Progress" to "Resolved," establishing a verified paper trail of corporate responsibility.

### 4. Social & Gamification Flow (The "S" in ESG)
* **Training & CSR:** The platform isn't just for executives—it engages the whole company. Employees complete assigned ESG Training modules and log Corporate Social Responsibility (CSR) activities (e.g., Volunteer days, Tree planting).
* **Gamification Engine:** To drive adoption, every positive action (resolving compliance issues, finishing training, logging CSR activities) awards points.
* **Leaderboard & Badges:** Employees compete on a company-wide leaderboard, unlocking visual achievement badges. This transforms mandatory compliance into an engaging, morale-boosting game.

### 5. Technical Data Flow
1. **Client Layer:** The user interacts with a modern React SPA (Single Page Application) built with Vite and Tailwind CSS. Forms and tables use localized state hooks for instant, snappy feedback.
2. **API Layer:** Axios intercepts requests and communicates with the Node.js / Express backend via RESTful endpoints.
3. **Validation Layer:** Before hitting the database, the backend uses **Zod schemas** to strictly validate all incoming payloads (ensuring strict types for UUIDs, enums, and numerical ranges).
4. **Database Layer:** Clean data is processed via the **Prisma ORM** and permanently stored in a relational PostgreSQL / MySQL database.
5. **Real-time UI:** The backend responds with updated relational data, and the React UI dynamically re-renders using custom-built Glassmorphism modals and inline toast alerts without ever reloading the page.

---

## ✨ Core Features at a Glance

* **🌍 Environmental:** Carbon footprint tracking, lifecycle phases, dynamic emission factor assignments.
* **🛡️ Governance:** Departmental audits, corporate policy enforcement, active compliance tracking.
* **🎮 Gamification:** Leaderboards, achievement badges, training logs, and CSR tracking.

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

*Built with ❤️ for the Hackathon.*
