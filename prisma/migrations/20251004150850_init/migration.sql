-- CreateEnum
CREATE TYPE "public"."status_project" AS ENUM ('planned', 'active', 'completed', 'canceled');

-- CreateEnum
CREATE TYPE "public"."bill_status" AS ENUM ('aberta', 'despachada', 'aceita', 'em deslocamento', 'em atendimento', 'executada', 'não executada', 'devolvida', 'cancelada', 'reprogramada');

-- CreateTable
CREATE TABLE "public"."master" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "token_access" TEXT,
    "code_expires_at" TIMESTAMP(3),
    "code_used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "master_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."firm" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "firm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."occupation" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description_of_occupation" TEXT NOT NULL,
    "dangerousness" BOOLEAN NOT NULL,
    "active" BOOLEAN NOT NULL,
    "salary" DOUBLE PRECISION NOT NULL,
    "total_salary" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "occupation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."service" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" DECIMAL(16,2) NOT NULL,
    "project_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bill" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "customer_address_id" INTEGER NOT NULL,
    "extension_address_id" INTEGER NOT NULL,
    "consultant_id" INTEGER NOT NULL,
    "project_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,
    "technical_id" INTEGER,
    "scheduled_at" TIMESTAMP(3),
    "service_completed_at" TIMESTAMP(3),
    "service_started_at" TIMESTAMP(3),
    "note" TEXT,
    "detail" TEXT,
    "status" "public"."bill_status" DEFAULT 'aberta',
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number_contract" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "estimated_price" DECIMAL(16,2) NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "estimated_end_date" TIMESTAMP(3) NOT NULL,
    "status" "public"."status_project" NOT NULL DEFAULT 'planned',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "firm_id" INTEGER NOT NULL,
    "responsible_contract" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."phone" (
    "id" SERIAL NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "phone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."cnh" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "number_license" TEXT NOT NULL,
    "validity" DATE NOT NULL,
    "first_drivers_license" DATE NOT NULL,
    "category_cnh" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "cnh_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."project_team" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "project_team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."address" (
    "id" SERIAL NOT NULL,
    "zip_code" TEXT,
    "street_name" TEXT,
    "number_of_house" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "employee_id" INTEGER NOT NULL,
    "neighborhood" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."customer_address" (
    "id" SERIAL NOT NULL,
    "zip_code" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."extension_address" (
    "id" SERIAL NOT NULL,
    "zip_code" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,

    CONSTRAINT "extension_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."consultant" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "consultant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."employee" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "rg" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "drivers_license" BOOLEAN NOT NULL,
    "occupation_id" INTEGER NOT NULL,
    "admission_date" DATE NOT NULL,
    "password_hash" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "first_access" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."occupation_service" (
    "occupation_id" INTEGER NOT NULL,
    "service_id" INTEGER NOT NULL,

    CONSTRAINT "occupation_service_pkey" PRIMARY KEY ("occupation_id","service_id")
);

-- CreateTable
CREATE TABLE "public"."street_data" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "street_data_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."daily_report" (
    "id" SERIAL NOT NULL,
    "pipe_branch_diameter" TEXT NOT NULL,
    "pipe_network_diameter" TEXT NOT NULL,
    "signal_tape" BOOLEAN NOT NULL,
    "round_tachao" BOOLEAN NOT NULL,
    "capping_type" TEXT NOT NULL,
    "branch_type" TEXT NOT NULL,
    "cut_location" TEXT NOT NULL,
    "branch_material" TEXT NOT NULL,
    "network_material" TEXT NOT NULL,
    "branch_position" TEXT NOT NULL,
    "network_pressure" TEXT NOT NULL,
    "flow_valve_type" BOOLEAN NOT NULL DEFAULT false,
    "mechanical_protection" BOOLEAN NOT NULL,
    "cut_branch" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bill_id" INTEGER NOT NULL,
    "streetDataId" INTEGER,

    CONSTRAINT "daily_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."component" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "manufacturer" TEXT NOT NULL,
    "batch" TEXT NOT NULL,
    "daily_report_id" INTEGER,

    CONSTRAINT "component_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."photo" (
    "id" SERIAL NOT NULL,
    "sidewalk_before" TEXT,
    "sketch" TEXT,
    "front_house" TEXT,
    "street_sign" TEXT,
    "mechanical_protection" TEXT,
    "provisional" TEXT,
    "cut_branch" TEXT,
    "exposed_branch" TEXT,
    "tachao" TEXT,
    "daily_report_id" INTEGER NOT NULL,

    CONSTRAINT "photo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."weld" (
    "id" SERIAL NOT NULL,
    "weld_number" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "cooling_time" TEXT NOT NULL,
    "daily_report_id" INTEGER,

    CONSTRAINT "weld_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trench" (
    "id" SERIAL NOT NULL,
    "length" INTEGER NOT NULL,
    "width" INTEGER NOT NULL,
    "depth" INTEGER NOT NULL,
    "floor_type" TEXT NOT NULL,
    "daily_report_id" INTEGER,

    CONSTRAINT "trench_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "master_email_key" ON "public"."master"("email");

-- CreateIndex
CREATE UNIQUE INDEX "master_cpf_key" ON "public"."master"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "firm_email_key" ON "public"."firm"("email");

-- CreateIndex
CREATE UNIQUE INDEX "firm_cnpj_key" ON "public"."firm"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "occupation_name_key" ON "public"."occupation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_number_contract_key" ON "public"."project"("number_contract");

-- CreateIndex
CREATE INDEX "project_start_date_estimated_end_date_idx" ON "public"."project"("start_date", "estimated_end_date");

-- CreateIndex
CREATE UNIQUE INDEX "address_employee_id_key" ON "public"."address"("employee_id");

-- CreateIndex
CREATE UNIQUE INDEX "employee_cpf_key" ON "public"."employee"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "daily_report_streetDataId_key" ON "public"."daily_report"("streetDataId");

-- CreateIndex
CREATE UNIQUE INDEX "photo_daily_report_id_key" ON "public"."photo"("daily_report_id");

-- AddForeignKey
ALTER TABLE "public"."service" ADD CONSTRAINT "service_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_consultant_id_fkey" FOREIGN KEY ("consultant_id") REFERENCES "public"."consultant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_customer_address_id_fkey" FOREIGN KEY ("customer_address_id") REFERENCES "public"."customer_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_extension_address_id_fkey" FOREIGN KEY ("extension_address_id") REFERENCES "public"."extension_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bill" ADD CONSTRAINT "bill_technical_id_fkey" FOREIGN KEY ("technical_id") REFERENCES "public"."employee"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project" ADD CONSTRAINT "project_firm_id_fkey" FOREIGN KEY ("firm_id") REFERENCES "public"."firm"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."phone" ADD CONSTRAINT "phone_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."cnh" ADD CONSTRAINT "cnh_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_team" ADD CONSTRAINT "project_team_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."project_team" ADD CONSTRAINT "project_team_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "public"."project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."address" ADD CONSTRAINT "address_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."customer_address" ADD CONSTRAINT "customer_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."extension_address" ADD CONSTRAINT "extension_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "public"."customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."employee" ADD CONSTRAINT "employee_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "public"."occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."occupation_service" ADD CONSTRAINT "occupation_service_occupation_id_fkey" FOREIGN KEY ("occupation_id") REFERENCES "public"."occupation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."occupation_service" ADD CONSTRAINT "occupation_service_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "public"."service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_report" ADD CONSTRAINT "daily_report_bill_id_fkey" FOREIGN KEY ("bill_id") REFERENCES "public"."bill"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."daily_report" ADD CONSTRAINT "daily_report_streetDataId_fkey" FOREIGN KEY ("streetDataId") REFERENCES "public"."street_data"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."component" ADD CONSTRAINT "component_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."photo" ADD CONSTRAINT "photo_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_report"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."weld" ADD CONSTRAINT "weld_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trench" ADD CONSTRAINT "trench_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "public"."daily_report"("id") ON DELETE SET NULL ON UPDATE CASCADE;
