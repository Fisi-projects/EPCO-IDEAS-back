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

router.get('/clientes/all', async (_req, res) => {
    const{clientes, error, status} = await UserService.getAllClientes();
    if(error){
        res.status(status).json({message:error});
    }
    res.status(status).json(clientes);
})

router.get('/tecnico/nombres', async (_req, res) => {
    const{tecnicos, error, status} = await UserService.getAllNombresTecnicos();
    if(error){
        res.status(status).json({message:error});
    }
    res.status(status).json(tecnicos);
})

export default router;