import express from 'express';
import {
	createBlog,
	deleteBlog,
	getAllBlogs,
	getMyBlogs,
	getSingleBlog,
	updateBlog,
} from '../controller/blog.controller.js';
import { isAdmin, isAuthenticated } from '../middleware/authUser.js';

const router = express.Router();

router.post('/create', isAuthenticated, isAdmin('admin'), createBlog);
router.delete('/delete/:id', isAuthenticated, isAdmin('admin'), deleteBlog);
router.get('/all-blogs', isAuthenticated, getAllBlogs);
router.get('/single-blogs/:id', isAuthenticated, getSingleBlog);
router.get('/myblogs', isAuthenticated, isAdmin('admin'), getMyBlogs);
router.put('/update-blog/:id', isAuthenticated, isAdmin('admin'), updateBlog);

export default router;
