import express from 'express';
import { login, logout, register } from '../controller/user.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/authUser.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);

export default router;
