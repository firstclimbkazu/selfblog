-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "featured_order" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "articles_featured_order_key" ON "articles"("featured_order");
