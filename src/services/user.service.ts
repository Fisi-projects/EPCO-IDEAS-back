import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { AdminRegisterSchema, PublicUserSchema } from "../schemas/user.schema";
import prisma from "../utils/connection";
import bcrypt from 'bcrypt';

export class UserService{
    static async getAllUsers(){
        try {
            const users = await prisma.user.findMany();
            return {users: users.map(user => PublicUserSchema.parse(user)), status: 200}; 
        } catch (error) {
            console.log(error);
            return {error: 'something went wrong :(', status: 500};
        }
    };

    //solo para crear admins
    static register = async (userData : Object)=>{
        const result= AdminRegisterSchema.safeParse(userData);
        if(!result.success){
            return {user: null, error: result.error.errors, status: 400};
        }
        const {email, nombres, apellidos, dni, password, fecha_nac} = result.data;
        const hashed_pasword = await bcrypt.hash(password, 10);            
        try {
            //search another user with the same email
            
            const newUser = await prisma.user.create({
                data:{
                    email,
                    nombres,
                    apellidos,
                    dni,
                    hashed_pasword,
                    fecha_nac,
                    role: 'admin' //me olvide el rol xde
                }
            })
            PublicUserSchema.parse(newUser);
            return {user: newUser, status: 201};
        } catch (error) {
            console.log(error);
            console.log('wasa');    
            if( error instanceof PrismaClientKnownRequestError && error.code === 'P2002'){
                return {error: 'Email already exists', status: 400};
            }
            console.log(error);
            return {error: 'something went wrong :(', status: 500};
        }
    }
}
