/*
  Warnings:

  - You are about to drop the column `achieved_value` on the `esg_goal` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `esg_goal` table. All the data in the column will be lost.
  - You are about to drop the `product_esg_profile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `unit` to the `esg_goal` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product_esg_profile" DROP CONSTRAINT "product_esg_profile_emission_factor_id_fkey";

-- AlterTable
ALTER TABLE "esg_goal" DROP COLUMN "achieved_value",
DROP COLUMN "title",
ADD COLUMN     "current_value" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "unit" VARCHAR(50) NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ON_TRACK';

-- DropTable
DROP TABLE "product_esg_profile";

-- CreateTable
CREATE TABLE "product_profile" (
    "id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "lifecycle_status" VARCHAR(50) NOT NULL DEFAULT 'DESIGN',
    "carbon_footprint" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "product_profile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_profile_department_id_idx" ON "product_profile"("department_id");

-- AddForeignKey
ALTER TABLE "product_profile" ADD CONSTRAINT "product_profile_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
