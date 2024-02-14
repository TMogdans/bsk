-- CreateTable
CREATE TABLE `Config` (
    `id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `weight` DOUBLE NOT NULL DEFAULT 1.0,
    `order` SMALLINT NOT NULL,

    UNIQUE INDEX `Config_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rating` (
    `id` VARCHAR(191) NOT NULL,
    `configId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `objectId` VARCHAR(191) NOT NULL,
    `value` SMALLINT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Rating_configId_userId_objectId_key`(`configId`, `userId`, `objectId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Rating` ADD CONSTRAINT `Rating_configId_fkey` FOREIGN KEY (`configId`) REFERENCES `Config`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

