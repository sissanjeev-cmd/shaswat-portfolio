import { Request, Response, NextFunction } from 'express';
import { publicationService as svc } from '../../services/publication.service';

export async function getPublications(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await svc.getPublic();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
