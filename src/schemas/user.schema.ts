import {z} from 'zod';

export const LoginUserSchema = z.object({
    username: z.string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Username is required'
    }).min(4,{
        message: 'Username must be at least 4 characters'
    }), 
    password: z.string({
        invalid_type_error: 'Password must be a string',
        required_error: 'Password is required'
    }).min(8,{
        message: 'Password must be at least 8 characters'
    })
})

export const PrivateUserSchema = z.object({
    username: z.string({
        required_error: 'Username is required',
        invalid_type_error: 'Username must be a string',
    }).nonempty(), 
    email: z.string().email({
        message: 'Invalid email address'
    }).nonempty(),
    password: z.string({
        required_error: 'Password is required',
        invalid_type_error: 'Password must be a string',
    }).min(8).nonempty()
})

export type PublicUser = z.infer<typeof LoginUserSchema>
export type Privateuser = z.infer<typeof PrivateUserSchema>