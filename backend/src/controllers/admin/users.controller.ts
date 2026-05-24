import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { AdminRole } from '@prisma/client';
import { usersService } from '../../services/users.service';
import { AppError } from '../../middleware/errorHandler';

export async function list(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    // usersService.list() returns all users; pagination/filtering can be layered here
    // once the service grows that capability.
    res.json({ data: await usersService.list() });
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await usersService.getById(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { password, email, displayName, role } = req.body as {
      password: string;
      email: string;
      displayName: string;
      role?: AdminRole;
    };
    if (!email || !displayName || !password) {
      throw new AppError(400, 'email, displayName and password are required', 'VALIDATION_ERROR');
    }
    const passwordHash = await bcrypt.hash(password, 12);
    res.status(201).json({
      data: await usersService.create({
        email,
        displayName,
        passwordHash,
        role: role ?? 'ADMIN',
      }),
    });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { password, ...rest } = req.body as {
      password?: string;
      email?: string;
      displayName?: string;
      role?: AdminRole;
    };
    const patch: { email?: string; displayName?: string; role?: AdminRole; passwordHash?: string } =
      { ...rest };
    if (password) {
      patch.passwordHash = await bcrypt.hash(password, 12);
    }
    res.json({ data: await usersService.update(Number(req.params.id), patch) });
  } catch (err) {
    next(err);
  }
}

export async function activate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await usersService.activate(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    res.json({ data: await usersService.deactivate(Number(req.params.id)) });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    await usersService.delete(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
