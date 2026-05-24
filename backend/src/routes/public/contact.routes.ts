import { Router } from 'express';
import { validate } from '../../middleware/validate';
import { ContactMessageSchema } from '../../schemas/contact.schema';
import { createContactMessage } from '../../controllers/public/contact.controller';

export const contactRouter = Router();

contactRouter.post('/', validate(ContactMessageSchema), createContactMessage);
