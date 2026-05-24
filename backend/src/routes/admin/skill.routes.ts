import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { SkillCreateSchema, SkillUpdateSchema } from '../../schemas/skill.schema';
import * as ctrl from '../../controllers/admin/skill.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(SkillCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(SkillUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminSkillRouter = r;
