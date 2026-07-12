# EcoSphere – ESG Management Platform
## Software Architecture Design Document (SADD)

**Version:** 1.0  
**Project Type:** Enterprise Web Application  
**Architecture:** Modular Monolith (Layered Architecture)  
**Frontend:** React + Tailwind CSS  
**Backend:** Node.js + Express.js  
**Database:** PostgreSQL  
**ORM:** Prisma ORM  
**Authentication:** JWT + bcrypt  
**Validation:** Zod  
**Charts:** Chart.js  
**Version Control:** Git + GitHub

---

# 1. Introduction

## 1.1 Purpose

EcoSphere is an Enterprise ESG (Environmental, Social and Governance)
Management Platform designed to integrate sustainability directly into an
organization's daily operations.

Instead of maintaining ESG data separately in spreadsheets, EcoSphere
centralizes environmental metrics, employee engagement, governance
compliance, and sustainability initiatives into a unified platform.

The platform enables organizations to:

- Measure ESG performance
- Track sustainability initiatives
- Encourage employee participation
- Automate ESG calculations
- Generate regulatory reports
- Monitor department-wise ESG performance
- Improve decision-making through analytics

---

# 1.2 Objectives

The primary objectives of EcoSphere are:

- Digitize ESG management
- Automate carbon accounting
- Encourage employee engagement using gamification
- Simplify governance compliance
- Provide organization-wide ESG dashboards
- Generate ESG reports instantly
- Reduce manual reporting efforts
- Improve sustainability awareness

---

# 1.3 Technology Stack

## Frontend

- React
- React Router
- Tailwind CSS
- Axios
- Chart.js

---

## Backend

- Node.js
- Express.js
- Prisma ORM
- JWT Authentication
- bcrypt
- Zod Validation

---

## Database

- PostgreSQL

---

## Development Tools

- Git
- GitHub
- Postman
- Prisma Studio
- Docker (PostgreSQL)
- VS Code

---

# 1.4 Design Principles

The application follows enterprise software engineering principles.

### Modularity

Each business module is isolated and independently maintainable.

### Scalability

Architecture supports future expansion without major redesign.

### Maintainability

Business logic remains separated from routing and persistence.

### Security

Authentication, authorization, validation, and auditing are enforced at every layer.

### Reusability

Shared components, services, hooks, utilities, and middleware minimize code duplication.

### Performance

Optimized SQL queries, indexing, pagination, lazy loading, and efficient API responses.

### Team Collaboration

The project structure is designed so four developers can work independently with minimal merge conflicts.

---

# 1.5 High-Level Modules

The system consists of the following business modules:

1. Authentication & User Management
2. Environmental Management
3. Social Management
4. Governance Management
5. Gamification Engine
6. Reporting & Analytics
7. Dashboard
8. Notification System
9. Settings & Administration

---

# 1.6 Target Users

The platform supports multiple organizational roles.

- Administrator
- ESG Manager
- Department Head
- Auditor
- Employee

Each role has different permissions governed by Role-Based Access Control (RBAC).

---

**Next Section:** 2. Overall System Architecture
# 2. Overall System Architecture

## 2.1 Architectural Style

EcoSphere follows a **Modular Monolith** architecture with a **Layered Backend Design**.

This architecture combines the simplicity of a monolithic deployment with the maintainability of modular software engineering.

Each business domain is developed as an independent module while sharing a single PostgreSQL database.

```
                    +----------------------+
                    |      React App       |
                    |  (Tailwind + Axios)  |
                    +----------+-----------+
                               |
                               |
                          REST APIs
                               |
                               ▼
                    +----------------------+
                    |     Express Server   |
                    +----------+-----------+
                               |
     ------------------------------------------------------------
     |            |             |            |                  |
     ▼            ▼             ▼            ▼                  ▼
 Authentication Environment    Social    Governance     Gamification
     Module       Module       Module      Module          Module
     |            |             |            |                  |
     ------------------------------------------------------------
                               |
                               ▼
                     Shared Service Layer
                               |
                               ▼
                     Repository Layer
                               |
                               ▼
                         Prisma ORM
                               |
                               ▼
                         PostgreSQL
```

---

# 2.2 Why Modular Monolith?

For an 8-hour hackathon, a modular monolith provides enterprise-level organization without the operational complexity of microservices.

### Advantages

- Single deployment
- One database
- Shared authentication
- Easy debugging
- Faster development
- Simple transactions
- No distributed consistency issues
- Minimal DevOps overhead

Although deployed as one application, each module behaves like an independent service internally.

---

# 2.3 Layered Backend Architecture

Every request follows the same execution path.

```
HTTP Request
      │
      ▼
Express Route
      │
      ▼
Controller
      │
      ▼
Service
      │
      ▼
Repository
      │
      ▼
Prisma ORM
      │
      ▼
PostgreSQL
      │
      ▼
Response
```

### Responsibility of each layer

#### Routes

- Define API endpoints
- Apply middleware
- Forward requests to controllers

Routes contain **no business logic**.

---

#### Controllers

Controllers are responsible for:

- Receiving requests
- Reading request parameters
- Calling service methods
- Returning HTTP responses

Controllers remain lightweight.

---

#### Services

The Service Layer contains all business rules.

Examples:

- Carbon emission calculations
- Badge auto-awarding
- ESG score computation
- Reward redemption
- Challenge lifecycle validation

No SQL queries should exist inside services.

---

#### Repository Layer

Repositories communicate directly with Prisma.

Responsibilities:

- CRUD operations
- Query optimization
- Pagination
- Filtering
- Transactions

Repositories do not contain business rules.

---

#### Prisma ORM

Acts as the database abstraction layer.

Responsibilities:

- Type-safe queries
- Relationship mapping
- Migrations
- Transactions

---

#### PostgreSQL

Stores all master and transactional ESG data.

The database enforces:

- Foreign keys
- Constraints
- Indexes
- Data integrity

---

# 2.4 Frontend Architecture

The frontend is divided into feature-based modules.

```
src/

├── modules/
│
├── auth/
├── dashboard/
├── environmental/
├── social/
├── governance/
├── gamification/
├── reports/
├── settings/
│
├── shared/
│
├── components/
├── hooks/
├── services/
├── utils/
├── layouts/
└── routes/
```

Each module owns:

- Pages
- Components
- API services
- Validation
- State
- Assets

This minimizes cross-team dependencies.

---

# 2.5 Backend Architecture

```
backend/

src/

├── modules/
│
├── auth/
├── dashboard/
├── environmental/
├── social/
├── governance/
├── gamification/
├── reports/
├── settings/
│
├── middleware/
├── config/
├── prisma/
├── shared/
├── utils/
└── server.js
```

Each module contains:

```
module/

controllers/

services/

repositories/

routes/

validators/

dto/

constants/

types/
```

This ensures every business capability is self-contained.

---

# 2.6 Module Communication

Modules communicate only through the Service Layer.

Example:

```
Challenge Module
        │
        ▼
XP Service
        │
        ▼
Badge Service
        │
        ▼
Notification Service
```

Modules should **never** access another module's database repository directly.

Instead, they invoke exposed service methods.

This reduces coupling and improves maintainability.

---

# 2.7 Shared Components

The following are shared across all modules:

### Backend

- Authentication middleware
- Authorization middleware
- Logger
- Error handler
- Prisma client
- Validation utilities
- Notification service
- File upload utility
- Constants
- Environment configuration

---

### Frontend

- Navbar
- Sidebar
- Layout
- Data Table
- Modal
- Form components
- Toast notifications
- Chart wrappers
- Pagination
- Loading spinner
- Axios client
- Protected Route
- Role Guard

---

# 2.8 Architectural Goals

The architecture is designed to achieve:

- Independent module ownership
- Minimal merge conflicts
- Scalable business logic
- High cohesion
- Low coupling
- Enterprise coding standards
- Easy testing
- Fast integration
- Maintainable codebase

---

**Next Section:** 3. Project Folder Structure & Module Organization
# 3. Project Folder Structure & Module Organization

## 3.1 Project Structure

The project follows a **feature-first modular architecture** instead of grouping files only by type.

This ensures each developer owns an entire business domain (frontend + backend + database + business logic), allowing parallel development with minimal merge conflicts.

```
ecosphere/

├── frontend/
├── backend/
├── database/
├── docs/
├── .github/
├── docker-compose.yml
├── README.md
└── .env.example
```

---

# 3.2 Frontend Structure

```
frontend/

src/

├── assets/
│
├── components/
│   ├── common/
│   ├── layout/
│   ├── forms/
│   ├── charts/
│   ├── tables/
│   └── feedback/
│
├── hooks/
│
├── layouts/
│
├── routes/
│
├── services/
│
├── store/
│
├── types/
│
├── utils/
│
├── constants/
│
├── modules/
│   │
│   ├── auth/
│   ├── dashboard/
│   ├── environmental/
│   ├── social/
│   ├── governance/
│   ├── gamification/
│   ├── reports/
│   └── settings/
│
└── App.jsx
```

---

## 3.3 Backend Structure

```
backend/

src/

├── config/
│
├── middleware/
│
├── prisma/
│
├── shared/
│
├── utils/
│
├── modules/
│
│   ├── auth/
│   │
│   ├── dashboard/
│   │
│   ├── environmental/
│   │
│   ├── social/
│   │
│   ├── governance/
│   │
│   ├── gamification/
│   │
│   ├── reports/
│   │
│   └── settings/
│
├── app.js
└── server.js
```

---

# 3.4 Internal Structure of Every Module

Every module follows the exact same architecture.

```
environmental/

controllers/

services/

repositories/

routes/

validators/

dto/

constants/

types/

index.js
```

The same structure is used for:

- Social
- Governance
- Dashboard
- Reports
- Settings
- Authentication
- Gamification

Consistency reduces onboarding time and improves maintainability.

---

# 3.5 Responsibility of Each Folder

## controllers/

Responsible for:

- Receiving HTTP requests
- Calling services
- Returning responses

Controllers contain **no business logic**.

---

## services/

Responsible for:

- Business rules
- Validation flow
- Transactions
- Domain logic

Examples:

- Carbon calculations
- ESG score calculations
- XP calculation
- Badge unlocking
- Reward redemption

---

## repositories/

Responsible for database access.

Uses Prisma only.

Examples:

```
findById()

findAll()

create()

update()

delete()

findByDepartment()
```

Repositories never contain business logic.

---

## validators/

Contains Zod schemas.

Example:

```
Create Department

Update Department

Create Challenge

Update Policy

Reward Redemption

Create Audit
```

All API input passes through validators before reaching services.

---

## dto/

Contains request and response contracts.

Purpose:

- Stable API contracts
- Type consistency
- Easy documentation

---

## constants/

Stores:

- Status values
- Enums
- Default weights
- Static configuration

Example:

```
ChallengeStatus

BadgeType

ComplianceSeverity

NotificationType
```

---

## types/

Contains shared TypeScript interfaces (or JSDoc types if using JavaScript).

Examples:

```
Department

Employee

Audit

Reward

Challenge
```

---

# 3.6 Shared Backend Modules

```
shared/

├── logger/
├── notifications/
├── upload/
├── permissions/
├── responses/
├── errors/
└── helpers/
```

These modules are reusable by every feature.

Only the designated owner should modify them.

---

# 3.7 Shared Frontend Modules

```
components/common/

Button

Input

Modal

DataTable

Badge

Avatar

Card

StatCard

Loading

Pagination

EmptyState

ConfirmDialog

Toast
```

These are generic UI components.

Business-specific UI should remain inside each module.

---

# 3.8 Shared Hooks

```
hooks/

useAuth()

useApi()

usePagination()

useDebounce()

usePermission()

useModal()

useNotification()

useForm()
```

These hooks prevent repeated logic across modules.

---

# 3.9 Shared Services

```
services/

api.js

authService.js

notificationService.js

fileUploadService.js
```

Responsibilities:

- Axios instance
- JWT handling
- Token refresh
- Error interception
- Shared HTTP methods

---

# 3.10 Shared Utilities

```
utils/

date.js

formatters.js

calculations.js

validators.js

export.js
```

Examples:

- Date formatting
- ESG score helpers
- CSV export
- Percentage calculations
- Carbon unit conversions

---

# 3.11 Configuration Files

```
config/

database.js

jwt.js

mail.js

upload.js

env.js
```

Only application-level configuration belongs here.

Business configuration (ESG weights, toggles, etc.) is stored in the database.

---

# 3.12 Environment Variables

```
DATABASE_URL

JWT_SECRET

JWT_EXPIRES_IN

PORT

EMAIL_HOST

EMAIL_PORT

EMAIL_USER

EMAIL_PASSWORD

UPLOAD_PATH

NODE_ENV
```

Sensitive values are never committed to Git.

---

# 3.13 File Ownership Rules

To avoid merge conflicts, ownership is clearly defined.

| Folder | Owner |
|---------|-------|
| modules/environmental | Developer 1 |
| modules/social | Developer 2 |
| modules/governance | Developer 3 |
| modules/gamification | Developer 4 |
| shared | Tech Lead / Shared |
| config | Tech Lead |
| prisma | Tech Lead |
| middleware | Shared |
| layouts | Shared |
| routes | Shared |
| components/common | Shared |

No developer should modify another developer's module without prior discussion.

---

# 3.14 Benefits of This Structure

- Independent development
- Predictable code organization
- Minimal merge conflicts
- Easier testing
- Faster onboarding
- Scalable architecture
- Enterprise-grade maintainability
- Consistent coding standards

---

**Next Section:** **4. Database Architecture & Design Philosophy**
# 4. Database Architecture & Design Philosophy

## 4.1 Database Overview

The PostgreSQL database is the **core of the EcoSphere platform**.

All ESG calculations, reporting, dashboards, gamification, compliance, and analytics are driven from normalized relational data.

The database is designed following **Third Normal Form (3NF)** to eliminate redundancy, maintain consistency, and support efficient querying.

---

# 4.2 Database Design Principles

The database follows these principles:

### Normalization

- Third Normal Form (3NF)
- No duplicated business data
- Single source of truth

---

### Referential Integrity

Every relationship is enforced using Foreign Keys.

Example:

```
Department
      │
      ▼
Employee
      │
      ▼
CSR Participation
```

An employee cannot exist without a department.

CSR participation cannot exist without an employee.

---

### Transaction Safety

Critical operations use PostgreSQL transactions.

Examples:

- Reward Redemption
- XP Award
- Badge Assignment
- Challenge Completion

Either all related tables update successfully or none do.

---

### Extensibility

The schema is designed so future modules can be added without redesigning existing tables.

Example:

Future modules:

- Supplier ESG
- Energy Monitoring
- Water Consumption
- Waste Management

can reuse existing Department and Category tables.

---

### Auditability

Instead of overwriting important information, historical records are preserved.

Example:

Reward Redemption

```
Employee XP

↓

Redeem Reward

↓

Reward Redemption Record Created

↓

Employee XP Updated
```

The redemption history is always available.

---

# 4.3 Database Layers

The database contains three logical layers.

```
Master Data

↓

Transactional Data

↓

Reporting & Analytics
```

---

## Master Data

Contains relatively static business information.

Examples

- Departments
- Categories
- Emission Factors
- Products
- Goals
- Policies
- Badges
- Rewards

These tables change infrequently.

---

## Transactional Data

Stores daily business activities.

Examples

- Carbon Transactions
- CSR Activities
- Employee Participation
- Challenges
- Challenge Participation
- Policy Acknowledgements
- Audits
- Compliance Issues

These tables grow continuously.

---

## Reporting Layer

Stores aggregated information for dashboards.

Examples

- Department ESG Score
- Organization ESG Score
- Monthly Carbon Summary

These values can either be generated on demand or refreshed periodically.

---

# 4.4 Database Naming Convention

### Tables

Use singular nouns.

Examples

```
department

employee

challenge

audit
```

---

### Primary Keys

Always

```
id
```

Example

```
department.id

employee.id

audit.id
```

---

### Foreign Keys

Named after referenced table.

```
department_id

employee_id

challenge_id

badge_id
```

---

### Boolean Fields

Prefix with

```
is_

has_

can_
```

Examples

```
is_active

has_proof

can_auto_award
```

---

### Timestamp Fields

Every transactional table contains

```
created_at

updated_at
```

Some tables also include

```
completed_at

approved_at

redeemed_at

closed_at
```

---

# 4.5 Data Integrity Rules

The database itself enforces integrity wherever possible.

Examples

```
Department Name

NOT NULL
```

```
Department Code

UNIQUE
```

```
Reward Stock

CHECK(stock >= 0)
```

```
Employee XP

CHECK(points >= 0)
```

```
Challenge Difficulty

CHECK(
difficulty IN
('Easy','Medium','Hard')
)
```

Application validation complements these constraints but does not replace them.

---

# 4.6 Soft Delete Strategy

Business records should not be physically deleted.

Instead,

```
is_active

status

deleted_at
```

are used.

Example

```
Department

Status

ACTIVE

↓

Archived

↓

INACTIVE
```

Historical reports remain accurate.

---

# 4.7 Lookup Tables vs Enum Tables

Instead of hardcoding values inside application code, lookup tables are preferred where values may change.

Example

```
Category

CSR

Challenge

Training

Volunteer
```

Advantages

- Configurable by admin
- No code changes
- Easy reporting

For fixed system values, enums are appropriate.

Examples

```
Audit Severity

LOW

MEDIUM

HIGH

CRITICAL
```

---

# 4.8 Database Relationships

High-level relationship overview:

```
Department
    │
    ├──────── Employee
    │              │
    │              ├──────── Challenge Participation
    │              │
    │              ├──────── CSR Participation
    │              │
    │              ├──────── Policy Acknowledgement
    │              │
    │              ├──────── Badge
    │              │
    │              └──────── Reward Redemption
    │
    ├──────── Carbon Transaction
    │
    ├──────── Audit
    │
    ├──────── Compliance Issue
    │
    └──────── Department ESG Score
```

This structure minimizes duplication while preserving traceability.

---

# 4.9 Master Data vs Transaction Data

| Master Data | Transaction Data |
|-------------|------------------|
| Department | Carbon Transaction |
| Category | CSR Activity |
| Emission Factor | Employee Participation |
| Product ESG Profile | Challenge Participation |
| ESG Goal | Policy Acknowledgement |
| ESG Policy | Audit |
| Badge | Compliance Issue |
| Reward | Reward Redemption |
| Notification Settings | XP Ledger |

Master tables define the business.

Transactional tables capture daily activity.

---

# 4.10 Database Performance Strategy

Performance is achieved through:

- Proper indexing
- Foreign key indexing
- Composite indexes for reports
- Query pagination
- Aggregate views for dashboards
- Avoiding duplicated calculations
- Efficient joins using normalized relationships

Heavy dashboard queries should avoid scanning large transactional tables repeatedly by using aggregated score tables where appropriate.

---

# 4.11 Why PostgreSQL?

PostgreSQL is chosen because it provides:

- Strong ACID compliance
- Excellent relational modeling
- Rich indexing options
- JSON support (if needed for extensibility)
- Robust transaction handling
- Advanced aggregation capabilities
- Excellent compatibility with Prisma ORM

It is well suited for enterprise ERP-style applications such as EcoSphere.

---

**Next Section:** **5. Complete Entity Relationship (ER) Diagram & Database Tables**
# 5. Complete Entity Relationship (ER) Diagram & Database Tables

## 5.1 Entity Relationship Overview

The database consists of three logical groups:

```
                 MASTER DATA
──────────────────────────────────────────────

Department
Category
Emission Factor
Product ESG Profile
ESG Goal
ESG Policy
Badge
Reward
Notification Setting
Organization Setting

                │
                │
                ▼

          TRANSACTION DATA
──────────────────────────────────────────────

Carbon Transaction
CSR Activity
Employee Participation
Challenge
Challenge Participation
Policy Acknowledgement
Audit
Compliance Issue
Reward Redemption
XP Ledger
Notification
Department Score

                │
                ▼

        REPORTING & ANALYTICS
──────────────────────────────────────────────

Organization ESG Score
Environmental Report
Social Report
Governance Report
ESG Summary Report
```

---

# 5.2 High-Level ER Diagram

```text
                    Department
                         │
      ┌──────────────────┼────────────────────┐
      │                  │                    │
      ▼                  ▼                    ▼
Employee         CarbonTransaction      DepartmentScore
      │
      ├──────────────┐
      │              │
      ▼              ▼
EmployeeParticipation
ChallengeParticipation
      │              │
      ▼              ▼
CSRActivity      Challenge
                     │
                     ▼
                  Category

Employee
   │
   ├───────────────► PolicyAcknowledgement ◄──────── ESGPolicy
   │
   ├───────────────► RewardRedemption ◄──────── Reward
   │
   ├───────────────► XPLedger
   │
   ├───────────────► EmployeeBadge ◄──────── Badge
   │
   └───────────────► Notification

Department
     │
     ▼
Audit
     │
     ▼
ComplianceIssue
```

---

# 5.3 Master Tables

The following tables define the organization's ESG configuration.

| Table | Purpose |
|--------|---------|
| department | Organizational hierarchy |
| category | Shared categories (CSR, Challenge) |
| emission_factor | Carbon conversion factors |
| product_esg_profile | ESG profile for products |
| esg_goal | Sustainability goals |
| esg_policy | Governance policies |
| badge | Badge definitions |
| reward | Redeemable rewards |
| organization_setting | Global ESG configuration |
| notification_setting | Notification preferences |

---

## Why Master Tables?

Master tables change infrequently.

Examples:

- Create Department
- Create Badge
- Create Reward
- Configure Emission Factor

These records are reused by thousands of transactions.

---

# 5.4 Transaction Tables

These tables store daily business operations.

| Table | Purpose |
|--------|---------|
| carbon_transaction | Calculated emissions |
| csr_activity | CSR events |
| employee_participation | Employee CSR participation |
| challenge | Sustainability challenges |
| challenge_participation | Challenge progress |
| policy_acknowledgement | Employee policy acceptance |
| audit | Governance audits |
| compliance_issue | Compliance violations |
| reward_redemption | Reward redemption history |
| xp_ledger | XP transaction history |
| employee_badge | Awarded badges |
| notification | In-app notifications |
| department_score | ESG score per department |

---

## Why Separate Transaction Tables?

Example:

A challenge should not store participant data.

Instead:

```
Challenge

↓

Challenge Participation

↓

Employee
```

This avoids:

- duplicated challenge information
- update anomalies
- inconsistent data

---

# 5.5 Supporting Tables

These tables support the core business process.

| Table | Purpose |
|--------|---------|
| employee | System users participating in ESG |
| role | RBAC roles |
| permission | Application permissions |
| role_permission | Many-to-many mapping |
| user_session | Login/session tracking (optional) |

These tables are shared across all modules.

---

# 5.6 Relationship Cardinality

## Department → Employee

```
One Department

↓

Many Employees
```

```
1 : N
```

---

## Department → Carbon Transaction

```
One Department

↓

Many Carbon Transactions
```

```
1 : N
```

---

## Department → Department Score

```
One Department

↓

Many Historical Scores
```

```
1 : N
```

---

## Employee → Employee Participation

```
One Employee

↓

Many CSR Participations
```

```
1 : N
```

---

## Employee → Challenge Participation

```
One Employee

↓

Many Challenge Participations
```

```
1 : N
```

---

## Employee → XP Ledger

```
One Employee

↓

Many XP Transactions
```

```
1 : N
```

---

## Employee → Reward Redemption

```
One Employee

↓

Many Reward Redemptions
```

```
1 : N
```

---

## Employee → Badge

An employee can earn many badges.

A badge can belong to many employees.

```
Employee

◄────────►

Badge
```

Relationship:

```
M : N
```

Implemented using:

```
employee_badge
```

junction table.

---

## Challenge → Challenge Participation

One challenge may have hundreds of participants.

```
Challenge

↓

Challenge Participation
```

```
1 : N
```

---

## CSR Activity → Employee Participation

One CSR activity

↓

Many employees participate

```
1 : N
```

---

## ESG Policy → Policy Acknowledgement

One policy

↓

Many acknowledgements

```
1 : N
```

---

## Audit → Compliance Issue

One audit

↓

Many compliance issues

```
1 : N
```

---

## Reward → Reward Redemption

One reward

↓

Many redemption records

```
1 : N
```

---

# 5.7 Data Ownership

Each module owns only its own tables.

| Module | Tables |
|----------|--------|
| Authentication | employee, role, permission, role_permission |
| Environmental | emission_factor, product_esg_profile, carbon_transaction, esg_goal |
| Social | csr_activity, employee_participation |
| Governance | esg_policy, policy_acknowledgement, audit, compliance_issue |
| Gamification | challenge, challenge_participation, badge, employee_badge, reward, reward_redemption, xp_ledger |
| Dashboard | department_score |
| Shared | department, category, notification, organization_setting, notification_setting |

This ownership prevents multiple developers from editing the same business logic.

---

# 5.8 Estimated Table Count

| Category | Tables |
|-----------|--------|
| Authentication | 4 |
| Environmental | 4 |
| Social | 2 |
| Governance | 4 |
| Gamification | 7 |
| Shared | 5 |
| Dashboard | 1 |

**Total ≈ 27 Tables**

This normalized design is sufficient for the hackathon while remaining scalable for future ERP expansion.

---

# 5.9 Design Philosophy

The schema intentionally separates:

- Configuration
- Business transactions
- Analytics
- Security
- Gamification

This separation ensures:

- High cohesion
- Low coupling
- Efficient reporting
- Easy maintenance
- Independent module ownership
- Future scalability

---

**Next Section:** **6. Normalized PostgreSQL Schema (Tables, Columns, Primary Keys, Foreign Keys, Constraints & Indexes)**
# 6. Normalized PostgreSQL Schema

## 6.1 Database Design Overview

The EcoSphere database follows **Third Normal Form (3NF)**.

Each entity has a single responsibility.

Business data is stored only once.

Relationships are maintained using foreign keys.

---

# Database Naming Standards

| Item | Convention |
|------|------------|
| Table | snake_case |
| Column | snake_case |
| Primary Key | id |
| Foreign Key | *_id |
| Boolean | is_* |
| Timestamp | created_at, updated_at |

Example:

```sql
department_id

employee_id

challenge_id

reward_id
```

---

# 6.2 department

Purpose

Stores organizational hierarchy.

Every ESG score is calculated department-wise.

---

### Columns

| Column | Type | Constraint |
|----------|------|------------|
| id | UUID | PK |
| name | VARCHAR(100) | NOT NULL |
| code | VARCHAR(20) | UNIQUE |
| head_employee_id | UUID | FK → employee |
| parent_department_id | UUID | FK → department |
| employee_count | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

Indexes

```
PK(id)

UNIQUE(code)

INDEX(name)

INDEX(parent_department_id)
```

---

# 6.3 employee

Purpose

Stores users participating in ESG activities.

---

### Columns

| Column | Type |
|----------|------|
| id | UUID |
| first_name | VARCHAR |
| last_name | VARCHAR |
| email | VARCHAR |
| password_hash | TEXT |
| department_id | UUID |
| role_id | UUID |
| total_xp | INTEGER |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |
| updated_at | TIMESTAMP |

---

Constraints

```
email UNIQUE

total_xp >= 0
```

---

Indexes

```
email

department_id

role_id
```

---

Relationships

```
Department

1

↓

N

Employee
```

---

# 6.4 category

Purpose

Shared lookup table.

Supports

- CSR Categories
- Challenge Categories

---

### Columns

| Column | Type |
|----------|------|
| id | UUID |
| name | VARCHAR |
| type | VARCHAR |
| is_active | BOOLEAN |

---

Example

```
Tree Plantation

CSR

----------------

Fitness

Challenge
```

---

# 6.5 emission_factor

Purpose

Stores carbon conversion values.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| source | VARCHAR |
| unit | VARCHAR |
| factor | DECIMAL |
| description | TEXT |
| is_active | BOOLEAN |

---

Example

```
Diesel

2.68 kg CO₂/L
```

---

Indexes

```
source

unit
```

---

# 6.6 product_esg_profile

Purpose

Stores ESG information associated with products.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| product_name | VARCHAR |
| emission_factor_id | UUID |
| recyclable | BOOLEAN |
| sustainability_rating | INTEGER |

---

Relationship

```
Emission Factor

1

↓

N

Product
```

---

# 6.7 esg_goal

Purpose

Stores environmental sustainability targets.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| department_id | UUID |
| title | VARCHAR |
| target_value | DECIMAL |
| achieved_value | DECIMAL |
| deadline | DATE |
| status | VARCHAR |

---

Status

```
Draft

Active

Completed

Expired
```

---

Indexes

```
department_id

deadline
```

---

# 6.8 carbon_transaction

Purpose

Stores calculated emissions.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| department_id | UUID |
| emission_factor_id | UUID |
| source_type | VARCHAR |
| reference_id | UUID |
| quantity | DECIMAL |
| emission_value | DECIMAL |
| transaction_date | DATE |
| created_at | TIMESTAMP |

---

Business Rule

```
Emission

=

Quantity

×

Emission Factor
```

---

Indexes

```
department_id

transaction_date

source_type
```

---

# 6.9 csr_activity

Purpose

Stores CSR campaigns.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| title | VARCHAR |
| category_id | UUID |
| description | TEXT |
| start_date | DATE |
| end_date | DATE |
| max_points | INTEGER |
| status | VARCHAR |

---

Status

```
Draft

Published

Completed

Cancelled
```

---

Indexes

```
category_id

status
```

---

# 6.10 employee_participation

Purpose

Tracks CSR participation.

---

Columns

| Column | Type |
|----------|------|
| id | UUID |
| employee_id | UUID |
| csr_activity_id | UUID |
| proof_file | TEXT |
| approval_status | VARCHAR |
| points_earned | INTEGER |
| completion_date | DATE |

---

Approval Status

```
Pending

Approved

Rejected
```

---

Business Rule

If

```
Evidence Required = TRUE
```

then

```
proof_file

NOT NULL
```

before approval.

---

Indexes

```
employee_id

csr_activity_id

approval_status
```

---

# 6.11 Why This Design?

These first core tables establish:

- Organization structure
- Employees
- Environmental configuration
- Carbon calculations
- CSR activities

All remaining modules (Governance, Gamification, Reports, Dashboard) build upon these foundational entities.

This layered approach keeps the schema normalized, modular, and easy to extend without introducing redundant data or violating referential integrity.

---

**Next Section:** **6.12 Remaining Tables (Governance, Gamification, Notifications, Dashboard, Authentication & Reporting)**
# 6.12 Remaining Normalized PostgreSQL Tables

This section completes the normalized schema for Governance, Gamification, Notifications, RBAC, Dashboard, and Reporting.

---

# 6.12 role

## Purpose

Stores system roles used for Role-Based Access Control.

Examples:

- Administrator
- ESG Manager
- Department Head
- Auditor
- Employee

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| name | VARCHAR(50) | NOT NULL, UNIQUE |
| description | TEXT | NULL |
| is_system_role | BOOLEAN | DEFAULT FALSE |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Constraints

```text
name must be unique

system roles should not be deleted

inactive roles cannot be assigned to new employees
```

---

## Indexes

```text
UNIQUE(name)

INDEX(is_active)
```

---

# 6.13 permission

## Purpose

Stores individual actions that may be granted to roles.

Examples:

```text
environmental.read

environmental.manage

social.approve_participation

governance.manage_audits

gamification.manage_rewards

reports.export

settings.manage
```

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| code | VARCHAR(100) | NOT NULL, UNIQUE |
| module | VARCHAR(50) | NOT NULL |
| action | VARCHAR(50) | NOT NULL |
| description | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL |

---

## Constraints

```text
code must be unique

module and action must not be empty
```

---

## Indexes

```text
UNIQUE(code)

INDEX(module)

INDEX(module, action)
```

---

# 6.14 role_permission

## Purpose

Implements the many-to-many relationship between roles and permissions.

A role can contain many permissions.

A permission can belong to many roles.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| role_id | UUID | FK → role.id |
| permission_id | UUID | FK → permission.id |
| created_at | TIMESTAMP | NOT NULL |

---

## Primary Key

```text
PRIMARY KEY(role_id, permission_id)
```

---

## Foreign-Key Rules

```text
role_id

ON DELETE CASCADE

permission_id

ON DELETE CASCADE
```

---

## Indexes

```text
PRIMARY KEY(role_id, permission_id)

INDEX(permission_id)
```

---

# 6.15 esg_policy

## Purpose

Stores governance policies that employees must review and acknowledge.

Examples:

- Environmental Responsibility Policy
- Anti-Bribery Policy
- Diversity and Inclusion Policy
- Data Privacy Policy

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| title | VARCHAR(150) | NOT NULL |
| policy_code | VARCHAR(30) | NOT NULL, UNIQUE |
| description | TEXT | NULL |
| content | TEXT | NOT NULL |
| version | VARCHAR(20) | NOT NULL |
| effective_date | DATE | NOT NULL |
| acknowledgement_due_date | DATE | NULL |
| owner_employee_id | UUID | FK → employee.id |
| status | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |
| archived_at | TIMESTAMP | NULL |

---

## Status Values

```text
Draft

Published

Archived
```

---

## Business Rules

- Only published policies are visible to employees.
- A published policy must have an effective date.
- Every new policy version requires a new acknowledgement.
- Archived policies remain available for historical reporting.
- Policy code must remain unique.

---

## Indexes

```text
UNIQUE(policy_code)

INDEX(status)

INDEX(effective_date)

INDEX(owner_employee_id)
```

---

# 6.16 policy_acknowledgement

## Purpose

Tracks whether an employee has accepted a specific version of an ESG policy.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| policy_id | UUID | FK → esg_policy.id |
| employee_id | UUID | FK → employee.id |
| policy_version | VARCHAR(20) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| acknowledged_at | TIMESTAMP | NULL |
| reminder_count | INTEGER | DEFAULT 0 |
| last_reminded_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Status Values

```text
Pending

Acknowledged

Overdue
```

---

## Constraints

```text
UNIQUE(policy_id, employee_id, policy_version)

reminder_count >= 0
```

---

## Business Rules

- One employee can acknowledge one policy version only once.
- `acknowledged_at` is mandatory when status becomes `Acknowledged`.
- Pending acknowledgements become overdue after the acknowledgement due date.
- Reminder notifications may be generated for pending or overdue records.

---

## Indexes

```text
UNIQUE(policy_id, employee_id, policy_version)

INDEX(employee_id, status)

INDEX(policy_id, status)

INDEX(last_reminded_at)
```

---

# 6.17 audit

## Purpose

Stores governance and ESG audit records.

Audits may be internal or external.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| department_id | UUID | FK → department.id |
| title | VARCHAR(150) | NOT NULL |
| audit_type | VARCHAR(30) | NOT NULL |
| description | TEXT | NULL |
| auditor_employee_id | UUID | FK → employee.id |
| scheduled_date | DATE | NOT NULL |
| completed_date | DATE | NULL |
| status | VARCHAR(30) | NOT NULL |
| overall_rating | DECIMAL(5,2) | NULL |
| findings_summary | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Audit Types

```text
Internal

External

Compliance

ESG
```

---

## Status Values

```text
Planned

In Progress

Completed

Cancelled
```

---

## Constraints

```text
overall_rating BETWEEN 0 AND 100

completed_date cannot be before scheduled_date
```

---

## Business Rules

- Completed audits must contain a completion date.
- Completed audits should contain findings or an overall rating.
- Compliance issues may be raised from an audit.
- Historical audits must not be physically deleted.

---

## Indexes

```text
INDEX(department_id)

INDEX(auditor_employee_id)

INDEX(status)

INDEX(scheduled_date)

INDEX(department_id, status)
```

---

# 6.18 compliance_issue

## Purpose

Stores governance violations, risks, corrective actions, and audit findings.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| audit_id | UUID | FK → audit.id, NULL allowed |
| department_id | UUID | FK → department.id |
| title | VARCHAR(150) | NOT NULL |
| severity | VARCHAR(20) | NOT NULL |
| description | TEXT | NOT NULL |
| owner_employee_id | UUID | FK → employee.id, NOT NULL |
| due_date | DATE | NOT NULL |
| status | VARCHAR(30) | NOT NULL |
| resolution_notes | TEXT | NULL |
| resolved_at | TIMESTAMP | NULL |
| created_by_employee_id | UUID | FK → employee.id |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Severity Values

```text
Low

Medium

High

Critical
```

---

## Status Values

```text
Open

In Progress

Resolved

Closed
```

---

## Mandatory Business Rules

Every compliance issue must have:

```text
owner_employee_id

due_date
```

An issue is overdue when:

```text
due_date < current date

AND

status IN ('Open', 'In Progress')
```

Overdue issues must:

- Be visually flagged
- Appear in governance dashboards
- Trigger notifications according to notification settings

---

## Constraints

```text
owner_employee_id NOT NULL

due_date NOT NULL

resolved_at must be present when status is Resolved or Closed
```

---

## Indexes

```text
INDEX(owner_employee_id, status)

INDEX(department_id, status)

INDEX(due_date, status)

INDEX(severity)

INDEX(audit_id)
```

---

# 6.19 challenge

## Purpose

Stores sustainability challenges used by the Gamification module.

Examples:

- Cycle to Work Week
- Plastic-Free Month
- Energy Saving Challenge
- Paperless Office Challenge

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| title | VARCHAR(150) | NOT NULL |
| category_id | UUID | FK → category.id |
| description | TEXT | NOT NULL |
| xp_reward | INTEGER | NOT NULL |
| difficulty | VARCHAR(20) | NOT NULL |
| evidence_required | BOOLEAN | DEFAULT FALSE |
| start_date | DATE | NULL |
| deadline | DATE | NOT NULL |
| status | VARCHAR(30) | NOT NULL |
| created_by_employee_id | UUID | FK → employee.id |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |
| archived_at | TIMESTAMP | NULL |

---

## Difficulty Values

```text
Easy

Medium

Hard
```

---

## Lifecycle States

```text
Draft

Active

Under Review

Completed

Archived
```

---

## Valid State Transitions

```text
Draft → Active

Active → Under Review

Under Review → Completed

Any State → Archived
```

Invalid examples:

```text
Completed → Active

Archived → Draft

Draft → Completed
```

---

## Constraints

```text
xp_reward >= 0

deadline must not be before start_date

category must have type = Challenge
```

---

## Indexes

```text
INDEX(category_id)

INDEX(status)

INDEX(deadline)

INDEX(status, deadline)
```

---

# 6.20 challenge_participation

## Purpose

Tracks employee enrollment, progress, evidence, approval, and awarded XP for challenges.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| challenge_id | UUID | FK → challenge.id |
| employee_id | UUID | FK → employee.id |
| progress_percentage | DECIMAL(5,2) | DEFAULT 0 |
| proof_file_url | TEXT | NULL |
| approval_status | VARCHAR(20) | NOT NULL |
| xp_awarded | INTEGER | DEFAULT 0 |
| submitted_at | TIMESTAMP | NULL |
| reviewed_at | TIMESTAMP | NULL |
| reviewed_by_employee_id | UUID | FK → employee.id, NULL |
| completion_date | DATE | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Approval Status Values

```text
Not Submitted

Pending

Approved

Rejected
```

---

## Constraints

```text
UNIQUE(challenge_id, employee_id)

progress_percentage BETWEEN 0 AND 100

xp_awarded >= 0
```

---

## Business Rules

- An employee may participate only once in a challenge.
- Proof is mandatory when the challenge requires evidence.
- XP may be awarded only once.
- Approval must be completed by an authorized reviewer.
- Approved participation may update:
  - XP Ledger
  - Employee XP balance
  - Badge eligibility
  - Leaderboard
  - Notifications

---

## Indexes

```text
UNIQUE(challenge_id, employee_id)

INDEX(employee_id, approval_status)

INDEX(challenge_id, approval_status)

INDEX(reviewed_by_employee_id)
```

---

# 6.21 xp_ledger

## Purpose

Stores every XP or points transaction.

This table is the authoritative audit trail for employee balances.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| employee_id | UUID | FK → employee.id |
| transaction_type | VARCHAR(30) | NOT NULL |
| points | INTEGER | NOT NULL |
| source_type | VARCHAR(50) | NOT NULL |
| source_id | UUID | NULL |
| description | TEXT | NULL |
| balance_after | INTEGER | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |

---

## Transaction Types

```text
Credit

Debit
```

---

## Source Types

```text
Challenge

CSR Activity

Badge Bonus

Reward Redemption

Manual Adjustment
```

---

## Constraints

```text
points > 0

balance_after >= 0
```

---

## Business Rules

For credit:

```text
new balance = current balance + points
```

For debit:

```text
new balance = current balance - points
```

A debit must fail when the employee has insufficient points.

---

## Indexes

```text
INDEX(employee_id, created_at)

INDEX(source_type, source_id)

INDEX(transaction_type)
```

---

# 6.22 badge

## Purpose

Stores badge definitions and unlock conditions.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| name | VARCHAR(100) | NOT NULL, UNIQUE |
| description | TEXT | NOT NULL |
| icon_url | TEXT | NULL |
| unlock_metric | VARCHAR(50) | NOT NULL |
| unlock_operator | VARCHAR(10) | NOT NULL |
| unlock_value | DECIMAL(12,2) | NOT NULL |
| bonus_xp | INTEGER | DEFAULT 0 |
| is_active | BOOLEAN | DEFAULT TRUE |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Unlock Metrics

```text
Total XP

Completed Challenges

Approved CSR Activities

Training Completions
```

---

## Unlock Operators

```text
>=

>

=

<=
```

---

## Example Unlock Rule

```text
unlock_metric = Total XP

unlock_operator = >=

unlock_value = 1000
```

---

## Constraints

```text
unlock_value >= 0

bonus_xp >= 0
```

---

# 6.23 employee_badge

## Purpose

Stores badges awarded to employees.

This is the junction table between employees and badges.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| employee_id | UUID | FK → employee.id |
| badge_id | UUID | FK → badge.id |
| awarded_at | TIMESTAMP | NOT NULL |
| trigger_metric_value | DECIMAL(12,2) | NULL |
| source_type | VARCHAR(50) | NULL |
| source_id | UUID | NULL |

---

## Constraints

```text
UNIQUE(employee_id, badge_id)
```

---

## Business Rules

- The same badge cannot be awarded twice to one employee.
- Auto-award occurs only when the organization setting is enabled.
- Badge awarding may create:
  - An employee badge record
  - An optional XP ledger credit
  - A badge unlock notification

---

## Indexes

```text
UNIQUE(employee_id, badge_id)

INDEX(employee_id, awarded_at)

INDEX(badge_id)
```

---

# 6.24 reward

## Purpose

Stores redeemable incentives in the rewards catalog.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| name | VARCHAR(100) | NOT NULL |
| description | TEXT | NULL |
| points_required | INTEGER | NOT NULL |
| stock | INTEGER | NOT NULL |
| image_url | TEXT | NULL |
| status | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Status Values

```text
Active

Inactive

Out of Stock
```

---

## Constraints

```text
points_required > 0

stock >= 0
```

---

## Business Rules

- A reward cannot be redeemed when inactive.
- A reward cannot be redeemed when stock is zero.
- Stock must never become negative.
- Status may automatically become `Out of Stock` when stock reaches zero.

---

## Indexes

```text
INDEX(status)

INDEX(points_required)
```

---

# 6.25 reward_redemption

## Purpose

Stores the complete history of reward redemptions.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| employee_id | UUID | FK → employee.id |
| reward_id | UUID | FK → reward.id |
| points_spent | INTEGER | NOT NULL |
| status | VARCHAR(30) | NOT NULL |
| redeemed_at | TIMESTAMP | NOT NULL |
| fulfilled_at | TIMESTAMP | NULL |
| cancelled_at | TIMESTAMP | NULL |
| cancellation_reason | TEXT | NULL |

---

## Status Values

```text
Pending

Approved

Fulfilled

Cancelled
```

---

## Constraints

```text
points_spent > 0
```

---

## Atomic Redemption Transaction

The following actions must occur inside one PostgreSQL transaction:

```text
1. Lock or safely re-read the Reward row

2. Verify stock > 0

3. Verify employee balance >= points_required

4. Create reward_redemption

5. Create XP ledger debit entry

6. Update employee cached XP balance

7. Decrement reward stock

8. Commit transaction
```

If any step fails, the entire operation must roll back.

---

## Indexes

```text
INDEX(employee_id, redeemed_at)

INDEX(reward_id, status)

INDEX(status)
```

---

# 6.26 notification

## Purpose

Stores in-app notifications generated by business events.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| employee_id | UUID | FK → employee.id |
| notification_type | VARCHAR(50) | NOT NULL |
| title | VARCHAR(150) | NOT NULL |
| message | TEXT | NOT NULL |
| related_entity_type | VARCHAR(50) | NULL |
| related_entity_id | UUID | NULL |
| channel | VARCHAR(20) | NOT NULL |
| status | VARCHAR(20) | NOT NULL |
| read_at | TIMESTAMP | NULL |
| sent_at | TIMESTAMP | NULL |
| created_at | TIMESTAMP | NOT NULL |

---

## Notification Types

```text
Compliance Issue Raised

Compliance Issue Overdue

CSR Approval Decision

Challenge Approval Decision

Policy Reminder

Badge Unlocked

Reward Redemption
```

---

## Channel Values

```text
In-App

Email

Both
```

---

## Status Values

```text
Pending

Sent

Failed

Read
```

---

## Indexes

```text
INDEX(employee_id, status, created_at)

INDEX(notification_type)

INDEX(related_entity_type, related_entity_id)
```

---

# 6.27 notification_setting

## Purpose

Stores organization-wide notification preferences.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| event_type | VARCHAR(50) | NOT NULL, UNIQUE |
| in_app_enabled | BOOLEAN | DEFAULT TRUE |
| email_enabled | BOOLEAN | DEFAULT FALSE |
| reminder_frequency_days | INTEGER | NULL |
| is_active | BOOLEAN | DEFAULT TRUE |
| updated_by_employee_id | UUID | FK → employee.id |
| updated_at | TIMESTAMP | NOT NULL |

---

## Constraints

```text
reminder_frequency_days > 0 when provided
```

---

## Business Rules

Notification preferences must exist for at least:

- New compliance issue
- Compliance issue overdue
- CSR approval decision
- Challenge approval decision
- Policy acknowledgement reminder
- Badge unlock

---

# 6.28 organization_setting

## Purpose

Stores configurable ESG business rules at organization level.

A single-organization hackathon implementation may maintain one active row.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| organization_name | VARCHAR(150) | NOT NULL |
| environmental_weight | DECIMAL(5,2) | NOT NULL |
| social_weight | DECIMAL(5,2) | NOT NULL |
| governance_weight | DECIMAL(5,2) | NOT NULL |
| auto_emission_calculation_enabled | BOOLEAN | DEFAULT FALSE |
| csr_evidence_required | BOOLEAN | DEFAULT FALSE |
| badge_auto_award_enabled | BOOLEAN | DEFAULT TRUE |
| default_currency | VARCHAR(10) | DEFAULT 'INR' |
| timezone | VARCHAR(50) | DEFAULT 'Asia/Kolkata' |
| updated_by_employee_id | UUID | FK → employee.id |
| updated_at | TIMESTAMP | NOT NULL |

---

## Mandatory Weight Constraint

```text
environmental_weight
+
social_weight
+
governance_weight
=
100
```

Default values:

```text
Environmental = 40

Social = 30

Governance = 30
```

---

## Business Rules

- Weight values must be between 0 and 100.
- Total weight must always equal 100.
- Configuration updates require administrator permission.
- Toggle changes affect future workflow execution.

---

# 6.29 department_score

## Purpose

Stores calculated ESG scores for each department over a specific reporting period.

This table supports fast dashboard and ranking queries.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| department_id | UUID | FK → department.id |
| period_start | DATE | NOT NULL |
| period_end | DATE | NOT NULL |
| environmental_score | DECIMAL(5,2) | NOT NULL |
| social_score | DECIMAL(5,2) | NOT NULL |
| governance_score | DECIMAL(5,2) | NOT NULL |
| total_score | DECIMAL(5,2) | NOT NULL |
| calculated_at | TIMESTAMP | NOT NULL |
| calculation_version | VARCHAR(20) | NOT NULL |

---

## Constraints

```text
UNIQUE(department_id, period_start, period_end)

all scores BETWEEN 0 AND 100

period_end >= period_start
```

---

## Weighted Total Formula

```text
Total Score

=

(Environmental Score × Environmental Weight)

+

(Social Score × Social Weight)

+

(Governance Score × Governance Weight)
```

Weights are converted to decimal fractions before calculation.

Example:

```text
Environmental Score = 80

Social Score = 70

Governance Score = 90

Weights = 40%, 30%, 30%
```

```text
Total Score

=

80 × 0.40

+

70 × 0.30

+

90 × 0.30

=

80
```

---

## Indexes

```text
UNIQUE(department_id, period_start, period_end)

INDEX(period_start, period_end)

INDEX(total_score)

INDEX(department_id, calculated_at)
```

---

# 6.30 diversity_metric

## Purpose

Stores department-level or organization-level workforce diversity statistics.

This supports the required Social module diversity metrics.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| department_id | UUID | FK → department.id |
| metric_type | VARCHAR(50) | NOT NULL |
| metric_value | DECIMAL(12,2) | NOT NULL |
| total_population | INTEGER | NULL |
| reporting_date | DATE | NOT NULL |
| notes | TEXT | NULL |
| created_at | TIMESTAMP | NOT NULL |

---

## Metric Type Examples

```text
Gender Diversity Percentage

Women in Leadership Percentage

Age Group Distribution

Accessibility Representation
```

---

## Constraints

```text
metric_value >= 0

total_population >= 0
```

---

## Indexes

```text
INDEX(department_id, reporting_date)

INDEX(metric_type, reporting_date)
```

---

# 6.31 training

## Purpose

Stores ESG-related employee training programs.

This supports the required Social module training-completion feature.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| title | VARCHAR(150) | NOT NULL |
| description | TEXT | NULL |
| category_id | UUID | FK → category.id, NULL |
| due_date | DATE | NULL |
| points_awarded | INTEGER | DEFAULT 0 |
| status | VARCHAR(20) | NOT NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Status Values

```text
Draft

Active

Completed

Archived
```

---

# 6.32 training_completion

## Purpose

Tracks employee completion of ESG training.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| training_id | UUID | FK → training.id |
| employee_id | UUID | FK → employee.id |
| status | VARCHAR(20) | NOT NULL |
| completion_percentage | DECIMAL(5,2) | DEFAULT 0 |
| completed_at | TIMESTAMP | NULL |
| score | DECIMAL(5,2) | NULL |
| created_at | TIMESTAMP | NOT NULL |
| updated_at | TIMESTAMP | NOT NULL |

---

## Constraints

```text
UNIQUE(training_id, employee_id)

completion_percentage BETWEEN 0 AND 100

score BETWEEN 0 AND 100 when provided
```

---

## Indexes

```text
UNIQUE(training_id, employee_id)

INDEX(employee_id, status)

INDEX(training_id, status)
```

---

# 6.33 Optional Reporting Persistence

Environmental, Social, Governance, ESG Summary, and Custom Reports should normally be generated from normalized data.

A separate report table is not required unless generated reports must be saved.

For saved report history, use:

```text
generated_report
```

---

# 6.34 generated_report

## Purpose

Stores generated-report metadata and exported-file references.

---

## Columns

| Column | Type | Constraint |
|---|---|---|
| id | UUID | Primary Key |
| report_type | VARCHAR(50) | NOT NULL |
| generated_by_employee_id | UUID | FK → employee.id |
| filters_json | JSONB | NOT NULL |
| file_format | VARCHAR(10) | NOT NULL |
| file_url | TEXT | NULL |
| status | VARCHAR(20) | NOT NULL |
| generated_at | TIMESTAMP | NOT NULL |
| expires_at | TIMESTAMP | NULL |

---

## File Formats

```text
PDF

Excel

CSV
```

---

## Indexes

```text
INDEX(generated_by_employee_id, generated_at)

INDEX(report_type)

GIN INDEX(filters_json)
```

The JSONB field is acceptable here because report filters are flexible metadata rather than core relational business data.

---

# 6.35 Critical Foreign-Key Delete Policy

Recommended delete behavior:

| Relationship | Delete Rule |
|---|---|
| Department → Employee | RESTRICT |
| Department → Carbon Transaction | RESTRICT |
| Employee → Participation | RESTRICT |
| Challenge → Participation | RESTRICT |
| Policy → Acknowledgement | RESTRICT |
| Audit → Compliance Issue | RESTRICT |
| Role → Role Permission | CASCADE |
| Permission → Role Permission | CASCADE |
| Employee → Notification | CASCADE or anonymize |
| Badge → Employee Badge | RESTRICT |
| Reward → Redemption | RESTRICT |

Business and audit records must be preserved.

For this reason, soft deletion or status-based archiving is preferred for master and transactional entities.

---

# 6.36 Database Transaction Boundaries

The following workflows must use Prisma transactions:

## Reward Redemption

```text
Validate balance

Validate stock

Create redemption

Create XP debit

Update employee balance

Update reward stock
```

---

## Challenge Approval

```text
Approve participation

Set XP awarded

Create XP credit

Update employee balance

Evaluate badges

Create notifications
```

---

## CSR Approval

```text
Validate proof requirement

Approve participation

Set points earned

Create XP credit

Update employee balance

Evaluate badges

Create notification
```

---

## Badge Award

```text
Verify rule

Verify badge not already owned

Create employee badge

Create optional XP credit

Create notification
```

---

# 6.37 Database Source-of-Truth Rules

| Data | Source of Truth |
|---|---|
| Current employee XP history | xp_ledger |
| Fast current XP balance | employee.total_xp |
| Reward stock | reward.stock |
| Challenge participation state | challenge_participation |
| Policy acceptance | policy_acknowledgement |
| ESG weights | organization_setting |
| Department ESG performance | department_score |
| Notification history | notification |
| Badge ownership | employee_badge |

Cached values must always be updated in the same transaction as their underlying ledger or transaction record.

---

# 6.38 Database Ownership by Developer

| Developer | Primary Table Ownership |
|---|---|
| Developer 1 – Environmental | emission_factor, product_esg_profile, esg_goal, carbon_transaction |
| Developer 2 – Social | csr_activity, employee_participation, diversity_metric, training, training_completion |
| Developer 3 – Governance | esg_policy, policy_acknowledgement, audit, compliance_issue |
| Developer 4 – Gamification | challenge, challenge_participation, badge, employee_badge, reward, reward_redemption, xp_ledger |
| Shared Owner | department, employee, role, permission, role_permission, category, organization_setting, notification_setting, notification, department_score |

No developer should directly modify another developer's owned models after the initial schema contract is frozen.

---

**Next Section:** **7. Complete Prisma Schema Design and Migration Ownership**
# 7. Prisma Schema Design and Migration Ownership

## 7.1 Prisma Design Goals

Prisma acts as the type-safe data-access layer between Express and PostgreSQL.

The Prisma design must support:

- Clear model ownership
- Strong relationships
- Safe migrations
- Consistent naming
- Efficient querying
- Transaction support
- Minimal merge conflicts
- Independent module development

The project should use a single PostgreSQL database and one shared Prisma schema.

---

# 7.2 Prisma Project Structure

```text
backend/

├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   ├── seed/
│   │   ├── roles.seed.js
│   │   ├── permissions.seed.js
│   │   ├── users.seed.js
│   │   ├── settings.seed.js
│   │   ├── categories.seed.js
│   │   ├── emission-factors.seed.js
│   │   ├── badges.seed.js
│   │   └── rewards.seed.js
│   │
│   └── seed.js
│
└── src/
    └── config/
        └── prisma.js
```

---

# 7.3 Prisma Datasource Configuration

The Prisma datasource connects to PostgreSQL using an environment variable.

```text
DATABASE_URL
```

Example environment format:

```text
postgresql://username:password@localhost:5432/ecosphere
```

The real database credentials must never be committed to Git.

Only `.env.example` should be stored in the repository.

---

# 7.4 Prisma Client Ownership

Only one Prisma client instance should be created for the backend.

Recommended file:

```text
backend/src/config/prisma.js
```

All repositories import the same shared Prisma client.

This prevents:

- Excessive database connections
- Connection pool exhaustion
- Duplicate configuration
- Inconsistent logging
- Circular imports

---

# 7.5 Prisma Naming Strategy

Database tables and columns use `snake_case`.

Prisma models and fields use application-friendly naming.

Example mapping:

```text
Prisma Model

CarbonTransaction

Database Table

carbon_transaction
```

Field mapping:

```text
Prisma Field

departmentId

Database Column

department_id
```

Prisma mapping annotations should preserve both conventions.

---

# 7.6 Core Model Groups

The Prisma schema should be organized using comments and domain sections.

```text
// ============================================================
// AUTHENTICATION AND RBAC
// ============================================================

// ============================================================
// ORGANIZATION AND SHARED MASTER DATA
// ============================================================

// ============================================================
// ENVIRONMENTAL MODULE
// ============================================================

// ============================================================
// SOCIAL MODULE
// ============================================================

// ============================================================
// GOVERNANCE MODULE
// ============================================================

// ============================================================
// GAMIFICATION MODULE
// ============================================================

// ============================================================
// NOTIFICATIONS AND SETTINGS
// ============================================================

// ============================================================
// DASHBOARD AND REPORTING
// ============================================================
```

This improves readability when the schema is maintained by multiple developers.

---

# 7.7 Authentication and RBAC Models

## Role

Relationships:

```text
Role

1 ───────── N Employee

Role

M ───────── N Permission
```

The many-to-many relationship is implemented explicitly using:

```text
RolePermission
```

Explicit junction models are preferred over implicit Prisma many-to-many relations because they support:

- Audit timestamps
- Easier reporting
- Future permission metadata
- Clear database ownership

---

## Permission

Each permission contains a unique code.

Example:

```text
environmental.read

environmental.manage

social.approve

governance.audit.manage

gamification.reward.redeem

reports.export
```

The backend authorizes access using permission codes rather than role names wherever possible.

---

## Employee

The Employee model should relate to:

- Department
- Role
- CSR participation
- Challenge participation
- Policy acknowledgements
- Audit ownership
- Compliance issue ownership
- XP ledger
- Badges
- Reward redemptions
- Notifications

Because Employee is a highly connected shared model, changes to it must be reviewed by the shared-schema owner.

---

# 7.8 Organization and Shared Models

## Department

Department requires two self-referential relationships:

```text
Parent Department

↓

Child Departments
```

and:

```text
Department Head

↓

Employee
```

These relations must use separate relation names to prevent ambiguity.

Example conceptual relation names:

```text
DepartmentHierarchy

DepartmentHead
```

---

## Category

Category is shared between Social and Gamification.

The model includes a category type:

```text
CSR_ACTIVITY

CHALLENGE

TRAINING
```

A unique constraint should prevent duplicate active categories of the same type.

Recommended compound uniqueness:

```text
name + type
```

---

## OrganizationSetting

For the hackathon, the platform supports one organization.

The application should maintain exactly one active configuration row.

The service layer should expose:

```text
getOrganizationSettings()

updateOrganizationSettings()
```

Other modules must not query settings independently in multiple places.

---

# 7.9 Environmental Prisma Models

Developer 1 owns:

```text
EmissionFactor

ProductEsgProfile

EsgGoal

CarbonTransaction
```

---

## EmissionFactor Relations

An emission factor may relate to:

- Multiple product ESG profiles
- Multiple carbon transactions

```text
EmissionFactor

1 ───────── N ProductEsgProfile

EmissionFactor

1 ───────── N CarbonTransaction
```

---

## CarbonTransaction Relations

Each carbon transaction belongs to:

- One department
- One emission factor

Optional ERP source linkage is represented using:

```text
sourceType

referenceId
```

Because Purchase, Manufacturing, Expense, and Fleet modules are simulated rather than fully built, a polymorphic database foreign key is not possible.

The service layer must validate the supported source types.

---

## ESG Goal Relations

A goal belongs to a department.

Future versions may support organization-level goals by allowing `departmentId` to be nullable.

For the hackathon, department ownership is recommended because scoring and dashboards are department-based.

---

# 7.10 Social Prisma Models

Developer 2 owns:

```text
CsrActivity

EmployeeParticipation

DiversityMetric

Training

TrainingCompletion
```

---

## CSR Activity Relations

A CSR activity belongs to a category.

One activity has many employee participations.

```text
Category

1 ───────── N CsrActivity

CsrActivity

1 ───────── N EmployeeParticipation
```

---

## Employee Participation Uniqueness

The following compound uniqueness is mandatory:

```text
employeeId + csrActivityId
```

This prevents an employee from registering for the same CSR activity multiple times.

---

## Diversity Metric Relations

Each diversity metric belongs to a department and reporting date.

Possible compound index:

```text
departmentId + metricType + reportingDate
```

This supports trend charts and department comparisons.

---

## Training Completion Uniqueness

The following compound constraint is mandatory:

```text
trainingId + employeeId
```

An employee should have only one active completion record for a training program.

---

# 7.11 Governance Prisma Models

Developer 3 owns:

```text
EsgPolicy

PolicyAcknowledgement

Audit

ComplianceIssue
```

---

## Policy Acknowledgement Uniqueness

A policy acknowledgement must be unique for:

```text
policyId

employeeId

policyVersion
```

This preserves acknowledgement history across policy versions.

---

## Audit Relations

Each audit belongs to a department and may have:

- One auditor
- Many compliance issues

```text
Department

1 ───────── N Audit

Audit

1 ───────── N ComplianceIssue
```

---

## Compliance Issue Relations

A compliance issue belongs to:

- One department
- One owner employee
- One creator employee
- Optionally one audit

Because multiple foreign keys point to Employee, separate Prisma relation names are required.

Example:

```text
ComplianceIssueOwner

ComplianceIssueCreator
```

---

# 7.12 Gamification Prisma Models

Developer 4 owns:

```text
Challenge

ChallengeParticipation

XpLedger

Badge

EmployeeBadge

Reward

RewardRedemption
```

---

## Challenge Participation Uniqueness

The following compound uniqueness is mandatory:

```text
challengeId + employeeId
```

This guarantees one participation record per employee per challenge.

---

## XP Ledger Design

XP Ledger is append-only.

Normal application workflows must not update or delete XP ledger records.

Corrections should create a new adjustment entry.

Example:

```text
Incorrect Credit: +100

Correction Entry: -100
```

This preserves auditability.

---

## Employee Badge Uniqueness

The following constraint prevents duplicate awards:

```text
employeeId + badgeId
```

---

## Reward Redemption Relations

Each redemption belongs to:

- One employee
- One reward

Reward stock and employee balance must be updated in the same Prisma transaction.

---

# 7.13 Enum Design

Use Prisma enums for system-controlled values that should not be editable by administrators.

Recommended enums:

```text
ChallengeStatus

ChallengeDifficulty

ApprovalStatus

AuditStatus

AuditType

ComplianceSeverity

ComplianceStatus

PolicyStatus

AcknowledgementStatus

RewardStatus

RedemptionStatus

NotificationChannel

NotificationStatus

XpTransactionType

GoalStatus

TrainingStatus
```

---

## When Not to Use Enums

Do not use enums for values administrators must manage dynamically.

Examples:

- CSR categories
- Challenge categories
- Departments
- Badges
- Rewards
- Emission factors

These belong in database tables.

---

# 7.14 Decimal Precision

PostgreSQL decimal types should be used for values requiring accuracy.

Recommended precision:

| Data | Database Precision |
|---|---|
| Emission factor | DECIMAL(18,6) |
| Quantity | DECIMAL(18,4) |
| Emission value | DECIMAL(18,4) |
| ESG score | DECIMAL(5,2) |
| Weight percentage | DECIMAL(5,2) |
| Progress percentage | DECIMAL(5,2) |
| Diversity metric | DECIMAL(12,2) |

JavaScript floating-point arithmetic must not be trusted for final financial-style or ESG calculations without controlled rounding.

---

# 7.15 Timestamp Strategy

Use UTC timestamps in PostgreSQL.

The application converts timestamps to the organization's configured timezone for display.

Recommended Prisma default behavior:

```text
createdAt

default current timestamp
```

```text
updatedAt

automatically updated
```

Date-only business fields remain PostgreSQL dates.

Examples:

- Due date
- Deadline
- Effective date
- Reporting period

---

# 7.16 Cascade and Restrict Rules

Prisma relations must explicitly define delete behavior.

Recommended strategy:

```text
RolePermission

onDelete: Cascade
```

```text
EmployeeParticipation

onDelete: Restrict
```

```text
ChallengeParticipation

onDelete: Restrict
```

```text
RewardRedemption

onDelete: Restrict
```

```text
PolicyAcknowledgement

onDelete: Restrict
```

Transactional and audit data should not disappear when master data is archived.

---

# 7.17 Index Design in Prisma

Prisma indexes should be declared for frequent filtering and joins.

Examples:

```text
departmentId

employeeId

status

dueDate

deadline

transactionDate

createdAt
```

Composite indexes should match actual API filters.

Examples:

```text
departmentId + transactionDate

employeeId + approvalStatus

dueDate + status

challengeId + approvalStatus

employeeId + createdAt
```

Indexes should not be created blindly on every column because excessive indexes slow inserts and updates.

---

# 7.18 Migration Strategy

All database changes must use Prisma migrations.

Never manually alter the shared database during development without creating a migration.

Migration naming convention:

```text
001_initial_auth_shared

002_environmental_master

003_social_module

004_governance_module

005_gamification_module

006_notifications_settings

007_dashboard_reporting
```

Actual Prisma migration folders will include timestamps, but the descriptive suffix should remain clear.

---

# 7.19 Migration Ownership

| Migration Group | Owner |
|---|---|
| Authentication and shared master tables | Shared owner |
| Environmental tables | Developer 1 |
| Social tables | Developer 2 |
| Governance tables | Developer 3 |
| Gamification tables | Developer 4 |
| Notification and settings tables | Shared owner |
| Dashboard and reporting tables | Shared owner |

---

# 7.20 Schema Editing Rule

Only one developer should modify `schema.prisma` at a time.

Recommended workflow:

1. Shared owner creates the initial complete schema contract.
2. All developers review model names and relations.
3. Schema is frozen before feature development.
4. Each developer creates migrations only for their owned models.
5. Any cross-domain schema change requires team approval.
6. Shared owner resolves schema conflicts.
7. Developers regenerate Prisma Client after pulling migrations.

This is necessary because `schema.prisma` is a high-conflict file.

---

# 7.21 Initial Migration Order

Migrations must run in dependency order.

```text
1. Role and Permission

2. Department and Employee

3. Category and Organization Settings

4. Environmental Models

5. Social Models

6. Governance Models

7. Gamification Models

8. Notification Models

9. Department Score and Reporting Models
```

This order ensures foreign-key dependencies exist before dependent tables are created.

---

# 7.22 Seeder Execution Order

Seeders should run in the following order:

```text
1. Roles

2. Permissions

3. Role-Permission Mappings

4. Departments

5. Admin and Demo Employees

6. Organization Settings

7. Notification Settings

8. Categories

9. Emission Factors

10. ESG Policies

11. Badges

12. Rewards

13. Demo Challenges

14. Demo CSR Activities
```

Seeders must be idempotent.

Running the seed command multiple times must not create duplicate records.

Use unique fields and upsert operations.

---

# 7.23 Required Seed Data

Minimum hackathon seed data:

## Roles

```text
Administrator

ESG Manager

Department Head

Auditor

Employee
```

---

## Departments

```text
Administration

Operations

Human Resources

Finance

Technology
```

---

## Categories

```text
Tree Plantation — CSR Activity

Community Service — CSR Activity

Cycle to Work — Challenge

Energy Saving — Challenge

ESG Awareness — Training
```

---

## Organization Configuration

```text
Environmental Weight = 40

Social Weight = 30

Governance Weight = 30

Auto Emission Calculation = Enabled

CSR Evidence Requirement = Enabled

Badge Auto-Award = Enabled
```

---

# 7.24 Prisma Transaction Usage

Prisma transactions are mandatory for multi-table business operations.

Recommended transaction scenarios:

```text
CSR approval

Challenge approval

Reward redemption

Badge award

ESG score recalculation
```

Interactive transactions should remain short.

Do not perform:

- Email delivery
- File uploads
- Long calculations
- External API calls

inside a database transaction.

Instead:

1. Commit the database transaction.
2. Queue or trigger the notification afterward.
3. Record notification failure separately.

---

# 7.25 Repository Access Rule

Only repository files may directly use Prisma for normal module CRUD operations.

Correct flow:

```text
Controller

↓

Service

↓

Repository

↓

Prisma
```

Incorrect flow:

```text
Controller

↓

Prisma
```

or:

```text
React Page

↓

Database
```

This keeps data access testable and prevents business logic from leaking into controllers.

---

# 7.26 Prisma Query Standards

Every list query should support:

- Pagination
- Sorting
- Search
- Filtering
- Controlled relation inclusion

Avoid deeply nested unrestricted includes.

Example response rules:

```text
List APIs return summaries.

Detail APIs return full relationships.
```

This reduces payload size and improves performance.

---

# 7.27 Avoiding N+1 Queries

Repositories should use:

- Prisma relation includes
- Select statements
- Aggregate queries
- Group-by queries
- Batched fetching

Example:

A leaderboard API should not fetch every employee and then separately query XP for each employee.

It should use a single ordered aggregate query or the cached employee balance.

---

# 7.28 Prisma Error Translation

Raw Prisma errors must not be returned to frontend clients.

The repository or shared error handler maps them into application errors.

Examples:

| Prisma Error | Application Response |
|---|---|
| Unique constraint violation | 409 Conflict |
| Foreign key violation | 400 Bad Request or 409 Conflict |
| Record not found | 404 Not Found |
| Database unavailable | 503 Service Unavailable |
| Unknown Prisma error | 500 Internal Server Error |

Sensitive SQL, connection details, and stack traces must never appear in production responses.

---

# 7.29 Migration Safety Checklist

Before merging any migration:

- Prisma schema validates successfully
- Migration runs on an empty database
- Migration runs after all earlier migrations
- Seeders still work
- Prisma Client generates successfully
- Existing APIs still start
- No owned table is unintentionally dropped
- Foreign keys use correct delete rules
- Indexes support expected filters
- Migration name clearly describes the change

---

# 7.30 Prisma Definition of Done

The Prisma layer is complete when:

- All models exist
- All relations are mapped
- All enums are defined
- Primary keys are configured
- Foreign keys are enforced
- Unique constraints prevent duplicates
- Required indexes are declared
- Migration order works
- Seeders are repeatable
- Transactions protect critical workflows
- Prisma errors are safely translated
- Developers can run the complete database locally from scratch

---

**Next Section:** **8. Backend Layer Architecture — Routes, Controllers, Services, Repositories, Validation and Middleware**
# 8. Backend Layer Architecture

## 8.1 Backend Architectural Pattern

The EcoSphere backend follows a strict layered architecture:

```text
Route
  ↓
Middleware
  ↓
Controller
  ↓
Service
  ↓
Repository
  ↓
Prisma ORM
  ↓
PostgreSQL
```

Each layer has a single responsibility.

This separation prevents business logic from becoming mixed with HTTP handling or database queries.

---

# 8.2 Request Processing Flow

A typical request follows this path:

```text
React Frontend

↓

Axios Request

↓

Express Route

↓

Authentication Middleware

↓

Authorization Middleware

↓

Validation Middleware

↓

Controller

↓

Service

↓

Repository

↓

Prisma

↓

PostgreSQL

↓

Standard API Response
```

Example:

```text
POST /api/v1/rewards/:rewardId/redeem
```

Execution flow:

```text
1. Verify JWT

2. Verify employee permission

3. Validate reward ID

4. Controller receives request

5. Reward service validates business rules

6. Repository executes Prisma transaction

7. XP balance and stock are updated

8. Redemption record is created

9. Notification is triggered

10. Response is returned
```

---

# 8.3 Module Backend Structure

Every backend module must follow the same internal structure.

```text
src/modules/gamification/

├── controllers/
│   ├── challenge.controller.js
│   ├── badge.controller.js
│   └── reward.controller.js
│
├── services/
│   ├── challenge.service.js
│   ├── badge.service.js
│   ├── reward.service.js
│   └── xp.service.js
│
├── repositories/
│   ├── challenge.repository.js
│   ├── badge.repository.js
│   ├── reward.repository.js
│   └── xp.repository.js
│
├── routes/
│   ├── challenge.routes.js
│   ├── badge.routes.js
│   └── reward.routes.js
│
├── validators/
│   ├── challenge.validator.js
│   ├── badge.validator.js
│   └── reward.validator.js
│
├── dto/
│   ├── challenge.dto.js
│   ├── badge.dto.js
│   └── reward.dto.js
│
├── constants/
│   └── gamification.constants.js
│
└── index.js
```

This pattern is repeated for all modules.

---

# 8.4 Route Layer

## Purpose

Routes define:

- HTTP method
- URL
- Middleware order
- Controller function

Routes must not contain business logic.

---

## Responsibilities

A route may:

- Apply authentication
- Apply permission checks
- Apply validation
- Apply upload middleware
- Forward the request to a controller

---

## Example Route Responsibilities

Conceptual example:

```text
POST /api/v1/challenges

Authentication required

Permission required: gamification.challenge.create

Validate request body

Call createChallenge controller
```

---

## Route Naming Convention

Use plural resource names.

Correct:

```text
/api/v1/departments

/api/v1/challenges

/api/v1/audits

/api/v1/rewards
```

Avoid action-heavy URLs when standard REST semantics are sufficient.

Correct:

```text
POST /api/v1/challenges
```

Avoid:

```text
POST /api/v1/createChallenge
```

---

# 8.5 Controller Layer

## Purpose

Controllers translate HTTP requests into service calls.

Controllers should remain small and predictable.

---

## Controller Responsibilities

Controllers may:

- Read route parameters
- Read query parameters
- Read validated request body
- Access authenticated user context
- Call the service layer
- Return a standardized response

---

## Controllers Must Not

Controllers must not:

- Query Prisma directly
- Calculate ESG scores
- Award XP
- Validate lifecycle transitions
- Send emails directly
- Contain SQL
- Decide permissions manually

---

## Controller Output Pattern

Every controller should return one of the standard responses:

```text
success

created

paginated

noContent
```

Errors should be passed to the centralized error handler.

---

# 8.6 Service Layer

## Purpose

The Service Layer contains business logic.

This is the most important backend layer.

---

## Service Responsibilities

Services handle:

- Business rules
- State transitions
- Cross-table operations
- Transaction coordination
- Authorization beyond simple permissions
- Domain validation
- Notification triggering
- Score calculation
- Badge eligibility
- XP operations

---

## Examples of Service Logic

### Environmental Service

```text
Validate emission factor

Calculate emissions

Create carbon transaction

Update department score
```

---

### Social Service

```text
Validate CSR participation

Check proof requirement

Approve or reject participation

Award points

Trigger badge evaluation
```

---

### Governance Service

```text
Create compliance issue

Ensure owner and due date exist

Flag overdue issues

Send notifications
```

---

### Gamification Service

```text
Validate challenge state transition

Award XP

Check badge unlock rules

Redeem reward atomically
```

---

# 8.7 Repository Layer

## Purpose

Repositories isolate all Prisma database access.

---

## Responsibilities

Repositories handle:

- Create
- Read
- Update
- Archive
- Pagination
- Filtering
- Sorting
- Aggregation
- Transactions
- Database-specific query optimization

---

## Repository Rules

Repositories must not:

- Return HTTP responses
- Read Express request objects
- Perform permission checks
- Contain UI-specific formatting
- Send notifications
- Make unrelated cross-module decisions

---

## Repository Method Naming

Use clear domain-oriented names.

Examples:

```text
findById()

findMany()

create()

update()

archive()

findByDepartment()

findPendingApprovals()

findOverdueIssues()

getLeaderboard()

getEmployeeBalance()
```

---

# 8.8 Validation Layer

## Purpose

Zod validates all incoming data before it reaches the controller.

Validation must apply to:

- Request body
- Route parameters
- Query parameters
- Uploaded file metadata

---

## Validation Categories

### Structural Validation

Checks:

- Required fields
- Field types
- String length
- Number ranges
- Date formats
- Enum values

---

### Business Validation

Handled in services.

Examples:

- Reward stock availability
- Sufficient XP balance
- Valid challenge transition
- Employee belongs to required department
- Evidence is required before approval

Zod should not replace business-rule validation.

---

# 8.9 Middleware Architecture

Shared middleware should be centralized.

```text
src/middleware/

├── authenticate.middleware.js
├── authorize.middleware.js
├── validate.middleware.js
├── error.middleware.js
├── notFound.middleware.js
├── rateLimit.middleware.js
├── requestId.middleware.js
├── upload.middleware.js
└── auditLog.middleware.js
```

---

# 8.10 Authentication Middleware

## Responsibilities

The authentication middleware:

1. Reads the JWT from the request
2. Verifies its signature
3. Checks expiration
4. Loads essential employee information
5. Attaches authenticated context to the request

Recommended request context:

```text
request.user.id

request.user.roleId

request.user.departmentId

request.user.permissions
```

---

## Authentication Failure Responses

| Situation | Status |
|---|---|
| Missing token | 401 Unauthorized |
| Invalid token | 401 Unauthorized |
| Expired token | 401 Unauthorized |
| Inactive employee | 403 Forbidden |

---

# 8.11 Authorization Middleware

## Purpose

Authorization verifies whether an authenticated user has the required permission.

Example:

```text
authorize('governance.audit.manage')
```

---

## Authorization Rules

Permission checks should use permission codes.

Avoid checking role names throughout controllers.

Correct:

```text
user has permission:
governance.compliance.manage
```

Less flexible:

```text
user role equals Administrator
```

---

# 8.12 Department-Level Access Control

Some users should only access records from their own department.

Example:

A Department Head may view:

```text
their department's employees

their department's ESG score

their department's carbon transactions

their department's compliance issues
```

They should not automatically access other departments.

This filtering belongs in the service or repository query contract.

---

# 8.13 Validation Middleware

The validation middleware receives a Zod schema and validates the relevant request section.

Example validation targets:

```text
body

params

query
```

On validation failure, the API should return:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      {
        "field": "deadline",
        "message": "Deadline must be a valid future date"
      }
    ]
  }
}
```

---

# 8.14 File Upload Middleware

Proof files may be used for:

- CSR participation
- Challenge participation
- Audit evidence
- Policy attachments

---

## File Validation Rules

Validate:

- MIME type
- Extension
- Maximum file size
- File count
- Filename safety

Recommended formats:

```text
PDF

PNG

JPEG

JPG
```

Recommended maximum size:

```text
5 MB per file
```

Files must not be trusted solely based on extension.

---

# 8.15 Central Error Handling

All application errors must pass through one error middleware.

Recommended error classes:

```text
AppError

ValidationError

AuthenticationError

AuthorizationError

NotFoundError

ConflictError

BusinessRuleError

DatabaseError
```

---

## Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_XP",
    "message": "You do not have enough XP to redeem this reward",
    "details": null,
    "requestId": "req_12345"
  }
}
```

---

# 8.16 Standard Success Response

Single-resource response:

```json
{
  "success": true,
  "message": "Reward redeemed successfully",
  "data": {
    "id": "uuid"
  }
}
```

---

## Paginated Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 145,
    "totalPages": 8
  }
}
```

---

# 8.17 HTTP Status Code Standards

| Status | Usage |
|---|---|
| 200 | Successful read or update |
| 201 | Successful creation |
| 204 | Successful deletion with no body |
| 400 | Invalid request or business rule |
| 401 | Authentication required |
| 403 | Permission denied |
| 404 | Resource not found |
| 409 | Conflict or duplicate |
| 422 | Semantic validation failure |
| 429 | Rate limit exceeded |
| 500 | Unexpected server error |
| 503 | Database or dependent service unavailable |

---

# 8.18 API Versioning

All APIs should be versioned.

```text
/api/v1
```

Example:

```text
/api/v1/environmental/carbon-transactions
```

This allows future API changes without breaking existing clients.

---

# 8.19 Route Registration

Every module exposes an index file.

Example:

```text
src/modules/environmental/index.js
```

The application root imports only module entry points.

Conceptual structure:

```text
/api/v1/auth

/api/v1/environmental

/api/v1/social

/api/v1/governance

/api/v1/gamification

/api/v1/reports

/api/v1/settings
```

This prevents the application entry file from becoming unmanageable.

---

# 8.20 Dependency Direction

Dependencies must flow inward.

Correct:

```text
Route → Controller → Service → Repository
```

Incorrect:

```text
Repository → Controller
```

Incorrect:

```text
Service → Express Response
```

Incorrect:

```text
Repository → Notification Controller
```

Shared utilities may be imported by any layer, but they must remain domain-neutral.

---

# 8.21 Cross-Module Communication

One module must not directly import another module's repository.

Correct:

```text
CSR Service

↓

XP Service public interface
```

Incorrect:

```text
CSR Service

↓

XP Repository
```

This protects module boundaries.

---

# 8.22 Shared Service Contracts

The following shared service contracts should be frozen early:

```text
awardXp(employeeId, points, sourceType, sourceId, description)

deductXp(employeeId, points, sourceType, sourceId, description)

evaluateBadges(employeeId)

createNotification(payload)

recalculateDepartmentScore(departmentId, period)

getOrganizationSettings()
```

Each method should have a documented input and output contract.

---

# 8.23 Logging at the Backend Layers

Log important events at the service boundary.

Examples:

```text
User login succeeded

Compliance issue created

CSR participation approved

Challenge participation rejected

Reward redeemed

Badge awarded

ESG score recalculated
```

Do not log:

- Passwords
- JWTs
- Password hashes
- Full personal records
- Sensitive environment variables

---

# 8.24 Audit Logging

High-risk changes should create audit log records.

Recommended events:

- Organization-setting changes
- ESG-weight changes
- Role or permission changes
- Policy publication
- Compliance issue closure
- Manual XP adjustment
- Reward stock adjustment

An optional `audit_log` table may store:

```text
actor_employee_id

action

entity_type

entity_id

old_value_json

new_value_json

created_at
```

---

# 8.25 Backend Coding Standards

- Use async/await consistently
- Avoid deeply nested conditions
- Keep controllers small
- Keep service methods domain-focused
- Avoid duplicate Prisma queries
- Use centralized constants
- Use explicit error codes
- Never expose internal stack traces
- Use pagination for list endpoints
- Prefer immutable request data
- Use transactions for critical workflows
- Document public service interfaces

---

# 8.26 Backend Definition of Done

A backend feature is complete when:

- Route exists
- Authentication is applied
- Authorization is applied
- Zod validation exists
- Controller is thin
- Service contains business logic
- Repository contains Prisma logic
- Errors are standardized
- Success responses are standardized
- Unit tests cover service rules
- Integration tests cover API flow
- Permission checks are verified
- Database constraints are respected
- Logging is added for important actions

---

**Next Section:** **9. REST API Architecture and Complete API Catalogue**
# 9. REST API Architecture & Complete API Catalogue

## 9.1 API Design Philosophy

EcoSphere follows **RESTful API principles**.

The API is designed to be:

- Consistent
- Predictable
- Versioned
- Stateless
- Secure
- Easy to consume
- Easy to document
- Suitable for future mobile applications

All communication between the React frontend and Express backend occurs through REST APIs using JSON.

---

# 9.2 Base URL

```text
/api/v1
```

Example:

```text
GET /api/v1/departments
```

---

# 9.3 REST Resource Naming Rules

Use plural nouns.

Correct:

```text
/departments

/employees

/challenges

/rewards
```

Avoid:

```text
/getDepartments

/createChallenge

/deleteReward
```

---

# 9.4 HTTP Methods

| Method | Purpose |
|----------|----------|
| GET | Retrieve data |
| POST | Create new resource |
| PUT | Replace entire resource |
| PATCH | Partial update |
| DELETE | Archive/Delete resource |

---

# 9.5 Standard Request Headers

```http
Authorization: Bearer <JWT>

Content-Type: application/json

Accept: application/json
```

File uploads:

```http
Content-Type: multipart/form-data
```

---

# 9.6 Standard Success Response

```json
{
  "success": true,
  "message": "Challenge created successfully",
  "data": {}
}
```

---

# 9.7 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid request",
    "details": []
  }
}
```

---

# 9.8 Pagination Format

Every list endpoint should support pagination.

Query Parameters

```text
?page=1

&limit=20
```

Response

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 245,
    "totalPages": 13
  }
}
```

---

# 9.9 Filtering Standard

Every list endpoint should support filtering.

Example

```text
?department=IT

&status=ACTIVE

&from=2026-01-01

&to=2026-12-31
```

---

# 9.10 Sorting

Supported format

```text
?sort=createdAt

&order=desc
```

---

# 9.11 Search

Example

```text
?search=tree
```

Used for

- Departments
- Employees
- Challenges
- Rewards
- Policies

---

# 9.12 Authentication APIs

## Login

| Method | POST |
|----------|------|
| URL | /auth/login |

Purpose

Authenticate employee.

---

Validation

```text
email

password
```

---

Response

```text
JWT

Employee Details

Permissions
```

---

Authentication

Not Required

---

Status Codes

```
200

401
```

---

## Logout

| Method | POST |
|----------|------|
| URL | /auth/logout |

Authentication

Required

---

## Current User

| Method | GET |
|----------|------|
| URL | /auth/me |

Purpose

Returns logged-in employee.

---

# 9.13 Department APIs

## Get Departments

```
GET

/departments
```

---

Supports

```
Pagination

Search

Sorting
```

---

## Create Department

```
POST

/departments
```

Permission

```
department.create
```

---

Validation

```
Name

Code

Parent Department
```

---

## Update Department

```
PATCH

/departments/:id
```

---

## Archive Department

```
DELETE

/departments/:id
```

Soft delete only.

---

# 9.14 Environmental APIs

## Emission Factors

### Get All

```
GET

/environmental/emission-factors
```

---

### Create

```
POST

/environmental/emission-factors
```

---

### Update

```
PATCH

/environmental/emission-factors/:id
```

---

### Archive

```
DELETE

/environmental/emission-factors/:id
```

---

## Carbon Transactions

### Get All

```
GET

/environmental/carbon-transactions
```

Supports

```
Department

Date Range

Source

Pagination
```

---

### Create

```
POST

/environmental/carbon-transactions
```

Business Rule

If

```
Auto Calculation Enabled
```

then

```
Emission

=

Quantity × Emission Factor
```

---

## ESG Goals

```
GET

/environmental/goals
```

```
POST

/environmental/goals
```

```
PATCH

/environmental/goals/:id
```

---

# 9.15 Social APIs

## CSR Activities

```
GET

/social/csr-activities
```

---

```
POST

/social/csr-activities
```

---

```
PATCH

/social/csr-activities/:id
```

---

## Employee Participation

```
POST

/social/participation
```

---

Validation

```
Employee

CSR Activity

Proof File
```

---

Business Rule

If

```
Evidence Required

=

TRUE
```

then

```
Proof File

Mandatory
```

---

## Approval

```
PATCH

/social/participation/:id/approve
```

---

## Reject

```
PATCH

/social/participation/:id/reject
```

---

# 9.16 Governance APIs

## Policies

```
GET

/governance/policies
```

---

```
POST

/governance/policies
```

---

```
PATCH

/governance/policies/:id
```

---

## Policy Acknowledgement

```
POST

/governance/policies/:id/acknowledge
```

---

Business Rule

Employee

↓

One acknowledgement

↓

Per policy version

---

## Audits

```
GET

/governance/audits
```

---

```
POST

/governance/audits
```

---

```
PATCH

/governance/audits/:id
```

---

## Compliance Issues

```
GET

/governance/compliance-issues
```

---

```
POST

/governance/compliance-issues
```

---

Validation

```
Owner

Mandatory

Due Date

Mandatory
```

---

```
PATCH

/governance/compliance-issues/:id
```

---

# 9.17 Gamification APIs

## Challenges

```
GET

/gamification/challenges
```

---

```
POST

/gamification/challenges
```

---

```
PATCH

/gamification/challenges/:id
```

---

Lifecycle Validation

```
Draft

↓

Active

↓

Under Review

↓

Completed

↓

Archived
```

---

## Join Challenge

```
POST

/gamification/challenges/:id/join
```

---

## Submit Challenge

```
POST

/gamification/challenges/:id/submit
```

---

Validation

```
Evidence

Required

If challenge requires evidence.
```

---

## Challenge Approval

```
PATCH

/gamification/challenges/:id/approve
```

Business Logic

```
Award XP

↓

Update XP Ledger

↓

Evaluate Badges

↓

Leaderboard Update

↓

Notification
```

---

## Badges

```
GET

/gamification/badges
```

---

```
POST

/gamification/badges
```

---

Auto-awarded only.

Manual assignment not allowed.

---

## Rewards

```
GET

/gamification/rewards
```

---

```
POST

/gamification/rewards
```

---

## Redeem Reward

```
POST

/gamification/rewards/:id/redeem
```

Business Flow

```
Check XP

↓

Check Stock

↓

Deduct XP

↓

Update Stock

↓

Create Redemption

↓

Notification
```

---

## Leaderboard

```
GET

/gamification/leaderboard
```

Supports

```
Department

Monthly

Overall
```

---

# 9.18 Dashboard APIs

## Organization Dashboard

```
GET

/dashboard
```

Returns

```
Overall ESG Score

Department Rankings

Carbon Summary

Open Audits

Compliance Issues

Leaderboard

Goals Progress
```

---

## Department Dashboard

```
GET

/dashboard/departments/:id
```

Returns

```
Environmental

Social

Governance

Total Score

Charts
```

---

# 9.19 Report APIs

## Environmental Report

```
GET

/reports/environmental
```

---

## Social Report

```
GET

/reports/social
```

---

## Governance Report

```
GET

/reports/governance
```

---

## ESG Summary Report

```
GET

/reports/summary
```

---

## Custom Report

```
POST

/reports/custom
```

Request

```
Department

Date Range

Employee

Challenge

Category

Module
```

---

Export

```
PDF

Excel

CSV
```

---

# 9.20 Notification APIs

## Get Notifications

```
GET

/notifications
```

---

## Mark Read

```
PATCH

/notifications/:id/read
```

---

## Notification Settings

```
GET

/settings/notification-settings
```

---

```
PATCH

/settings/notification-settings
```

---

# 9.21 Settings APIs

## Organization Settings

```
GET

/settings/organization
```

---

```
PATCH

/settings/organization
```

---

Business Rule

Environmental Weight

+

Social Weight

+

Governance Weight

=

100

---

# 9.22 API Authentication Matrix

| API | Authentication |
|------|---------------|
| Login | ❌ |
| Logout | ✅ |
| Dashboard | ✅ |
| Reports | ✅ |
| Challenges | ✅ |
| Rewards | ✅ |
| Policies | ✅ |
| Departments | ✅ |
| Settings | ✅ |

---

# 9.23 API Authorization Matrix

| Module | Permission Required |
|---------|---------------------|
| Departments | department.manage |
| Environmental | environmental.manage |
| Social | social.manage |
| Governance | governance.manage |
| Gamification | gamification.manage |
| Reports | reports.export |
| Settings | settings.manage |

Read-only endpoints may use corresponding `.read` permissions.

---

# 9.24 API Versioning Strategy

Current version:

```
/api/v1
```

Future versions:

```
/api/v2
```

Older versions remain available until officially deprecated.

---

# 9.25 API Documentation Standard

Every endpoint should be documented with:

- HTTP Method
- URL
- Description
- Required Permission
- Authentication Requirement
- Request Body
- Path Parameters
- Query Parameters
- Success Response
- Error Responses
- Business Rules
- Example Request
- Example Response

This enables automatic generation of OpenAPI/Swagger documentation in future iterations.

---

# 9.26 API Design Principles Summary

The EcoSphere API is designed to be:

- RESTful
- Stateless
- Versioned
- Secure
- Permission-driven
- Consistent
- Filterable
- Paginated
- Extensible
- Enterprise-ready

Each module exposes only its own resources while interacting with other modules through shared service contracts rather than direct database access.

---

**Next Section:** **10. Frontend Architecture (React, Routing, Components, State Management & UI Structure)**
# 10. Frontend Architecture

## 10.1 Frontend Design Philosophy

The EcoSphere frontend is designed using a **Feature-Based Modular Architecture**.

Each business module owns:

- Pages
- Components
- API services
- Hooks
- Validation
- Types

instead of grouping everything by file type.

This enables four developers to work independently without editing the same files.

---

# 10.2 Frontend Technology Stack

| Technology | Purpose |
|------------|---------|
| React | UI Framework |
| React Router | Routing |
| Tailwind CSS | Styling |
| Axios | API Communication |
| Chart.js | Dashboards & Analytics |
| React Hook Form | Form Handling |
| Zod | Client-side Validation |
| React Context | Authentication & Global State |

---

# 10.3 Frontend Folder Structure

```text
frontend/

src/

├── assets/
│
├── layouts/
│
├── routes/
│
├── services/
│
├── hooks/
│
├── store/
│
├── utils/
│
├── constants/
│
├── types/
│
├── components/
│
│   ├── common/
│   ├── charts/
│   ├── forms/
│   ├── tables/
│   ├── feedback/
│   └── layout/
│
└── modules/

    ├── auth/
    ├── dashboard/
    ├── environmental/
    ├── social/
    ├── governance/
    ├── gamification/
    ├── reports/
    └── settings/
```

---

# 10.4 Module Ownership

Each feature owns everything related to itself.

Example:

```text
modules/environmental/

pages/

components/

services/

hooks/

validators/

types/
```

No other module should modify these files.

---

# 10.5 React Routing Structure

```text
/

↓

Login

↓

Dashboard

↓

Environmental

↓

Social

↓

Governance

↓

Gamification

↓

Reports

↓

Settings
```

---

Recommended URLs

```text
/

→ Login

/dashboard

/environmental

/social

/governance

/gamification

/reports

/settings
```

---

# 10.6 Route Groups

Public Routes

```text
/login
```

Protected Routes

```text
/dashboard

/environmental

/social

/governance

/gamification

/reports

/settings
```

---

Admin Routes

```text
/settings

/departments

/roles

/permissions
```

Protected using Role-Based Access Control.

---

# 10.7 Application Layout

```
+-------------------------------------------------------+
|                    Top Navigation                      |
+-------------+-----------------------------------------+
|             |                                         |
|             |                                         |
|             |                                         |
| Sidebar     |         Main Content Area               |
|             |                                         |
|             |                                         |
|             |                                         |
+-------------+-----------------------------------------+
|                 Footer (optional)                     |
+-------------------------------------------------------+
```

---

# 10.8 Sidebar Navigation

Recommended Menu

```text
Dashboard

Environmental

Social

Governance

Gamification

Reports

Settings

Logout
```

Menu items should be shown based on permissions.

Example

Employee

↓

Cannot see

```
Settings
```

---

# 10.9 Layout Components

Shared Layout

```
MainLayout
```

Contains

```
Navbar

Sidebar

Breadcrumb

Content

Footer
```

---

Authentication Layout

```
Login Page
```

Uses a simplified layout without sidebar.

---

# 10.10 Common Components

Reusable UI components.

```
Button

Input

Textarea

Select

Checkbox

Radio

Card

Badge

Avatar

Modal

Drawer

Tooltip

Dropdown

Pagination

Loader

Empty State

Confirm Dialog

Toast
```

These components must remain business-independent.

---

# 10.11 Table Components

Many screens require tables.

Create one reusable

```
DataTable
```

Supports

```
Sorting

Pagination

Search

Filtering

Row Actions

Loading

Empty State
```

Used by

- Departments
- Carbon Transactions
- Challenges
- Audits
- Policies
- Rewards
- Reports

---

# 10.12 Chart Components

Reusable wrappers around Chart.js.

Components

```
BarChart

LineChart

PieChart

DoughnutChart

RadarChart
```

Used in

Dashboard

Reports

Department Score

Carbon Trends

Leaderboard

---

# 10.13 Form Components

Shared form controls

```
TextField

PasswordField

DatePicker

FileUpload

NumberInput

SearchBox

RichTextEditor

MultiSelect

ToggleSwitch
```

---

# 10.14 Shared Hooks

```
useAuth()

useApi()

usePagination()

useSearch()

useDebounce()

useNotification()

usePermission()

useModal()

useUpload()
```

These hooks eliminate duplicate logic across modules.

---

# 10.15 Shared Services

```
api.js

auth.service.js

notification.service.js

upload.service.js
```

Responsibilities

```
Axios Instance

JWT Handling

Token Refresh

Global Error Handling

Request Interceptors

Response Interceptors
```

---

# 10.16 Shared Utilities

```
date.js

format.js

download.js

score.js

carbon.js

validators.js
```

Examples

```
Date Formatting

Percentage Formatting

Carbon Conversion

CSV Export

PDF Download

Score Calculation Helpers
```

---

# 10.17 Feature Modules

Each module owns:

```
Pages

Components

Services

Hooks

Validation

Types
```

Example

```
modules/social/

pages/

components/

services/

hooks/

validators/

types/
```

---

# 10.18 Environmental Pages

```
Carbon Dashboard

Emission Factors

Carbon Transactions

Goals

Goal Details
```

---

# 10.19 Social Pages

```
CSR Activities

Participation

Training

Diversity Metrics
```

---

# 10.20 Governance Pages

```
Policies

Acknowledgements

Audits

Compliance Issues
```

---

# 10.21 Gamification Pages

```
Challenges

Challenge Details

Rewards

Leaderboard

Badges

My Rewards
```

---

# 10.22 Dashboard Pages

```
Organization Dashboard

Department Dashboard

Personal Dashboard
```

---

# 10.23 Reports Pages

```
Environmental Report

Social Report

Governance Report

Summary Report

Custom Report Builder
```

---

# 10.24 Settings Pages

```
Departments

Categories

Notification Settings

Organization Settings

Roles

Permissions
```

---

# 10.25 State Management Strategy

The frontend uses **React Context** for global state and local component state where appropriate.

Global State:

```text
Authentication

Logged-in User

Permissions

Theme (optional)

Notification Count
```

Module State:

- Filters
- Forms
- Tables
- Dialogs
- Selected Records

Avoid storing all data globally to reduce unnecessary re-renders.

---

# 10.26 API Communication

All HTTP requests pass through a single Axios client.

Flow:

```text
React Page

↓

Feature Service

↓

Axios Client

↓

Express API
```

Benefits:

- Centralized JWT handling
- Common error handling
- Request logging
- Easy API URL changes

---

# 10.27 Error Handling

User-friendly error messages should be displayed.

Examples:

```text
Reward is out of stock.

You do not have enough XP.

Proof document is required.

Challenge deadline has passed.
```

Avoid exposing backend or database errors directly to users.

---

# 10.28 Loading States

Every API request should show an appropriate loading state.

Examples:

- Skeleton loaders for dashboards
- Spinner for form submission
- Disabled buttons during requests

This improves perceived performance and usability.

---

# 10.29 Responsive Design

The interface should support:

- Desktop (primary)
- Tablet
- Mobile (bonus)

Sidebar should collapse into a hamburger menu on smaller screens.

Tables should become horizontally scrollable when needed.

---

# 10.30 Accessibility

Follow basic accessibility practices:

- Semantic HTML
- Keyboard navigation
- Focus indicators
- ARIA labels where necessary
- Color contrast compliance

---

# 10.31 Frontend Security

- Store JWT securely (prefer HttpOnly cookies in production; for the hackathon, if using local storage, mitigate XSS risks).
- Sanitize user-generated content before rendering.
- Escape dynamic HTML.
- Validate file uploads before submission.
- Hide UI elements based on permissions, but always rely on backend authorization for enforcement.

---

# 10.32 UI Design Principles

The UI should emphasize:

- Simplicity
- Consistency
- Fast navigation
- Clear data visualization
- Minimal clicks
- Dashboard-first experience

Color suggestions:

- 🟢 Environmental
- 🔵 Social
- 🟣 Governance
- 🟠 Gamification

This creates a visual identity for each module.

---

# 10.33 Frontend Performance

Recommended optimizations:

- Lazy-load routes
- Code splitting
- Memoize expensive components
- Debounce search inputs
- Paginate large datasets
- Cache static configuration
- Minimize unnecessary re-renders

---

# 10.34 Frontend Definition of Done

A frontend feature is complete when:

- Page is implemented
- Responsive layout works
- API integration is complete
- Validation is implemented
- Loading and error states exist
- Permission checks are applied
- Shared components are reused
- Accessibility basics are met
- Styling is consistent with the design system

---

**Next Section:** **11. Authentication, Authorization (RBAC), Permission Matrix & Security Architecture**
# 11. Authentication, Authorization (RBAC) & Security Architecture

## 11.1 Security Architecture Overview

EcoSphere follows a layered security model.

Every request passes through multiple security checkpoints before reaching business logic.

```text
User

↓

Login

↓

JWT Authentication

↓

Authorization (RBAC)

↓

Permission Validation

↓

Business Rule Validation

↓

Database Access
```

Security is enforced at multiple layers rather than relying on the frontend alone.

---

# 11.2 Authentication Flow

The platform uses **JWT (JSON Web Token)** for stateless authentication.

Password hashing is handled using **bcrypt**.

---

## Login Flow

```text
Employee enters email & password

↓

Backend validates credentials

↓

Password hash compared using bcrypt

↓

JWT generated

↓

JWT returned to frontend

↓

Frontend stores token

↓

Authenticated requests include JWT
```

---

## JWT Payload

The JWT should contain only essential information.

Recommended payload:

```json
{
  "sub": "employee_id",
  "roleId": "role_id",
  "departmentId": "department_id",
  "permissions": [
    "environmental.read",
    "social.read"
  ],
  "iat": 1234567890,
  "exp": 1234569999
}
```

Avoid storing sensitive personal information inside the token.

---

# 11.3 Password Security

Passwords are never stored in plain text.

Recommended rules:

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character

Passwords are hashed using bcrypt before storage.

---

# 11.4 Session Management

The application is stateless.

The backend does not maintain server-side sessions.

Authentication relies entirely on valid JWTs.

Optional enhancements for production:

- Refresh tokens
- Token revocation list
- Device tracking

These are not mandatory for the hackathon.

---

# 11.5 Authorization Model

EcoSphere uses **Role-Based Access Control (RBAC)**.

Authorization is based on permissions rather than hardcoded role names.

Flow:

```text
Employee

↓

Role

↓

Permissions

↓

Allowed API Actions
```

---

# 11.6 Roles

Recommended default roles:

| Role | Description |
|------|-------------|
| Administrator | Full system access |
| ESG Manager | Manage ESG modules |
| Department Head | Department-level management |
| Auditor | Audit and compliance access |
| Employee | Participation and self-service |

Roles can be extended in future versions.

---

# 11.7 Permissions

Permissions are granular.

Examples:

```text
department.read

department.manage

environmental.read

environmental.manage

social.read

social.manage

governance.read

governance.manage

gamification.read

gamification.manage

reports.read

reports.export

settings.manage
```

Permissions are assigned to roles through the `role_permission` table.

---

# 11.8 Permission Matrix

| Feature | Admin | ESG Manager | Department Head | Auditor | Employee |
|---------|:-----:|:-----------:|:---------------:|:-------:|:--------:|
| View Dashboard | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Departments | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage Emission Factors | ✅ | ✅ | ❌ | ❌ | ❌ |
| View Carbon Reports | ✅ | ✅ | ✅ | ✅ | ❌ |
| Create CSR Activities | ✅ | ✅ | ❌ | ❌ | ❌ |
| Participate in CSR | ✅ | ✅ | ✅ | ❌ | ✅ |
| Approve CSR Participation | ✅ | ✅ | ✅ | ❌ | ❌ |
| Publish Policies | ✅ | ✅ | ❌ | ❌ | ❌ |
| Acknowledge Policies | ✅ | ✅ | ✅ | ✅ | ✅ |
| Manage Audits | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Compliance Issues | ✅ | ✅ | ❌ | ✅ | ❌ |
| Join Challenges | ✅ | ✅ | ✅ | ❌ | ✅ |
| Redeem Rewards | ✅ | ✅ | ✅ | ❌ | ✅ |
| Export Reports | ✅ | ✅ | ❌ | ✅ | ❌ |
| Manage Settings | ✅ | ❌ | ❌ | ❌ | ❌ |

This matrix serves as the default configuration and can be extended.

---

# 11.9 Authorization Flow

Every protected API follows the same flow.

```text
HTTP Request

↓

JWT Verification

↓

Employee Lookup

↓

Role Resolution

↓

Permission Validation

↓

Business Rule Validation

↓

Controller

↓

Service

↓

Repository
```

If permission validation fails:

```http
403 Forbidden
```

---

# 11.10 Department-Level Access

Some roles should only access data belonging to their department.

Example:

Department Head

↓

Can View

- Department employees
- Department carbon data
- Department ESG score
- Department compliance issues

Cannot View

- Other departments

Filtering is enforced in backend services.

---

# 11.11 Ownership Validation

Certain actions require ownership validation.

Example:

Employee can:

- View own challenge participation
- Redeem own rewards
- View own notifications

Employee cannot:

- Redeem rewards for another employee
- Approve own CSR participation
- Edit another employee's records

Ownership checks are implemented in the service layer.

---

# 11.12 Security Middleware

Security middleware stack:

```text
authenticate

↓

authorize

↓

validate

↓

controller
```

Responsibilities:

- Verify JWT
- Check token expiry
- Attach user context
- Validate permissions
- Reject unauthorized requests

---

# 11.13 API Security Best Practices

- Require HTTPS in production
- Validate all inputs
- Sanitize request data
- Rate-limit authentication endpoints
- Return generic login failure messages
- Do not expose internal IDs unnecessarily
- Log security events

---

# 11.14 Password Reset (Future Scope)

Suggested flow:

```text
Employee requests reset

↓

Email with secure token

↓

Token validation

↓

Password update

↓

Old tokens invalidated
```

Not mandatory for the hackathon.

---

# 11.15 File Upload Security

Proof files for CSR and Challenges must be validated.

Checks:

- Allowed MIME types
- Maximum size
- Filename sanitization
- Virus scanning (future enhancement)

Store uploaded files outside the public web root.

---

# 11.16 SQL Injection Protection

Using Prisma ORM provides parameterized queries by default.

Rules:

- Never concatenate SQL strings
- Never trust client input
- Validate all filters before querying

---

# 11.17 Cross-Site Scripting (XSS)

Prevent XSS by:

- Escaping dynamic HTML
- Sanitizing rich-text content
- Avoiding `dangerouslySetInnerHTML`
- Validating uploaded filenames

---

# 11.18 Cross-Site Request Forgery (CSRF)

If JWT is stored in HttpOnly cookies (recommended for production):

- Enable CSRF protection
- Use SameSite cookies

If JWT is stored in Authorization headers (hackathon approach), CSRF risk is reduced but XSS protection becomes more important.

---

# 11.19 Rate Limiting

Apply rate limits to sensitive endpoints.

Recommended:

| Endpoint | Limit |
|----------|-------|
| Login | 5 requests/minute/IP |
| File Upload | 20 requests/hour/user |
| Reward Redemption | 10 requests/hour/user |
| Report Export | 30 requests/hour/user |

---

# 11.20 Sensitive Data Handling

Never log:

- Passwords
- Password hashes
- JWTs
- Secret keys
- Database passwords

Mask personally identifiable information where appropriate.

---

# 11.21 Audit Logging

Record security-sensitive events.

Examples:

- Successful login
- Failed login
- Permission denied
- Role changes
- Organization setting updates
- Manual XP adjustments

Each log should include:

- Actor
- Action
- Timestamp
- Entity affected
- Result

---

# 11.22 Business Rule Security

Critical workflows require additional validation.

Examples:

### Reward Redemption

- Employee has enough XP
- Reward is active
- Reward stock > 0

### Challenge Approval

- Reviewer has permission
- Challenge is in correct state
- Evidence provided if required

### Compliance Issue

- Owner assigned
- Due date present

---

# 11.23 Error Handling Security

Do not reveal internal implementation details.

Incorrect:

```text
Prisma Error:
Foreign key constraint failed on employee_id
```

Correct:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_EMPLOYEE",
    "message": "The specified employee could not be found."
  }
}
```

---

# 11.24 Security Checklist

Before deployment:

- JWT authentication working
- Password hashing enabled
- RBAC enforced
- Permission checks verified
- Input validation complete
- File upload validation complete
- Rate limiting enabled
- Error responses sanitized
- Audit logging implemented
- Environment variables secured

---

# 11.25 Authentication & Authorization Definition of Done

The security layer is complete when:

- Users can log in securely
- Passwords are hashed
- JWTs are validated
- Roles are assigned
- Permissions are enforced
- Department-level access works
- Ownership validation works
- Sensitive operations are protected
- Audit logs are generated
- Unauthorized access is consistently blocked

---

**Next Section:** **12. Business Workflows, State Machines & Core Business Rules**
# 12. Business Workflows, State Machines & Core Business Rules

## 12.1 Overview

The EcoSphere platform revolves around a set of business workflows that connect all ESG modules.

Instead of isolated CRUD operations, each workflow represents a complete business process.

```
Master Configuration

↓

Daily Operations

↓

Environmental

↓

Social

↓

Governance

↓

Gamification

↓

Department Score

↓

Organization ESG Score

↓

Reports & Dashboard
```

---

# 12.2 Master Configuration Workflow

This workflow initializes the ESG platform.

```
Administrator

↓

Departments

↓

Categories

↓

Emission Factors

↓

Products

↓

Goals

↓

Policies

↓

Badges

↓

Rewards

↓

Organization Settings
```

### Business Rules

- Department codes must be unique.
- Category names must be unique within their type.
- Organization ESG weights must total **100%**.
- Only administrators can modify master configuration.

---

# 12.3 Carbon Emission Workflow

```
ERP Operation
(Purchase / Manufacturing / Expense / Fleet)

↓

Auto Emission Enabled?

↓

YES

↓

Retrieve Emission Factor

↓

Calculate Emission

↓

Create Carbon Transaction

↓

Update Department Environmental Score

↓

Dashboard Refresh
```

### Formula

```
Emission

=

Quantity

×

Emission Factor
```

---

### Business Rules

- Quantity must be greater than zero.
- Emission Factor must exist and be active.
- Carbon Transaction cannot be edited after creation (corrections create a new transaction).
- Every transaction belongs to exactly one department.

---

# 12.4 Sustainability Goal Workflow

```
Administrator

↓

Create Goal

↓

Assign Department

↓

Target Value

↓

Track Progress

↓

Completed

↓

Dashboard
```

### Goal States

```
Draft

↓

Active

↓

Completed

↓

Expired
```

---

### Business Rules

- Target value must be positive.
- Deadline must be in the future.
- Completed goals become read-only.

---

# 12.5 CSR Activity Workflow

```
ESG Manager

↓

Create CSR Activity

↓

Publish

↓

Employees Register

↓

Participation Submitted

↓

Approval

↓

Award Points

↓

Department Social Score Updated
```

---

### CSR Activity States

```
Draft

↓

Published

↓

Completed

↓

Cancelled
```

---

### Employee Participation States

```
Registered

↓

Pending Review

↓

Approved

↓

Rejected
```

---

### Business Rules

- Employees can participate only once.
- Proof is mandatory if the organization setting requires evidence.
- Only approved participation awards points.
- Approved participation updates the XP Ledger.

---

# 12.6 Training Completion Workflow

```
Administrator

↓

Create Training

↓

Assign Employees

↓

Employee Completes Training

↓

Completion Recorded

↓

Social Score Updated
```

---

### Business Rules

- Completion percentage must be between 0 and 100.
- Training can contribute to diversity or engagement metrics.
- Completed training may unlock badges.

---

# 12.7 Policy Management Workflow

```
Administrator

↓

Create Policy

↓

Publish

↓

Employees Receive Notification

↓

Acknowledgement

↓

Compliance Dashboard Updated
```

---

### Policy Lifecycle

```
Draft

↓

Published

↓

Archived
```

---

### Policy Acknowledgement Lifecycle

```
Pending

↓

Acknowledged

↓

Completed
```

If acknowledgement is overdue:

```
Pending

↓

Overdue

↓

Reminder Notification
```

---

### Business Rules

- Employees acknowledge each policy version only once.
- New policy versions require new acknowledgements.
- Archived policies remain available for historical reporting.

---

# 12.8 Audit Workflow

```
Create Audit

↓

Assign Auditor

↓

Perform Audit

↓

Create Findings

↓

Compliance Issues

↓

Close Audit
```

---

### Audit States

```
Planned

↓

In Progress

↓

Completed

↓

Cancelled
```

---

### Business Rules

- Completed audits cannot return to "In Progress".
- Completed audits should contain findings or ratings.
- One audit can generate multiple compliance issues.

---

# 12.9 Compliance Issue Workflow

```
Audit

↓

Create Issue

↓

Assign Owner

↓

Due Date

↓

Open

↓

In Progress

↓

Resolved

↓

Closed
```

---

### State Diagram

```
Open

↓

In Progress

↓

Resolved

↓

Closed
```

---

### Business Rules

Mandatory:

```
Owner

Due Date
```

If

```
Current Date

>

Due Date

AND

Status != Closed
```

↓

```
Flag Overdue

↓

Generate Notification
```

---

# 12.10 Challenge Workflow

```
ESG Manager

↓

Create Challenge

↓

Draft

↓

Activate

↓

Employees Join

↓

Submit Evidence

↓

Review

↓

Approve

↓

Award XP

↓

Leaderboard Update
```

---

### Challenge Lifecycle

```
Draft

↓

Active

↓

Under Review

↓

Completed

↓

Archived
```

---

### Allowed Transitions

```
Draft → Active

Active → Under Review

Under Review → Completed

Any State → Archived
```

---

### Invalid Transitions

```
Completed → Active

Archived → Active

Draft → Completed
```

---

### Business Rules

- Deadline must be after start date.
- Employees join only once.
- Proof required if challenge requires evidence.
- XP awarded only after approval.

---

# 12.11 Challenge Participation Workflow

```
Join Challenge

↓

Work In Progress

↓

Submit

↓

Pending Review

↓

Approved

↓

XP Awarded

↓

Badge Evaluation

↓

Leaderboard Update
```

---

### Participation States

```
Joined

↓

Submitted

↓

Pending

↓

Approved

↓

Rejected
```

---

### Business Rules

- Employees cannot submit after the deadline.
- Evidence is mandatory when configured.
- Approval triggers XP Ledger updates.
- Rejected submissions may be resubmitted before the deadline.

---

# 12.12 Badge Auto-Award Workflow

```
XP Updated

↓

Evaluate Badge Rules

↓

Criteria Met?

↓

YES

↓

Award Badge

↓

Create Employee Badge

↓

Optional Bonus XP

↓

Notification
```

---

### Business Rules

Badge auto-award occurs only when:

```
Organization Setting

↓

Badge Auto Award

↓

Enabled
```

Employees cannot receive the same badge twice.

---

# 12.13 Reward Redemption Workflow

```
Employee

↓

Choose Reward

↓

Check XP Balance

↓

Check Reward Stock

↓

Deduct XP

↓

Reduce Stock

↓

Create Redemption Record

↓

Notification
```

---

### Atomic Transaction

```
Validate XP

↓

Validate Stock

↓

Create Redemption

↓

XP Ledger Debit

↓

Update Employee XP

↓

Update Stock

↓

Commit
```

If any step fails:

```
Rollback Transaction
```

---

### Business Rules

- Stock cannot become negative.
- Employee XP cannot become negative.
- Redemption history is immutable.

---

# 12.14 Department Score Calculation Workflow

```
Environmental Score

+

Social Score

+

Governance Score

↓

Weighted Formula

↓

Department Total Score

↓

Dashboard
```

---

### Default Formula

```
Environmental

40%

+

Social

30%

+

Governance

30%
```

Weights are configurable.

---

### Business Rules

- Weight total must equal **100**.
- Score range is **0–100**.
- Recalculated after relevant business events.

---

# 12.15 Organization ESG Score Workflow

```
Department Scores

↓

Weighted Average

↓

Organization ESG Score

↓

Dashboard

↓

Reports
```

---

### Formula

```
Organization ESG Score

=

Average of Department Scores
```

Future enhancement:

Department weighting by employee count.

---

# 12.16 Notification Workflow

Business events generate notifications.

```
Business Event

↓

Notification Service

↓

Notification Settings

↓

In-App

↓

Email

↓

Notification Record
```

---

### Notification Triggers

- Compliance issue created
- Compliance issue overdue
- CSR approved/rejected
- Challenge approved/rejected
- Policy reminder
- Badge unlocked
- Reward redeemed

---

# 12.17 Dashboard Refresh Workflow

```
Business Event

↓

Update Transaction Tables

↓

Recalculate Scores

↓

Dashboard Queries

↓

Updated Charts
```

Dashboard data should reflect recent committed transactions without manual refresh logic in business services.

---

# 12.18 Report Generation Workflow

```
User Chooses Filters

↓

Validate Filters

↓

Aggregate Data

↓

Generate Report

↓

Export

↓

Download
```

Supported formats:

- PDF
- Excel
- CSV

---

# 12.19 Cross-Module Business Rules

| Rule | Modules |
|------|---------|
| CSR approval awards XP | Social + Gamification |
| Challenge approval awards XP | Gamification |
| XP update evaluates badges | Gamification |
| Badge unlock creates notification | Gamification + Notification |
| Compliance overdue creates notification | Governance + Notification |
| Carbon transaction updates department score | Environmental + Dashboard |
| Department score updates organization score | Dashboard + Reports |

Cross-module interactions must occur through shared service interfaces, not direct repository access.

---

# 12.20 Business Rule Summary

### Environmental

- Auto emission calculation supported
- Emission factor required
- Carbon transactions immutable

### Social

- One participation per employee
- Evidence configurable
- Approval required for points

### Governance

- Policy acknowledgement per version
- Owner and due date mandatory
- Overdue issues flagged automatically

### Gamification

- Challenge lifecycle enforced
- XP tracked through ledger
- Badge auto-award configurable
- Reward redemption atomic

### Dashboard

- Department scores calculated automatically
- Organization score derived from department scores
- Reports generated from normalized data

---

# 12.21 Workflow Definition of Done

Business workflows are complete when:

- All lifecycle transitions are validated
- Invalid state transitions are blocked
- Cross-module interactions use service contracts
- Notifications are triggered correctly
- Department and organization scores update automatically
- Transactions are atomic where required
- All business rules from the problem statement are enforced

---

**Next Section:** **13. Dashboard, Analytics, Reporting & Notification Architecture**
# 13. Dashboard, Analytics, Reporting & Notification Architecture

## 13.1 Overview

The Dashboard is the **central decision-making interface** of EcoSphere.

It combines Environmental, Social, Governance, and Gamification data into one unified ESG view.

Unlike CRUD screens, dashboards are **analytics-driven** and focus on KPIs, trends, and actionable insights.

---

# 13.2 Dashboard Architecture

```text
                  PostgreSQL
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 Environmental    Social Data    Governance
      Data            Data           Data
        │              │              │
        └──────────────┼──────────────┘
                       │
               Dashboard Service
                       │
         Score Aggregation Engine
                       │
         Analytics & KPI Calculator
                       │
                REST API Layer
                       │
                   React UI
                       │
                 Chart.js Widgets
```

The dashboard **does not calculate values in the frontend**.

All calculations occur in the backend.

---

# 13.3 Dashboard Types

The platform contains three dashboard levels.

## 1. Organization Dashboard

Visible to:

- Administrator
- ESG Manager

Displays:

- Overall ESG Score
- Organization Carbon Emissions
- Department Rankings
- Open Compliance Issues
- Active Challenges
- Reward Redemptions
- Leaderboard
- Goal Progress

---

## 2. Department Dashboard

Visible to:

- Department Head
- ESG Manager
- Administrator

Displays:

- Department ESG Score
- Department Carbon Emissions
- CSR Participation
- Training Completion
- Department Challenges
- Compliance Issues
- Goal Progress

---

## 3. Employee Dashboard

Visible to:

- Employee

Displays:

- Personal XP
- Earned Badges
- Joined Challenges
- Reward Balance
- CSR Participation
- Assigned Policies
- Notifications

---

# 13.4 Dashboard KPI Cards

Top summary cards:

```
Overall ESG Score

Total Carbon Emissions

Open Compliance Issues

CSR Participation %

Training Completion %

Active Challenges

Rewards Redeemed

Employee Engagement Score
```

KPI cards should update from backend APIs.

---

# 13.5 Environmental Dashboard

Displays:

### KPI Cards

```
Carbon Emissions

Emission Reduction

Goal Achievement %

Departments Meeting Goals
```

---

### Charts

```
Monthly Carbon Trend

Carbon by Department

Carbon by Source

Goal Progress
```

---

### Tables

```
Recent Carbon Transactions

Goals

Emission Factors
```

---

# 13.6 Social Dashboard

Displays

### KPIs

```
CSR Activities

Participation Rate

Training Completion

Diversity Score
```

---

### Charts

```
CSR Participation Trend

Department Participation

Training Completion

Diversity Metrics
```

---

### Tables

```
Upcoming CSR Activities

Recent Participation

Training Status
```

---

# 13.7 Governance Dashboard

Displays

### KPIs

```
Policies

Pending Acknowledgements

Open Audits

Open Compliance Issues
```

---

### Charts

```
Audit Status

Compliance Severity

Policy Completion

Issue Trend
```

---

### Tables

```
Latest Audits

Compliance Issues

Policy Status
```

---

# 13.8 Gamification Dashboard

Displays

### KPIs

```
Active Challenges

XP Earned

Badges Awarded

Rewards Redeemed
```

---

### Charts

```
Leaderboard

XP Distribution

Badge Distribution

Challenge Completion
```

---

### Tables

```
Latest Challenges

Recent Badges

Reward Catalog
```

---

# 13.9 ESG Score Dashboard

Main visualization

```
Environmental

Social

Governance

↓

Weighted Formula

↓

Overall ESG Score
```

Visualization

```
Gauge

Radar Chart

Score Cards
```

---

# 13.10 Leaderboard

Leaderboard supports

```
Overall

Department

Monthly

Quarterly

Yearly
```

Ranking based on

```
XP

Completed Challenges

CSR Participation
```

---

# 13.11 Department Ranking

Departments ranked by

```
Environmental Score

Social Score

Governance Score

Overall ESG Score
```

Useful for management benchmarking.

---

# 13.12 Analytics Layer

The analytics service calculates

```
ESG Score

Participation %

Completion %

Compliance %

Goal Progress

Carbon Trend

Reward Usage
```

Business logic remains in backend services.

---

# 13.13 Dashboard Data Flow

```
Business Event

↓

Transaction Table

↓

Department Score Update

↓

Organization Score Update

↓

Dashboard API

↓

React

↓

Chart.js
```

No chart performs calculations independently.

---

# 13.14 Report Architecture

Report Generation Flow

```
User

↓

Select Report

↓

Apply Filters

↓

Backend Validation

↓

Analytics Query

↓

Report Builder

↓

Export

↓

Download
```

---

# 13.15 Available Reports

Environmental

```
Carbon Transactions

Emission Summary

Department Carbon

Goal Progress
```

---

Social

```
CSR Activities

Participation

Training

Diversity
```

---

Governance

```
Policies

Acknowledgements

Audits

Compliance Issues
```

---

ESG Summary

```
Environmental

Social

Governance

Department Ranking

Overall Score
```

---

Custom Report

Users choose

```
Module

Department

Employee

Challenge

Date Range

Category
```

Output

```
PDF

Excel

CSV
```

---

# 13.16 Report Filters

Every report supports

```
Department

Date Range

Employee

Challenge

Category

Module
```

Additional filters can be added later without changing the report engine.

---

# 13.17 Export Architecture

```
Frontend

↓

Report API

↓

Backend Report Builder

↓

Generate File

↓

Temporary Storage

↓

Download Link
```

Generated reports should include metadata:

- Generated by
- Generated on
- Applied filters

---

# 13.18 Notification Architecture

Notification Flow

```text
Business Event
        │
        ▼
Notification Service
        │
        ▼
Notification Settings
        │
 ┌──────┴─────────┐
 ▼                ▼
In-App         Email
        │
        ▼
Notification Table
```

Notification generation is centralized to ensure consistency across modules.

---

# 13.19 Notification Types

Required notifications:

- New compliance issue raised
- Compliance issue overdue
- CSR approval
- CSR rejection
- Challenge approval
- Challenge rejection
- Policy acknowledgement reminder
- Badge unlocked
- Reward redeemed

---

# 13.20 Notification States

```
Pending

↓

Sent

↓

Read
```

Failed notifications remain available for retry.

---

# 13.21 Dashboard Performance Strategy

To ensure fast dashboards:

- Use aggregated `department_score` table
- Paginate recent activity tables
- Cache infrequently changing master data
- Query only required fields
- Avoid repeated full-table scans
- Use indexed date ranges

Heavy calculations should not execute on every page load.

---

# 13.22 Report Performance Strategy

Large reports should:

- Stream data where practical
- Use indexed filters
- Avoid loading unnecessary relationships
- Generate exports on the backend

Custom reports should validate filters before execution to prevent expensive queries.

---

# 13.23 Analytics Integrity

Dashboard and report values must always be derived from committed transactional data.

Examples:

- Carbon totals from `carbon_transaction`
- XP from `xp_ledger`
- Department score from `department_score`
- Compliance counts from `compliance_issue`

No dashboard values should rely solely on frontend calculations.

---

# 13.24 Future Analytics Enhancements

Potential extensions:

- Predictive ESG trends
- AI-powered sustainability recommendations
- Carbon forecasting
- Goal achievement forecasting
- Benchmarking against previous years
- Department performance heatmaps

These enhancements can be added without changing the normalized database design.

---

# 13.25 Dashboard & Reporting Definition of Done

This module is complete when:

- Organization dashboard is operational
- Department dashboard is operational
- Employee dashboard is operational
- All ESG KPIs display correctly
- Charts are populated from backend APIs
- Reports support required filters
- PDF, Excel, and CSV exports work
- Notifications are generated from business events
- Dashboard performance remains responsive with growing data

---

**Next Section:** **14. Logging, Error Handling, Performance Optimization, Caching, Scalability, Testing & Deployment Strategy**
# 14. Logging, Error Handling, Performance Optimization, Caching, Scalability, Testing & Deployment Strategy

## 14.1 Overview

This chapter defines the operational architecture of EcoSphere.

It covers:

- Logging
- Error handling
- Performance optimization
- Caching
- Scalability
- Testing
- Deployment

These practices ensure the application remains maintainable and production-ready.

---

# 14.2 Logging Strategy

Logging should help developers diagnose issues without exposing sensitive information.

The application should use structured logging.

Recommended log levels:

| Level | Purpose |
|--------|---------|
| INFO | Normal business events |
| WARN | Recoverable issues |
| ERROR | Unexpected failures |
| DEBUG | Development only |

---

## Log Categories

### Authentication

Examples:

```text
User Login

User Logout

Invalid Login

Expired Token
```

---

### Business Events

Examples

```text
CSR Approved

Reward Redeemed

Badge Awarded

Compliance Issue Created

Policy Published
```

---

### Database

Examples

```text
Migration Started

Migration Completed

Transaction Failed
```

---

### System

Examples

```text
Application Started

Server Shutdown

Configuration Loaded
```

---

# 14.3 Log Format

Recommended structured log

```json
{
  "timestamp":"2026-07-12T10:15:20Z",
  "level":"INFO",
  "module":"Governance",
  "action":"Compliance Issue Created",
  "employeeId":"EMP001",
  "requestId":"REQ12345"
}
```

Structured logs are easier to search and analyze.

---

# 14.4 What Should Never Be Logged

Never log:

- Passwords
- Password hashes
- JWT tokens
- Database passwords
- Secret keys
- Uploaded confidential documents

Mask personally identifiable information where appropriate.

---

# 14.5 Error Handling Strategy

The application uses centralized error handling.

Flow:

```text
Request

↓

Controller

↓

Service

↓

Repository

↓

Exception

↓

Global Error Handler

↓

Standard Response
```

No controller should return raw exceptions.

---

# 14.6 Error Categories

| Error Type | Example |
|------------|---------|
| Validation | Missing required field |
| Authentication | Invalid JWT |
| Authorization | Permission denied |
| Business Rule | Insufficient XP |
| Database | Foreign key violation |
| System | Unexpected server error |

---

# 14.7 Standard Error Codes

Examples:

```text
VALIDATION_ERROR

AUTHENTICATION_FAILED

ACCESS_DENIED

RESOURCE_NOT_FOUND

INSUFFICIENT_XP

OUT_OF_STOCK

INVALID_STATE

DATABASE_ERROR

INTERNAL_SERVER_ERROR
```

Clients should rely on error codes rather than parsing messages.

---

# 14.8 Performance Optimization

Key strategies:

- Database indexing
- Pagination
- Lazy loading
- Efficient joins
- Cached master data
- Minimized payload sizes
- Avoid N+1 queries

---

## Pagination

All list APIs must support:

```text
?page=

&limit=
```

Default page size:

```text
20
```

Maximum page size:

```text
100
```

---

## Query Optimization

Repositories should:

- Select only required fields
- Filter before joining
- Use indexed columns
- Avoid unnecessary nested includes

---

# 14.9 Caching Strategy

Caching should be applied selectively.

Suitable candidates:

- Organization settings
- Notification settings
- Categories
- Emission factors
- Badge definitions
- Reward catalog

Frequently changing transactional data should not be cached.

---

## Cache Invalidation

Whenever master data changes:

```text
Update Database

↓

Clear Cache

↓

Serve Fresh Data
```

---

# 14.10 Scalability Considerations

Although implemented as a modular monolith, the architecture supports future growth.

Scalability features:

- Feature-based modules
- Repository abstraction
- Service interfaces
- Independent database ownership
- Stateless APIs

Future migration to microservices would require minimal domain changes.

---

# 14.11 Background Processing (Future Scope)

Potential asynchronous tasks:

- Email notifications
- Large report generation
- Scheduled score recalculation
- Reminder notifications

For the hackathon, these may run synchronously for simplicity.

---

# 14.12 Testing Strategy

Testing should cover multiple layers.

### Unit Tests

Target:

- Services
- Utility functions
- Score calculations
- Validation rules

---

### Integration Tests

Target:

- REST APIs
- Database interactions
- Authentication flow
- Transactions

---

### Manual Testing

Verify:

- Dashboard
- Reports
- Challenge workflow
- Reward redemption
- Notifications
- Role permissions

---

# 14.13 Suggested Test Scenarios

### Environmental

- Create emission factor
- Create carbon transaction
- Verify emission calculation

---

### Social

- Register for CSR
- Upload proof
- Approve participation
- Verify XP

---

### Governance

- Publish policy
- Acknowledge policy
- Create audit
- Create compliance issue

---

### Gamification

- Join challenge
- Submit evidence
- Approve challenge
- Award badge
- Redeem reward

---

# 14.14 Deployment Architecture

Recommended deployment:

```text
React Frontend

↓

Node.js Backend

↓

PostgreSQL Database
```

For the hackathon, all components may run locally or on a single VPS.

---

# 14.15 Environment Configuration

Required environment variables:

```text
DATABASE_URL

JWT_SECRET

PORT

NODE_ENV

UPLOAD_PATH

EMAIL_HOST

EMAIL_PORT

EMAIL_USER

EMAIL_PASSWORD
```

`.env` must never be committed.

Provide `.env.example` in the repository.

---

# 14.16 CI/CD (Optional)

Suggested GitHub Actions pipeline:

```text
Install Dependencies

↓

Run Lint

↓

Run Tests

↓

Build Frontend

↓

Generate Prisma Client

↓

Verify Migrations

↓

Deploy
```

For the hackathon, manual deployment is acceptable.

---

# 14.17 Backup Strategy (Production Consideration)

Although not required for the hackathon:

- Regular PostgreSQL backups
- Versioned report exports
- Audit log retention

This ensures recoverability in production.

---

# 14.18 Monitoring (Future Scope)

Potential metrics:

- API response times
- Error rates
- Database query duration
- Active users
- Notification failures
- Report generation time

---

# 14.19 Security Checklist

Before final submission:

- JWT authentication working
- RBAC enforced
- Password hashing enabled
- Validation complete
- SQL injection protection
- XSS mitigation
- Secure file uploads
- Environment variables configured
- Standard error responses implemented

---

# 14.20 Operational Definition of Done

The operational architecture is complete when:

- Logging is centralized
- Errors are standardized
- Performance optimizations are applied
- Master data caching works
- Testing covers critical workflows
- Deployment instructions are documented
- Environment configuration is complete
- The application runs consistently across team members' environments

---

# 14.21 Hackathon Readiness Checklist

Before the final demo:

- Database migrations run successfully
- Seed data loads correctly
- Backend starts without errors
- Frontend builds successfully
- Authentication works
- Core ESG workflows are functional
- Dashboards display live data
- Reports export correctly
- Notifications trigger as expected
- Git history shows continuous progress from all team members

---

**Next Section:** **15. Team Division, Git Strategy, Integration Plan, 8-Hour Timeline & AI Prompts for the Four Developers**
# 15. Team Division, Git Strategy, Integration Plan & 8-Hour Execution Plan

## 15.1 Development Philosophy

The hackathon has **4 independent developers**.

The architecture is designed so every developer owns an entire **vertical slice**:

- Frontend
- Backend
- Database Models
- Business Logic
- REST APIs
- Validation
- Testing

No developer should wait for another developer before starting work.

---

# 15.2 Team Structure

| Developer | Module |
|------------|--------|
| Developer 1 | Environmental |
| Developer 2 | Social |
| Developer 3 | Governance |
| Developer 4 | Gamification |

Shared modules are created only once at project setup.

---

# 15.3 Shared Ownership (Created During Hour 0–1)

These folders should **not** be modified by everyone throughout the hackathon.

| Shared Folder | Owner |
|--------------|-------|
| prisma/ | Team Lead |
| config/ | Team Lead |
| middleware/ | Team Lead |
| shared/ | Team Lead |
| components/common | Frontend Lead |
| layouts | Frontend Lead |
| services/api.js | Frontend Lead |
| auth module | Team Lead |

After initial setup, these folders should remain frozen unless the team agrees on changes.

---

# 15.4 Developer 1 – Environmental Module

## Responsibilities

- Emission Factors
- Carbon Transactions
- Product ESG Profiles
- ESG Goals
- Environmental Dashboard APIs

---

## Database Ownership

```text
emission_factor

product_esg_profile

carbon_transaction

esg_goal
```

---

## Backend Ownership

```text
controllers/environmental

services/environmental

repositories/environmental

routes/environmental

validators/environmental
```

---

## Frontend Ownership

```text
modules/environmental/
```

Pages:

- Emission Factors
- Carbon Transactions
- ESG Goals
- Environmental Dashboard

---

## APIs Exposed

```text
GET /environmental/emission-factors

POST /environmental/emission-factors

GET /environmental/carbon-transactions

POST /environmental/carbon-transactions

GET /environmental/goals

POST /environmental/goals
```

---

## APIs Consumed

```text
GET /settings/organization
```

Used to retrieve ESG configuration.

---

# 15.5 Developer 2 – Social Module

## Responsibilities

- CSR Activities
- Employee Participation
- Diversity Metrics
- Training
- Social Dashboard

---

## Database Ownership

```text
csr_activity

employee_participation

diversity_metric

training

training_completion
```

---

## Backend Ownership

```text
controllers/social

services/social

repositories/social

validators/social

routes/social
```

---

## Frontend Ownership

```text
modules/social/
```

Pages:

- CSR Activities
- Participation
- Training
- Diversity Dashboard

---

## APIs Exposed

```text
GET /social/csr-activities

POST /social/csr-activities

POST /social/participation

PATCH /social/participation/:id/approve
```

---

## APIs Consumed

```text
awardXp()

evaluateBadges()

createNotification()
```

These shared service contracts are used after CSR approval.

---

# 15.6 Developer 3 – Governance Module

## Responsibilities

- ESG Policies
- Policy Acknowledgements
- Audits
- Compliance Issues
- Governance Dashboard

---

## Database Ownership

```text
esg_policy

policy_acknowledgement

audit

compliance_issue
```

---

## Backend Ownership

```text
controllers/governance

services/governance

repositories/governance

routes/governance

validators/governance
```

---

## Frontend Ownership

```text
modules/governance/
```

Pages:

- Policies
- Acknowledgements
- Audits
- Compliance Issues

---

## APIs Exposed

```text
GET /governance/policies

POST /governance/policies

POST /governance/policies/:id/acknowledge

GET /governance/audits

POST /governance/compliance-issues
```

---

## APIs Consumed

```text
createNotification()
```

---

# 15.7 Developer 4 – Gamification Module

## Responsibilities

- Challenges
- Challenge Participation
- XP Ledger
- Badges
- Rewards
- Leaderboard

---

## Database Ownership

```text
challenge

challenge_participation

xp_ledger

badge

employee_badge

reward

reward_redemption
```

---

## Backend Ownership

```text
controllers/gamification

services/gamification

repositories/gamification

routes/gamification

validators/gamification
```

---

## Frontend Ownership

```text
modules/gamification/
```

Pages:

- Challenges
- Leaderboard
- Rewards
- Badges

---

## APIs Exposed

```text
POST /gamification/challenges

POST /gamification/challenges/:id/join

POST /gamification/rewards/:id/redeem

GET /gamification/leaderboard
```

---

## Shared Services Owned

Developer 4 should also own:

```text
XP Service

Badge Service

Leaderboard Service
```

These services are consumed by other modules.

---

# 15.8 Shared Service Contracts

The following interfaces must be agreed upon before development starts.

```text
awardXp(employeeId, points, sourceType)

deductXp(employeeId, points)

evaluateBadges(employeeId)

createNotification(payload)

recalculateDepartmentScore(departmentId)

getOrganizationSettings()
```

No module should bypass these contracts.

---

# 15.9 Git Branch Strategy

Main branches:

```text
main

develop
```

Feature branches:

```text
feature/environmental

feature/social

feature/governance

feature/gamification
```

Hotfix branches (if required):

```text
hotfix/<issue-name>
```

---

# 15.10 Commit Convention

Use descriptive commit messages.

Examples:

```text
feat(environmental): add emission factor CRUD

feat(social): implement CSR participation workflow

feat(governance): create audit module

feat(gamification): implement reward redemption

fix(auth): resolve JWT validation

docs: update architecture

refactor(shared): optimize notification service
```

---

# 15.11 Pull Request Convention

PR title format:

```text
[Environmental] Carbon Transaction Module

[Social] CSR Participation Approval

[Governance] Compliance Issue Workflow

[Gamification] Reward Redemption
```

Each PR should include:

- Summary
- Screenshots (if UI)
- Testing performed
- Known limitations

---

# 15.12 Continuous Push Strategy

Odoo evaluates Git history.

Every developer should push at least every **1–2 hours**.

Example timeline:

```text
09:00

Project Setup

↓

10:30

Basic CRUD

↓

12:00

Business Logic

↓

14:00

Integration

↓

15:30

Testing

↓

16:30

Final Polish
```

Each push should represent meaningful progress.

---

# 15.13 Integration Plan

## Hour 0–1

Shared setup:

- Initialize repository
- Configure PostgreSQL
- Configure Prisma
- Create base schema
- Implement authentication skeleton
- Create common layout
- Configure routing

Application should build successfully.

---

## Hour 1–2

Developers work independently:

Developer 1

- Emission Factors

Developer 2

- CSR Activities

Developer 3

- Policies

Developer 4

- Challenges

Shared owner:

- Roles
- Permissions
- Seed data

---

## Hour 2–4

Business logic:

Developer 1

- Carbon Transactions

Developer 2

- Participation Workflow

Developer 3

- Audits

Developer 4

- XP Ledger

Integration checkpoint:

- Backend APIs functional
- Database migrations complete

---

## Hour 4–6

Advanced workflows:

Developer 1

- Goals

Developer 2

- Training

Developer 3

- Compliance Issues

Developer 4

- Reward Redemption

Integration checkpoint:

- Dashboard skeleton
- Shared services connected

---

## Hour 6–7

Final integration:

- Dashboard
- Reports
- Notifications
- Bug fixes

Application should remain fully runnable.

---

## Hour 7–8

Final preparation:

- End-to-end testing
- Fix critical issues
- Demo preparation
- Video recording
- Final merge to `main`

---

# 15.14 Milestone Checklist

## Milestone 1 (Hour 0–1)

Completed:

- Repository initialized
- Prisma configured
- Authentication skeleton
- Shared folders
- Initial migration

Demo:

Application starts successfully.

---

## Milestone 2 (Hour 1–2)

Completed:

- Basic CRUD for each module
- Seed data
- Shared API client

Demo:

Users can navigate core pages.

---

## Milestone 3 (Hour 2–4)

Completed:

- Business logic
- Validation
- REST APIs
- Database integration

Demo:

Core ESG workflows operational.

---

## Milestone 4 (Hour 4–6)

Completed:

- Notifications
- Dashboard APIs
- XP system
- Compliance workflows

Demo:

Cross-module interactions working.

---

## Milestone 5 (Hour 6–7)

Completed:

- Reports
- Charts
- Leaderboard
- Settings

Demo:

Management dashboard functional.

---

## Milestone 6 (Hour 7–8)

Completed:

- Final testing
- Bug fixes
- Documentation
- Demo video

Demo:

End-to-end platform ready for evaluation.

---

# 15.15 Conflict Avoidance Strategy

To minimize merge conflicts:

- One owner per feature module
- Freeze shared schema early
- Shared services exposed via interfaces
- No cross-module repository access
- Merge to `develop` first
- Smoke test after every merge

---

# 15.16 Environment Variables

Shared across all developers:

```text
DATABASE_URL

JWT_SECRET

PORT

NODE_ENV

UPLOAD_PATH

EMAIL_HOST

EMAIL_PORT

EMAIL_USER

EMAIL_PASSWORD
```

Distribute using a shared `.env.example`.

---

# 15.17 Files That Should Never Be Edited Simultaneously

High-conflict files:

```text
prisma/schema.prisma

package.json

App.jsx

main.jsx

api.js

auth.service.js

shared/layout

middleware/index
```

Assign ownership or coordinate changes.

---

# 15.18 Definition of Done for the Hackathon

The project is complete when:

- All four modules are integrated
- Database migrations succeed
- Frontend builds successfully
- Backend runs without errors
- Authentication works
- Core ESG workflows function
- Dashboard displays live data
- Reports export correctly
- Notifications trigger
- Git history shows continuous, meaningful progress
- Presentation and demo are ready

---

# 15.19 Final Deliverables

- Public GitHub repository
- Working EcoSphere application
- PostgreSQL schema
- Prisma migrations
- REST APIs
- Responsive React frontend
- Architecture documentation
- Demo video

---

# 15.20 AI Coding Prompts (To Be Generated Separately)

For production use with AI coding assistants, prepare four independent prompts:

1. **Developer 1 – Environmental Module**
2. **Developer 2 – Social Module**
3. **Developer 3 – Governance Module**
4. **Developer 4 – Gamification Module**

Each prompt should include:

- Objective
- Folder ownership
- Database ownership
- Prisma models
- REST APIs
- React pages
- Backend layers
- Business rules
- Validation rules
- Integration contracts
- Coding standards
- Definition of Done

These prompts ensure each developer can generate code independently while maintaining compatibility with the shared architecture.

---

# Conclusion

The EcoSphere architecture is designed as an **enterprise-grade modular monolith** optimized for:

- Clean architecture
- Normalized PostgreSQL design
- Prisma ORM best practices
- Scalable backend layering
- Feature-based React frontend
- Secure RBAC authorization
- Minimal merge conflicts
- Parallel team development
- Continuous Git progress
- Rapid integration within an 8-hour hackathon

This structure aligns with the evaluation criteria for the Odoo Hiring Hackathon and provides a strong foundation for both the hackathon implementation and future expansion into a production-ready ESG platform.


# 16. AI Development Prompts for the Four Developers

These prompts are intended for AI coding assistants (ChatGPT, Claude, Gemini, Cursor, etc.).

Each prompt assumes the developer **owns only their assigned module**.

The generated code must integrate into the shared architecture without modifying another developer's work.

---

# 16.1 Developer 1 Prompt — Environmental Module

## Objective

Implement the complete **Environmental Module** for the EcoSphere ESG Management Platform.

You are responsible only for the Environmental domain.

Do **not** modify any other module.

---

## Folder Ownership

```text
frontend/src/modules/environmental/

backend/src/modules/environmental/
```

---

## Database Ownership

```text
emission_factor

product_esg_profile

carbon_transaction

esg_goal
```

Do not modify shared tables.

---

## Prisma Models

Implement only:

```text
EmissionFactor

ProductEsgProfile

CarbonTransaction

EsgGoal
```

---

## React Pages

Develop:

```text
Environmental Dashboard

Emission Factors

Carbon Transactions

ESG Goals

Goal Details
```

---

## Backend Layers

Implement:

```text
Controllers

Services

Repositories

Validators

Routes
```

---

## REST APIs

Expose:

```text
GET /environmental/emission-factors

POST /environmental/emission-factors

PATCH /environmental/emission-factors/:id

DELETE /environmental/emission-factors/:id

GET /environmental/carbon-transactions

POST /environmental/carbon-transactions

GET /environmental/goals

POST /environmental/goals

PATCH /environmental/goals/:id
```

---

## Business Rules

Implement:

- Auto emission calculation
- Quantity × Emission Factor
- Department-wise carbon tracking
- Goal lifecycle
- Department score update

---

## Validation

Validate:

- Positive quantity
- Active emission factor
- Goal deadline
- Goal target value
- Unique emission factor

---

## APIs Consumed

```text
getOrganizationSettings()

recalculateDepartmentScore()
```

---

## Definition of Done

- Environmental CRUD complete
- Business rules implemented
- Dashboard widgets working
- Validation complete
- Tests passing

---

# 16.2 Developer 2 Prompt — Social Module

## Objective

Implement the complete **Social Module**.

Own the entire CSR and employee engagement workflow.

---

## Folder Ownership

```text
frontend/src/modules/social/

backend/src/modules/social/
```

---

## Database Ownership

```text
csr_activity

employee_participation

diversity_metric

training

training_completion
```

---

## Prisma Models

Implement:

```text
CsrActivity

EmployeeParticipation

DiversityMetric

Training

TrainingCompletion
```

---

## React Pages

```text
CSR Activities

Participation

Training

Training Completion

Diversity Metrics
```

---

## Backend Layers

```text
Controllers

Services

Repositories

Validators

Routes
```

---

## REST APIs

```text
GET /social/csr-activities

POST /social/csr-activities

PATCH /social/csr-activities/:id

POST /social/participation

PATCH /social/participation/:id/approve

PATCH /social/participation/:id/reject

GET /social/training

POST /social/training
```

---

## Business Rules

Implement:

- One participation per employee
- Evidence requirement
- CSR approval
- Training completion
- Diversity tracking

---

## APIs Consumed

```text
awardXp()

evaluateBadges()

createNotification()
```

---

## Definition of Done

- CSR workflow complete
- Training workflow complete
- Diversity dashboard complete
- XP integration working

---

# 16.3 Developer 3 Prompt — Governance Module

## Objective

Implement the **Governance Module**.

Own governance compliance, audits and policies.

---

## Folder Ownership

```text
frontend/src/modules/governance/

backend/src/modules/governance/
```

---

## Database Ownership

```text
esg_policy

policy_acknowledgement

audit

compliance_issue
```

---

## Prisma Models

```text
EsgPolicy

PolicyAcknowledgement

Audit

ComplianceIssue
```

---

## React Pages

```text
Policies

Acknowledgements

Audits

Compliance Issues
```

---

## Backend Layers

```text
Controllers

Services

Repositories

Validators

Routes
```

---

## REST APIs

```text
GET /governance/policies

POST /governance/policies

PATCH /governance/policies/:id

POST /governance/policies/:id/acknowledge

GET /governance/audits

POST /governance/audits

GET /governance/compliance-issues

POST /governance/compliance-issues
```

---

## Business Rules

Implement:

- Policy lifecycle
- Policy acknowledgement
- Audit lifecycle
- Compliance issue ownership
- Due-date validation
- Overdue detection

---

## APIs Consumed

```text
createNotification()

getOrganizationSettings()
```

---

## Definition of Done

- Policy workflow complete
- Audit workflow complete
- Compliance tracking complete
- Notifications integrated

---

# 16.4 Developer 4 Prompt — Gamification Module

## Objective

Implement the **Gamification Module**.

This module is also responsible for the shared XP engine.

---

## Folder Ownership

```text
frontend/src/modules/gamification/

backend/src/modules/gamification/
```

---

## Database Ownership

```text
challenge

challenge_participation

xp_ledger

badge

employee_badge

reward

reward_redemption
```

---

## Prisma Models

```text
Challenge

ChallengeParticipation

XpLedger

Badge

EmployeeBadge

Reward

RewardRedemption
```

---

## React Pages

```text
Challenges

Challenge Details

Leaderboard

Badges

Rewards

My Rewards
```

---

## Backend Layers

```text
Controllers

Services

Repositories

Validators

Routes
```

---

## REST APIs

```text
GET /gamification/challenges

POST /gamification/challenges

POST /gamification/challenges/:id/join

POST /gamification/challenges/:id/submit

PATCH /gamification/challenges/:id/approve

GET /gamification/rewards

POST /gamification/rewards/:id/redeem

GET /gamification/leaderboard
```

---

## Shared Services Owned

Developer 4 owns and exposes:

```text
awardXp()

deductXp()

evaluateBadges()

getLeaderboard()
```

Other modules must consume these services rather than modifying XP directly.

---

## Business Rules

Implement:

- Challenge lifecycle
- XP ledger
- Badge auto-award
- Reward redemption
- Atomic transactions
- Leaderboard updates

---

## Definition of Done

- Challenge workflow complete
- XP ledger operational
- Reward redemption transactional
- Leaderboard functional
- Badge auto-award working

---

# 16.5 Shared Coding Standards

All four developers must follow the same standards:

- Use the Controller → Service → Repository pattern
- Never access Prisma directly from controllers
- Validate all requests using Zod
- Keep business logic inside services
- Return standardized API responses
- Use Prisma transactions for multi-table operations
- Do not modify another developer's module
- Commit every 1–2 hours with meaningful messages
- Reuse shared components and services
- Follow the agreed folder structure and naming conventions

---

# 16.6 Final Integration Contract

Before merging into `develop`, every module must satisfy:

- ✅ Builds successfully
- ✅ Database migrations succeed
- ✅ APIs return standardized responses
- ✅ Shared service contracts are unchanged
- ✅ No changes outside owned folders
- ✅ Linting passes
- ✅ Smoke tests pass
- ✅ Integration with shared authentication and RBAC verified

---

**End of Software Architecture Design Document**