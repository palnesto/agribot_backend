import { ProductModel } from '@/db/models/product';
import type { IProduct } from '@/db/models/product';

/**
 * Create a new product.
 */
export const createProductService = async (data: Partial<IProduct>, session: any) => {
  const [product] = await ProductModel.create([data], { session });
  return product;
};

/**
 * Get all products (that are not archived).
 */
export const getAllProductsService = async () => {
  return ProductModel.find({ archivedAt: null });
};

/**
 * Get a single product by its ID.
 */
export const getProductByIdService = async (id: string) => {
  return ProductModel.findById(id);
};

/**
 * Update a product by ID.
 */
export const updateProductByIdService = async (productId: string, updateData: Partial<IProduct>, session: any) => {
  // Ensure the product exists and is not archived
  const product = await ProductModel.findOne({ _id: productId, archivedAt: null }).session(session);
  if (!product) {
    return null;
  }
  const updatedProduct = await ProductModel.findOneAndUpdate({ _id: productId }, updateData, {
    new: true,
    session,
  });
  return updatedProduct;
};

/**
 * Soft-delete a product by ID.
 */
export const deleteProductByIdService = async (productId: string, session: any) => {
  // Ensure the product exists and is not archived
  const product = await ProductModel.findOne({ _id: productId, archivedAt: null }).session(session);
  if (!product) {
    return null;
  }
  // Use your "softDelete" method (assuming your `createModel` has a `softDelete` static method).
  const deletedProduct = await ProductModel.softDelete(productId, { session });
  return deletedProduct;
};
