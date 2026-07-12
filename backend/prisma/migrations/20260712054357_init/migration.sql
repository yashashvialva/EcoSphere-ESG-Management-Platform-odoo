-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "CsrActivityStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TrainingStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TrainingCompletionStatus" AS ENUM ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('DRAFT', 'ACTIVE', 'COMPLETED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ChallengeStatus" AS ENUM ('DRAFT', 'ACTIVE', 'UNDER_REVIEW', 'COMPLETED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "ChallengeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- CreateEnum
CREATE TYPE "ChallengeApprovalStatus" AS ENUM ('NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PolicyStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AcknowledgementStatus" AS ENUM ('PENDING', 'ACKNOWLEDGED', 'OVERDUE');

-- CreateEnum
CREATE TYPE "AuditStatus" AS ENUM ('PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "AuditType" AS ENUM ('INTERNAL', 'EXTERNAL', 'COMPLIANCE', 'ESG');

-- CreateEnum
CREATE TYPE "ComplianceSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "RewardStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'OUT_OF_STOCK');

-- CreateEnum
CREATE TYPE "RedemptionStatus" AS ENUM ('PENDING', 'APPROVED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'BOTH');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "XpTransactionType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('CSR_ACTIVITY', 'CHALLENGE', 'TRAINING');

-- CreateTable
CREATE TABLE "role" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_system_role" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" TEXT NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "module" VARCHAR(50) NOT NULL,
    "action" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "role_id" TEXT NOT NULL,
    "permission_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("role_id","permission_id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "head_employee_id" TEXT,
    "parent_department_id" TEXT,
    "employee_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" TEXT NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "role_id" TEXT NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" "CategoryType" NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_setting" (
    "id" TEXT NOT NULL,
    "organization_name" VARCHAR(150) NOT NULL,
    "environmental_weight" DECIMAL(5,2) NOT NULL DEFAULT 40,
    "social_weight" DECIMAL(5,2) NOT NULL DEFAULT 30,
    "governance_weight" DECIMAL(5,2) NOT NULL DEFAULT 30,
    "auto_emission_calculation_enabled" BOOLEAN NOT NULL DEFAULT false,
    "csr_evidence_required" BOOLEAN NOT NULL DEFAULT false,
    "badge_auto_award_enabled" BOOLEAN NOT NULL DEFAULT true,
    "default_currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
    "timezone" VARCHAR(50) NOT NULL DEFAULT 'Asia/Kolkata',
    "updated_by_employee_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emission_factor" (
    "id" TEXT NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(50) NOT NULL,
    "factor" DECIMAL(18,6) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "emission_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_esg_profile" (
    "id" TEXT NOT NULL,
    "product_name" VARCHAR(150) NOT NULL,
    "emission_factor_id" TEXT NOT NULL,
    "recyclable" BOOLEAN NOT NULL DEFAULT false,
    "sustainability_rating" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "product_esg_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_transaction" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "emission_factor_id" TEXT NOT NULL,
    "source_type" VARCHAR(50) NOT NULL,
    "reference_id" TEXT,
    "quantity" DECIMAL(18,4) NOT NULL,
    "emission_value" DECIMAL(18,4) NOT NULL,
    "transaction_date" DATE NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carbon_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esg_goal" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "target_value" DECIMAL(18,4) NOT NULL,
    "achieved_value" DECIMAL(18,4) NOT NULL DEFAULT 0,
    "deadline" DATE NOT NULL,
    "status" "GoalStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "esg_goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "csr_activity" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "category_id" TEXT NOT NULL,
    "description" TEXT,
    "start_date" DATE NOT NULL,
    "end_date" DATE NOT NULL,
    "max_points" INTEGER NOT NULL DEFAULT 0,
    "status" "CsrActivityStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "csr_activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_participation" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "csr_activity_id" TEXT NOT NULL,
    "proof_file" TEXT,
    "approval_status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "points_earned" INTEGER NOT NULL DEFAULT 0,
    "completion_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "employee_participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diversity_metric" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "metric_type" VARCHAR(50) NOT NULL,
    "metric_value" DECIMAL(12,2) NOT NULL,
    "total_population" INTEGER,
    "reporting_date" DATE NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "diversity_metric_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "category_id" TEXT,
    "due_date" DATE,
    "points_awarded" INTEGER NOT NULL DEFAULT 0,
    "status" "TrainingStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_completion" (
    "id" TEXT NOT NULL,
    "training_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "status" "TrainingCompletionStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "completion_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "completed_at" TIMESTAMP(3),
    "score" DECIMAL(5,2),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "training_completion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esg_policy" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "policy_code" VARCHAR(30) NOT NULL,
    "description" TEXT,
    "content" TEXT NOT NULL,
    "version" VARCHAR(20) NOT NULL,
    "effective_date" DATE NOT NULL,
    "acknowledgement_due_date" DATE,
    "owner_employee_id" TEXT NOT NULL,
    "status" "PolicyStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "esg_policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policy_acknowledgement" (
    "id" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "policy_version" VARCHAR(20) NOT NULL,
    "status" "AcknowledgementStatus" NOT NULL DEFAULT 'PENDING',
    "acknowledged_at" TIMESTAMP(3),
    "reminder_count" INTEGER NOT NULL DEFAULT 0,
    "last_reminded_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policy_acknowledgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "audit_type" "AuditType" NOT NULL,
    "description" TEXT,
    "auditor_employee_id" TEXT NOT NULL,
    "scheduled_date" DATE NOT NULL,
    "completed_date" DATE,
    "status" "AuditStatus" NOT NULL DEFAULT 'PLANNED',
    "overall_rating" DECIMAL(5,2),
    "findings_summary" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "audit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_issue" (
    "id" TEXT NOT NULL,
    "audit_id" TEXT,
    "department_id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "severity" "ComplianceSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "owner_employee_id" TEXT NOT NULL,
    "due_date" DATE NOT NULL,
    "status" "ComplianceStatus" NOT NULL DEFAULT 'OPEN',
    "resolution_notes" TEXT,
    "resolved_at" TIMESTAMP(3),
    "created_by_employee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_issue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "category_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "xp_reward" INTEGER NOT NULL,
    "difficulty" "ChallengeDifficulty" NOT NULL,
    "evidence_required" BOOLEAN NOT NULL DEFAULT false,
    "start_date" DATE,
    "deadline" DATE NOT NULL,
    "status" "ChallengeStatus" NOT NULL DEFAULT 'DRAFT',
    "created_by_employee_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "archived_at" TIMESTAMP(3),

    CONSTRAINT "challenge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "challenge_participation" (
    "id" TEXT NOT NULL,
    "challenge_id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "progress_percentage" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "proof_file_url" TEXT,
    "approval_status" "ChallengeApprovalStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
    "xp_awarded" INTEGER NOT NULL DEFAULT 0,
    "submitted_at" TIMESTAMP(3),
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_employee_id" TEXT,
    "completion_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "challenge_participation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xp_ledger" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "transaction_type" "XpTransactionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "source_type" VARCHAR(50) NOT NULL,
    "source_id" TEXT,
    "description" TEXT,
    "balance_after" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "xp_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "badge" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "icon_url" TEXT,
    "unlock_metric" VARCHAR(50) NOT NULL,
    "unlock_operator" VARCHAR(10) NOT NULL,
    "unlock_value" DECIMAL(12,2) NOT NULL,
    "bonus_xp" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee_badge" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "badge_id" TEXT NOT NULL,
    "awarded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trigger_metric_value" DECIMAL(12,2),
    "source_type" VARCHAR(50),
    "source_id" TEXT,

    CONSTRAINT "employee_badge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "points_required" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "image_url" TEXT,
    "status" "RewardStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reward_redemption" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "reward_id" TEXT NOT NULL,
    "points_spent" INTEGER NOT NULL,
    "status" "RedemptionStatus" NOT NULL DEFAULT 'PENDING',
    "redeemed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilled_at" TIMESTAMP(3),
    "cancelled_at" TIMESTAMP(3),
    "cancellation_reason" TEXT,

    CONSTRAINT "reward_redemption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification" (
    "id" TEXT NOT NULL,
    "employee_id" TEXT NOT NULL,
    "notification_type" VARCHAR(50) NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "related_entity_type" VARCHAR(50),
    "related_entity_id" TEXT,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_setting" (
    "id" TEXT NOT NULL,
    "event_type" VARCHAR(50) NOT NULL,
    "in_app_enabled" BOOLEAN NOT NULL DEFAULT true,
    "email_enabled" BOOLEAN NOT NULL DEFAULT false,
    "reminder_frequency_days" INTEGER,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "updated_by_employee_id" TEXT,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_score" (
    "id" TEXT NOT NULL,
    "department_id" TEXT NOT NULL,
    "period_start" DATE NOT NULL,
    "period_end" DATE NOT NULL,
    "environmental_score" DECIMAL(5,2) NOT NULL,
    "social_score" DECIMAL(5,2) NOT NULL,
    "governance_score" DECIMAL(5,2) NOT NULL,
    "total_score" DECIMAL(5,2) NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "calculation_version" VARCHAR(20) NOT NULL,

    CONSTRAINT "department_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generated_report" (
    "id" TEXT NOT NULL,
    "report_type" VARCHAR(50) NOT NULL,
    "generated_by_employee_id" TEXT NOT NULL,
    "filters_json" JSONB NOT NULL,
    "file_format" VARCHAR(10) NOT NULL,
    "file_url" TEXT,
    "status" VARCHAR(20) NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "generated_report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_code_key" ON "permission"("code");

-- CreateIndex
CREATE INDEX "permission_module_idx" ON "permission"("module");

-- CreateIndex
CREATE INDEX "permission_module_action_idx" ON "permission"("module", "action");

-- CreateIndex
CREATE INDEX "role_permission_permission_id_idx" ON "role_permission"("permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_code_key" ON "department"("code");

-- CreateIndex
CREATE INDEX "department_name_idx" ON "department"("name");

-- CreateIndex
CREATE INDEX "department_parent_department_id_idx" ON "department"("parent_department_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE INDEX "employee_department_id_idx" ON "employee"("department_id");

-- CreateIndex
CREATE INDEX "employee_role_id_idx" ON "employee"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_type_key" ON "category"("name", "type");

-- CreateIndex
CREATE INDEX "emission_factor_source_idx" ON "emission_factor"("source");

-- CreateIndex
CREATE INDEX "emission_factor_unit_idx" ON "emission_factor"("unit");

-- CreateIndex
CREATE INDEX "carbon_transaction_department_id_idx" ON "carbon_transaction"("department_id");

-- CreateIndex
CREATE INDEX "carbon_transaction_transaction_date_idx" ON "carbon_transaction"("transaction_date");

-- CreateIndex
CREATE INDEX "carbon_transaction_source_type_idx" ON "carbon_transaction"("source_type");

-- CreateIndex
CREATE INDEX "esg_goal_department_id_idx" ON "esg_goal"("department_id");

-- CreateIndex
CREATE INDEX "esg_goal_deadline_idx" ON "esg_goal"("deadline");

-- CreateIndex
CREATE INDEX "csr_activity_category_id_idx" ON "csr_activity"("category_id");

-- CreateIndex
CREATE INDEX "csr_activity_status_idx" ON "csr_activity"("status");

-- CreateIndex
CREATE INDEX "employee_participation_employee_id_approval_status_idx" ON "employee_participation"("employee_id", "approval_status");

-- CreateIndex
CREATE INDEX "employee_participation_csr_activity_id_approval_status_idx" ON "employee_participation"("csr_activity_id", "approval_status");

-- CreateIndex
CREATE UNIQUE INDEX "employee_participation_employee_id_csr_activity_id_key" ON "employee_participation"("employee_id", "csr_activity_id");

-- CreateIndex
CREATE INDEX "diversity_metric_department_id_reporting_date_idx" ON "diversity_metric"("department_id", "reporting_date");

-- CreateIndex
CREATE INDEX "diversity_metric_metric_type_reporting_date_idx" ON "diversity_metric"("metric_type", "reporting_date");

-- CreateIndex
CREATE INDEX "training_status_idx" ON "training"("status");

-- CreateIndex
CREATE INDEX "training_completion_employee_id_status_idx" ON "training_completion"("employee_id", "status");

-- CreateIndex
CREATE INDEX "training_completion_training_id_status_idx" ON "training_completion"("training_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "training_completion_training_id_employee_id_key" ON "training_completion"("training_id", "employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "esg_policy_policy_code_key" ON "esg_policy"("policy_code");

-- CreateIndex
CREATE INDEX "esg_policy_status_idx" ON "esg_policy"("status");

-- CreateIndex
CREATE INDEX "esg_policy_effective_date_idx" ON "esg_policy"("effective_date");

-- CreateIndex
CREATE INDEX "esg_policy_owner_employee_id_idx" ON "esg_policy"("owner_employee_id");

-- CreateIndex
CREATE INDEX "policy_acknowledgement_employee_id_status_idx" ON "policy_acknowledgement"("employee_id", "status");

-- CreateIndex
CREATE INDEX "policy_acknowledgement_policy_id_status_idx" ON "policy_acknowledgement"("policy_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "policy_acknowledgement_policy_id_employee_id_policy_version_key" ON "policy_acknowledgement"("policy_id", "employee_id", "policy_version");

-- CreateIndex
CREATE INDEX "audit_department_id_idx" ON "audit"("department_id");

-- CreateIndex
CREATE INDEX "audit_auditor_employee_id_idx" ON "audit"("auditor_employee_id");

-- CreateIndex
CREATE INDEX "audit_status_idx" ON "audit"("status");

-- CreateIndex
CREATE INDEX "audit_scheduled_date_idx" ON "audit"("scheduled_date");

-- CreateIndex
CREATE INDEX "audit_department_id_status_idx" ON "audit"("department_id", "status");

-- CreateIndex
CREATE INDEX "compliance_issue_owner_employee_id_status_idx" ON "compliance_issue"("owner_employee_id", "status");

-- CreateIndex
CREATE INDEX "compliance_issue_department_id_status_idx" ON "compliance_issue"("department_id", "status");

-- CreateIndex
CREATE INDEX "compliance_issue_due_date_status_idx" ON "compliance_issue"("due_date", "status");

-- CreateIndex
CREATE INDEX "compliance_issue_severity_idx" ON "compliance_issue"("severity");

-- CreateIndex
CREATE INDEX "compliance_issue_audit_id_idx" ON "compliance_issue"("audit_id");

-- CreateIndex
CREATE INDEX "challenge_category_id_idx" ON "challenge"("category_id");

-- CreateIndex
CREATE INDEX "challenge_status_idx" ON "challenge"("status");

-- CreateIndex
CREATE INDEX "challenge_deadline_idx" ON "challenge"("deadline");

-- CreateIndex
CREATE INDEX "challenge_status_deadline_idx" ON "challenge"("status", "deadline");

-- CreateIndex
CREATE INDEX "challenge_participation_employee_id_approval_status_idx" ON "challenge_participation"("employee_id", "approval_status");

-- CreateIndex
CREATE INDEX "challenge_participation_challenge_id_approval_status_idx" ON "challenge_participation"("challenge_id", "approval_status");

-- CreateIndex
CREATE INDEX "challenge_participation_reviewed_by_employee_id_idx" ON "challenge_participation"("reviewed_by_employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "challenge_participation_challenge_id_employee_id_key" ON "challenge_participation"("challenge_id", "employee_id");

-- CreateIndex
CREATE INDEX "xp_ledger_employee_id_created_at_idx" ON "xp_ledger"("employee_id", "created_at");

-- CreateIndex
CREATE INDEX "xp_ledger_source_type_source_id_idx" ON "xp_ledger"("source_type", "source_id");

-- CreateIndex
CREATE INDEX "xp_ledger_transaction_type_idx" ON "xp_ledger"("transaction_type");

-- CreateIndex
CREATE UNIQUE INDEX "badge_name_key" ON "badge"("name");

-- CreateIndex
CREATE INDEX "employee_badge_employee_id_awarded_at_idx" ON "employee_badge"("employee_id", "awarded_at");

-- CreateIndex
CREATE INDEX "employee_badge_badge_id_idx" ON "employee_badge"("badge_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_badge_employee_id_badge_id_key" ON "employee_badge"("employee_id", "badge_id");

-- CreateIndex
CREATE INDEX "reward_status_idx" ON "reward"("status");

-- CreateIndex
CREATE INDEX "reward_points_required_idx" ON "reward"("points_required");

-- CreateIndex
CREATE INDEX "reward_redemption_employee_id_redeemed_at_idx" ON "reward_redemption"("employee_id", "redeemed_at");

-- CreateIndex
CREATE INDEX "reward_redemption_reward_id_status_idx" ON "reward_redemption"("reward_id", "status");

-- CreateIndex
CREATE INDEX "reward_redemption_status_idx" ON "reward_redemption"("status");

-- CreateIndex
CREATE INDEX "notification_employee_id_status_created_at_idx" ON "notification"("employee_id", "status", "created_at");

-- CreateIndex
CREATE INDEX "notification_notification_type_idx" ON "notification"("notification_type");

-- CreateIndex
CREATE INDEX "notification_related_entity_type_related_entity_id_idx" ON "notification"("related_entity_type", "related_entity_id");

-- CreateIndex
CREATE UNIQUE INDEX "notification_setting_event_type_key" ON "notification_setting"("event_type");

-- CreateIndex
CREATE INDEX "department_score_period_start_period_end_idx" ON "department_score"("period_start", "period_end");

-- CreateIndex
CREATE INDEX "department_score_total_score_idx" ON "department_score"("total_score");

-- CreateIndex
CREATE INDEX "department_score_department_id_calculated_at_idx" ON "department_score"("department_id", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "department_score_department_id_period_start_period_end_key" ON "department_score"("department_id", "period_start", "period_end");

-- CreateIndex
CREATE INDEX "generated_report_generated_by_employee_id_generated_at_idx" ON "generated_report"("generated_by_employee_id", "generated_at");

-- CreateIndex
CREATE INDEX "generated_report_report_type_idx" ON "generated_report"("report_type");

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_head_employee_id_fkey" FOREIGN KEY ("head_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_setting" ADD CONSTRAINT "organization_setting_updated_by_employee_id_fkey" FOREIGN KEY ("updated_by_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_esg_profile" ADD CONSTRAINT "product_esg_profile_emission_factor_id_fkey" FOREIGN KEY ("emission_factor_id") REFERENCES "emission_factor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_transaction" ADD CONSTRAINT "carbon_transaction_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_transaction" ADD CONSTRAINT "carbon_transaction_emission_factor_id_fkey" FOREIGN KEY ("emission_factor_id") REFERENCES "emission_factor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_goal" ADD CONSTRAINT "esg_goal_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "csr_activity" ADD CONSTRAINT "csr_activity_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_participation" ADD CONSTRAINT "employee_participation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_participation" ADD CONSTRAINT "employee_participation_csr_activity_id_fkey" FOREIGN KEY ("csr_activity_id") REFERENCES "csr_activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diversity_metric" ADD CONSTRAINT "diversity_metric_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training" ADD CONSTRAINT "training_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_completion" ADD CONSTRAINT "training_completion_training_id_fkey" FOREIGN KEY ("training_id") REFERENCES "training"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_completion" ADD CONSTRAINT "training_completion_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_policy" ADD CONSTRAINT "esg_policy_owner_employee_id_fkey" FOREIGN KEY ("owner_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_acknowledgement" ADD CONSTRAINT "policy_acknowledgement_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "esg_policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "policy_acknowledgement" ADD CONSTRAINT "policy_acknowledgement_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit" ADD CONSTRAINT "audit_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit" ADD CONSTRAINT "audit_auditor_employee_id_fkey" FOREIGN KEY ("auditor_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_issue" ADD CONSTRAINT "compliance_issue_audit_id_fkey" FOREIGN KEY ("audit_id") REFERENCES "audit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_issue" ADD CONSTRAINT "compliance_issue_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_issue" ADD CONSTRAINT "compliance_issue_owner_employee_id_fkey" FOREIGN KEY ("owner_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_issue" ADD CONSTRAINT "compliance_issue_created_by_employee_id_fkey" FOREIGN KEY ("created_by_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge" ADD CONSTRAINT "challenge_created_by_employee_id_fkey" FOREIGN KEY ("created_by_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participation" ADD CONSTRAINT "challenge_participation_challenge_id_fkey" FOREIGN KEY ("challenge_id") REFERENCES "challenge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participation" ADD CONSTRAINT "challenge_participation_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "challenge_participation" ADD CONSTRAINT "challenge_participation_reviewed_by_employee_id_fkey" FOREIGN KEY ("reviewed_by_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xp_ledger" ADD CONSTRAINT "xp_ledger_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_badge" ADD CONSTRAINT "employee_badge_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_badge" ADD CONSTRAINT "employee_badge_badge_id_fkey" FOREIGN KEY ("badge_id") REFERENCES "badge"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemption" ADD CONSTRAINT "reward_redemption_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reward_redemption" ADD CONSTRAINT "reward_redemption_reward_id_fkey" FOREIGN KEY ("reward_id") REFERENCES "reward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification" ADD CONSTRAINT "notification_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_setting" ADD CONSTRAINT "notification_setting_updated_by_employee_id_fkey" FOREIGN KEY ("updated_by_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_score" ADD CONSTRAINT "department_score_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generated_report" ADD CONSTRAINT "generated_report_generated_by_employee_id_fkey" FOREIGN KEY ("generated_by_employee_id") REFERENCES "employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
