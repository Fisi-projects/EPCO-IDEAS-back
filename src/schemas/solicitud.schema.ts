import {z} from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     SolicitudTable:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         cliente_nombre:
 *           type: string
 *         cliente_celular:
 *           type: string
 *         fecha:
 *           type: string
 *         productos_nombres:
 *           type: array
 *           items:
 *             type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *         tecnico_nombre:
 *           type: string
 *         tecnico_id:
 *           type: integer
 *     SolicitudDetails:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         cliente_nombre:
 *           type: string
 *         cliente_celular:
 *           type: string
 *         fecha:
 *           type: string
 *         productos_nombres:
 *           type: array
 *           items:
 *             type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *         tecnico_nombre:
 *           type: string
 *     SolicitudCreated:
 *       type: object
 *       required:
 *         - title
 *         - cliente_id
 *         - fecha
 *         - descripcion
 *         - estado
 *         - tecnico_id
 *         - productos
 *       properties:
 *         title:
 *           type: string
 *         cliente_id:
 *           type: integer
 *         fecha:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *         tecnico_id:
 *           type: integer
 *         productos:
 *           type: array
 *           items:
 *             type: integer
 *     SolicitudUpdate:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         fecha:
 *           type: string
 *         descripcion:
 *           type: string
 *         estado:
 *           type: string
 *         cliente_id:
 *           type: integer
 *         tecnico_id:
 *           type: integer
 *         productos:
 *           type: array
 *           items:
 *             type: integer
 */
export const SolicitudTableSchema = z.object({
  id: z.number(),
  title: z.string(),
  cliente_nombre: z.string(),
  cliente_celular: z.string(),
  fecha: z.string(),
  productos_nombres: z.string().array(),
  descripcion: z.string(),
  estado: z.string(),
  tecnico_nombre: z.string(),
  tecnico_id: z.number()
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

export type SolicitudTable = z.infer<typeof SolicitudTableSchema>;
export type SolicitudDetails = z.infer<typeof SolicitudDetailsSchema>;
export type SolicitudCreated = z.infer<typeof SolicitudCreatedSchema>;
export type SolicitudUpdate = z.infer<typeof SolicitudUpdateSchema>;