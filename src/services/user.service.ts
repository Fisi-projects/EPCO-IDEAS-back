import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { PublicUser, UserRegisterSchema } from "../schemas/user.schema";
import prisma from "../utils/connection";
import bcrypt from 'bcrypt';

export class UserService{
    static async getAllUsers(){
        try {
            const users = await prisma.user.findMany();
            return {users: users.map(user => PublicUser.parse(user)), status: 200};
        } catch (error) {
            return {error: 'something went wrong :(', status: 500};
        }
    };

    static register = async (userData : Object)=>{
        const result= UserRegisterSchema.safeParse(userData);
        if(!result.success){
            return {user: null, error: result.error.errors.map(err => err.message), status: 400};
        }
        const {email, nombres, apellidos, dni, direccion, password, fecha_nac} = result.data;
        const hashed_pasword = await bcrypt.hash(password, 10);            
        try {
            //search another user with the same email
            
            const newUser = await prisma.user.create({
                data:{
                    email,
                    nombres,
                    apellidos,
                    dni,
                    direccion,
                    hashed_pasword,
                    fecha_nac
                }
            })
            PublicUser.parse(newUser);
            return {user: newUser, status: 201};
        } catch (error) {
            if( error instanceof PrismaClientKnownRequestError && error.code === 'P2002'){
                return {error: 'Email already exists', status: 400};
            }
            return {error: 'something went wrong :(', status: 500};
        }
    }
}
