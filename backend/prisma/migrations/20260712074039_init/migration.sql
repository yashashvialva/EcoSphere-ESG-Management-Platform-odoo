-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permission" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "module" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employee" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "department_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "total_xp" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "code" VARCHAR(20) NOT NULL,
    "head_employee_id" UUID,
    "parent_department_id" UUID,
    "employee_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_setting" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "env_weight" DECIMAL(5,2) NOT NULL DEFAULT 33.33,
    "soc_weight" DECIMAL(5,2) NOT NULL DEFAULT 33.33,
    "gov_weight" DECIMAL(5,2) NOT NULL DEFAULT 33.34,
    "industry" VARCHAR(100),
    "fiscal_start" VARCHAR(5),
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "organization_setting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emission_factor" (
    "id" UUID NOT NULL,
    "source" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(20) NOT NULL,
    "factor" DECIMAL(10,4) NOT NULL,
    "description" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "emission_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_esg_profile" (
    "id" UUID NOT NULL,
    "product_name" VARCHAR(255) NOT NULL,
    "emission_factor_id" UUID NOT NULL,
    "recyclable" BOOLEAN NOT NULL DEFAULT false,
    "sustainability_rating" INTEGER NOT NULL DEFAULT 3,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_esg_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carbon_transaction" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "emission_factor_id" UUID NOT NULL,
    "source_type" VARCHAR(50) NOT NULL,
    "reference_id" VARCHAR(100),
    "quantity" DECIMAL(12,2) NOT NULL,
    "emission_value" DECIMAL(12,2) NOT NULL,
    "transaction_date" DATE NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "carbon_transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "esg_goal" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "target_value" DECIMAL(12,2) NOT NULL,
    "achieved_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "deadline" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "esg_goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department_score" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "calculated_date" DATE NOT NULL,
    "env_score" DECIMAL(5,2) NOT NULL,
    "soc_score" DECIMAL(5,2) NOT NULL,
    "gov_score" DECIMAL(5,2) NOT NULL,
    "total_score" DECIMAL(5,2) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "department_score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permission_code_key" ON "permission"("code");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_role_id_permission_id_key" ON "role_permission"("role_id", "permission_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_email_key" ON "employee"("email");

-- CreateIndex
CREATE INDEX "employee_email_idx" ON "employee"("email");

-- CreateIndex
CREATE INDEX "employee_department_id_idx" ON "employee"("department_id");

-- CreateIndex
CREATE INDEX "employee_role_id_idx" ON "employee"("role_id");

-- CreateIndex
CREATE UNIQUE INDEX "department_code_key" ON "department"("code");

-- CreateIndex
CREATE INDEX "department_name_idx" ON "department"("name");

-- CreateIndex
CREATE INDEX "department_parent_department_id_idx" ON "department"("parent_department_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_name_type_key" ON "category"("name", "type");

-- CreateIndex
CREATE UNIQUE INDEX "emission_factor_source_unit_key" ON "emission_factor"("source", "unit");

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
CREATE UNIQUE INDEX "department_score_department_id_calculated_date_key" ON "department_score"("department_id", "calculated_date");

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee" ADD CONSTRAINT "employee_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_head_employee_id_fkey" FOREIGN KEY ("head_employee_id") REFERENCES "employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department" ADD CONSTRAINT "department_parent_department_id_fkey" FOREIGN KEY ("parent_department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_esg_profile" ADD CONSTRAINT "product_esg_profile_emission_factor_id_fkey" FOREIGN KEY ("emission_factor_id") REFERENCES "emission_factor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_transaction" ADD CONSTRAINT "carbon_transaction_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carbon_transaction" ADD CONSTRAINT "carbon_transaction_emission_factor_id_fkey" FOREIGN KEY ("emission_factor_id") REFERENCES "emission_factor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "esg_goal" ADD CONSTRAINT "esg_goal_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "department_score" ADD CONSTRAINT "department_score_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE CASCADE ON UPDATE CASCADE;
