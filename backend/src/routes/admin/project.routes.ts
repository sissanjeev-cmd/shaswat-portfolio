import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { ProjectCreateSchema, ProjectUpdateSchema } from '../../schemas/project.schema';
import * as ctrl from '../../controllers/admin/project.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(ProjectCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(ProjectUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminProjectRouter = r;
