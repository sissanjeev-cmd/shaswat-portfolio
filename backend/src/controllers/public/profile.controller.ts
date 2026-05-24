import { Request, Response, NextFunction } from 'express';
import { profileService as svc } from '../../services/profile.service';

export async function getProfile(
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const data = await svc.get();
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
