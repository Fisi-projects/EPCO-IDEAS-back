import express from 'express';
import { UserService } from '../services/user.service';

const router = express.Router();

/**
 * @openapi
 * /users/register:
 *   post:
 *     tags:
 *       - Users
 *     summary: Register a new user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AdminRegister'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/register', async (req, res) => {
    const { user, error, status } = await UserService.register(req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(user);
})

/**
 * @openapi
 * /users/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     responses:
 *       200:
 *         description: List of users
 *       500:
 *         description: Internal server error
 */
router.get('/all', async (_req, res) => {
    const { users, error, status } = await UserService.getAllUsers();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(users);
})

/**
 * @openapi
 * /users/clientes/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all clients
 *     responses:
 *       200:
 *         description: List of clients
 *       500:
 *         description: Internal server error
 */
router.get('/clientes/all', async (_req, res) => {
    const { clientes, error, status } = await UserService.getAllClientes();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(clientes);
})

/**
 * @openapi
 * /users/tecnico/nombres:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all technician names
 *     responses:
 *       200:
 *         description: List of technician names
 *       500:
 *         description: Internal server error
 */
router.get('/tecnico/nombres', async (_req, res) => {
    const { tecnicos, error, status } = await UserService.getAllNombresTecnicos();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnicos);
})

/**
 * @openapi
 * /users/tecnicos/all:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all technicians
 *     responses:
 *       200:
 *         description: List of technicians
 *       500:
 *         description: Internal server error
 */
router.get('/tecnicos/all', async (_req, res) => {
    const { tecnicos, error, status } = await UserService.getAllTecnicos();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnicos);
})

/**
 * @openapi
 * /users/tecnicos/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get technician by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Technician details
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.get('/tecnicos/:id', async (req, res) => {
    const { id } = req.params;
    const { tecnico, error, status } = await UserService.getTecnicoById(Number(id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

/**
 * @openapi
 * /users/tecnicos/create:
 *   post:
 *     tags:
 *       - Users
 *     summary: Create a new technician
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateTecnico'
 *     responses:
 *       201:
 *         description: Technician created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/tecnicos/create', async (req, res) => {
    const { tecnico, error, status } = await UserService.createTecnico(req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

/**
 * @openapi
 * /users/tecnicos/update/{id}:
 *   put:
 *     tags:
 *       - Users
 *     summary: Update a technician
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTecnico'
 *     responses:
 *       200:
 *         description: Technician updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.put('/tecnicos/update/:id', async (req, res) => {
    const { id } = req.params;
    const { tecnico, error, status } = await UserService.updateTecnico(Number(id), req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(tecnico);
})

/**
 * @openapi
 * /users/tecnicos/delete/{id}:
 *   delete:
 *     tags:
 *       - Users
 *     summary: Delete a technician
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Technician deleted successfully
 *       404:
 *         description: Technician not found
 *       500:
 *         description: Internal server error
 */
router.delete('/tecnicos/delete/:id', async (req, res) => {
    const { id } = req.params;
    const { message, error, status } = await UserService.deleteTecnico(Number(id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json({ message });
})

export default router;