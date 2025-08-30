import { Router } from 'express';
import { body } from 'express-validator';

import validate from '../middleware/validate';
import * as authController from '../controllers/authController';

const router = Router();
router.get('/login', authController.getLogin);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    // body('username').notEmpty().isString().withMessage('Username is required'),
  ],
  validate,
  authController.postLogin,
);
router.get('/signup', authController.getSignup);
router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').notEmpty().withMessage('Password is required'),
    // body('username').notEmpty().isString().withMessage('Username is required'),
  ],
  validate,
  authController.postSignup,
);
router.post('/logout', authController.postLogout);

export default router;
