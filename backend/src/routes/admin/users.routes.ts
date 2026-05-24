import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { UserCreateSchema, UserUpdateSchema } from '../../schemas/user.schema';
import * as ctrl from '../../controllers/admin/users.controller';

const r = Router();

// All users management routes require authentication and SUPER_ADMIN role
r.use(requireAuth, requireRole('SUPER_ADMIN'));

r.get('/', ctrl.list);
r.post('/', validate(UserCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(UserUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.remove);
r.patch('/:id/activate', ctrl.activate);
r.patch('/:id/deactivate', ctrl.deactivate);

export const usersRouter = r;
