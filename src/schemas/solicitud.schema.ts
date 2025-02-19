import {z} from 'zod';

export const SolicitudTableSchema = z.object({
  id: z.number(),
  title: z.string(),
  cliente_nombre: z.string(),
  productos_nombres: z.string().array(),
  estado: z.string(),
  tecnico_nombre: z.string()
})

export const SolicitudDetailsSchema = z.object({
  title: z.string(),
  cliente_nombre: z.string(),
  cliente_celular: z.string(),
  fecha: z.string(),
  productos_nombres: z.string().array(),
  descripcion: z.string(),
  estado: z.string(),
  tecnico_nombre: z.string()
})

export const SolicitudCreatedSchema = z.object({
  title: z.string(),
  cliente_id: z.number(), // De tratarse de un nuevo cliente, debe ser creado primero
  fecha: z.string(),
  descripcion: z.string(),
  estado: z.string(),
  tecnico_id: z.number(), //Solo se escoge de los ya creados
  productos: z.number().array()
})

export const SolicitudUpdateSchema = z.object({
  title: z.string().optional(),
  fecha: z.string().optional(),
  descripcion: z.string().optional(),
  estado: z.string().optional(),
  cliente_id: z.number().optional(),
  tecnico_id: z.number().optional(),
  productos: z.number().array().optional()
})