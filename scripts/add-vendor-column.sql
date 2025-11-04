-- Add vendorId column to User table
ALTER TABLE `User` ADD COLUMN `vendorId` INT;

-- Add foreign key constraint
ALTER TABLE `User` ADD CONSTRAINT `User_vendorId_fkey` FOREIGN KEY (`vendorId`) REFERENCES `Vendor`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- Add index for vendorId
CREATE INDEX `User_vendorId_idx` ON `User`(`vendorId`);