import { Router } from 'express';
import { getCertifications } from '../../controllers/public/certification.controller';

export const certificationRouter = Router();

certificationRouter.get('/', getCertifications);
