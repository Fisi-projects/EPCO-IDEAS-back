-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "hashed_pasword" TEXT NOT NULL,
    "fecha_nac" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'cliente',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" TEXT NOT NULL DEFAULT 'pendiente',
    "tecnico_id" INTEGER NOT NULL,
    "cliente_id" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solicitud_Product" (
    "id" SERIAL NOT NULL,
    "solicitud_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "cantidad" INTEGER NOT NULL,

    CONSTRAINT "Solicitud_Product_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "User"("dni");

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_tecnico_id_fkey" FOREIGN KEY ("tecnico_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_cliente_id_fkey" FOREIGN KEY ("cliente_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Product" ADD CONSTRAINT "Solicitud_Product_solicitud_id_fkey" FOREIGN KEY ("solicitud_id") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud_Product" ADD CONSTRAINT "Solicitud_Product_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
