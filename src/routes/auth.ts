import express from 'express';
import { AuthService } from '../services/auth.service';

const router = express.Router();

router.post('/login', async (req, res) => {
    const {user, error, status} = await AuthService.login(req.body);
    if(error){
        res.status(status).json({message:error});
    }
    res.status(status).json(user);
})

export default router;