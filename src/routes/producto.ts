import express from 'express';
import { ProductoService } from '../services/producto.service';

const router = express.Router();

router.get('/all', async (_req, res) => {
    const { products, error, status } = await ProductoService.getAllProducts();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(products);
})

router.get('/:id', async (req, res) => {
    const { product, error, status } = await ProductoService.getProductById(Number(req.params.id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

router.post('/create', async (req, res) => {
    const { product, error, status } = await ProductoService.createProduct(req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

router.put('/update/:id', async (req, res) => {
    const { product, error, status } = await ProductoService.updateProduct(Number(req.params.id), req.body);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

router.delete('/delete/:id', async (req, res) => {
    const { message, error, status } = await ProductoService.deleteProduct(Number(req.params.id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json({ message });
})

export default router;