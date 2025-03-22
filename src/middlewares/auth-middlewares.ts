import { getCookie } from 'hono/cookie';
import { ApiResponse } from '@/utils/ApiResponse';
import jwt from 'jsonwebtoken';
import { createFactory } from 'hono/factory';
import { cookieStrings } from '@/constants';
import type { Context } from 'hono';
import { AdminModel } from '@/db/models/admin';

export const factory = createFactory();
export const adminAuthMiddleware = factory.createMiddleware(async (c: Context, next) => {
  // Retrieve the admin access token from cookies (ensure your cookie name matches your constants)
  const accessToken = getCookie(c, cookieStrings.adminLoginAccessToken);
  if (!accessToken) {
    return c.json(new ApiResponse(401, null, 'Unauthorized'), 401);
  }

  try {
    // Verify the token using the secret and extract adminId
    const decoded = jwt.verify(accessToken, process.env.ADMIN_JWT_SECRET!) as { adminId: string };
    if (!decoded?.adminId) {
      return c.json(new ApiResponse(403, null, 'Invalid token payload.'), 403);
    }

    // Fetch the admin document from the database
    const adminDoc = await AdminModel.findById(decoded.adminId).lean();
    if (!adminDoc) {
      return c.json(new ApiResponse(403, null, 'Admin not found.'), 403);
    }

    c.set('adminId', decoded.adminId);
    // Proceed to the next middleware or controller
    await next();
  } catch (error) {
    return c.json(new ApiResponse(403, null, 'Unauthorized. Invalid access token.'), 403);
  }
});
