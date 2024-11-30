import { Blog } from '../models/blog.model.js';
import { v2 as cloudinary } from 'cloudinary';

export const createBlog = async (req, res, next) => {
	try {
		if (!req.files || Object.keys(req.files).length === 0) {
			return res.status(400).json({
				message: 'No file uploaded photo is required ',
			});
		}

		const blogImage = req.files.blogImage;

		const allowedFormats = ['image/jpeg', 'image/png', 'image/jpeg'];

		if (!allowedFormats.includes(blogImage.mimetype)) {
			return res.status(400).json({
				message: 'Invalid photo format. Only jpg and png allowed ',
			});
		}

		const { category, title, about } = req.body;
		if (!category || !title || !about || !blogImage) {
			return res.status(400).json({
				message: 'All Fields are required',
			});
		}

		// Upload an image
		const cloudinaryResponse = await cloudinary.uploader.upload(
			blogImage.tempFilePath,
		);

		const adminName = req?.user?.name;
		const adminPhoto = req?.user?.photo;
		const createdBy = req?.user?._id;

		if (!cloudinaryResponse || cloudinary.error) {
			console.log(cloudinaryResponse.error);
			return;
		}

		const blogData = {
			title,
			about,
			category,
			adminName,
			adminPhoto,
			createdBy,
			blogImage: {
				public_id: cloudinaryResponse.public_id,
				url: cloudinaryResponse.url,
			},
		};
		const blog = await Blog.create(blogData);

		return res.status(201).json({
			message: 'Blog Created successfully !',
			blog,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: 'Internal server error',
		});
	}
};
