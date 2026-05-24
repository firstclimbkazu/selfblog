-- CreateEnum
CREATE TYPE "LpStatus" AS ENUM ('DRAFT', 'PUBLISHED');

-- CreateTable
CREATE TABLE "landing_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "html" TEXT NOT NULL,
    "css" TEXT,
    "js" TEXT,
    "head_html" TEXT,
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_og_image" TEXT,
    "status" "LpStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "landing_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lp_images" (
    "id" TEXT NOT NULL,
    "lp_id" TEXT NOT NULL,
    "public_url" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lp_images_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "landing_pages_slug_key" ON "landing_pages"("slug");

-- AddForeignKey
ALTER TABLE "lp_images" ADD CONSTRAINT "lp_images_lp_id_fkey" FOREIGN KEY ("lp_id") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
