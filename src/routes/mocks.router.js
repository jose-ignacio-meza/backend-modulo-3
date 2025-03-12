console.log('mock');
import { Router } from 'express';
import mocksController from '../controllers/mocks.controller.js';

const router = Router();

router.get('/',mocksController.getMocksUserandPets);
router.get('/mockingpets',mocksController.getMocksPets);
router.get('/mockingusers',mocksController.getMocksUsers);
router.post('/generateData',mocksController.generateData);


export default router;