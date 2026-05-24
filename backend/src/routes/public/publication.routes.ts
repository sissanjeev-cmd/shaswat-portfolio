import { Router } from 'express';
import { getPublications } from '../../controllers/public/publication.controller';

export const publicationRouter = Router();

publicationRouter.get('/', getPublications);
