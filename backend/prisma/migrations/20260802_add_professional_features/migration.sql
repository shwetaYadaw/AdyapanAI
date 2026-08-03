-- Add new columns to Problem table for professional features
ALTER TABLE `Problem` ADD COLUMN `successRate` DOUBLE NOT NULL DEFAULT 0;
ALTER TABLE `Problem` ADD COLUMN `totalAttempts` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Problem` ADD COLUMN `totalAccepted` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Problem` ADD COLUMN `averageRuntime` INTEGER NOT NULL DEFAULT 0;
ALTER TABLE `Problem` ADD COLUMN `createdBy` VARCHAR(191) NULL;
ALTER TABLE `Problem` ADD COLUMN `updatedBy` VARCHAR(191) NULL;
ALTER TABLE `Problem` ADD COLUMN `isArchived` BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE `Problem` ADD COLUMN `metadata` JSON NULL;
ALTER TABLE `Problem` ADD COLUMN `tags` TEXT NOT NULL DEFAULT "";
ALTER TABLE `Problem` ADD COLUMN `category` VARCHAR(191) NOT NULL DEFAULT "general";

-- Add new columns to ProblemTestCase table
ALTER TABLE `ProblemTestCase` ADD COLUMN `explanation` TEXT NULL;
ALTER TABLE `ProblemTestCase` ADD COLUMN `order` INTEGER NOT NULL DEFAULT 0;

-- Create ProblemSolution table
CREATE TABLE `ProblemSolution` (
    `id` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,
    `code` TEXT NOT NULL,
    `language` VARCHAR(191) NOT NULL,
    `approach` TEXT NOT NULL,
    `timeComplexity` VARCHAR(191) NOT NULL DEFAULT "O(n)",
    `spaceComplexity` VARCHAR(191) NOT NULL DEFAULT "O(1)",
    `explanation` TEXT NOT NULL,
    `isOptimal` BOOLEAN NOT NULL DEFAULT false,
    `rating` DOUBLE NOT NULL DEFAULT 0,
    `createdBy` VARCHAR(191) NULL,
    `versionNumber` INTEGER NOT NULL DEFAULT 1,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create ProblemVersion table for version history
CREATE TABLE `ProblemVersion` (
    `id` VARCHAR(191) NOT NULL,
    `problemId` VARCHAR(191) NOT NULL,
    `versionNum` INTEGER NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `statement` TEXT NOT NULL,
    `difficulty` VARCHAR(191) NOT NULL,
    `changes` JSON NOT NULL,
    `changedBy` VARCHAR(191) NULL,
    `changeReason` TEXT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `ProblemVersion_problemId_versionNum_key`(`problemId`, `versionNum`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Add foreign keys
ALTER TABLE `ProblemSolution` ADD CONSTRAINT `ProblemSolution_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `ProblemVersion` ADD CONSTRAINT `ProblemVersion_problemId_fkey` FOREIGN KEY (`problemId`) REFERENCES `Problem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
