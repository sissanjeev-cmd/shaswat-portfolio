import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { CertificationCreateSchema, CertificationUpdateSchema } from '../../schemas/certification.schema';
import * as ctrl from '../../controllers/admin/certification.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(CertificationCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(CertificationUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminCertificationRouter = r;
