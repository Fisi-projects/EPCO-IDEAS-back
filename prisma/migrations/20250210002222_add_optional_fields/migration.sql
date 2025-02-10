-- AlterTable
ALTER TABLE "User" ADD COLUMN     "disponibilidad" TEXT,
ADD COLUMN     "telefono" TEXT,
ALTER COLUMN "direccion" DROP NOT NULL;
