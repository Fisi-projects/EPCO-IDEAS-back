import { z } from 'zod';


/**
 * @openapi
 * components:
 *   schemas:
 *     Producto:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         description:
 *           type: string
 *         image:
 *           type: string
 *     ProductoCreate:
 *       type: object
 *       required:
 *         - name
 *         - price
 *         - stock
 *         - description
 *         - image
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 *     ProductoUpdate:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         price:
 *           type: number
 *         stock:
 *           type: integer
 *         description:
 *           type: string
 *         image:
 *           type: string
 *           format: binary
 */
export const ProductoSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    stock: z.number().int().positive(),
    description: z.string().min(1).max(255),
    image: z.string(),
})

export const ProductoCreateSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    stock: z.number().int().positive(),
    description: z.string().min(1).max(255),
    image: z.string(),
})

export const ProductoUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().positive().optional(),
    description: z.string().min(1).max(255).optional(),
    image: z.string().optional(),
})


export type Producto = z.infer<typeof ProductoSchema>;
export type ProductoCreate = z.infer<typeof ProductoCreateSchema>;
export type ProductoUpdate = z.infer<typeof ProductoUpdateSchema>;