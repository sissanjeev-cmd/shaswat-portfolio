import { Request, Response, NextFunction } from 'express';
import { educationService as svc } from '../../services/education.service';

export async function getEducation(
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
