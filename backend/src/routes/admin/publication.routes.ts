import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import { validate } from '../../middleware/validate';
import { PublicationCreateSchema, PublicationUpdateSchema } from '../../schemas/publication.schema';
import * as ctrl from '../../controllers/admin/publication.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.post('/', validate(PublicationCreateSchema), ctrl.create);
r.get('/:id', ctrl.getOne);
r.put('/:id', validate(PublicationUpdateSchema), ctrl.update);
r.delete('/:id', ctrl.softDelete);
r.patch('/:id/archive', ctrl.archive);
r.patch('/:id/restore', ctrl.restore);

export const adminPublicationRouter = r;
