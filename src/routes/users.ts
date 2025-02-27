import express from 'express';
import { UserService } from '../services/user.service';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { user, error, status } = await UserService.register(req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(user);
})

router.get('/all', async (_req, res) => {
    const { users, error, status } = await UserService.getAllUsers();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(users);
})

router.get('/clientes/all', async (_req, res) => {
    const { clientes, error, status } = await UserService.getAllClientes();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(clientes);
})

router.get('/tecnico/nombres', async (_req, res) => {
    const { tecnicos, error, status } = await UserService.getAllNombresTecnicos();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnicos);
})

router.get('/tecnicos/all', async (_req, res) => {
    const { tecnicos, error, status } = await UserService.getAllTecnicos();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnicos);
})

router.get('/tecnicos/:id', async (req, res) => {
    const { id } = req.params;
    const { tecnico, error, status } = await UserService.getTecnicoById(Number(id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

router.post('/tecnicos/create', async (req, res) => {
    const { tecnico, error, status } = await UserService.createTecnico(req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

router.put('/tecnicos/update/:id', async (req, res) => {
    const { id } = req.params;
    const { tecnico, error, status } = await UserService.updateTecnico(Number(id), req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

router.delete('/tecnicos/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { message, error, status } = await UserService.deleteTecnico(Number(id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json({ message });
})

export default router;