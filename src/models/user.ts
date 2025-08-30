import { Router } from 'express';
import * as ctrl from '../controllers/userController';

const router = Router();

router.post('/', ctrl.createUser);
router.get('/', ctrl.getUsers);
router.get('/:id', ctrl.getUserById);
router.put('/:id', ctrl.updateUser);
router.delete('/:id', ctrl.deleteUser);

export default router;
