-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "image" TEXT,
    "userType" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "twitterUrl" TEXT,
    "facebookUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "token" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Spotlight" (
    "id" TEXT NOT NULL,
    "menteeName" TEXT NOT NULL,
    "portfolioUrl" TEXT,
    "twitterUrl" TEXT,
    "facebookUrl" TEXT,
    "linkedinUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "imageUrl" TEXT NOT NULL,
    "about" TEXT NOT NULL,

    CONSTRAINT "Spotlight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "entry" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_token_key" ON "users"("token");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
