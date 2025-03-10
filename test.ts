import { z } from 'zod';

// how to use zod
// first define zod schema
// then use it to validate tour variable
const aSchema = z.string().startsWith('vid', { message: 'must start with "vid"' });
const a = 'vidjnsd';
const validatedValueOfa = aSchema.parse(a); // will throw error
// const validatedValueOfa = aSchema.safeParse(a); // will return error

console.log(validatedValueOfa);
