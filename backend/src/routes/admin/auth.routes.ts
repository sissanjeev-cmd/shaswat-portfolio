import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { LoginSchema } from '../../schemas/user.schema';
import * as ctrl from '../../controllers/admin/auth.controller';

const r = Router();

r.post('/login', validate(LoginSchema), ctrl.login);
r.post('/logout', requireAuth, ctrl.logout);
r.get('/me', requireAuth, ctrl.me);

export const authRouter = r;
