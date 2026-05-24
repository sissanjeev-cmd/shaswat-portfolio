import { Request, Response, NextFunction } from 'express';
import { certificationService as svc } from '../../services/certification.service';

export async function getCertifications(
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
