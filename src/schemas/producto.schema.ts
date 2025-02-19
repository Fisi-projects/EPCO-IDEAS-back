import { z } from 'zod';

export const ProductoSchema = z.object({
    id: z.number().int().positive(),
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    stock: z.number().int().positive(),
    description: z.string().min(1).max(255),
    image: z.string().url(),
})

export const ProductoCreateSchema = z.object({
    name: z.string().min(1).max(100),
    price: z.number().positive(),
    stock: z.number().int().positive(),
    description: z.string().min(1).max(255),
    image: z.string().url(),
})

export const ProductoUpdateSchema = z.object({
    name: z.string().min(1).max(100).optional(),
    price: z.number().positive().optional(),
    stock: z.number().int().positive().optional(),
    description: z.string().min(1).max(255).optional(),
    image: z.string().url().optional(),
})


export type Producto = z.infer<typeof ProductoSchema>;
export type ProductoCreate = z.infer<typeof ProductoCreateSchema>;
export type ProductoUpdate = z.infer<typeof ProductoUpdateSchema>;