/*
  Warnings:

  - A unique constraint covering the columns `[uuid]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `Analytics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `Product` table without a default value. This is not possible if the table is not empty.
  - The required column `uuid` was added to the `Product` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "public"."Analytics" ADD COLUMN     "productId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Product" ADD COLUMN     "category" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "images" TEXT[],
ADD COLUMN     "productType" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'ACTIVE',
ADD COLUMN     "tags" TEXT[],
ADD COLUMN     "uuid" TEXT NOT NULL,
ADD COLUMN     "variants" JSONB;

-- CreateIndex
CREATE UNIQUE INDEX "Product_uuid_key" ON "public"."Product"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "public"."Product"("slug");

-- AddForeignKey
ALTER TABLE "public"."Analytics" ADD CONSTRAINT "Analytics_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
