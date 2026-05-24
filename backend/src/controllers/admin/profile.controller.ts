import { Request, Response, NextFunction } from 'express';
import { profileService } from '../../services/profile.service';

export async function get(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await profileService.get() });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await profileService.upsert(req.body) });
  } catch (err) {
    next(err);
  }
}
