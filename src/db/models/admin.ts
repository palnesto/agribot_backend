import { createSchema, createModel, type IBaseDocument } from '../base';
import { z } from 'zod';

export const adminZodSchema = z.object({
  name: z.string().min(1, { message: 'Name is required.' }),
  email: z.string().email({ message: 'Invalid email format.' }),
  passwordHash: z.string().min(1, { message: 'Password is required.' }),
  refreshToken: z.string().optional(), // New field for storing the refresh token
});

export type IAdmin = z.infer<typeof adminZodSchema> & IBaseDocument;

const AdminSchema = createSchema<IAdmin>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  refreshToken: { type: String, default: null }, // default null if not signed in yet
});

export const AdminModel = createModel<IAdmin>('Admin', AdminSchema);
