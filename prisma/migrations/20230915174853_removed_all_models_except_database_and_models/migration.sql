/*
  Warnings:

  - You are about to drop the `files` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lambda` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `static_site` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_account` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "files" DROP CONSTRAINT "files_static_site_id_fkey";

-- DropForeignKey
ALTER TABLE "lambda" DROP CONSTRAINT "lambda_project_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "static_site" DROP CONSTRAINT "static_site_project_id_fkey";

-- DropForeignKey
ALTER TABLE "swiftbase_db" DROP CONSTRAINT "swiftbase_db_project_id_fkey";

-- DropTable
DROP TABLE "files";

-- DropTable
DROP TABLE "lambda";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "static_site";

-- DropTable
DROP TABLE "user_account";

-- DropEnum
DROP TYPE "file_type";

-- DropEnum
DROP TYPE "service";

-- DropEnum
DROP TYPE "service_type";
