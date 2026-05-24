import { Request, Response, NextFunction } from 'express';
import { projectService } from '../../services/project.service';

function parseListOpts(q: Record<string, unknown>) {
  return {
    page: Math.max(1, Number(q.page) || 1),
    limit: Math.min(100, Math.max(1, Number(q.limit) || 20)),
    sort: (q.sort as string) || 'sortOrder',
    order: ((q.order as string) === 'desc' ? 'desc' : 'asc') as 'asc' | 'desc',
    search: q.search as string | undefined,
    includeArchived: q.includeArchived === 'true',
    includeDeleted: q.includeDeleted === 'true',
  };
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await projectService.adminList(parseListOpts(req.query as Record<string, unknown>)));
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await projectService.getById(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.status(201).json({ data: await projectService.create(req.body) });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await projectService.update(Number(req.params.id), req.body) });
  } catch (err) {
    next(err);
  }
}

export async function softDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await projectService.softDelete(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function archive(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await projectService.archive(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function restore(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await projectService.restore(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}
