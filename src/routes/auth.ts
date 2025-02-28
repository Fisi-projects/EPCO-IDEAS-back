import express from 'express';
import bcrypt from 'bcrypt';
import { LoginUserSchema, PublicUserSchema } from '../schemas/user.schema';
import prisma from '../utils/connection';
import jwt from 'jsonwebtoken';

const router = express.Router();

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags:
 *      - Auth
 *     summary: Login a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: User created
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Something went wrong :(
 */
router.post('/login',async (req, res) =>{
    const validCredential = LoginUserSchema.safeParse(req.body);
    if(!validCredential.success){
        res.status(400).json({error: "invalid credentials"});
        return;
    } 
    const userLogin = await prisma.user.findUnique({
        where:{
            email: validCredential.data.email
        },
    });
    if(userLogin === null){
        res.status(404).json({error: "user not found"});
        return;
    }
    const validPassword = await bcrypt.compare(validCredential.data.password, userLogin.hashed_pasword);
    if(!validPassword){
        res.status(400).json({error: "invalid user or password"});
        return;
    }

    const userfortoken = PublicUserSchema.parse(userLogin);
    if (!process.env.JWT) {
        res.status(500).json({ error: "something went wrong :(" });
        return;
    }

    const token = jwt.sign(userfortoken, process.env.JWT, {expiresIn: '30d'});
    res.status(200).json({user: userfortoken, token});  
})
    
export default router;