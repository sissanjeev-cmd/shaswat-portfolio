import { Router } from 'express';
import { requireAuth } from '../../middleware/auth';
import * as ctrl from '../../controllers/admin/contact.controller';

const r = Router();

r.use(requireAuth);

r.get('/', ctrl.list);
r.get('/:id', ctrl.getOne);
r.delete('/:id', ctrl.hardDelete);
r.patch('/:id/read', ctrl.markRead);

export const adminContactRouter = r;
