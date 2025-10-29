/*
  Warnings:

  - A unique constraint covering the columns `[tag_title]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `S3_Key` to the `Attachment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Attachment" ADD COLUMN     "S3_Key" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tag" ADD COLUMN     "user_id" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_tag_title_key" ON "public"."Tag"("tag_title");

-- AddForeignKey
ALTER TABLE "public"."Tag" ADD CONSTRAINT "Tag_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;
