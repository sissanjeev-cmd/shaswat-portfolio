import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { usersService } from '../../services/users.service';
import { AppError } from '../../middleware/errorHandler';

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };
    const user = await usersService.getByEmail(email);
    if (!user || !user.isActive) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Invalid credentials', 'INVALID_CREDENTIALS');
    }
    // Update lastLoginAt — fire and forget; a failure here must not block the response.
    // Cast required because the typed update signature only covers user-editable fields.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usersService.update(user.id, { lastLoginAt: new Date() } as any).catch(() => {});
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' },
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await usersService.getById(req.auth!.userId);
    res.json({ data: user });
  } catch (err) {
    next(err);
  }
}

export async function logout(_req: Request, res: Response): Promise<void> {
  // JWT is stateless; invalidation must be handled client-side by discarding the token.
  res.json({ message: 'Logged out' });
}
