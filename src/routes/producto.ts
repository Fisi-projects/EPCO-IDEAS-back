import express from 'express';
import { ProductoService } from '../services/producto.service';
import multer from 'multer';
import { getStorage } from "firebase/storage"
import { initializeApp } from 'firebase/app';
import config from '../config/firebase.config';

const router = express.Router();

initializeApp(config.firebaseConfig);

const storage = getStorage();

const upload = multer({ storage: multer.memoryStorage() });

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

router.post('/create', upload.single('image'), async (req, res) => {
    const { product, error, status } = await ProductoService.createProduct(req.body, storage, upload, req);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

router.put('/update/:id', upload.single('image'), async (req, res) => {
    const productData = {
        ...req.body,
        price: req.body.price ? parseFloat(req.body.price) : undefined,
        stock: req.body.stock ? parseInt(req.body.stock, 10) : undefined,
    };
    const { product, error, status } = await ProductoService.updateProduct(Number(req.params.id), productData, storage, req);
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