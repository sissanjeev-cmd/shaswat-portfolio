import { Router } from 'express';
import { getProjects } from '../../controllers/public/project.controller';

export const projectRouter = Router();

projectRouter.get('/', getProjects);
