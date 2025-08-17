-- CreateTable
CREATE TABLE "public"."User" (
    "user_id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "sec_password" TEXT,
    "join_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Book" (
    "book_id" SERIAL NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "sec_password" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("book_id")
);

-- CreateTable
CREATE TABLE "public"."Entity" (
    "entity_id" SERIAL NOT NULL,
    "book_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("entity_id")
);

-- CreateTable
CREATE TABLE "public"."Tag" (
    "tag_id" SERIAL NOT NULL,
    "tag_title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("tag_id")
);

-- CreateTable
CREATE TABLE "public"."Attachment" (
    "attachment_id" SERIAL NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("attachment_id")
);

-- CreateTable
CREATE TABLE "public"."_EntityTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_EntityTags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "public"."User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE INDEX "_EntityTags_B_index" ON "public"."_EntityTags"("B");

-- AddForeignKey
ALTER TABLE "public"."Book" ADD CONSTRAINT "Book_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "public"."User"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Entity" ADD CONSTRAINT "Entity_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "public"."Book"("book_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attachment" ADD CONSTRAINT "Attachment_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "public"."Entity"("entity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntityTags" ADD CONSTRAINT "_EntityTags_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Entity"("entity_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_EntityTags" ADD CONSTRAINT "_EntityTags_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Tag"("tag_id") ON DELETE CASCADE ON UPDATE CASCADE;
