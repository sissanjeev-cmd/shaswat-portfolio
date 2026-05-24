import { Router } from 'express';
import { getEducation } from '../../controllers/public/education.controller';

export const educationRouter = Router();

educationRouter.get('/', getEducation);
