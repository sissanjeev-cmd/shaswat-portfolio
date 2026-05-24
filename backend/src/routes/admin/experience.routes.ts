import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { ExperienceCreateSchema, ExperienceUpdateSchema } from '../../schemas/experience.schema';
import * as ctrl from '../../controllers/admin/experience.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(ExperienceCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(ExperienceUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminExperienceRouter = r;
