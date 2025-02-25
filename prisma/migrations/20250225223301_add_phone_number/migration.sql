/*
  Warnings:

  - You are about to drop the column `cantidad` on the `Solicitud_Product` table. All the data in the column will be lost.
  - Added the required column `descripcion` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "descripcion" TEXT NOT NULL,
ALTER COLUMN "estado" SET DEFAULT 'activo';

-- AlterTable
ALTER TABLE "Solicitud_Product" DROP COLUMN "cantidad";
