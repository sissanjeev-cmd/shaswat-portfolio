import { Router } from 'express';
import { getAwards } from '../../controllers/public/award.controller';

export const awardRouter = Router();

awardRouter.get('/', getAwards);
