import { Hono } from 'hono';
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '@/controllers/product.controller';
import { productZodSchema, productUpdateSchema, productIdParamSchema } from '@/db/models/product';
import { zJsonValidator, zParamsValidator } from '@/utils/zValidators';
import { adminAuthMiddleware } from '@/middlewares';

export const productRouter = new Hono();

// GET /entities/products
productRouter.get('/', getAllProducts);

// GET /entities/products/:id
productRouter.get('/:id', zParamsValidator(productIdParamSchema), getProductById);

// POST /entities/products
productRouter.post('/', adminAuthMiddleware, zJsonValidator(productZodSchema), createProduct);

// PATCH /entities/products/:id
productRouter.patch('/:id', adminAuthMiddleware, zParamsValidator(productIdParamSchema), zJsonValidator(productUpdateSchema), updateProduct);

// DELETE /entities/products/:id
productRouter.delete('/:id', adminAuthMiddleware, zParamsValidator(productIdParamSchema), deleteProduct);
