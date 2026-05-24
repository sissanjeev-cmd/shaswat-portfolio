import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { EducationCreateSchema, EducationUpdateSchema } from '../../schemas/education.schema';
import * as ctrl from '../../controllers/admin/education.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(EducationCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(EducationUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminEducationRouter = r;
