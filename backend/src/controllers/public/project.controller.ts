import { Request, Response, NextFunction } from 'express';
import { projectService as svc } from '../../services/project.service';

export async function getProjects(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const featured =
      req.query.featured === 'true' ? true : undefined;
    const data = await svc.getPublic(featured);
    res.json({ data });
  } catch (err) {
    next(err);
  }
}
