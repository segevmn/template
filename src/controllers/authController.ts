import { Request, Response, NextFunction } from 'express';

import { authService } from '../services/authService';
import { getEnv } from '../config/env';
import { logger } from '../utils/logger';

export async function getLogin(req: any, res: any, next: any) {
  res.status(200).json({});
}

export async function getSignup(req: any, res: any, next: any) {
  res.status(200).json({});
}

export async function postLogin(req: any, res: any, next: any) {
  const { email, password, username } = req.body;
  try {
    const user = await authService.login(email, password, username);
    const NODE_ENV = getEnv('NODE_ENV', 'development');
    res
      .cookie('token', user.token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(200)
      .json({ message: 'Login successful' });
  } catch (error) {
    logger.warn(`Login failed for email: ${email}`, error);
    next(error);
  }
}

export async function postSignup(req: any, res: any, next: any) {
  const { email, password, username } = req.body;
  try {
    const user = await authService.signup(email, password, username);
    const NODE_ENV = getEnv('NODE_ENV', 'development');
    res
      .cookie('token', user.token, {
        httpOnly: true,
        secure: NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
      })
      .status(201)
      .json({ message: 'Signup successful' });
  } catch (error) {
    logger.warn(`Signup failed for email: ${email}`, error);
    next(error);
  }
}

export async function postLogout(req: any, res: any, next: any) {
  res.clearCookie('token');
  res.status(204).end();
}
