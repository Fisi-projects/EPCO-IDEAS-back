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

export const UserRegisterSchema = z.object({
    id: z.number(),
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string(),
    direccion: z.string(),
    password: z.string(),
    fecha_nac: z.string(),
    rol : z.string(),
})

export const PublicUser = z.object({
    id: z.number(),
    nombres: z.string(),
    apellidos: z.string(),
    email: z.string().email(),
    dni: z.string(),
    direccion: z.string(),
    fecha_nac: z.string(),
    rol : z.string(),
})

export type LoginUser = z.infer<typeof LoginUserSchema>;
export type UserRegister = z.infer<typeof UserRegisterSchema>;
export type PublicUserType = z.infer<typeof PublicUser>;