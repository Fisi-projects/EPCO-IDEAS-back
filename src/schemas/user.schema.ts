import {z} from 'zod';

export const LoginUserSchema = z.object({
    email: z.string().email({
        message: 'Invalid email address'
    }),
    password: z.string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required'
    }).min(8,{
        message: 'Password must be at least 8 characters'
    })
})

export const AdminRegisterSchema = z.object({
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string().min(8),
    password: z.string(),
    fecha_nac: z.string(),
    rol : z.string(),
})

export const PublicUserSchema = z.object({
    id: z.number(),
    nombres: z.string(),
    apellidos: z.string(),
    email : z.string().email(),
    role : z.string(),
})

export const ClienteRegisterSchema = z.object({
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string(),
    direccion: z.string().optional(),
    telefono: z.string().optional(),
    fecha_nac: z.string(),
});

export type LoginUser = z.infer<typeof LoginUserSchema>;
export type AdminRegister = z.infer<typeof AdminRegisterSchema>;
export type PublicUser = z.infer<typeof PublicUserSchema>;