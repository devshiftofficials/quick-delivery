-- CreateTable
ALTER TABLE `Category` ADD COLUMN `slug` VARCHAR(191) NOT NULL;
ALTER TABLE `Category` ADD UNIQUE INDEX `Category_slug_key`(`slug`);

-- AddForeignKey
ALTER TABLE `Subcategory` ADD COLUMN `slug` VARCHAR(191) NOT NULL;
ALTER TABLE `Subcategory` ADD UNIQUE INDEX `Subcategory_slug_key`(`slug`);

-- AddForeignKey
ALTER TABLE `Product` ADD COLUMN `slug` VARCHAR(191) NOT NULL,
ADD COLUMN `subcategorySlug` VARCHAR(191) NOT NULL;
ALTER TABLE `Product` ADD UNIQUE INDEX `Product_slug_key`(`slug`);

-- AddForeignKey
ALTER TABLE `Product` ADD CONSTRAINT `Product_subcategorySlug_fkey` FOREIGN KEY (`subcategorySlug`) REFERENCES `Subcategory`(`slug`) ON DELETE RESTRICT ON UPDATE CASCADE;