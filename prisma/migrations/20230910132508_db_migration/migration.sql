-- CreateEnum
CREATE TYPE "file_type" AS ENUM ('HTML', 'JS', 'CSS', 'IMAGE', 'VIDEO');

-- CreateEnum
CREATE TYPE "service" AS ENUM ('LAMDBA', 'STATIC_HOSTING');

-- CreateEnum
CREATE TYPE "service_type" AS ENUM ('LAMDBA', 'STATIC_HOSTING');

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "file_name" TEXT,
    "file" TEXT,
    "file_size" TEXT,
    "static_site_id" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lambda" (
    "id" TEXT NOT NULL,
    "func" TEXT,
    "func_name" TEXT,
    "project_id" TEXT,

    CONSTRAINT "lambda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "models" (
    "id" TEXT NOT NULL,
    "model_name" TEXT,
    "data" JSONB,
    "database_id" TEXT NOT NULL,

    CONSTRAINT "models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project" (
    "id" TEXT NOT NULL,
    "project_name" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "static_site" (
    "id" TEXT NOT NULL,
    "entry_point" TEXT DEFAULT 'index.html',
    "project_id" TEXT,

    CONSTRAINT "static_site_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "swiftbase_db" (
    "id" TEXT NOT NULL,
    "project_id" TEXT,
    "token" TEXT,

    CONSTRAINT "swiftbase_db_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_account" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "password" TEXT NOT NULL,

    CONSTRAINT "user_account_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "files_file_name_static_site_id_key" ON "files"("file_name", "static_site_id");

-- CreateIndex
CREATE UNIQUE INDEX "lambda_func_name_key" ON "lambda"("func_name");

-- CreateIndex
CREATE UNIQUE INDEX "lambda_project_id_key" ON "lambda"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "static_site_project_id_key" ON "static_site"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "swiftbase_db_project_id_key" ON "swiftbase_db"("project_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_account_email_key" ON "user_account"("email");

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_static_site_id_fkey" FOREIGN KEY ("static_site_id") REFERENCES "static_site"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lambda" ADD CONSTRAINT "lambda_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "models" ADD CONSTRAINT "models_database_id_fkey" FOREIGN KEY ("database_id") REFERENCES "swiftbase_db"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project" ADD CONSTRAINT "project_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "user_account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "static_site" ADD CONSTRAINT "static_site_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "swiftbase_db" ADD CONSTRAINT "swiftbase_db_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
