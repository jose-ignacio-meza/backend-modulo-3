import { Router } from 'express';
import usersController from '../controllers/users.controller.js';

const router = Router();

router.get('/',usersController.getAllUsers);
router.post('/',usersController.createUser);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);
router.get('/:uid',usersController.getUserById);
export default router;