import { Router } from 'express';
import { getExperiences } from '../../controllers/public/experience.controller';

export const experienceRouter = Router();

experienceRouter.get('/', getExperiences);
