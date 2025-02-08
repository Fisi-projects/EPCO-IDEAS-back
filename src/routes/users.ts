import express from 'express';
import { UserService } from '../services/user.service';

const router = express.Router();

router.post('/register', async (req, res) => {
    const {user, error, status} = await UserService.register(req.body);
    if(error){
        res.status(status).json({message:error});
    }
    res.status(status).json(user);
})

router.get('/all', async (_req, res) => {
    const{users, error, status} = await UserService.getAllUsers();
    if(error){
        res.status(status).json({message:error});
    }
    res.status(status).json(users);
})
export default router;