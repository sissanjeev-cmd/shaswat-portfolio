import { Router } from 'express';
import { getProfile } from '../../controllers/public/profile.controller';

export const profileRouter = Router();

profileRouter.get('/', getProfile);
