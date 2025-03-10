import { Schema } from 'mongoose';
import { createSchema, createModel, type IBaseDocument } from '../base';
import { z } from 'zod';

// ---------------- Zod Schemas ---------------- //
export const productZodSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  price: z.number().min(0, { message: 'Price must be a positive number.' }),
  short_description: z.string().min(1, { message: 'Short description is required.' }),
  detail_description: z.string().min(1, { message: 'Detail description is required.' }),
  faqs: z
    .array(
      z.object({
        question: z.string().min(1, { message: 'FAQ question is required.' }),
        answer: z.string().min(1, { message: 'FAQ answer is required.' }),
      })
    )
    .default([]),
  assets: z.array(z.string().url({ message: 'Each asset must be a valid URL.' })).default([]),
  archivedAt: z.date().nullable().default(null),
});

// For partial updates
export const productUpdateSchema = productZodSchema
  .pick({
    name: true,
    price: true,
    short_description: true,
    detail_description: true,
    faqs: true,
    assets: true,
  })
  .partial()
  .strict();

// For ID param validation
export const productIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid product ID.' }),
});

// ---------------- Types ---------------- //
export type IProduct = z.infer<typeof productZodSchema> & IBaseDocument;

// ---------------- Mongoose Schema ---------------- //
const ProductSchema = createSchema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  short_description: { type: String, required: true },
  detail_description: { type: String, required: true },
  faqs: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
  assets: [{ type: String, required: false }], // no strict requirement other than array
  archivedAt: { type: Date, default: null },
});

// (Optional) If you need to do something on updates (similar to blog image deletion),
// you could add a .pre('findOneAndUpdate', ...) hook here. Currently omitted.

// ---------------- Mongoose Model ---------------- //
export const ProductModel = createModel<IProduct>('Product', ProductSchema);
