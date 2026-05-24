import { Request, Response, NextFunction } from 'express';
import { experienceService as svc } from '../../services/experience.service';

export async function getExperiences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await svc.getPublic(req.query.type as string | undefined);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
