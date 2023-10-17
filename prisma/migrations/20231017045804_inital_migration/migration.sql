-- CreateEnum
CREATE TYPE "userRole" AS ENUM ('customer', 'admin', 'super_admin');

-- CreateEnum
CREATE TYPE "EventCategory" AS ENUM ('Concerts', 'Cricket', 'Football', 'Movies', 'Theatre', 'Comedy', 'Family', 'Festivals', 'Fighting', 'Kabaddi');

-- CreateEnum
CREATE TYPE "Cities" AS ENUM ('Dhaka', 'Chittagong', 'Rajshahi', 'Khulna', 'Sylhet', 'Barisal', 'Rangpur', 'Mymensingh', 'Jashore', 'Comilla', 'Narayanganj', 'Gazipur', 'Bogra', 'Kushtia', 'CoxsBazar', 'Dinajpur', 'Tangail', 'Faridpur', 'Jamalpur', 'Pabna', 'Jessore', 'Noakhali', 'Satkhira', 'Rangamati', 'Narsingdi', 'Sirajganj', 'Nawabganj', 'Narail', 'Pirojpur', 'Magura', 'Habiganj', 'Brahmanbaria', 'Joypurhat', 'Chuadanga', 'Chandpur', 'Meherpur', 'Chapainawabganj', 'Feni', 'Shariatpur', 'Sherpur', 'Lalmonirhat', 'Kurigram', 'Gaibandha', 'Bagerhat', 'Thakurgaon', 'Patuakhali', 'Nilphamari', 'Netrakona', 'Madaripur', 'Lakshmipur', 'Kishoreganj', 'Jhenaidah', 'Gopalganj', 'Sunamganj', 'Panchagarh');

-- CreateTable
CREATE TABLE "users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'customer',
    "password" TEXT NOT NULL,
    "imageURL" TEXT,
    "confirmationCode" TEXT,
    "confirmed" BOOLEAN DEFAULT false,
    "confirmedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "categories" (
    "categoryId" TEXT NOT NULL,
    "categoryName" "EventCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("categoryId")
);

-- CreateTable
CREATE TABLE "cities" (
    "cityId" TEXT NOT NULL,
    "cityName" "Cities" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cities_pkey" PRIMARY KEY ("cityId")
);

-- CreateTable
CREATE TABLE "venues" (
    "venueId" TEXT NOT NULL,
    "venueName" TEXT NOT NULL,
    "venueImageURL" TEXT,
    "venueAddress" TEXT,
    "venueCapacity" INTEGER,
    "venueDescription" TEXT,
    "cityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "venues_pkey" PRIMARY KEY ("venueId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "venues" ADD CONSTRAINT "venues_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities"("cityId") ON DELETE RESTRICT ON UPDATE CASCADE;
