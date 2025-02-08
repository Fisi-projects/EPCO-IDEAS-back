import { LoginUserSchema } from "../schemas/user.schema";
import prisma from "../utils/connection";
import bcrypt from 'bcrypt';

export class AuthService{
    static async login (loginData: Object){
        const validCredential = LoginUserSchema.safeParse(loginData);
        if(!validCredential.success){
            return {user: null, error: "invalid credentials", status: 400};
        }
        try {
            const userlogin = await prisma.user.findUnique({
                where:{
                    email: validCredential.data.email
                }
            })
            if(userlogin === null){
                return {user: null, error: "user not found", status: 404};
            }
            const validpassword = await bcrypt.compare(validCredential.data.password, userlogin.hashed_pasword);
            if(!validpassword){
                return {user: null, error: "invalid credentials", status: 400};
            }
            return {user: userlogin, status: 200};
        } catch (error) {
            return {user: null, error: "something went wrong :(", status: 500};
        }
    }
}