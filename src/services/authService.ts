import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import { getEnv } from '../config/env';
import { userDataAccess } from '../dataAccess/userDataAccess';
import { createError, NotFoundError, ValidationError } from '../utils/errors';

const JWT_SECRET = getEnv('JWT_SECRET');
//const ConflictError = createError('ConflictError', 409);
const UnauthorizedError = createError('UnauthorizedError', 401);

export const authService = {
  async signup(
    email: string,
    password: string,
    username: string,
  ): Promise<any> {
    const existingUser = await userDataAccess.findByEmail(email);
    if (existingUser) throw ValidationError('Email already in use');
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await userDataAccess.create({
      email,
      password: hashedPassword,
      username,
    });
    const token = jwt.sign(
      {
        id: (newUser as any)._id.toString(),
        email: newUser.email,
        // username: newUser.username,
        role: (newUser as any).role,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );
    return { user: newUser, token };
  },
  async login(email: string, password: string, username: string) {
    const user = await userDataAccess.findByEmail(email);
    if (!user) throw NotFoundError('User not found');
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw UnauthorizedError('Invalid credentials');
    const token = jwt.sign(
      {
        id: (user as any)._id.toString(),
        email: user.email,
        // username: user.username,
        role: (user as any).role,
      },
      JWT_SECRET,
      { expiresIn: '1d' },
    );
    return { user, token };
  },
  async logout(..._args: any[]): Promise<any> {
    return { message: 'Logged out successfully' };
  },
};
