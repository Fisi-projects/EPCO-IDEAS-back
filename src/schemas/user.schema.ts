import { z } from 'zod';

export const LoginUserSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required'
    }).min(8, {
        message: 'Password must be at least 8 characters'
    })
})

export const AdminRegisterSchema = z.object({
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string().length(8),
    password: z.string(),
    fecha_nac: z.coerce.date(),
    rol: z.string(),
})

export const PublicUserSchema = z.object({
    id: z.number(),
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    role: z.string(),
})

export const ClienteRegisterSchema = z.object({
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string().length(8),
    direccion: z.string().optional(),
    telefono: z.string().length(9).startsWith('9').optional(),
    fecha_nac: z.coerce.date(),
});

export const TecnicoSchema = z.object({
    id: z.number(),
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string().length(8),
    telefono: z.string().length(9).startsWith('9'),
    fecha_nac: z.coerce.date(),
});

export const CreateTecnicoSchema = z.object({
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string().length(8),
    telefono: z.string().length(9).startsWith('9'),
    fecha_nac: z.coerce.date(),
});

export const UpdateTecnicoSchema = z.object({
    nombres: z.string().optional(),
    apellidos: z.string().optional(),
    email: z.string().email().optional(),
    dni: z.string().length(8).optional(),
    telefono: z.string().length(9).startsWith('9').optional(),
    fecha_nac: z.coerce.date().optional(),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
export type AdminRegister = z.infer<typeof AdminRegisterSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;
export type ClienteRegister = z.infer<typeof ClienteRegisterSchema>;
export type Tecnico = z.infer<typeof TecnicoSchema>;
export type CreateTecnico = z.infer<typeof CreateTecnicoSchema>;
export type UpdateTecnico = z.infer<typeof UpdateTecnicoSchema>;