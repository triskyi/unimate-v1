-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "profileImage" TEXT,
    "username" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "gender" TEXT,
    "dob" TIMESTAMP(3),
    "nationality" TEXT,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
