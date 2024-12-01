import express from 'express';
import {
	getMyProfile,
	login,
	logout,
	register,
} from '../controller/user.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/authUser.js';
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);
router.get('/profile', isAuthenticated, getMyProfile);

export default router;
