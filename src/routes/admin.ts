import { Hono } from 'hono';
import { adminAuthMiddleware } from '@/middlewares';
import { checkAdminAuth, logoutAdmin, refreshAdminToken, signInAdmin } from '@/controllers';

export const adminRouter = new Hono();

adminRouter.post('/signin', signInAdmin);
adminRouter.post('/logout', logoutAdmin);
adminRouter.post('/refresh', refreshAdminToken);
adminRouter.get('/check', adminAuthMiddleware, checkAdminAuth);
