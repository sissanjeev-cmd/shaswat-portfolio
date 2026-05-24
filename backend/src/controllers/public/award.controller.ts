import { Request, Response, NextFunction } from 'express';
import { awardService as svc } from '../../services/award.service';

export async function getAwards(
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
