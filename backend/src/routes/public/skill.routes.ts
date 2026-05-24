import { Router } from 'express';
import { getSkills } from '../../controllers/public/skill.controller';

export const skillRouter = Router();

skillRouter.get('/', getSkills);
