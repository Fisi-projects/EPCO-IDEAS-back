import { ProductoSchema, ProductoCreateSchema, ProductoUpdateSchema, ProductoCreate } from "../schemas/producto.schema";
import prisma from "../utils/connection";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

export class ProductoService {
    static async getAllProducts() {
        try {
            const products = await prisma.product.findMany();
            return { products: products.map(product => ProductoSchema.parse(product)), status: 200 };
        } catch (error) {
            console.log(error);
            return { error: 'something went wrong :(', status: 500 };
        }
    }

    static async getProductById(id: number) {
        try {
            const product = await prisma.product.findUnique({ where: { id } });
            if (product) {
                return { product: ProductoSchema.parse(product), status: 200 };
            }
            return { error: 'Product not found', status: 404 };
        } catch (error) {
            console.log(error);
            return { error: 'something went wrong :(', status: 500 };
        }
    }

    static async createProduct(productData: ProductoCreate, storage: any, upload: any, req: any) {

        if (!req.file) {
            return { product: null, error: 'File not provided', status: 400 };
        }

        const dateTime = new Date().toISOString();
        const storageRef = ref(storage, `files/${req.file.originalname + dateTime}`);

        const metadata = {
            contentType: req.file.mimetype,
        };

        try {

            const snapshot = await uploadBytesResumable(storageRef, req.file.buffer, metadata);

            const downloadURL = await getDownloadURL(snapshot.ref);
    
            const result = ProductoCreateSchema.safeParse({
                ...productData,
                price: parseFloat(productData.price.toString()), // ignorar lo obvio xdxd
                stock: parseInt(productData.stock.toString(), 10),
                image: downloadURL
            });
            
            if (!result.success) {
                return { product: null, error: result.error.errors, status: 400 };
            }

            const newProduct = await prisma.product.create({ 
                data: { 
                    ...result.data, 
                    image: downloadURL 
                } 
            });
            return { product: ProductoSchema.parse(newProduct), status: 201 };
        } catch (error) {
            console.log(error);
            return { error: 'something went wrong :(', status: 500 };
        }
    }

    static async updateProduct(id: number, productData: Object) {
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return { error: 'Product not found', status: 404 };
        }

        const result = ProductoUpdateSchema.safeParse(productData);
        if (!result.success) {
            return { product: null, error: result.error.errors, status: 400 };
        }

        try {
            const updatedProduct = await prisma.product.update({
                where: { id }, data: {
                    name: result.data.name ?? product.name,
                    price: result.data.price ?? product.price,
                    stock: result.data.stock ?? product.stock,
                    description: result.data.description ?? product.description,
                    image: result.data.image ?? product.image
                }
            });
            return { product: ProductoSchema.parse(updatedProduct), status: 200 };
        } catch (error) {
            console.log(error);
            return { error: 'something went wrong :(', status: 500 };
        }
    }

    static async deleteProduct(id: number) {
        try {
            await prisma.product.delete({ where: { id } });
            return { message: 'product deleted', status: 204 };
        } catch (error) {
            console.log(error);
            return { error: 'something went wrong :(', status: 500 };
        }
    }
}