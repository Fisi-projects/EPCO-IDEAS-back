import express from 'express';
import { LoginUserSchema } from '../schemas/user.schema';

const router = express.Router();

router.post('/login', (req, res) => {
    const validUser = LoginUserSchema.safeParse(req.body);
    if(!validUser.success) {
        res.status(400).json({error: validUser.error.errors.map(err => err.message)});
    }
    res.status(200).json(validUser.data);
})

router.post('/register', (req, res) => {
    const {username, password, email} = req.body;
    res.status(200).json({username, password, email});
})

export default router;