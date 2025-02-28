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

/**
 * @openapi
 * /productos/all:
 *   get:
 *     tags:
 *       - Producto
 *     summary: Get all products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Internal server error
 */
router.get('/all', async (_req, res) => {
    const { products, error, status } = await ProductoService.getAllProducts();
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(products);
})

/**
 * @openapi
 * /productos/{id}:
 *   get:
 *     tags:
 *       - Producto
 *     summary: Get product by ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', async (req, res) => {
    const { product, error, status } = await ProductoService.getProductById(Number(req.params.id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

/**
 * @openapi
 * /productos/create:
 *   post:
 *     tags:
 *       - Producto
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoCreate'
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post('/create', upload.single('image'), async (req, res) => {
    const { product, error, status } = await ProductoService.createProduct(req.body, storage, upload, req);
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json(product);
})

/**
 * @openapi
 * /productos/update/{id}:
 *   put:
 *     tags:
 *       - Producto
 *     summary: Update a product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             $ref: '#/components/schemas/ProductoUpdate'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
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

/**
 * @openapi
 * /productos/delete/{id}:
 *   delete:
 *     tags:
 *       - Producto
 *     summary: Delete a product
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       500:
 *         description: Internal server error
 */
router.delete('/delete/:id', async (req, res) => {
    const { message, error, status } = await ProductoService.deleteProduct(Number(req.params.id));
    if (error) {
        res.status(status).json({ message: error });
    }
    res.status(status).json({ message });
})

export default router;