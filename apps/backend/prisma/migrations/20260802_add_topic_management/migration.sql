-- CreateTable for Topic Management
CREATE TABLE "Topic" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "system" TEXT NOT NULL,
    "description" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Topic_pkey" PRIMARY KEY ("id")
);

-- CreateIndex for unique topic per system
CREATE UNIQUE INDEX "Topic_name_system_key" ON "Topic"("name", "system");

-- CreateIndex for querying topics by system
CREATE INDEX "Topic_system_idx" ON "Topic"("system");

-- CreateIndex for active topics
CREATE INDEX "Topic_isActive_system_idx" ON "Topic"("isActive", "system");
