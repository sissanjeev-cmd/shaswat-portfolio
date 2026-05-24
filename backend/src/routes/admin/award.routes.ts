import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { AwardCreateSchema, AwardUpdateSchema } from '../../schemas/award.schema';
import * as ctrl from '../../controllers/admin/award.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(AwardCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(AwardUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminAwardRouter = r;
