import { Request, Response, NextFunction } from 'express';
import { skillService as svc } from '../../services/skill.service';

export async function getSkills(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await svc.getPublic(req.query.category as string | undefined);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
