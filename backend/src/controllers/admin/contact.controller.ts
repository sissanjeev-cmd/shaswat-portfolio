import { Request, Response, NextFunction } from 'express';
import { contactService } from '../../services/contact.service';

function parseListOpts(q: Record<string, unknown>) {
  return {
    page: Math.max(1, Number(q.page) || 1),
    limit: Math.min(100, Math.max(1, Number(q.limit) || 20)),
    sort: (q.sort as string) || 'createdAt',
    order: ((q.order as string) === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc',
    search: q.search as string | undefined,
    // Tri-state: true, false, or undefined (all)
    read:
      q.read === 'true' ? true : q.read === 'false' ? false : undefined,
  };
}

export async function list(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json(await contactService.adminList(parseListOpts(req.query as Record<string, unknown>)));
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await contactService.getById(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function hardDelete(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await contactService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function markRead(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await contactService.markRead(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}
