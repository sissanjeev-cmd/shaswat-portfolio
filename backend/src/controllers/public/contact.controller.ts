import { Request, Response, NextFunction } from 'express';
import { contactService as svc } from '../../services/contact.service';

export async function createContactMessage(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await svc.create(req.body);
    res.status(201).json({ data });
  } catch (err) {
    next(err);
  }
}
