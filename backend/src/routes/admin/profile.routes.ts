import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { ProfileUpdateSchema } from '../../schemas/profile.schema';
import * as ctrl from '../../controllers/admin/profile.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.get);
r.put('/', validate(ProfileUpdateSchema), ctrl.update);

export const adminProfileRouter = r;
